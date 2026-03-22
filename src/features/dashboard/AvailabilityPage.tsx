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
  Copy
} from 'lucide-react';
import { motion } from 'framer-motion';

const DAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export const AvailabilityPage: React.FC = () => {
  const { business, updateBusiness } = useAppStore();

  if (!business) return null;

  // Ensure workingHours exists and is sorted by dayOfWeek
  const sortedHours = [...(business.workingHours || [])].sort((a, b) => a.dayOfWeek - b.dayOfWeek);

  const handleToggleDay = (dayOfWeek: number) => {
    const updated = sortedHours.map(h => 
      h.dayOfWeek === dayOfWeek ? { ...h, isOpen: !h.isOpen } : h
    );
    updateBusiness({ workingHours: updated });
  };

  const handleUpdateHours = (dayOfWeek: number, field: 'startTime' | 'endTime', value: string) => {
    const updated = sortedHours.map(h => 
      h.dayOfWeek === dayOfWeek ? { ...h, [field]: value } : h
    );
    updateBusiness({ workingHours: updated });
  };

  const copyToAll = (sourceDayIndex: number) => {
    const source = sortedHours.find(h => h.dayOfWeek === sourceDayIndex);
    if (!source) return;

    const updated = sortedHours.map(h => ({
      ...h,
      startTime: source.startTime,
      endTime: source.endTime,
      isOpen: source.isOpen
    }));
    updateBusiness({ workingHours: updated });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex items-center justify-between">
         <div className="space-y-1">
           <h1 className="text-2xl font-medium tracking-tight text-text-primary">Availability</h1>
           <p className="text-xs text-text-secondary font-normal">Define when your business is open for bookings.</p>
         </div>
         <div className="flex items-center gap-2 bg-brand/5 px-4 py-2 rounded-2xl border border-brand/10">
            <AlertCircle size={14} className="text-brand" />
            <p className="text-[10px] font-normal text-brand uppercase tracking-widest">Auto-saving Schedule</p>
         </div>
      </header>

      <div className="space-y-4">
        {DAY_NAMES.map((dayName, dayIdx) => {
          const daySlots = sortedHours.filter(h => h.dayOfWeek === dayIdx);
          const isOpen = daySlots.some(s => s.isOpen);

          const handleAddSlot = () => {
            const newSlot = { 
              dayOfWeek: dayIdx, 
              startTime: '09:00', 
              endTime: '17:00', 
              isOpen: true 
            };
            updateBusiness({ workingHours: [...business.workingHours, newSlot] });
          };

          const handleRemoveSlot = (indexInDay: number) => {
            const targetSlot = daySlots[indexInDay];
            const updatedHours = business.workingHours.filter(h => h !== targetSlot);
            updateBusiness({ workingHours: updatedHours });
          };

          const handleUpdateSlot = (indexInDay: number, field: 'startTime' | 'endTime', value: string) => {
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
                h.dayOfWeek === dayIdx ? { ...h, isOpen: false } : h
              );
              updateBusiness({ workingHours: updatedHours });
            } else {
              // If no slots exist at all for this day, create one
              if (daySlots.length === 0) {
                handleAddSlot();
              } else {
                // Open all existing slots
                const updatedHours = business.workingHours.map(h => 
                  h.dayOfWeek === dayIdx ? { ...h, isOpen: true } : h
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
              <Card className={`p-6 transition-all duration-300 rounded-[28px] ${isOpen ? 'border-brand/10 bg-white' : 'bg-bg-secondary/50 opacity-70 grayscale'}`}>
                 <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <button 
                            onClick={handleToggleDay}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isOpen ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'bg-white border border-border-default text-text-tertiary shadow-sm'}`}
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
                       {daySlots.filter(s => s.isOpen).map((slot, sIdx) => (
                         <div key={`${dayIdx}-${sIdx}`} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                            <div className="relative flex-1 group">
                               <Clock size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand transition-colors" />
                               <input 
                                 type="time"
                                 value={slot.startTime}
                                 onChange={(e) => handleUpdateSlot(sIdx, 'startTime', e.target.value)}
                                 className="w-full h-10 pl-8 pr-4 rounded-xl border border-border-default bg-white text-xs font-normal focus:outline-none focus:ring-2 focus:ring-brand/10 focus:border-brand transition-all"
                               />
                            </div>
                            <div className="h-[1px] w-3 bg-border-default shrink-0" />
                            <div className="relative flex-1 group">
                               <Clock size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand transition-colors" />
                               <input 
                                 type="time"
                                 value={slot.endTime}
                                 onChange={(e) => handleUpdateSlot(sIdx, 'endTime', e.target.value)}
                                 className="w-full h-10 pl-8 pr-4 rounded-xl border border-border-default bg-white text-xs font-normal focus:outline-none focus:ring-2 focus:ring-brand/10 focus:border-brand transition-all"
                               />
                            </div>
                            
                            {daySlots.filter(s => s.isOpen).length > 1 && (
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

      <Card className="border-dashed py-10 flex flex-col items-center justify-center text-center bg-bg-secondary/30 rounded-[32px]">
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
