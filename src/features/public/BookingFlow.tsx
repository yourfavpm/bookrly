import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  Calendar as CalendarIcon, 
  User, 
  ShieldCheck, 
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

  // 1. Service Selection
  // 2. Add-ons
  // 3. Date
  // 4. Time
  // 5. Contact
  // 6. Review
  // 7. Payment (Success/Finalize)

  const steps = [
    { id: 1, title: 'Service' },
    { id: 2, title: 'Extras' },
    { id: 3, title: 'Date' },
    { id: 4, title: 'Time' },
    { id: 5, title: 'Details' },
    { id: 6, title: 'Review' },
    { id: 7, title: 'Payment' }
  ];

  const nextStep = () => setStep(s => Math.min(s + 1, 7));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const subtotal = useMemo(() => {
    if (!selectedService) return 0;
    let total = selectedService.price;
    selectedAddOns.forEach(name => {
      const addon = selectedService.addOns.find((a: any) => a.name === name);
      if (addon) total += addon.price;
    });
    return total;
  }, [selectedService, selectedAddOns]);

  const availableDates = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i + 1);
      return d.toISOString().split('T')[0];
    });
  }, []);

  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

  if (!business) return null;

  const renderProgress = () => (
    <div className="flex items-center gap-2 w-full mb-10 text-xs font-bold text-text-tertiary">
       <span>Step {step} of 7 — {steps.find(s => s.id === step)?.title}</span>
       <div className="flex-1 h-1.5 ml-4 rounded-full bg-border-light overflow-hidden flex">
          {steps.map((s, idx) => (
             <div 
               key={s.id} 
               className="h-full transition-all duration-500 rounded-full" 
               style={{ 
                 width: `${100 / steps.length}%`, 
                 backgroundColor: step >= s.id ? business.primaryColor : 'transparent',
                 marginRight: idx < steps.length - 1 ? '2px' : '0'
               }} 
             />
          ))}
       </div>
    </div>
  );

  const renderTotalPrice = () => (
    <div className="pb-6 mb-8 border-b border-border-light flex items-center justify-between">
       <div>
          <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1">Estimated Total</p>
          <p className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-3">
            ${subtotal}
          </p>
       </div>
       <div className="text-right">
          <p className="text-[10px] font-bold text-success uppercase tracking-widest flex items-center justify-end gap-1.5 mt-2 bg-success/10 px-3 py-1.5 rounded-full inline-flex">
             <ShieldCheck size={14} /> Secure
          </p>
       </div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col min-h-full px-4 md:px-0">
      <header className="flex items-center justify-between mb-8 pb-6 border-b border-border-light">
         <div className="flex items-center gap-4">
            {step > 1 && (
              <button 
                onClick={prevStep} 
                className="w-10 h-10 flex items-center justify-center hover:bg-bg-secondary rounded-full border border-border-light text-text-primary transition-colors cursor-pointer"
              >
                 <ChevronLeft size={20} />
              </button>
            )}
            <div>
               <h2 className="text-2xl font-bold tracking-tight text-text-primary">
                  {steps.find(s => s.id === step)?.title} Selection
               </h2>
            </div>
         </div>
         {onCancel && (
           <button onClick={onCancel} className="p-2 hover:bg-bg-secondary rounded-full transition-colors text-text-tertiary cursor-pointer">
              <X size={20} />
           </button>
         )}
      </header>

      {renderProgress()}

      <div className="flex-1">
        <AnimatePresence mode="wait">
           {step === 1 && (
             <motion.div 
               key="step1"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="flex flex-col gap-4"
             >
                {business.services.map(s => (
                  <button 
                    key={s.id}
                    onClick={() => { setSelectedService(s); nextStep(); }}
                    className={`w-full p-6 lg:p-8 rounded-2xl border transition-all text-left flex flex-col sm:flex-row sm:items-center gap-6 cursor-pointer group hover:-translate-y-1 ${selectedService?.id === s.id ? 'border-brand shadow-md bg-brand/5' : 'border-border-light bg-white hover:border-text-tertiary/30 hover:shadow-sm'}`}
                    style={{ 
                      borderColor: selectedService?.id === s.id ? business.primaryColor : undefined,
                      backgroundColor: selectedService?.id === s.id ? `${business.primaryColor}08` : undefined
                    }}
                  >
                     <div className="w-12 h-12 rounded-full bg-bg-secondary border border-border-light flex items-center justify-center text-text-tertiary transition-colors shrink-0" style={{ color: selectedService?.id === s.id ? business.primaryColor : undefined }}>
                        <Clock size={22} />
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                           <h3 className="text-lg font-bold text-text-primary truncate pr-4">{s.name}</h3>
                           <span className="text-lg font-bold text-text-primary whitespace-nowrap pl-2 border-l border-border-light">${s.price}</span>
                        </div>
                        <p className="text-text-secondary text-sm leading-relaxed max-w-lg line-clamp-2">{s.description}</p>
                     </div>
                     <div className="hidden sm:flex shrink-0 items-center justify-center w-8 h-8 rounded-full border border-border-light text-border-default group-hover:text-white transition-colors" style={{ backgroundColor: selectedService?.id === s.id ? business.primaryColor : undefined, borderColor: selectedService?.id === s.id ? business.primaryColor : undefined, color: selectedService?.id === s.id ? 'white' : undefined }}>
                        <ArrowRight size={16} />
                     </div>
                  </button>
                ))}
             </motion.div>
           )}

           {step === 2 && selectedService && (
             <motion.div 
               key="step2"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-8"
             >
                {renderTotalPrice()}
                <div className="flex flex-col gap-3">
                   {selectedService.addOns.length > 0 ? (
                     selectedService.addOns.map((addon: any) => (
                       <button 
                         key={addon.name}
                         onClick={() => {
                           if (selectedAddOns.includes(addon.name)) {
                             setSelectedAddOns(selectedAddOns.filter(a => a !== addon.name));
                           } else {
                             setSelectedAddOns([...selectedAddOns, addon.name]);
                           }
                         }}
                         className={`w-full p-5 rounded-2xl border transition-all flex items-center gap-5 cursor-pointer group ${selectedAddOns.includes(addon.name) ? 'border-brand bg-brand/5 shadow-sm' : 'border-border-light bg-white hover:border-text-tertiary/30'}`}
                         style={{ 
                            borderColor: selectedAddOns.includes(addon.name) ? business.primaryColor : undefined,
                            backgroundColor: selectedAddOns.includes(addon.name) ? `${business.primaryColor}08` : undefined
                         }}
                       >
                          <div className={`w-6 h-6 rounded flex shrink-0 items-center justify-center border transition-all ${selectedAddOns.includes(addon.name) ? 'text-white border-transparent' : 'border-border-default bg-bg-secondary group-hover:bg-white'}`} style={{ backgroundColor: selectedAddOns.includes(addon.name) ? business.primaryColor : undefined }}>
                             {selectedAddOns.includes(addon.name) && <Check size={14} strokeWidth={3} />}
                          </div>
                          <div className="flex-1 text-left min-w-0">
                             <div className="flex items-center justify-between">
                                <h4 className="font-bold text-base text-text-primary truncate">{addon.name}</h4>
                                <span className="font-bold text-text-primary whitespace-nowrap ml-4">+${addon.price}</span>
                             </div>
                             <p className="text-sm font-medium text-text-tertiary line-clamp-1">{addon.description}</p>
                          </div>
                       </button>
                     ))
                   ) : (
                     <div className="p-12 text-center rounded-2xl border border-dashed border-border-light space-y-3">
                        <div className="w-12 h-12 rounded-full bg-bg-secondary flex items-center justify-center mx-auto text-text-tertiary">
                           <Info size={24} />
                        </div>
                        <p className="text-text-secondary text-sm font-medium">No specialized extras available for this service.</p>
                     </div>
                   )}
                </div>
                <Button className="w-full h-16 rounded-2xl font-bold text-lg shadow-md" style={{ backgroundColor: business.primaryColor }} onClick={nextStep}>
                   Continue to Scheduling
                </Button>
             </motion.div>
           )}

           {step === 3 && (
             <motion.div 
               key="step3"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-8"
             >
                {renderTotalPrice()}
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                   {availableDates.map(date => {
                      const d = new Date(date);
                      const isSelected = selectedDate === date;
                      return (
                        <button 
                          key={date}
                          onClick={() => { setSelectedDate(date); nextStep(); }}
                          className={`py-4 flex flex-col items-center justify-center rounded-2xl border transition-all cursor-pointer hover:-translate-y-1 ${isSelected ? 'text-white shadow-md' : 'border-border-light bg-white hover:border-text-tertiary/40'}`}
                          style={{ 
                            backgroundColor: isSelected ? business.primaryColor : undefined, 
                            borderColor: isSelected ? business.primaryColor : undefined 
                          }}
                        >
                           <span className={`text-[10px] uppercase font-bold tracking-widest ${isSelected ? 'text-white/80' : 'text-text-tertiary'}`}>
                             {d.toLocaleDateString(undefined, { weekday: 'short' })}
                           </span>
                           <span className="text-xl font-bold mt-1">{d.getDate()}</span>
                           <span className={`text-[10px] uppercase font-bold tracking-widest mt-0.5 ${isSelected ? 'text-white/80' : 'text-text-tertiary'}`}>
                             {d.toLocaleDateString(undefined, { month: 'short' })}
                           </span>
                        </button>
                      );
                   })}
                </div>
             </motion.div>
           )}

           {step === 4 && (
             <motion.div 
               key="step4"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-8"
             >
                {renderTotalPrice()}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                   {timeSlots.map(time => {
                      const isSelected = selectedTime === time;
                      return (
                        <button 
                          key={time}
                          onClick={() => { setSelectedTime(time); nextStep(); }}
                          className={`py-4 rounded-xl border font-bold text-sm transition-all cursor-pointer hover:-translate-y-0.5 ${isSelected ? 'text-white shadow-md' : 'border-border-light bg-white hover:border-text-tertiary/40'}`}
                          style={{ 
                            backgroundColor: isSelected ? business.primaryColor : undefined, 
                            borderColor: isSelected ? business.primaryColor : undefined 
                          }}
                        >
                           {time}
                        </button>
                      );
                   })}
                </div>
             </motion.div>
           )}

           {step === 5 && (
             <motion.div 
               key="step5"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-8"
             >
                {renderTotalPrice()}
                <div className="space-y-5">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        type="text"
                        placeholder="John Doe"
                        className="w-full h-14 px-5 rounded-xl border border-border-light bg-white focus:bg-white outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all text-sm font-medium"
                        value={contactInfo.name}
                        onChange={e => setContactInfo({...contactInfo, name: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Email Address</label>
                      <input 
                        type="email"
                        placeholder="john@example.com"
                        className="w-full h-14 px-5 rounded-xl border border-border-light bg-white focus:bg-white outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all text-sm font-medium"
                        value={contactInfo.email}
                        onChange={e => setContactInfo({...contactInfo, email: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Phone Number</label>
                      <input 
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="w-full h-14 px-5 rounded-xl border border-border-light bg-white focus:bg-white outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all text-sm font-medium"
                        value={contactInfo.phone}
                        onChange={e => setContactInfo({...contactInfo, phone: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Instructions / Notes (Optional)</label>
                      <textarea 
                        placeholder="Any special requests or parking directions?"
                        className="w-full h-24 p-5 rounded-xl border border-border-light bg-white focus:bg-white outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all text-sm font-medium resize-none"
                        value={contactInfo.notes}
                        onChange={e => setContactInfo({...contactInfo, notes: e.target.value})}
                      />
                   </div>
                </div>
                <Button 
                   disabled={!contactInfo.name || !contactInfo.email || !contactInfo.phone}
                   className="w-full h-16 rounded-2xl font-bold text-lg shadow-md hover:-translate-y-1 transition-transform" 
                   style={{ backgroundColor: business.primaryColor }} 
                   onClick={nextStep}
                >
                   Review Your Appointment
                </Button>
             </motion.div>
           )}

           {step === 6 && selectedService && (
             <motion.div 
               key="step6"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-8"
             >
                <div className="p-8 rounded-3xl bg-bg-secondary/30 border border-border-light border-dashed space-y-8">
                   <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-border-light">
                      <div className="space-y-1">
                         <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-2 flex items-center gap-1.5"><CalendarIcon size={14}/> Timeline</p>
                         <h4 className="text-xl font-bold text-text-primary">
                            {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                         </h4>
                         <p className="text-sm font-bold text-text-tertiary">starts at {selectedTime}</p>
                      </div>
                      <div className="space-y-1 md:text-right">
                         <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-2 flex items-center md:justify-end gap-1.5"><User size={14}/> Client</p>
                         <h4 className="text-base font-bold text-text-primary">{contactInfo.name}</h4>
                         <p className="text-sm text-text-secondary">{contactInfo.email}</p>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm font-bold text-text-primary">
                         <span>{selectedService.name}</span>
                         <span>${selectedService.price}</span>
                      </div>
                      {selectedAddOns.map(name => {
                        const addon = selectedService.addOns.find((a: any) => a.name === name);
                        return (
                          <div key={name} className="flex justify-between items-center text-sm font-medium text-text-secondary">
                             <span>+ {name}</span>
                             <span>${addon.price}</span>
                          </div>
                        );
                      })}
                      
                      <div className="pt-6 mt-4 border-t border-border-light flex justify-between items-center">
                         <span className="text-lg font-bold text-text-primary">Total Due</span>
                         <span className="text-3xl font-bold" style={{ color: business.primaryColor }}>${subtotal}</span>
                      </div>
                   </div>
                </div>

                <Button className="w-full h-16 rounded-2xl font-bold text-lg shadow-md group flex items-center justify-center gap-2 transition-all hover:-translate-y-1" style={{ backgroundColor: business.primaryColor }} onClick={nextStep}>
                   Confirm Order & Pay <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Button>
             </motion.div>
           )}

           {step === 7 && (
             <motion.div 
               key="step7"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="py-12 text-center space-y-10"
             >
                <div className="w-24 h-24 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto">
                   <Check size={40} className="stroke-[3px]" />
                </div>
                <div className="space-y-3">
                   <h2 className="text-3xl font-bold tracking-tight text-text-primary">You're all set!</h2>
                   <p className="text-base text-text-secondary max-w-md mx-auto leading-relaxed">
                      Your appointment has been successfully scheduled. We've sent a confirmation to <span className="font-bold text-text-primary">{contactInfo.email}</span>.
                   </p>
                </div>
                
                <div className="p-8 rounded-2xl border border-border-light bg-bg-secondary/30 max-w-md mx-auto text-left flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                   <div className="w-16 h-16 rounded-full bg-white border border-border-light flex items-center justify-center text-text-tertiary shrink-0">
                      <CalendarIcon size={24} />
                   </div>
                   <div className="space-y-1 text-center sm:text-left">
                      <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Receipt</p>
                      <h4 className="text-lg font-bold text-text-primary">{selectedService?.name}</h4>
                      <p className="text-sm font-medium text-text-secondary">
                         {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' })} at {selectedTime}
                      </p>
                      <p className="text-xs font-bold text-success flex items-center justify-center sm:justify-start gap-1.5 pt-2">
                         <ShieldCheck size={14} /> Paid in Full: ${subtotal}
                      </p>
                   </div>
                </div>

                <div className="flex flex-col gap-3 justify-center max-w-md mx-auto">
                   <Button className="w-full h-14 rounded-xl font-bold text-sm" style={{ backgroundColor: business.primaryColor }} onClick={() => window.print()}>
                      Download Receipt
                   </Button>
                   <Button variant="secondary" className="w-full h-14 rounded-xl font-bold text-sm border-border-light" onClick={() => window.location.href = '/'}>
                      Return to Homepage
                   </Button>
                </div>
             </motion.div>
           )}
        </AnimatePresence>
      </div>
    </div>
  );
};
