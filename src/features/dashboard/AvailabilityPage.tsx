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

const DAYS = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];

export const AvailabilityPage: React.FC = () => {
  const { business, updateBusiness } = useAppStore();

  const handleToggleDay = (day: string) => {
    const updatedHours = { ...business.workingHours };
    updatedHours[day].active = !updatedHours[day].active;
    updateBusiness({ workingHours: updatedHours });
  };

  const handleUpdateHours = (day: string, field: 'start' | 'end', value: string) => {
    const updatedHours = { ...business.workingHours };
    updatedHours[day][field] = value;
    updateBusiness({ workingHours: updatedHours });
  };

  const copyToAll = (sourceDay: string) => {
    const source = business.workingHours[sourceDay];
    const updatedHours = { ...business.workingHours };
    DAYS.forEach(day => {
      if (day !== sourceDay) {
        updatedHours[day] = { ...source };
      }
    });
    updateBusiness({ workingHours: updatedHours });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex items-center justify-between">
         <div className="space-y-1">
           <h1 className="text-2xl font-bold tracking-tight text-text-primary">Availability</h1>
           <p className="text-xs text-text-secondary">Define when your business is open for bookings.</p>
         </div>
         <div className="flex items-center gap-2 bg-brand/5 px-4 py-2 rounded-2xl border border-brand/10">
            <AlertCircle size={14} className="text-brand" />
            <p className="text-[10px] font-bold text-brand uppercase tracking-widest">Auto-saving Schedule</p>
         </div>
      </header>

      <div className="space-y-4">
        {DAYS.map((day, index) => {
          const config = business.workingHours[day];
          return (
            <motion.div 
              key={day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`p-6 transition-all duration-300 ${config.active ? 'border-brand/10' : 'bg-bg-secondary opacity-70 grayscale'}`}>
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6 min-w-[140px]">
                       <button 
                         onClick={() => handleToggleDay(day)}
                         className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${config.active ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'bg-white border-2 border-border-default text-text-tertiary shadow-sm'}`}
                       >
                         {config.active ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                       </button>
                       <div>
                         <h3 className="font-bold text-sm capitalize text-text-primary">{day}</h3>
                         <p className={`text-[10px] font-bold uppercase tracking-widest ${config.active ? 'text-brand' : 'text-text-tertiary'}`}>
                           {config.active ? 'Open' : 'Closed'}
                         </p>
                       </div>
                    </div>

                    <div className={`flex items-center gap-4 transition-all duration-300 ${config.active ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none translate-x-4'}`}>
                       <div className="flex items-center gap-3">
                         <div className="relative group">
                            <Clock size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand transition-colors" />
                            <input 
                              type="time"
                              value={config.start}
                              onChange={(e) => handleUpdateHours(day, 'start', e.target.value)}
                              className="h-11 pl-8 pr-4 rounded-xl border border-border-default bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand/10 focus:border-brand transition-all"
                            />
                         </div>
                         <div className="h-[2px] w-3 bg-border-default rounded-full" />
                         <div className="relative group">
                            <Clock size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand transition-colors" />
                            <input 
                              type="time"
                              value={config.end}
                              onChange={(e) => handleUpdateHours(day, 'end', e.target.value)}
                              className="h-11 pl-8 pr-4 rounded-xl border border-border-default bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand/10 focus:border-brand transition-all"
                            />
                         </div>
                       </div>
                       
                       <div className="h-8 w-px bg-border-light mx-2" />
                       
                       <button 
                         onClick={() => copyToAll(day)}
                         className="p-2.5 rounded-xl hover:bg-brand/5 text-text-tertiary hover:text-brand transition-all flex items-center gap-2 group"
                         title="Apply to all days"
                       >
                         <Copy size={16} />
                         <span className="text-[10px] font-bold uppercase tracking-widest hidden lg:inline">Apply to all</span>
                       </button>
                    </div>

                    {!config.active && (
                       <div className="flex-1 flex justify-end items-center italic text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
                          Not accepting bookings
                       </div>
                    )}
                 </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="border-dashed py-10 flex flex-col items-center justify-center text-center bg-bg-secondary/30">
         <div className="p-3 bg-white rounded-2xl shadow-sm mb-4 border border-border-light text-text-tertiary">
            <Calendar size={24} />
         </div>
         <p className="text-xs font-bold text-text-primary tracking-tight">Need specific dates blocked off?</p>
         <p className="text-[10px] text-text-tertiary mt-1 max-w-[240px]">Our smart calendar integration and one-off holiday settings are coming soon.</p>
         <Button variant="secondary" className="mt-6 rounded-xl text-[10px] font-bold uppercase tracking-widest opacity-50 cursor-not-allowed">
            View Vacation Mode
         </Button>
      </Card>
    </div>
  );
};
