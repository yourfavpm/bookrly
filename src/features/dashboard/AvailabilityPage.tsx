import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

const DAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export const AvailabilityPage: React.FC = () => {
  const { business, updateBusiness } = useAppStore();

  if (!business) return null;

  // Ensure workingHours exists and is sorted by day_of_week
  const sortedHours = [...(business.workingHours || [])].sort((a, b) => a.day_of_week - b.day_of_week);

  return (
    <div className="max-w-none space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
         <div className="space-y-1">
           <h1 className="text-2xl font-medium tracking-tight text-text-primary">Availability</h1>
           <p className="text-xs text-text-secondary font-normal">Define when your business is open for bookings.</p>
         </div>
          <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100">
             <AlertCircle size={14} className="text-emerald-600" />
             <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest">Auto-saving Schedule</p>
          </div>
      </header>

      <div className="space-y-4">
        {DAY_NAMES.map((dayName, dayIdx) => {
          const daySlots = sortedHours.filter(h => h.day_of_week === dayIdx);
          const isOpen = daySlots.some(s => s.is_open);

          const handleAddSlot = () => {
            const newSlot = {
              day_of_week: dayIdx,
              start_time: '09:00',
              end_time: '17:00',
              is_open: true
            };
            updateBusiness({ workingHours: [...business.workingHours, newSlot as any] });
          };

          const handleRemoveSlot = (indexInDay: number) => {
            const targetSlot = daySlots[indexInDay];
            const updatedHours = business.workingHours.filter(h => h !== targetSlot);
            updateBusiness({ workingHours: updatedHours });
          };

          const handleUpdateSlot = (indexInDay: number, field: 'start_time' | 'end_time', value: string) => {
            const targetSlot = daySlots[indexInDay];
            const updatedHours = business.workingHours.map(h =>
              h === targetSlot ? { ...h, [field]: value } : h
            );
            updateBusiness({ workingHours: updatedHours });
          };

          const handleToggleDay = () => {
            if (isOpen) {
              // Close all slots for this day
              const updatedHours = business.workingHours.map(h =>
                h.day_of_week === dayIdx ? { ...h, is_open: false } : h
              );
              updateBusiness({ workingHours: updatedHours });
            } else {
              // If no slots exist at all for this day, create one
              if (daySlots.length === 0) {
                handleAddSlot();
              } else {
                // Open all existing slots
                const updatedHours = business.workingHours.map(h =>
                  h.day_of_week === dayIdx ? { ...h, is_open: true } : h
                );
                updateBusiness({ workingHours: updatedHours });
              }
            }
          };

          return (
            <motion.div
              key={dayIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIdx * 0.05 }}
            >
              <Card className={`transition-all duration-300 ${isOpen ? 'border-border-polaris bg-white' : 'bg-bg-canvas/50 opacity-70 grayscale'}`}>
                 <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <button
                             onClick={handleToggleDay}
                             className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${isOpen ? 'bg-emerald-600 text-white shadow-none' : 'bg-white border border-border-polaris text-text-tertiary shadow-none'}`}
                           >
                             {isOpen ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                           </button>
                          <div>
                            <h3 className="font-medium text-sm capitalize text-text-primary">{dayName}</h3>
                            <p className={`text-[9px] font-normal uppercase tracking-widest ${isOpen ? 'text-brand' : 'text-text-tertiary'}`}>
                              {isOpen ? 'Accepting Bookings' : 'Closed'}
                            </p>
                          </div>
                       </div>

                       {isOpen && (
                         <button 
                           onClick={handleAddSlot}
                           className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand/20 text-brand text-[9px] font-bold uppercase tracking-widest hover:bg-brand/5 transition-all"
                         >
                           <Plus size={12} />
                           Add Slot
                         </button>
                       )}
                    </div>

                    <div className="space-y-3">
                       {daySlots.filter(s => s.is_open).map((slot, sIdx) => (
                         <div key={`${dayIdx}-${sIdx}`} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                            <div className="relative flex-1 group">
                               <Clock size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand transition-colors" />
                               <input 
                                 type="time"
                                 value={slot.start_time}
                                 onChange={(e) => handleUpdateSlot(sIdx, 'start_time', e.target.value)}
                                 className="w-full h-10 pl-8 pr-4 rounded-lg border border-border-polaris bg-white text-xs font-normal focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand transition-all"
                               />
                            </div>
                            <div className="h-[1px] w-3 bg-border-default shrink-0" />
                            <div className="relative flex-1 group">
                               <Clock size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand transition-colors" />
                               <input 
                                 type="time"
                                 value={slot.end_time}
                                 onChange={(e) => handleUpdateSlot(sIdx, 'end_time', e.target.value)}
                                 className="w-full h-10 pl-8 pr-4 rounded-lg border border-border-polaris bg-white text-xs font-normal focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand transition-all"
                               />
                            </div>
                            
                            {daySlots.filter(s => s.is_open).length > 1 && (
                              <button 
                                onClick={() => handleRemoveSlot(sIdx)}
                                className="p-2 text-text-tertiary hover:text-error transition-colors"
                              >
                                <XCircle size={16} />
                              </button>
                            )}
                         </div>
                       ))}
                    </div>
                 </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="border-dashed flex flex-col items-center justify-center text-center bg-bg-canvas/30">
         <div className="p-3 bg-white rounded-2xl shadow-sm mb-4 border border-border-light text-text-tertiary">
            <Calendar size={24} />
         </div>
         <p className="text-xs font-medium text-text-primary tracking-tight">Need specific dates blocked off?</p>
         <p className="text-[10px] text-text-tertiary mt-1 max-w-[240px] font-normal">Our smart calendar integration and one-off holiday settings are coming soon.</p>
         <Button variant="secondary" className="mt-6 rounded-xl text-[10px] font-medium uppercase tracking-widest opacity-50 cursor-not-allowed">
            View Vacation Mode
         </Button>
      </Card>
    </div>
  );
};
