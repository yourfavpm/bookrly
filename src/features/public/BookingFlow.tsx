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

  const renderProgress = () => (
    <div className="flex items-center justify-between w-full mb-12 px-2">
      {steps.map((s, idx) => (
        <React.Fragment key={s.id}>
          <div className="flex flex-col items-center gap-3 relative group">
             <div 
               className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-500 shadow-lg ${step >= s.id ? 'text-white scale-110' : 'bg-bg-secondary text-text-tertiary shadow-none'}`}
               style={{ backgroundColor: step >= s.id ? business.primaryColor : undefined }}
             >
                {step > s.id ? <Check size={18} /> : s.id}
             </div>
             <span className={`text-[10px] font-bold uppercase tracking-widest absolute -bottom-6 whitespace-nowrap transition-colors ${step === s.id ? 'text-text-primary' : 'text-text-tertiary'}`}>
                {s.title}
             </span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`h-1 flex-1 mx-4 rounded-full transition-all duration-1000 ${step > s.id ? 'bg-brand' : 'bg-bg-secondary'}`} style={{ backgroundColor: step > s.id ? business.primaryColor : undefined }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderTotalPrice = () => (
    <div className="p-8 rounded-[32px] bg-bg-secondary/50 flex items-center justify-between mb-8 border border-border-light shadow-sm">
       <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-text-tertiary shadow-sm">
             <CreditCard size={20} />
          </div>
          <div>
             <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Estimated Total</p>
             <p className="text-2xl font-bold tracking-tight text-text-primary">${subtotal}</p>
          </div>
       </div>
       <div className="text-right">
          <p className="text-xs font-bold text-success uppercase tracking-widest flex items-center gap-1.5 justify-end">
             <ShieldCheck size={14} /> Secure Booking
          </p>
       </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col min-h-full">
      <header className="flex items-center justify-between mb-12">
         <div className="flex items-center gap-5">
            {step > 1 && (
              <button onClick={prevStep} className="p-4 hover:bg-bg-secondary rounded-xl transition-all bg-white border border-border-light text-text-primary shadow-sm">
                 <ChevronLeft size={20} />
              </button>
            )}
            <div>
               <h2 className="text-3xl font-bold tracking-tight text-text-primary">
                  {steps.find(s => s.id === step)?.title} Selection
               </h2>
               <p className="text-sm font-medium text-text-tertiary">Step {step} of 7 • Secure Checkout</p>
            </div>
         </div>
         {onCancel && (
           <button onClick={onCancel} className="p-4 hover:bg-bg-secondary rounded-xl transition-all text-text-tertiary">
              <X size={24} />
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
               className="grid grid-cols-1 md:grid-cols-2 gap-6"
             >
                {business.services.map(s => (
                  <button 
                    key={s.id}
                    onClick={() => { setSelectedService(s); nextStep(); }}
                    className={`p-8 rounded-[40px] border-2 transition-all text-left flex flex-col hover:shadow-2xl hover:scale-[1.02] cursor-pointer group ${selectedService?.id === s.id ? 'shadow-2xl scale-[1.02]' : 'border-border-default bg-white'}`}
                    style={{ borderColor: selectedService?.id === s.id ? business.primaryColor : undefined }}
                  >
                     <div className="flex justify-between items-start mb-10">
                        <div className="w-14 h-14 rounded-2xl bg-bg-secondary flex items-center justify-center text-text-tertiary transition-colors group-hover:bg-brand-light/20" style={{ color: selectedService?.id === s.id ? business.primaryColor : undefined }}>
                           <Clock size={28} />
                        </div>
                        <span className="text-2xl font-bold text-text-primary">$ {s.price}</span>
                     </div>
                     <h3 className="text-2xl font-bold text-text-primary mb-3">{s.name}</h3>
                     <p className="text-text-secondary text-sm font-medium leading-relaxed flex-1 mb-8 opacity-70">{s.description}</p>
                     <div className="flex items-center justify-between pt-6 border-t border-border-light mt-auto">
                        <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest bg-bg-secondary px-4 py-2 rounded-full">
                           {s.duration} MIN
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-text-primary text-white flex items-center justify-center" style={{ backgroundColor: selectedService?.id === s.id ? business.primaryColor : undefined }}>
                           <ArrowRight size={18} />
                        </div>
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
               className="space-y-10"
             >
                {renderTotalPrice()}
                <div className="grid grid-cols-1 gap-5">
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
                         className={`p-8 rounded-[32px] border-2 transition-all flex items-center justify-between group cursor-pointer ${selectedAddOns.includes(addon.name) ? 'bg-brand-light/10 shadow-lg' : 'border-border-default bg-white hover:border-border-light'}`}
                         style={{ borderColor: selectedAddOns.includes(addon.name) ? business.primaryColor : undefined }}
                       >
                          <div className="flex items-center gap-6">
                             <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${selectedAddOns.includes(addon.name) ? 'text-white' : 'border-border-default'}`} style={{ backgroundColor: selectedAddOns.includes(addon.name) ? business.primaryColor : undefined, borderColor: selectedAddOns.includes(addon.name) ? business.primaryColor : undefined }}>
                                {selectedAddOns.includes(addon.name) && <Check size={18} />}
                             </div>
                             <div className="text-left">
                                <h4 className="font-bold text-lg text-text-primary group-hover:text-brand transition-colors" style={{ color: selectedAddOns.includes(addon.name) ? business.primaryColor : undefined }}>{addon.name}</h4>
                                <p className="text-sm font-medium text-text-tertiary">{addon.description}</p>
                             </div>
                          </div>
                          <span className="text-xl font-bold text-text-primary">+${addon.price}</span>
                       </button>
                     ))
                   ) : (
                     <div className="p-16 text-center space-y-4 bg-bg-secondary/30 rounded-[40px]">
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto text-text-tertiary">
                           <Info size={32} />
                        </div>
                        <p className="text-text-secondary font-medium">No specialized extras available for this service.</p>
                     </div>
                   )}
                </div>
                <Button className="w-full h-20 rounded-[32px] font-bold text-xl shadow-2xl" style={{ backgroundColor: business.primaryColor }} onClick={nextStep}>
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
               className="space-y-10"
             >
                {renderTotalPrice()}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
                   {availableDates.map(date => {
                      const d = new Date(date);
                      const isSelected = selectedDate === date;
                      return (
                        <button 
                          key={date}
                          onClick={() => { setSelectedDate(date); nextStep(); }}
                          className={`h-36 shrink-0 rounded-[32px] border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group hover:scale-[1.05] ${isSelected ? 'text-white shadow-2xl scale-[1.05]' : 'border-border-default bg-white hover:border-border-light'}`}
                          style={{ backgroundColor: isSelected ? business.primaryColor : undefined, borderColor: isSelected ? business.primaryColor : undefined }}
                        >
                           <span className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-white/80' : 'text-text-tertiary'}`}>{d.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                           <span className="text-3xl font-bold tracking-tight">{d.getDate()}</span>
                           <span className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-white/80' : 'text-text-tertiary'}`}>{d.toLocaleDateString(undefined, { month: 'short' })}</span>
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
               className="space-y-10"
             >
                {renderTotalPrice()}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                   {timeSlots.map(time => {
                      const isSelected = selectedTime === time;
                      return (
                        <button 
                          key={time}
                          onClick={() => { setSelectedTime(time); nextStep(); }}
                          className={`py-8 rounded-[28px] border-2 font-bold text-lg transition-all cursor-pointer group hover:scale-[1.03] ${isSelected ? 'text-white shadow-xl scale-[1.03]' : 'border-border-default bg-white hover:border-border-light'}`}
                          style={{ backgroundColor: isSelected ? business.primaryColor : undefined, borderColor: isSelected ? business.primaryColor : undefined }}
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
               className="space-y-10"
             >
                {renderTotalPrice()}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em] ml-2">Full Name</label>
                      <div className="relative group">
                         <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand transition-colors" style={{ color: contactInfo.name ? business.primaryColor : undefined }} />
                         <input 
                           type="text"
                           placeholder="John Doe"
                           className="w-full h-16 pl-16 pr-8 rounded-[24px] border-2 border-border-light bg-bg-secondary/30 outline-none focus:bg-white transition-all text-sm font-bold"
                           value={contactInfo.name}
                           onChange={e => setContactInfo({...contactInfo, name: e.target.value})}
                         />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em] ml-2">Email Address</label>
                      <div className="relative group">
                         <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand transition-colors" style={{ color: contactInfo.email ? business.primaryColor : undefined }} />
                         <input 
                           type="email"
                           placeholder="john@example.com"
                           className="w-full h-16 pl-16 pr-8 rounded-[24px] border-2 border-border-light bg-bg-secondary/30 outline-none focus:bg-white transition-all text-sm font-bold"
                           value={contactInfo.email}
                           onChange={e => setContactInfo({...contactInfo, email: e.target.value})}
                         />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em] ml-2">Phone Number</label>
                      <div className="relative group">
                         <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand transition-colors" style={{ color: contactInfo.phone ? business.primaryColor : undefined }} />
                         <input 
                           type="tel"
                           placeholder="+1 (555) 000-0000"
                           className="w-full h-16 pl-16 pr-8 rounded-[24px] border-2 border-border-light bg-bg-secondary/30 outline-none focus:bg-white transition-all text-sm font-bold"
                           value={contactInfo.phone}
                           onChange={e => setContactInfo({...contactInfo, phone: e.target.value})}
                         />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em] ml-2">Appt. Notes (Optional)</label>
                      <input 
                        type="text"
                        placeholder="Any special requests?"
                        className="w-full h-16 px-8 rounded-[24px] border-2 border-border-light bg-bg-secondary/30 outline-none focus:bg-white transition-all text-sm font-bold"
                        value={contactInfo.notes}
                        onChange={e => setContactInfo({...contactInfo, notes: e.target.value})}
                      />
                   </div>
                </div>
                <Button 
                   disabled={!contactInfo.name || !contactInfo.email || !contactInfo.phone}
                   className="w-full h-20 rounded-[32px] font-bold text-xl shadow-2xl" 
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
               className="space-y-10"
             >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <div className="p-10 rounded-[48px] bg-white border-2 border-border-light space-y-8 shadow-sm">
                      <div className="flex items-center gap-5">
                         <div className="w-16 h-16 rounded-[24px] flex items-center justify-center text-white" style={{ backgroundColor: business.primaryColor }}>
                            <CalendarIcon size={32} />
                         </div>
                         <div>
                            <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Appointment Time</p>
                            <h4 className="text-xl font-bold text-text-primary">
                               {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                            </h4>
                            <p className="text-sm font-bold opacity-60">at {selectedTime}</p>
                         </div>
                      </div>
                      <div className="space-y-4 pt-4">
                         <div className="flex justify-between items-center text-sm font-bold text-text-secondary">
                            <span>{selectedService.name}</span>
                            <span>${selectedService.price}</span>
                         </div>
                         {selectedAddOns.map(name => {
                           const addon = selectedService.addOns.find((a: any) => a.name === name);
                           return (
                             <div key={name} className="flex justify-between items-center text-sm font-bold text-text-secondary">
                                <span>+ {name}</span>
                                <span>${addon.price}</span>
                             </div>
                           );
                         })}
                         <div className="pt-6 border-t-2 border-dashed border-border-light flex justify-between items-center">
                            <span className="text-xl font-bold text-text-primary">Total Amount</span>
                            <span className="text-3xl font-bold" style={{ color: business.primaryColor }}>${subtotal}</span>
                         </div>
                      </div>
                   </div>

                   <div className="p-10 rounded-[48px] bg-bg-secondary/30 space-y-8">
                      <div className="flex items-center gap-5">
                         <div className="w-16 h-16 rounded-[24px] bg-white flex items-center justify-center text-text-tertiary">
                            <User size={32} />
                         </div>
                         <div>
                            <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Customer Details</p>
                            <h4 className="text-xl font-bold text-text-primary">{contactInfo.name}</h4>
                            <p className="text-sm font-bold opacity-60 truncate max-w-[200px]">{contactInfo.email}</p>
                         </div>
                      </div>
                      <div className="space-y-4 pt-4">
                         <div className="bg-white p-6 rounded-[24px] shadow-sm border border-border-light">
                            <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-2">Instructions / Notes</p>
                            <p className="text-sm font-bold text-text-primary leading-relaxed">
                               {contactInfo.notes || "No special instructions provided."}
                            </p>
                         </div>
                      </div>
                   </div>
                </div>

                <Button className="w-full h-24 rounded-[40px] font-bold text-2xl shadow-3xl group flex items-center justify-center gap-4 transition-all hover:scale-[1.02]" style={{ backgroundColor: business.primaryColor }} onClick={nextStep}>
                   Confirm & Proceed to Payment <ChevronRight size={28} className="group-hover:translate-x-2 transition-transform" />
                </Button>
             </motion.div>
           )}

           {step === 7 && (
             <motion.div 
               key="step7"
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="py-16 text-center space-y-12"
             >
                <div className="w-32 h-32 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto shadow-2xl">
                   <Check size={64} className="stroke-[3px]" />
                </div>
                <div className="space-y-4">
                   <h2 className="text-5xl font-bold tracking-tight text-text-primary">You're all set!</h2>
                   <p className="text-xl text-text-secondary font-medium max-w-lg mx-auto leading-relaxed">
                      Your appointment with <span className="font-bold text-text-primary">{business.name}</span> has been successfully scheduled. We've sent a confirmation to <span className="font-bold text-text-primary">{contactInfo.email}</span>.
                   </p>
                </div>
                
                <div className="p-12 rounded-[56px] border-2 border-border-light bg-white prose max-w-2xl mx-auto shadow-sm">
                   <div className="flex flex-col sm:flex-row items-center gap-10 text-left">
                      <div className="w-24 h-24 rounded-[32px] bg-bg-secondary flex items-center justify-center text-text-tertiary">
                         <CalendarIcon size={40} />
                      </div>
                      <div className="space-y-2">
                         <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Receipt of Booking</p>
                         <h4 className="text-2xl font-bold text-text-primary">{selectedService?.name}</h4>
                         <p className="text-lg font-bold opacity-60">
                            {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
                         </p>
                         <p className="text-sm font-bold text-success flex items-center gap-2 pt-2">
                            <ShieldCheck size={16} /> Paid in Full • Total: ${subtotal}
                         </p>
                      </div>
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-5 justify-center">
                   <Button className="px-12 h-16 rounded-[24px] font-bold" style={{ backgroundColor: business.primaryColor }} onClick={() => window.print()}>
                      Download Receipt
                   </Button>
                   <Button variant="secondary" className="px-12 h-16 rounded-[24px] font-bold" onClick={() => window.location.href = '/'}>
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
