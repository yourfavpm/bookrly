import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  ChevronLeft, 
  Clock, 
  Calendar as CalendarIcon, 
  AlertCircle,
  X,
  CheckCircle2
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { Service, AddOn, StaffMember } from '../../store/useAppStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { formatPrice } from '../../utils/formatters';
import { getBusinessUrl, getBookingConfirmationUrl } from '../../lib/domainUtils';

interface BookingFlowProps {
  onCancel?: () => void;
}

interface BookingStepWrapperProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  onNext?: () => void;
  onBack?: () => void;
  nextDisabled?: boolean;
  showNext?: boolean;
  showBack?: boolean;
  nextLabel?: string;
  isLoading?: boolean;
  accentColor: string;
}

const BookingStepWrapper: React.FC<BookingStepWrapperProps> = ({
  children,
  title,
  subtitle,
  onNext,
  onBack,
  nextDisabled = false,
  showNext = true,
  showBack = true,
  nextLabel = 'Continue',
  isLoading = false,
  accentColor
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    className="w-full max-w-[440px] mx-auto pt-12 pb-12 px-6 flex flex-col min-h-[100dvh]"
  >
    <div className="flex-1 flex flex-col space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">{title}</h1>
        {subtitle && <p className="text-[11px] text-text-tertiary font-normal max-w-[300px] mx-auto leading-relaxed">{subtitle}</p>}
      </div>

      <div className="flex-1 min-h-0">
        {children}
      </div>
    </div>

    <div className="pt-8 pb-4 flex flex-col gap-4 mt-auto sticky bottom-0 bg-bg-canvas z-10">
      {showNext && (
        <Button
          onClick={onNext}
          disabled={nextDisabled}
          isLoading={isLoading}
          className="w-full h-14 rounded-2xl text-white font-bold text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-[0.98] disabled:opacity-30"
          style={{ backgroundColor: !nextDisabled ? accentColor : undefined }}
        >
          {nextLabel}
        </Button>
      )}
      {showBack && (
        <button
          onClick={onBack}
          className="w-full py-2 text-[10px] font-medium text-text-tertiary uppercase tracking-widest hover:text-text-primary transition-colors flex items-center justify-center gap-2"
        >
          <ChevronLeft size={14} /> Back
        </button>
      )}
    </div>
  </motion.div>
);

const getZonedDateParts = (date: Date, timeZone: string) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(date);

  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value || 0);
  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hour: get('hour'),
    minute: get('minute')
  };
};

const getZonedDateKey = (date: Date, timeZone: string) => {
  const { year, month, day } = getZonedDateParts(date, timeZone);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

export const BookingFlow: React.FC<BookingFlowProps> = ({ onCancel }) => {
  const { business, createBooking, createCheckoutSession, currency } = useAppStore();
  const flowRef = useRef<HTMLDivElement | null>(null);
  const businessTimezone = business?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const isStripeReady = business?.stripeConnected && business?.stripeDetailsSubmitted;
  const [step, setStep] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('booking_success') === 'true' ? 8 : 1;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isAnyStaff, setIsAnyStaff] = useState(false);
  const [availableStaffList, setAvailableStaffList] = useState<StaffMember[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [contactInfo, setContactInfo] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return {
        name: params.get('name') || '',
        email: params.get('email') || '',
        phone: params.get('phone') || '',
        notes: ''
      };
    }
    return { name: '', email: '', phone: '', notes: '' };
  });
  const [bookingError, setBookingError] = useState<string | null>(null);

  // 1. Service Selection
  // 2. Add-ons
  // 3. Date
  // 4. Time
  // 5. Staff Selection
  // 6. Contact
  // 7. Review
  // 8. Payment (Success/Finalize)

  const TOTAL_STEPS = 8;

  const nextStep = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  useEffect(() => {
    flowRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const subtotal = useMemo(() => {
    if (!selectedService) return 0;
    let total = selectedService.price;
    selectedAddOns.forEach(name => {
      const addon = selectedService.addOns.find((a: AddOn) => a.name === name);
      if (addon) total += addon.price;
    });
    return total;
  }, [selectedService, selectedAddOns]);

  const totalDue = useMemo(() => {
    if (!selectedService) return 0;
    if (selectedService.bookingFeeEnabled) {
      return selectedService.bookingFeeAmount || 0;
    }
    return 0;
  }, [selectedService]);

  const siteBookingUrl = business ? getBusinessUrl(business.subdomain, business.customDomain) : '';

  const availableDates = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return getZonedDateKey(d, businessTimezone);
    });
  }, [businessTimezone]);

  // Get qualified staff for the selected service
  const qualifiedStaff = useMemo(() => {
    if (!selectedService || !business) return [];
    return business.staff.filter(s => s.status === 'active' && s.serviceIds.includes(selectedService.id));
  }, [selectedService, business]);

  const checkOverlap = (bookings: any[], blocks: any[], slotStart: number, slotEnd: number, totalDurationMinutes: number) => {
    const isBookingOverlap = bookings.some((booking: any) => {
       const timeStr = booking.startTime;
       const [bh, bm] = timeStr.split(':').map(Number);
       const endStr = booking.endTime;
       const [eh, em] = endStr ? endStr.split(':').map(Number) : [bh + Math.floor(totalDurationMinutes/60), bm + (totalDurationMinutes%60)];
       
       const existingService = business?.services.find(s => s.id === booking.serviceId);
       const existingBuffer = existingService?.bufferTime || 0;
       
       const bookingStart = bh * 60 + bm;
       const bookingEnd = (eh * 60 + em) + existingBuffer;
       
       return (slotStart < bookingEnd) && (slotEnd > bookingStart);
    });

    const isBlockOverlap = blocks.some((block: any) => {
       const [bh, bm] = block.startTime.split(':').map(Number);
       const [eh, em] = block.endTime.split(':').map(Number);
       const blockStart = bh * 60 + bm;
       const blockEnd = eh * 60 + em;
       return (slotStart < blockEnd) && (slotEnd > blockStart);
    });
    return isBookingOverlap || isBlockOverlap;
  };

  const getComputedDuration = () => {
    if (!selectedService) return 0;
    let totalDurationMinutes = selectedService.duration;
    selectedAddOns.forEach(name => {
      const addon = selectedService.addOns.find((a: AddOn) => a.name === name);
      if (addon) totalDurationMinutes += addon.duration;
    });
    return totalDurationMinutes;
  };

  const timeSlots = useMemo(() => {
    if (!selectedDate || !selectedService || !business) return [];
    
    const [year, month, day] = selectedDate.split('-');
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const dayOfWeek = dateObj.getDay();

    const totalDurationMinutes = getComputedDuration();

    const now = new Date();
    const nowParts = getZonedDateParts(now, business.timezone || businessTimezone);
    const todayKey = `${nowParts.year}-${String(nowParts.month).padStart(2, '0')}-${String(nowParts.day).padStart(2, '0')}`;
    const isToday = selectedDate === todayKey;
    const currentMinutes = nowParts.hour * 60 + nowParts.minute;

    const bizHour = business.workingHours.find(h => h.dayOfWeek === dayOfWeek);
    if (!bizHour || !bizHour.isOpen) return [];

    const [startH, startM] = bizHour.startTime.split(':').map(Number);
    const [endH, endM] = bizHour.endTime.split(':').map(Number);
    const openMinutes = startH * 60 + startM;
    const closeMinutes = endH * 60 + endM;

    const mainBookings = business.bookings.filter(b => b.date === selectedDate && b.status !== 'cancelled' && !b.staffId);
    const mainBlocks = (business.blockedTimes || []).filter(b => b.date === selectedDate && !b.staffId);

    const currentBuffer = selectedService.bufferTime || 0;
    const slots: string[] = [];

    for (let m = openMinutes; m + totalDurationMinutes <= closeMinutes; m += 15) {
       if (isToday && m <= currentMinutes + 30) continue;
       const slotStart = m;
       const slotEnd = m + totalDurationMinutes + currentBuffer;
       
       let slotAvailable = false;

       if (!checkOverlap(mainBookings, mainBlocks, slotStart, slotEnd, totalDurationMinutes)) {
           slotAvailable = true;
       } else {
           const anyStaffAvailable = qualifiedStaff.some(staff => {
               const sHour = staff.availability.find(h => h.dayOfWeek === dayOfWeek);
               if (!sHour || !sHour.isOpen) return false;
               const [sh, sm] = sHour.startTime.split(':').map(Number);
               const [eh, em] = sHour.endTime.split(':').map(Number);
               if (slotStart < (sh*60+sm) || slotEnd > (eh*60+em)) return false;

               const sBookings = business.bookings.filter(b => b.date === selectedDate && b.status !== 'cancelled' && b.staffId === staff.id);
               const sBlocks = (business.blockedTimes || []).filter(b => b.date === selectedDate && b.staffId === staff.id);
               return !checkOverlap(sBookings, sBlocks, slotStart, slotEnd, totalDurationMinutes);
           });
           if (anyStaffAvailable) slotAvailable = true;
       }

       if (slotAvailable) {
          const h = Math.floor(m / 60);
          const mins = m % 60;
          const period = h >= 12 ? 'PM' : 'AM';
          const displayH = h % 12 || 12;
          slots.push(`${displayH.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${period}`);
       }
    }
    return slots;
  }, [selectedDate, selectedService, selectedAddOns, business, qualifiedStaff, businessTimezone]);

  if (!business) return null;

  const renderProgress = () => (
    <div className="sticky top-0 left-0 w-full h-[3px] bg-bg-tertiary z-60">
      <motion.div 
        className="h-full" 
        style={{ backgroundColor: business.primaryColor }}
        initial={false}
        animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        transition={{ duration: 0.5, ease: "circOut" }}
      />
    </div>
  );

  const renderTotalPrice = () => (
    <div className="mb-10 text-center">
      <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1">Total</p>
      <p className="text-3xl font-bold tracking-tight text-text-primary">
        {formatPrice(subtotal, currency)}
      </p>
    </div>
  );

  return (
    <div ref={flowRef} className="relative h-full min-h-full bg-white overflow-y-auto custom-scrollbar">
      {renderProgress()}

      <header className="sticky top-[3px] left-0 w-full h-20 flex items-center justify-between px-5 sm:px-8 z-50 bg-white/95 backdrop-blur-md border-b border-border-light/60">
         <div className="flex items-center gap-3">
            {business.logo ? (
              <img src={business.logo} className="w-8 h-8 rounded-lg object-contain" alt="Logo" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white italic font-bold text-sm shadow-sm">B</div>
            )}
            <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-text-primary px-3 border-l border-border-light">{business.name}</span>
         </div>
         {onCancel && (
           <button onClick={onCancel} className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest hover:text-text-primary transition-colors flex items-center gap-2">
             Exit <X size={14} />
           </button>
         )}
      </header>

      <div className="min-h-screen">
        <AnimatePresence mode="wait">
          {bookingError && (
            <div className="px-6 pt-6">
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-3">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-semibold">Booking failed</p>
                  <p className="text-red-600/90">{bookingError}</p>
                </div>
              </div>
            </div>
          )}
           {step === 1 && (
             <BookingStepWrapper 
               key="step1" 
               title="Select a service" 
               subtitle="Choose the service you'd like to book with us today."
               showBack={false}
               showNext={false}
               accentColor={business.primaryColor}
             >
                <div className="grid gap-3">
                   {business.services.map(s => (
                     <button 
                       key={s.id}
                        onClick={() => {
                          setSelectedService(s);
                          nextStep();
                        }}
                        className="w-full p-5 rounded-2xl border border-border-light bg-white hover:border-brand/40 hover:shadow-lg hover:shadow-black/2 transition-all text-left group"
                     >
                        <div className="flex justify-between items-start mb-1">
                           <h3 className="font-bold text-text-primary group-hover:text-brand transition-colors">{s.name}</h3>
                           <span className="font-bold text-text-primary">{formatPrice(s.price, currency)}</span>
                        </div>
                        <p className="text-[11px] text-text-tertiary line-clamp-2 leading-relaxed">{s.description}</p>
                        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
                           <Clock size={12} /> {s.duration} mins
                        </div>
                     </button>
                   ))}
                </div>
             </BookingStepWrapper>
           )}

           {step === 5 && selectedService && (
             <BookingStepWrapper
               key="step5"
               title="Choose your provider"
               subtitle="Select who you'd like to see, or let us assign someone."
               onBack={prevStep}
               showNext={false}
               accentColor={business.primaryColor}
             >
                <div className="grid gap-3">
                   <button
                     onClick={() => { setIsAnyStaff(true); setSelectedStaff(null); nextStep(); }}
                     className="w-full p-5 rounded-2xl border border-border-light bg-white hover:border-brand/40 hover:shadow-lg transition-all text-left group"
                   >
                      <div className="flex items-center gap-4">
                         <div className="w-11 h-11 rounded-xl bg-brand/10 flex items-center justify-center text-brand font-bold text-sm">✨</div>
                         <div>
                            <h3 className="font-bold text-text-primary group-hover:text-brand transition-colors">Any Available</h3>
                            <p className="text-[11px] text-text-tertiary">We'll match you with the best available team member</p>
                         </div>
                      </div>
                   </button>
                    {availableStaffList.map(member => (
                     <button
                       key={member.id}
                       onClick={() => { setIsAnyStaff(false); setSelectedStaff(member); nextStep(); }}
                       className="w-full p-5 rounded-2xl border border-border-light bg-white hover:border-brand/40 hover:shadow-lg transition-all text-left group"
                     >
                        <div className="flex items-center gap-4">
                           <div className="w-11 h-11 rounded-xl bg-brand/10 flex items-center justify-center text-brand font-bold text-sm">
                             {member.name.charAt(0).toUpperCase()}
                           </div>
                           <div>
                              <h3 className="font-bold text-text-primary group-hover:text-brand transition-colors">{member.name}</h3>
                              <p className="text-[10px] text-text-tertiary uppercase tracking-widest">{member.role}</p>
                           </div>
                        </div>
                     </button>
                   ))}
                </div>
             </BookingStepWrapper>
           )}

           {step === 2 && selectedService && (
             <BookingStepWrapper 
               key="step2" 
               title="Customize your visit" 
               subtitle="Select any add-ons to personalize your experience."
               onNext={nextStep}
               onBack={prevStep}
               nextLabel="Continue"
               accentColor={business.primaryColor}
             >
                {renderTotalPrice()}
                <div className="grid gap-3">
                   {selectedService.addOns.length > 0 ? (
                     selectedService.addOns.map((addon: AddOn) => {
                       const isSelected = selectedAddOns.includes(addon.name);
                       return (
                        <button 
                          key={addon.name}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedAddOns(selectedAddOns.filter(a => a !== addon.name));
                            } else {
                              setSelectedAddOns([...selectedAddOns, addon.name]);
                            }
                          }}
                          className={`w-full p-5 rounded-2xl border transition-all flex items-center justify-between ${isSelected ? 'border-brand bg-brand/5 shadow-sm' : 'border-border-light bg-white hover:border-text-tertiary/30'}`}
                          style={{ borderColor: isSelected ? business.primaryColor : undefined, backgroundColor: isSelected ? `${business.primaryColor}08` : undefined }}
                        >
                           <div className="flex items-center gap-4">
                              <div className={`w-5 h-5 rounded flex items-center justify-center border ${isSelected ? 'text-white border-transparent' : 'border-border-default'}`} style={{ backgroundColor: isSelected ? business.primaryColor : undefined }}>
                                 {isSelected && <Check size={12} strokeWidth={3} />}
                              </div>
                              <div className="text-left">
                                 <h4 className="font-bold text-sm text-text-primary">{addon.name}</h4>
                                 <p className="text-[10px] text-text-tertiary">+{addon.duration} mins</p>
                              </div>
                           </div>
                           <span className="font-bold text-sm text-text-primary">+{formatPrice(addon.price, currency)}</span>
                        </button>
                       );
                     })
                   ) : (
                     <div className="p-12 text-center rounded-[32px] bg-bg-secondary/30 italic">
                        <p className="text-text-tertiary text-xs">No extras available for this service.</p>
                     </div>
                   )}
                </div>
             </BookingStepWrapper>
           )}

           {step === 3 && (
             <BookingStepWrapper 
               key="step3" 
               title="Pick a date" 
               subtitle="When would you like to come in?"
               onBack={prevStep}
               showNext={false}
               accentColor={business.primaryColor}
             >
                {renderTotalPrice()}
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                   {availableDates.map(date => {
                       const d = new Date(date);
                       return (
                         <button 
                           key={date}
                           onClick={() => { setSelectedDate(date); nextStep(); }}
                           className="py-5 flex flex-col items-center justify-center rounded-2xl border border-border-light bg-white hover:border-brand/40 hover:-translate-y-1 transition-all"
                         >
                            <span className="text-[9px] uppercase font-bold tracking-widest text-text-tertiary">
                              {d.toLocaleDateString(undefined, { weekday: 'short' })}
                            </span>
                            <span className="text-lg font-bold mt-1 text-text-primary">{d.getDate()}</span>
                         </button>
                       );
                   })}
                </div>
             </BookingStepWrapper>
           )}

           {step === 4 && (
             <BookingStepWrapper 
               key="step4" 
               title="Select a time" 
               subtitle={`Available times for ${new Date(selectedDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}`}
               onBack={prevStep}
               showNext={false}
               accentColor={business.primaryColor}
             >
                {renderTotalPrice()}
                <div className="grid grid-cols-2 gap-3">
                   {timeSlots.length > 0 ? (
                     timeSlots.map(time => (
                        <button 
                          key={time}
                           onClick={() => { 
                             setSelectedTime(time);
                             
                             // Calculate available staff for this specific time
                             const [timeH, timeM, period] = time.match(/(\d+):(\d+) (AM|PM)/)!.slice(1);
                             let hour = parseInt(timeH);
                             if (period === 'PM' && hour !== 12) hour += 12;
                             if (period === 'AM' && hour === 12) hour = 0;
                             const slotStart = hour * 60 + parseInt(timeM);
                             
                             const totalDurationMinutes = getComputedDuration();
                             const slotEnd = slotStart + totalDurationMinutes + (selectedService.bufferTime || 0);

                             const mainBookings = business.bookings.filter(b => b.date === selectedDate && b.status !== 'cancelled' && !b.staffId);
                             const mainBlocks = (business.blockedTimes || []).filter(b => b.date === selectedDate && !b.staffId);
                             const isMainBusinessAvailable = !checkOverlap(mainBookings, mainBlocks, slotStart, slotEnd, totalDurationMinutes);

                             const dObj = new Date(selectedDate);
                             const dayOfWeek = dObj.getDay();

                             const availableStaff = qualifiedStaff.filter(staff => {
                                 const sHour = staff.availability.find(h => h.dayOfWeek === dayOfWeek);
                                 if (!sHour || !sHour.isOpen) return false;
                                 const [sh, sm] = sHour.startTime.split(':').map(Number);
                                 const [eh, em] = sHour.endTime.split(':').map(Number);
                                 if (slotStart < (sh*60+sm) || slotEnd > (eh*60+em)) return false;

                                 const sBookings = business.bookings.filter(b => b.date === selectedDate && b.status !== 'cancelled' && b.staffId === staff.id);
                                 const sBlocks = (business.blockedTimes || []).filter(b => b.date === selectedDate && b.staffId === staff.id);
                                 return !checkOverlap(sBookings, sBlocks, slotStart, slotEnd, totalDurationMinutes);
                             });

                             if (availableStaff.length === 0 && isMainBusinessAvailable) {
                                setIsAnyStaff(true);
                                setSelectedStaff(null);
                                setStep(6);
                             } else if (availableStaff.length === 1 && !isMainBusinessAvailable) {
                                setIsAnyStaff(false);
                                setSelectedStaff(availableStaff[0]);
                                setStep(6);
                             } else {
                                setAvailableStaffList(availableStaff);
                                setStep(5);
                             }
                           }}
                          className="py-4 rounded-2xl border border-border-light bg-white hover:border-brand/40 font-bold text-xs text-text-primary transition-all"
                        >
                           {time}
                        </button>
                      ))
                   ) : (
                     <div className="col-span-full py-12 text-center text-text-tertiary italic text-sm">
                        No available times for this date.
                     </div>
                   )}
                </div>
             </BookingStepWrapper>
           )}

           {step === 6 && (
             <BookingStepWrapper 
               key="step6" 
               title="Your details" 
               subtitle="Almost there. Let us know who to expect."
               onNext={nextStep}
               onBack={prevStep}
               nextDisabled={!contactInfo.name || !contactInfo.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)}
               accentColor={business.primaryColor}
             >
                <div className="space-y-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        type="text"
                        placeholder="e.g. John Doe"
                        className="w-full h-14 px-5 rounded-2xl bg-bg-secondary/30 border-none outline-none focus:bg-white focus:shadow-md transition-all text-sm font-medium"
                        value={contactInfo.name}
                        onChange={e => setContactInfo({...contactInfo, name: e.target.value})}
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Email</label>
                      <input 
                        type="email"
                        placeholder="john@example.com"
                        className="w-full h-14 px-5 rounded-2xl bg-bg-secondary/30 border-none outline-none focus:bg-white focus:shadow-md transition-all text-sm font-medium"
                        value={contactInfo.email}
                        onChange={e => setContactInfo({...contactInfo, email: e.target.value})}
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Phone (Optional)</label>
                      <input 
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="w-full h-14 px-5 rounded-2xl bg-bg-secondary/30 border-none outline-none focus:bg-white focus:shadow-md transition-all text-sm font-medium"
                        value={contactInfo.phone}
                        onChange={e => setContactInfo({...contactInfo, phone: e.target.value})}
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Notes</label>
                      <textarea 
                        placeholder="Any special requests?"
                        className="w-full h-24 p-5 rounded-2xl bg-bg-secondary/30 border-none outline-none focus:bg-white focus:shadow-md transition-all text-sm font-medium resize-none"
                        value={contactInfo.notes}
                        onChange={e => setContactInfo({...contactInfo, notes: e.target.value})}
                      />
                   </div>
                </div>
             </BookingStepWrapper>
           )}

           {step === 7 && selectedService && (
             <BookingStepWrapper 
                key="step7" 
                title="Review & Confirm" 
                subtitle="Review your appointment details before proceeding."
                onBack={prevStep}
                onNext={async () => {
                  setIsSubmitting(true);
                  setBookingError(null);
                  try {
                      const booking = await createBooking({
                          serviceId: selectedService.id,
                          addOnIds: selectedService.addOns.filter((a: AddOn) => selectedAddOns.includes(a.name)).map((a: AddOn) => a.id),
                          date: selectedDate,
                          time: selectedTime,
                          customerName: contactInfo.name,
                          customerEmail: contactInfo.email,
                          customerPhone: contactInfo.phone,
                          notes: contactInfo.notes,
                          totalPrice: subtotal,
                          depositDue: totalDue,
                          staffId: selectedStaff?.id
                      });

                       if (isStripeReady && booking && totalDue > 0) {
                           const checkoutUrl = await createCheckoutSession(booking.id);
                           if (checkoutUrl) {
                               window.location.href = checkoutUrl;
                               return;
                           }
                           throw new Error('We saved your booking, but payment setup could not start.');
                       }
                       if (booking) {
                         setStep(8);
                         return;
                       }
                  } catch (err) {
                    console.error('Booking error:', err);
                    setBookingError((err as Error).message || 'Something went wrong while saving your booking.');
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                nextLabel={isStripeReady ? 'Pay & Confirm' : 'Confirm Appointment'}
                isLoading={isSubmitting}
                accentColor={business.primaryColor}
             >
                <div className="grid gap-6">
                   <div className="p-6 rounded-3xl bg-bg-secondary/20 border border-border-light space-y-4">
                      <div className="flex justify-between items-start">
                         <div>
                            <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1">Time & Date</p>
                            <h4 className="font-bold text-text-primary">
                               {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} at {selectedTime}
                            </h4>
                         </div>
                         <button onClick={() => setStep(4)} className="text-[10px] font-bold text-brand uppercase tracking-widest">Edit</button>
                      </div>
                      <div className="flex justify-between items-start">
                         <div>
                            <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1">Service</p>
                            <h4 className="font-bold text-text-primary">{selectedService.name}</h4>
                            {selectedAddOns.map(a => <p key={a} className="text-[11px] text-text-tertiary">+ {a}</p>)}
                         </div>
                         <button onClick={() => setStep(1)} className="text-[10px] font-bold text-brand uppercase tracking-widest">Edit</button>
                      </div>
                   </div>

                   <div className="space-y-3 px-2">
                      <div className="flex justify-between items-center text-xs text-text-secondary">
                         <span>Subtotal</span>
                         <span>{formatPrice(subtotal, currency)}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold text-text-primary pt-2 border-t border-border-light">
                         <span>Total Due Today</span>
                         <span>{formatPrice(totalDue, currency)}</span>
                      </div>
                   </div>
                </div>
             </BookingStepWrapper>
           )}

           {step === 8 && (
             <BookingStepWrapper 
               key="step7" 
               title="You're all set!" 
               subtitle={`Confirmation sent to ${contactInfo.email}`}
               showBack={false}
               onNext={() => window.location.href = '/'}
               nextLabel="Return to Homepage"
               accentColor={business.primaryColor}
             >
                <div className="py-10 flex flex-col items-center text-center space-y-12">
                   <div className="w-20 h-20 rounded-full bg-success/10 text-success flex items-center justify-center">
                      <Check size={36} strokeWidth={3} />
                   </div>
                   
                   <Card className="w-full p-8 rounded-[40px] border-border-light/50 bg-bg-secondary/10 space-y-6 text-left">
                      <div>
                         <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-[0.2em] mb-2 text-center">Receipt Summary</p>
                         <h4 className="text-lg font-bold text-text-primary text-center">{selectedService?.name}</h4>
                      </div>
                      <div className="h-px bg-border-light w-full" />
                      <div className="grid gap-3">
                         <div className="flex items-center gap-3 text-sm text-text-secondary">
                            <CalendarIcon size={14} className="text-text-tertiary" />
                            <span>{new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                         </div>
                         <div className="flex items-center gap-3 text-sm text-text-secondary">
                            <Clock size={14} className="text-text-tertiary" />
                            <span>{selectedTime}</span>
                         </div>
                         <div className="flex items-center gap-3 text-sm text-text-secondary">
                            <CheckCircle2 size={14} className="text-success" />
                            <span>Amount Paid: {formatPrice(totalDue, currency)}</span>
                         </div>
                      </div>
                   </Card>
                </div>
             </BookingStepWrapper>
           )}
        </AnimatePresence>
      </div>
    </div>
  );
};
