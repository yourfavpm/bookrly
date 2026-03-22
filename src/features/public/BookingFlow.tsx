import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  Calendar as CalendarIcon, 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  CreditCard,
  ArrowRight,
  Info,
  X
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/ui/Button';

interface BookingFlowProps {
  onCancel?: () => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({ onCancel }) => {
  const { business } = useAppStore();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '', notes: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);


  const subtotal = useMemo(() => {
    if (!selectedService) return 0;
    let total = selectedService.price;
    selectedAddOns.forEach((name: string) => {
      const addon = selectedService.addOns.find((a: any) => a.name === name);
      if (addon) total += (addon.price as number);
    });
    return total;
  }, [selectedService, selectedAddOns]);

  const availableDates = useMemo(() => {
    if (!business) return [];
    const dates = [];
    const now = new Date();
    // Show next 30 days
    for (let i = 0; i < 30; i++) {
        const d = new Date();
        d.setDate(now.getDate() + i);
        const dayOfWeek = d.getDay();
        const config = (business.workingHours || []).find(h => h.dayOfWeek === dayOfWeek);
        if (config?.isOpen) {
            dates.push(d.toISOString().split('T')[0]);
        }
    }
    return dates;
  }, [business]);

  const timeSlots = useMemo(() => {
    if (!business || !selectedDate) return [];
    const date = new Date(selectedDate);
    const dayOfWeek = date.getDay();
    const config = (business.workingHours || []).find(h => h.dayOfWeek === dayOfWeek);
    if (!config || !config.startTime || !config.endTime) return [];

    const slots: string[] = [];
    const current = new Date(`${selectedDate}T${config.startTime}`);
    const end = new Date(`${selectedDate}T${config.endTime}`);

    while (current < end) {
      const timeStr = current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      const isBooked = (business.bookings || []).some(b => 
        b.date === selectedDate && 
        b.time === timeStr &&
        b.status !== 'cancelled'
      );

      if (!isBooked) slots.push(timeStr);
      current.setMinutes(current.getMinutes() + (selectedService?.duration || 30));
    }
    return slots;
  }, [selectedDate, business, selectedService]);

  if (!business) return null;

  const steps = [
    { id: 1, title: 'Service' },
    { id: 2, title: 'Add-ons' },
    { id: 3, title: 'Date' },
    { id: 4, title: 'Time' },
    { id: 5, title: 'Details' },
    { id: 6, title: 'Review' }
  ];

  const nextStep = () => setStep(s => Math.min(s + 1, 7));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleFinalize = async () => {
    if (subtotal > 0 && !business.stripeConnected) {
      alert("This business is not currently set up to receive payments. Please contact them directly.");
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real app, we would:
      // 1. Create the booking as 'pending_payment'
      // 2. Call a Supabase function to create a Stripe Checkout Session
      // 3. Redirect to the session URL
      
      // For now, we simulate the redirect success
      setTimeout(() => {
          setIsSubmitting(false);
          setStep(7);
      }, 1500);
    } catch (err: any) {
      console.error('Booking finalization error:', err);
      setIsSubmitting(false);
    }
  };

  const renderProgress = () => (
    <div className="w-full flex items-center gap-1 mb-10 px-1">
      {steps.map((s) => (
        <div 
          key={s.id}
          className="h-1 flex-1 rounded-full transition-all duration-500 overflow-hidden bg-bg-secondary"
        >
           <motion.div 
             initial={false}
             animate={{ width: step >= s.id ? '100%' : '0%' }}
             className="h-full"
             style={{ backgroundColor: business.primaryColor }}
           />
        </div>
      ))}
    </div>
  );

  const renderSummary = () => (
    <div className="fixed bottom-0 left-0 right-0 p-4 lg:p-0 lg:relative lg:mb-8 z-40">
       <div className="bg-white/80 backdrop-blur-xl border border-border-light p-4 lg:p-6 rounded-3xl shadow-xl lg:shadow-none flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-bg-secondary flex items-center justify-center text-text-tertiary">
                <CreditCard size={18} />
             </div>
             <div>
                <p className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest">Est. Total</p>
                <p className="text-xl font-medium tracking-tight text-text-primary">${subtotal}</p>
             </div>
          </div>
          {step < 5 && (
            <div className="text-[10px] font-medium text-text-tertiary uppercase tracking-[0.2em] px-3 py-1 bg-bg-secondary rounded-lg">
               Step {step} of 6
            </div>
          )}
       </div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col min-h-full pb-32 lg:pb-0">
      <header className="flex items-center justify-between mb-8">
         <div className="flex items-center gap-4">
            {step > 1 && step < 7 && (
              <button 
                onClick={prevStep} 
                className="w-10 h-10 flex items-center justify-center hover:bg-bg-secondary rounded-xl transition-all border border-border-light bg-white text-text-primary shadow-sm"
              >
                 <ChevronLeft size={16} />
              </button>
            )}
            <div>
               <h2 className="text-xl font-medium tracking-tight text-text-primary">
                  {step < 7 ? steps.find(s => s.id === step)?.title : 'Success!'}
               </h2>
               {step < 7 && (
                 <p className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest">
                    Customer Booking • Secure
                 </p>
               )}
            </div>
         </div>
         {onCancel && step < 7 && (
           <button onClick={onCancel} className="p-2 border border-border-light rounded-xl hover:bg-bg-secondary transition-all text-text-tertiary">
              <X size={18} />
           </button>
         )}
      </header>

      {step < 7 && renderProgress()}

      <div className="flex-1">
        <AnimatePresence mode="wait">
           {step === 1 && (
             <motion.div 
               key="step1"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="space-y-4"
             >
                {(business.services || []).filter(s => s.active).map(s => (
                  <button 
                    key={s.id}
                    onClick={() => { setSelectedService(s); nextStep(); }}
                    className="w-full p-6 rounded-3xl border border-border-light/60 bg-white text-left flex items-center justify-between hover:border-brand/40 transition-all group"
                  >
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-bg-secondary flex items-center justify-center text-text-tertiary group-hover:bg-brand/10 transition-colors" style={{ color: selectedService?.id === s.id ? business.primaryColor : undefined }}>
                           <Clock size={20} />
                        </div>
                        <div>
                           <h3 className="text-base font-medium text-text-primary">{s.name}</h3>
                           <div className="flex items-center gap-3 mt-1">
                              <span className="text-[10px] font-normal text-text-tertiary uppercase tracking-widest">{s.duration} MIN</span>
                              <span className="w-1 h-1 rounded-full bg-border-default" />
                              <span className="text-[10px] font-medium text-brand uppercase tracking-widest">${s.price}</span>
                           </div>
                        </div>
                     </div>
                     <ChevronRight size={18} className="text-text-tertiary opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                  </button>
                ))}
             </motion.div>
           )}

           {step === 2 && selectedService && (
             <motion.div 
               key="step2"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="space-y-6"
             >
                <div className="space-y-3">
                   {(selectedService.addOns || []).length > 0 ? (
                     selectedService.addOns.map((addon: any) => (
                       <button 
                         key={addon.id}
                         onClick={() => {
                           if (selectedAddOns.includes(addon.name)) {
                             setSelectedAddOns(selectedAddOns.filter(a => a !== addon.name));
                           } else {
                             setSelectedAddOns([...selectedAddOns, addon.name]);
                           }
                         }}
                         className={`w-full p-5 rounded-3xl border transition-all flex items-center justify-between group cursor-pointer ${selectedAddOns.includes(addon.name) ? 'bg-white shadow-sm' : 'border-border-light/60 bg-bg-secondary/20 hover:bg-white'}`}
                         style={{ borderColor: selectedAddOns.includes(addon.name) ? business.primaryColor : undefined }}
                       >
                          <div className="flex items-center gap-4">
                             <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${selectedAddOns.includes(addon.name) ? 'text-white' : 'border-border-default bg-white'}`} style={{ backgroundColor: selectedAddOns.includes(addon.name) ? business.primaryColor : 'transparent', borderColor: selectedAddOns.includes(addon.name) ? business.primaryColor : undefined }}>
                                {selectedAddOns.includes(addon.name) && <Check size={12} strokeWidth={4} />}
                             </div>
                             <div className="text-left">
                                <h4 className="text-sm font-medium text-text-primary">{addon.name}</h4>
                                <p className="text-[10px] text-text-tertiary">{addon.description}</p>
                             </div>
                          </div>
                          <span className="text-sm font-medium text-brand">+${addon.price}</span>
                       </button>
                     ))
                   ) : (
                     <div className="py-20 text-center space-y-3 px-6">
                        <p className="text-xs text-text-tertiary">No specialized add-ons for this service.</p>
                     </div>
                   )}
                </div>
                <Button className="w-full h-14 rounded-2xl font-medium shadow-lg" style={{ backgroundColor: business.primaryColor }} onClick={nextStep}>
                   Continue to Calendar
                </Button>
                {renderSummary()}
             </motion.div>
           )}

           {step === 3 && (
             <motion.div 
               key="step3"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="space-y-8"
             >
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                   {availableDates.map(date => {
                      const d = new Date(date);
                      const isSelected = selectedDate === date;
                      return (
                        <button 
                          key={date}
                          onClick={() => { setSelectedDate(date); nextStep(); }}
                          className={`aspect-square rounded-[24px] border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer group hover:border-brand/40 ${isSelected ? 'text-white shadow-xl' : 'border-border-light/60 bg-white'}`}
                          style={{ backgroundColor: isSelected ? business.primaryColor : undefined, borderColor: isSelected ? business.primaryColor : undefined }}
                        >
                           <span className={`text-[8px] font-medium uppercase tracking-[0.2em] ${isSelected ? 'text-white/80' : 'text-text-tertiary'}`}>{d.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                           <span className="text-xl font-medium tracking-tight">{d.getDate()}</span>
                           <span className={`text-[8px] font-medium uppercase tracking-[0.2em] ${isSelected ? 'text-white/80' : 'text-text-tertiary'}`}>{d.toLocaleDateString(undefined, { month: 'short' })}</span>
                        </button>
                      );
                   })}
                </div>
                {renderSummary()}
             </motion.div>
           )}

           {step === 4 && (
             <motion.div 
               key="step4"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="space-y-8"
             >
                <div className="grid grid-cols-3 gap-3">
                   {timeSlots.length > 0 ? timeSlots.map(time => {
                      const isSelected = selectedTime === time;
                      return (
                        <button 
                          key={time}
                          onClick={() => { setSelectedTime(time); nextStep(); }}
                          className={`py-4 rounded-2xl border font-medium text-xs transition-all cursor-pointer group hover:border-brand/40 ${isSelected ? 'text-white shadow-lg' : 'border-border-light/60 bg-white'}`}
                          style={{ backgroundColor: isSelected ? business.primaryColor : undefined, borderColor: isSelected ? business.primaryColor : undefined }}
                        >
                           {time}
                        </button>
                      );
                   }) : (
                     <div className="col-span-full py-20 text-center text-text-tertiary text-[10px] font-medium uppercase tracking-[0.3em]">
                        No available slots
                     </div>
                   )}
                </div>
                {renderSummary()}
             </motion.div>
           )}

           {step === 5 && (
             <motion.div 
               key="step5"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="space-y-8"
             >
                <div className="space-y-5">
                   <div className="space-y-2">
                      <label className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest ml-1">Full Name</label>
                      <div className="relative group">
                         <User size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                         <input 
                           type="text"
                           placeholder="Jane Smith"
                           className="w-full h-14 pl-12 pr-6 rounded-2xl border border-border-light/60 bg-bg-secondary/20 outline-none focus:bg-white text-sm font-medium transition-all"
                           value={contactInfo.name}
                           onChange={e => setContactInfo({...contactInfo, name: e.target.value})}
                         />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest ml-1">Email Address</label>
                      <div className="relative group">
                         <Mail size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                         <input 
                           type="email"
                           placeholder="jane@example.com"
                           className="w-full h-14 pl-12 pr-6 rounded-2xl border border-border-light/60 bg-bg-secondary/20 outline-none focus:bg-white text-sm font-medium transition-all"
                           value={contactInfo.email}
                           onChange={e => setContactInfo({...contactInfo, email: e.target.value})}
                         />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest">Phone Number</label>
                        <span className="text-[9px] font-normal text-text-tertiary uppercase tracking-widest">Optional</span>
                      </div>
                      <div className="relative group">
                         <Phone size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                         <input 
                           type="tel"
                           placeholder="+1 (555) 000-0000"
                           className="w-full h-14 pl-12 pr-6 rounded-2xl border border-border-light/60 bg-bg-secondary/20 outline-none focus:bg-white text-sm font-medium transition-all"
                           value={contactInfo.phone}
                           onChange={e => setContactInfo({...contactInfo, phone: e.target.value})}
                         />
                      </div>
                   </div>
                </div>
                <Button 
                   disabled={!contactInfo.name || !contactInfo.email}
                   className="w-full h-16 rounded-2xl font-medium shadow-xl mt-4" 
                   style={{ backgroundColor: business.primaryColor }} 
                   onClick={nextStep}
                >
                   Finalize Booking
                </Button>
                {renderSummary()}
             </motion.div>
           )}

           {step === 6 && selectedService && (
             <motion.div 
               key="step6"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="space-y-8 pb-10"
             >
                <div className="space-y-4">
                   <div className="p-6 rounded-[32px] bg-white border border-border-light/60 space-y-6">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: business.primaryColor }}>
                            <CalendarIcon size={20} />
                         </div>
                         <div>
                            <p className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest">Appointment</p>
                            <h4 className="text-sm font-medium text-text-primary">
                               {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
                            </h4>
                         </div>
                      </div>
                      
                      <div className="space-y-3 pt-3 border-t border-border-light/40">
                         <div className="flex justify-between items-center text-xs font-normal">
                            <span className="text-text-secondary">{selectedService.name}</span>
                            <span className="text-text-primary font-medium">${selectedService.price}</span>
                         </div>
                         {selectedAddOns.map(name => {
                           const addon = selectedService.addOns.find((a: any) => a.name === name);
                           return (
                             <div key={name} className="flex justify-between items-center text-xs font-normal">
                                <span className="text-text-tertiary">+ {name}</span>
                                <span className="text-text-primary font-medium">${addon.price}</span>
                             </div>
                           );
                         })}
                      </div>

                      <div className="pt-4 border-t border-dashed border-border-light flex justify-between items-center">
                         <span className="text-sm font-medium text-text-primary">Total to Pay</span>
                         <span className="text-2xl font-medium tracking-tight" style={{ color: business.primaryColor }}>${subtotal}</span>
                      </div>
                   </div>

                   <div className="p-6 rounded-[32px] bg-bg-secondary/20 flex items-center justify-between border border-border-light/40">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-white border border-border-light/60 flex items-center justify-center text-text-tertiary">
                             <User size={18} />
                          </div>
                          <div>
                             <p className="text-[9px] font-medium text-text-tertiary uppercase tracking-widest leading-none mb-1">Customer</p>
                             <h4 className="text-sm font-medium text-text-primary leading-none">{contactInfo.name}</h4>
                          </div>
                       </div>
                       <button onClick={() => setStep(5)} className="text-[10px] font-medium text-brand uppercase tracking-widest hover:underline px-2 py-1">Edit</button>
                   </div>
                </div>

                <div className="space-y-4">
                   {subtotal > 0 && !business.stripeConnected && (
                     <div className="p-4 rounded-2xl bg-error/5 border border-error/10 flex items-start gap-3">
                       <Info size={16} className="text-error mt-0.5 flex-shrink-0" />
                       <p className="text-[11px] text-error/80 font-normal leading-relaxed">
                         This business hasn't enabled online payments yet. They cannot accept paid bookings through the website at this time.
                       </p>
                     </div>
                   )}

                   <Button 
                     isLoading={isSubmitting}
                     disabled={subtotal > 0 && !business.stripeConnected}
                     className="w-full h-16 rounded-2xl font-medium shadow-2xl flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed" 
                     style={{ backgroundColor: (subtotal > 0 && !business.stripeConnected) ? '#94a3b8' : business.primaryColor }} 
                     onClick={handleFinalize}
                   >
                      {subtotal > 0 ? (
                        <>Confirm & Pay with Stripe <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></>
                      ) : (
                        <>Confirm Free Booking <Check size={18} className="transition-transform" /></>
                      )}
                   </Button>
                   <p className="text-[10px] text-center text-text-tertiary px-10 leading-relaxed font-normal">
                      By clicking confirm, you agree to our terms of service and chosen appointment time.
                   </p>
                </div>
             </motion.div>
           )}

           {step === 7 && (
             <motion.div 
               key="step7"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="py-12 text-center"
             >
                <div className="w-20 h-20 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto mb-8 shadow-xl shadow-success/5">
                   <Check size={40} strokeWidth={3} />
                </div>
                <h2 className="text-2xl font-medium tracking-tight text-text-primary mb-3">Booking Confirmed</h2>
                <p className="text-sm text-text-secondary font-normal mb-10 max-w-xs mx-auto">
                   Your appointment is scheduled. We've sent the details to <span className="font-medium text-text-primary">{contactInfo.email}</span>.
                </p>
                
                <div className="p-8 rounded-[32px] border border-border-light bg-bg-secondary/10 mb-10 text-left space-y-4">
                   <div>
                      <p className="text-[9px] font-medium text-text-tertiary uppercase tracking-widest mb-1">Service</p>
                      <h4 className="font-medium text-text-primary">{selectedService?.name}</h4>
                   </div>
                   <div>
                      <p className="text-[9px] font-medium text-text-tertiary uppercase tracking-widest mb-1">When</p>
                      <p className="font-medium text-text-primary">
                         {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
                      </p>
                   </div>
                   <div className="pt-4 border-t border-dashed border-border-light">
                      <p className="text-[10px] font-medium text-success flex items-center gap-2">
                         <ShieldCheck size={14} /> Total Paid: ${subtotal}
                      </p>
                   </div>
                </div>

                <Button variant="secondary" className="px-10 h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest border-border-light" onClick={() => window.location.reload()}>
                   Return to Site
                </Button>
             </motion.div>
           )}
        </AnimatePresence>
      </div>
    </div>
  );
};
