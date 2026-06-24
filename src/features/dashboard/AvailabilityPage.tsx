import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import type { WorkingHour } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Plus,
  Save,
  Trash2,
  CalendarOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export const AvailabilityPage: React.FC = () => {
  const { business, staffId, updateWorkingHours, updateStaffAvailability, addBlockedTime, deleteBlockedTime } = useAppStore();
  const [localHours, setLocalHours] = useState<WorkingHour[] | StaffAvailability[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  const [blockedDate, setBlockedDate] = useState('');
  const [blockedStartTime, setBlockedStartTime] = useState('09:00');
  const [blockedEndTime, setBlockedEndTime] = useState('17:00');
  const [blockedReason, setBlockedReason] = useState('');
  const [isAddingBlocked, setIsAddingBlocked] = useState(false);

  // Filter blocked times for the current view (business or specific staff)
  const relevantBlockedTimes = business?.blockedTimes?.filter(b => b.staffId === (staffId || null)) || [];

  if (business && !isInitialized) {
    if (staffId) {
      const currentStaff = business.staff.find(s => s.id === staffId);
      setLocalHours(currentStaff ? [...currentStaff.availability] : []);
    } else {
      setLocalHours(business.workingHours ? [...business.workingHours] : []);
    }
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
    if (staffId) {
      await updateStaffAvailability(staffId, localHours as StaffAvailability[]);
    } else {
      await updateWorkingHours(localHours as WorkingHour[]);
    }
    setSaving(false);
    setHasChanges(false);
  };

  const handleAddBlockedTime = async () => {
    if (!blockedDate || !blockedStartTime || !blockedEndTime) return alert('Date and times are required.');
    setIsAddingBlocked(true);
    await addBlockedTime({
      date: blockedDate,
      startTime: blockedStartTime,
      endTime: blockedEndTime,
      reason: blockedReason,
      staffId: staffId || undefined
    });
    setBlockedDate('');
    setBlockedStartTime('09:00');
    setBlockedEndTime('17:00');
    setBlockedReason('');
    setIsAddingBlocked(false);
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

      <div className="pt-8 mt-8 border-t border-border-polaris space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-text-primary">Blocked Time Off</h2>
          <p className="text-sm text-text-secondary">Block off specific dates and times when you are unavailable.</p>
        </div>

        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-1.5 w-full">
              <label className="text-xs font-normal text-text-secondary">Date</label>
              <input 
                type="date" 
                value={blockedDate}
                onChange={(e) => setBlockedDate(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border-polaris bg-white text-sm focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand transition-all"
              />
            </div>
            <div className="w-full md:w-32 space-y-1.5">
              <label className="text-xs font-normal text-text-secondary">Start Time</label>
              <input 
                type="time" 
                value={blockedStartTime}
                onChange={(e) => setBlockedStartTime(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border-polaris bg-white text-sm focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand transition-all"
              />
            </div>
            <div className="w-full md:w-32 space-y-1.5">
              <label className="text-xs font-normal text-text-secondary">End Time</label>
              <input 
                type="time" 
                value={blockedEndTime}
                onChange={(e) => setBlockedEndTime(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border-polaris bg-white text-sm focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand transition-all"
              />
            </div>
            <div className="flex-1 space-y-1.5 w-full">
              <label className="text-xs font-normal text-text-secondary">Reason (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. Doctor appointment"
                value={blockedReason}
                onChange={(e) => setBlockedReason(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border-polaris bg-white text-sm focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand transition-all"
              />
            </div>
            <Button 
              onClick={handleAddBlockedTime} 
              isLoading={isAddingBlocked}
              className="bg-text-primary hover:bg-text-primary/90 text-white rounded-xl h-11 px-6 w-full md:w-auto"
            >
              Block Time
            </Button>
          </div>

          {relevantBlockedTimes && relevantBlockedTimes.length > 0 && (
            <div className="mt-6 border-t border-black/5 pt-6 animate-in fade-in">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Upcoming Blocked Times</h3>
              <div className="space-y-3">
                {relevantBlockedTimes
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((block) => (
                  <div key={block.id} className="flex items-center justify-between p-4 bg-bg-canvas/50 rounded-xl border border-border-polaris bg-bg-canvas/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-error/10 text-error flex items-center justify-center">
                        <CalendarOff size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {new Date(block.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="text-xs text-text-secondary mt-0.5">
                          {block.startTime} - {block.endTime} {block.reason ? `• ${block.reason}` : ''}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteBlockedTime(block.id)}
                      className="p-2 text-text-tertiary hover:text-error hover:bg-error/5 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

