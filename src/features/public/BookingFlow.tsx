import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  ChevronLeft, 
  Clock, 
  Calendar as CalendarIcon, 
  X,
  CheckCircle2
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { Service, AddOn } from '../../store/useAppStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

interface BookingFlowProps {
  onCancel?: () => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({ onCancel }) => {
  const { business, createBooking, createCheckoutSession } = useAppStore();
  const isStripeReady = business?.stripeConnected && business?.stripeDetailsSubmitted;
  const [step, setStep] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('booking_success') === 'true' ? 7 : 1;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '', notes: '' });

  // 1. Service Selection
  // 2. Add-ons
  // 3. Date
  // 4. Time
  // 5. Contact
  // 6. Review
  // 7. Payment (Success/Finalize)

  // Steps are fixed at 7 for the flow logic.

  const nextStep = () => setStep(s => Math.min(s + 1, 7));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const subtotal = useMemo(() => {
    if (!selectedService) return 0;
    let total = selectedService.price;
    selectedAddOns.forEach(name => {
      const addon = selectedService.addOns.find((a: AddOn) => a.name === name);
      if (addon) total += addon.price;
    });
    return total;
  }, [selectedService, selectedAddOns]);

  const totalDue = subtotal;

  const availableDates = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i + 1);
      return d.toISOString().split('T')[0];
    });
  }, []);

  const timeSlots = useMemo(() => {
    if (!selectedDate || !selectedService || !business) return [];
    
    // Parse selected date treating it as local to prevent strict UTC shifts
    const [year, month, day] = selectedDate.split('-');
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const dayOfWeek = dateObj.getDay();
    
    const dayHours = business.workingHours.find(h => h.dayOfWeek === dayOfWeek);
    if (!dayHours || !dayHours.isOpen) return [];

    // Calculate dynamic duration payload
    let totalDurationMinutes = selectedService.duration;
    selectedAddOns.forEach(name => {
      const addon = selectedService.addOns.find((a: AddOn) => a.name === name);
      if (addon) totalDurationMinutes += addon.duration;
    });

    const [startH, startM] = dayHours.startTime.split(':').map(Number);
    const [endH, endM] = dayHours.endTime.split(':').map(Number);
    const openMinutes = startH * 60 + startM;
    const closeMinutes = endH * 60 + endM;

    // Fast same-day clipping
    const now = new Date();
    const isToday = now.getFullYear() === dateObj.getFullYear() && 
                    now.getMonth() === dateObj.getMonth() && 
                    now.getDate() === dateObj.getDate();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Pull collision blockers
    const todaysBookings = business.bookings.filter(
       b => b.date === selectedDate && b.status !== 'cancelled'
    );

    const slots: string[] = [];
    
    // Compute 15-minute structural nodes
    for (let m = openMinutes; m + totalDurationMinutes <= closeMinutes; m += 15) {
       if (isToday && m <= currentMinutes + 30) continue;
       
       const slotStart = m;
       const slotEnd = m + totalDurationMinutes;
       
       const isOverlap = todaysBookings.some((booking: any) => {
          const [bh, bm] = booking.time.split(':').map(Number);
          const endStr = (booking as any).end_time; // Keep this 'any' for direct DB field if not in interface
          const [eh, em] = endStr ? endStr.split(':').map(Number) : [bh + Math.floor(totalDurationMinutes/60), bm + (totalDurationMinutes%60)];
          const bStart = bh * 60 + bm;
          const bEnd = eh * 60 + em;
          
          return (slotStart < bEnd) && (slotEnd > bStart);
       });

       if (!isOverlap) {
          const h = Math.floor(m / 60);
          const mins = m % 60;
          const period = h >= 12 ? 'PM' : 'AM';
          const displayH = h % 12 || 12;
          slots.push(`${displayH.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${period}`);
       }
    }

    return slots;
  }, [selectedDate, selectedService, selectedAddOns, business]);

  if (!business) return null;

  const renderProgress = () => (
    <div className="fixed top-0 left-0 w-full h-[3px] bg-bg-tertiary z-60">
      <motion.div 
        className="h-full" 
        style={{ backgroundColor: business.primaryColor }}
        initial={false}
        animate={{ width: `${(step / 7) * 100}%` }}
        transition={{ duration: 0.5, ease: "circOut" }}
      />
    </div>
  );

  const renderTotalPrice = () => (
    <div className="mb-10 text-center">
      <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1">Total</p>
      <p className="text-3xl font-bold tracking-tight text-text-primary">
        ${subtotal}
      </p>
    </div>
  );

  const StepWrapper: React.FC<{ 
    children: React.ReactNode, 
    title: string, 
    subtitle?: string,
    onNext?: () => void,
    onBack?: () => void,
    nextDisabled?: boolean,
    showNext?: boolean,
    showBack?: boolean,
    nextLabel?: string,
    isLoading?: boolean
  }> = ({ 
    children, 
    title, 
    subtitle, 
    onNext, 
    onBack, 
    nextDisabled = false, 
    showNext = true, 
    showBack = true,
    nextLabel = "Continue",
    isLoading = false
  }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="w-full max-w-[440px] mx-auto pt-28 pb-20 px-6 flex flex-col min-h-screen"
    >
      <div className="flex-1 flex flex-col space-y-10">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">{title}</h1>
          {subtitle && <p className="text-[11px] text-text-tertiary font-normal max-w-[300px] mx-auto leading-relaxed">{subtitle}</p>}
        </div>
        
        <div className="flex-1">
          {children}
        </div>
      </div>

      <div className="pt-12 flex flex-col gap-4">
        {showNext && (
          <Button 
            onClick={onNext} 
            disabled={nextDisabled} 
            isLoading={isLoading}
            className="w-full h-14 rounded-2xl text-white font-bold text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-[0.98] disabled:opacity-30"
            style={{ backgroundColor: !nextDisabled ? business.primaryColor : undefined }}
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

  return (
    <div className="fixed inset-0 bg-white z-99 overflow-y-auto">
      {renderProgress()}

      <header className="fixed top-0 left-0 w-full h-20 flex items-center justify-between px-8 z-50">
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
           {step === 1 && (
             <StepWrapper 
               key="step1" 
               title="Select a service" 
               subtitle="Choose the service you'd like to book with us today."
               showBack={false}
               showNext={false}
             >
                <div className="grid gap-3">
                   {business.services.map(s => (
                     <button 
                       key={s.id}
                       onClick={() => { setSelectedService(s); nextStep(); }}
                       className="w-full p-5 rounded-2xl border border-border-light bg-white hover:border-brand/40 hover:shadow-lg hover:shadow-black/2 transition-all text-left group"
                     >
                        <div className="flex justify-between items-start mb-1">
                           <h3 className="font-bold text-text-primary group-hover:text-brand transition-colors">{s.name}</h3>
                           <span className="font-bold text-text-primary">${s.price}</span>
                        </div>
                        <p className="text-[11px] text-text-tertiary line-clamp-2 leading-relaxed">{s.description}</p>
                        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
                           <Clock size={12} /> {s.duration} mins
                        </div>
                     </button>
                   ))}
                </div>
             </StepWrapper>
           )}

           {step === 2 && selectedService && (
             <StepWrapper 
               key="step2" 
               title="Customize your visit" 
               subtitle="Select any add-ons to personalize your experience."
               onNext={nextStep}
               onBack={prevStep}
               nextLabel="Continue to Scheduling"
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
                           <span className="font-bold text-sm text-text-primary">+${addon.price}</span>
                        </button>
                       );
                     })
                   ) : (
                     <div className="p-12 text-center rounded-[32px] bg-bg-secondary/30 italic">
                        <p className="text-text-tertiary text-xs">No extras available for this service.</p>
                     </div>
                   )}
                </div>
             </StepWrapper>
           )}

           {step === 3 && (
             <StepWrapper 
               key="step3" 
               title="Pick a date" 
               subtitle="When would you like to come in?"
               onBack={prevStep}
               showNext={false}
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
             </StepWrapper>
           )}

           {step === 4 && (
             <StepWrapper 
               key="step4" 
               title="Select a time" 
               subtitle={`Available times for ${new Date(selectedDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}`}
               onBack={prevStep}
               showNext={false}
             >
                {renderTotalPrice()}
                <div className="grid grid-cols-2 gap-3">
                   {timeSlots.length > 0 ? (
                     timeSlots.map(time => (
                        <button 
                          key={time}
                          onClick={() => { setSelectedTime(time); nextStep(); }}
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
             </StepWrapper>
           )}

           {step === 5 && (
             <StepWrapper 
               key="step5" 
               title="Your details" 
               subtitle="Almost there. Let us know who to expect."
               onNext={nextStep}
               onBack={prevStep}
               nextDisabled={!contactInfo.name || !contactInfo.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)}
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
             </StepWrapper>
           )}

           {step === 6 && selectedService && (
             <StepWrapper 
                key="step6" 
                title="Review & Confirm" 
                subtitle="Review your appointment details before proceeding."
                onBack={prevStep}
                onNext={async () => {
                  setIsSubmitting(true);
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
                          depositDue: totalDue
                      });

                      if (isStripeReady) {
                          const checkoutUrl = await createCheckoutSession(booking.id);
                          if (checkoutUrl) {
                              window.location.href = checkoutUrl;
                              return;
                          }
                      }
                      nextStep();
                  } catch (err) {
                      console.error('Booking error:', err);
                  } finally {
                      setIsSubmitting(false);
                  }
                }}
                nextLabel={isStripeReady ? 'Pay & Confirm' : 'Confirm Appointment'}
                isLoading={isSubmitting}
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
                         <button onClick={() => setStep(3)} className="text-[10px] font-bold text-brand uppercase tracking-widest">Edit</button>
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
                         <span>${subtotal}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold text-text-primary pt-2 border-t border-border-light">
                         <span>Total</span>
                         <span>${totalDue}</span>
                      </div>
                   </div>
                </div>
             </StepWrapper>
           )}

           {step === 7 && (
             <StepWrapper 
               key="step7" 
               title="You're all set!" 
               subtitle={`Confirmation sent to ${contactInfo.email}`}
               showBack={false}
               onNext={() => window.location.href = '/'}
               nextLabel="Return to Homepage"
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
                            <span>Amount Paid: ${totalDue}</span>
                         </div>
                      </div>
                   </Card>
                </div>
             </StepWrapper>
           )}
        </AnimatePresence>
      </div>
    </div>
  );
};
