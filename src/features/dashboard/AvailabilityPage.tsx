import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import type { WorkingHour } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Plus,
  Save,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export const AvailabilityPage: React.FC = () => {
  const { business, updateWorkingHours } = useAppStore();
  const [localHours, setLocalHours] = useState<WorkingHour[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  if (business?.workingHours && !isInitialized) {
    setLocalHours([...business.workingHours]);
    setIsInitialized(true);
  }

  if (!business) return null;

  const handleToggleDay = (dayIdx: number) => {
    const daySlots = localHours.filter(h => h.day_of_week === dayIdx);
    const isOpen = daySlots.some(s => s.is_open);

    let updated: WorkingHour[];
    if (isOpen) {
      updated = localHours.map(h => 
        h.day_of_week === dayIdx ? { ...h, is_open: false } : h
      );
    } else {
      if (daySlots.length === 0) {
        updated = [...localHours, { 
          day_of_week: dayIdx, 
          start_time: '09:00', 
          end_time: '17:00', 
          is_open: true,
          dayOfWeek: dayIdx,
          startTime: '09:00',
          endTime: '17:00',
          isOpen: true
        } as WorkingHour];
      } else {
        updated = localHours.map(h => 
          h.day_of_week === dayIdx ? { ...h, is_open: true } : h
        );
      }
    }
    setLocalHours(updated);
    setHasChanges(true);
  };

  const handleAddSlot = (dayIdx: number) => {
    const newSlot: WorkingHour = {
      day_of_week: dayIdx,
      start_time: '09:00',
      end_time: '17:00',
      is_open: true,
      dayOfWeek: dayIdx,
      startTime: '09:00',
      endTime: '17:00',
      isOpen: true
    } as WorkingHour;
    setLocalHours([...localHours, newSlot]);
    setHasChanges(true);
  };

  const handleRemoveSlot = (originalSlot: WorkingHour) => {
    setLocalHours(localHours.filter(h => h !== originalSlot));
    setHasChanges(true);
  };

  const handleUpdateSlot = (originalSlot: WorkingHour, field: string, value: string) => {
    setLocalHours(localHours.map(h => 
      h === originalSlot ? { ...h, [field]: value, [field.replace('_', 'S')]: value } : h
    ));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateWorkingHours(localHours);
    setSaving(false);
    setHasChanges(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Weekly Schedule</h1>
          <p className="text-sm text-text-secondary">Set your standard operating hours for each day of the week.</p>
        </div>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {hasChanges && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Button 
                  onClick={handleSave} 
                  isLoading={saving}
                  className="bg-brand hover:bg-brand/90 text-white rounded-xl px-6"
                >
                  <Save size={18} className="mr-2" />
                  Save Changes
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <div className="grid gap-4">
        {DAY_NAMES.map((dayName, dayIdx) => {
          const daySlots = localHours.filter(h => h.day_of_week === dayIdx);
          const isOpen = daySlots.some(s => s.is_open);

          return (
            <Card key={dayIdx} className={`p-0 overflow-hidden transition-all duration-300 ${isOpen ? 'border-brand/20' : 'bg-bg-canvas/50 grayscale opacity-80'}`}>
              <div className="flex flex-col md:flex-row">
                <div className={`p-6 md:w-48 flex items-center gap-4 border-b md:border-b-0 md:border-r border-border-polaris ${isOpen ? 'bg-brand/5' : 'bg-bg-canvas/50'}`}>
                  <button
                    onClick={() => handleToggleDay(dayIdx)}
                    className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isOpen ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'bg-white border border-border-polaris text-text-tertiary'}`}
                  >
                    {isOpen ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                  </button>
                  <div>
                    <h3 className="font-semibold text-sm text-text-primary">{dayName}</h3>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${isOpen ? 'text-brand' : 'text-text-tertiary'}`}>
                      {isOpen ? 'Open' : 'Closed'}
                    </p>
                  </div>
                </div>

                <div className="flex-1 p-6 space-y-4">
                  {!isOpen ? (
                    <p className="text-sm text-text-tertiary italic py-2">Unavailable for bookings</p>
                  ) : (
                    <div className="space-y-4">
                      {daySlots.filter(s => s.is_open).map((slot, sIdx) => (
                        <div key={`${dayIdx}-${sIdx}`} className="flex items-center gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
                          <div className="flex-1 grid grid-cols-2 gap-3">
                            <div className="relative group">
                              <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest absolute -top-2 left-3 bg-white px-1 z-10">Start</label>
                              <div className="relative">
                                <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand" />
                                <input 
                                  type="time"
                                  value={slot.start_time}
                                  onChange={(e) => handleUpdateSlot(slot, 'start_time', e.target.value)}
                                  className="w-full h-11 pl-9 pr-4 rounded-xl border border-border-polaris bg-white text-sm focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand transition-all"
                                />
                              </div>
                            </div>
                            <div className="relative group">
                              <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest absolute -top-2 left-3 bg-white px-1 z-10">End</label>
                              <div className="relative">
                                <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand" />
                                <input 
                                  type="time"
                                  value={slot.end_time}
                                  onChange={(e) => handleUpdateSlot(slot, 'end_time', e.target.value)}
                                  className="w-full h-11 pl-9 pr-4 rounded-xl border border-border-polaris bg-white text-sm focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand transition-all"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {daySlots.filter(s => s.is_open).length > 1 && (
                              <button 
                                onClick={() => handleRemoveSlot(slot)}
                                className="p-2.5 text-text-tertiary hover:text-error hover:bg-error/5 rounded-xl transition-all"
                                title="Remove slot"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                            {sIdx === daySlots.filter(s => s.is_open).length - 1 && (
                              <button 
                                onClick={() => handleAddSlot(dayIdx)}
                                className="p-2.5 text-brand hover:bg-brand/5 rounded-xl transition-all"
                                title="Add another slot"
                              >
                                <Plus size={20} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="border-dashed flex flex-col items-center justify-center text-center bg-bg-canvas/30 py-12">
        <div className="p-4 bg-white rounded-2xl shadow-sm border border-border-light text-text-tertiary mb-4">
          <Calendar size={32} />
        </div>
        <h4 className="text-base font-semibold text-text-primary tracking-tight">Advanced Scheduling Coming Soon</h4>
        <p className="text-sm text-text-tertiary mt-2 max-w-sm">
          Soon you'll be able to sync with Google Calendar, block off specific dates for holidays, and set custom durations for different services.
        </p>
      </Card>
    </div>
  );
};

