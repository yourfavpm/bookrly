import React from 'react';
import { Clock } from 'lucide-react';
import type { SectionProps } from '../templates/types';

interface ScheduleProps extends SectionProps {
  variant?: 'cardGrid' | 'minimalList';
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const ScheduleSection: React.FC<ScheduleProps> = ({ business, variant = 'cardGrid' }) => {
  const hours = business.workingHours || [
    { dayOfWeek: 1, isOpen: true, startTime: '09:00', endTime: '17:00' },
    { dayOfWeek: 2, isOpen: true, startTime: '09:00', endTime: '17:00' },
    { dayOfWeek: 3, isOpen: true, startTime: '09:00', endTime: '17:00' },
    { dayOfWeek: 4, isOpen: true, startTime: '09:00', endTime: '17:00' },
    { dayOfWeek: 5, isOpen: true, startTime: '09:00', endTime: '17:00' },
    { dayOfWeek: 6, isOpen: false, startTime: '09:00', endTime: '17:00' },
    { dayOfWeek: 0, isOpen: false, startTime: '09:00', endTime: '17:00' },
  ];

  if (variant === 'minimalList') {
    return (
      <section id="schedule" style={{ padding: `var(--t-section-gap, 80px) 0` }}>
        <div className="max-w-2xl mx-auto px-6">
          <div className="mb-12 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--t-accent)' }}>Schedule</p>
            <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--t-heading-font)', fontWeight: 'var(--t-heading-weight)', color: 'var(--t-text-primary)' }}>Our Hours</h2>
          </div>
          <div className="space-y-0">
            {hours.map((h, i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b" style={{ borderColor: 'var(--t-border)' }}>
                <span className="text-sm font-semibold" style={{ color: 'var(--t-text-primary)' }}>{DAYS[h.dayOfWeek]}</span>
                <span className="text-sm" style={{ color: h.isOpen ? 'var(--t-text-secondary)' : 'var(--t-text-muted)' }}>
                  {h.isOpen ? `${h.startTime} — ${h.endTime}` : 'Closed'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="schedule" style={{ padding: `var(--t-section-gap, 80px) 0`, backgroundColor: 'var(--t-bg-secondary)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--t-accent)' }}>Schedule</p>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--t-heading-font)', fontWeight: 'var(--t-heading-weight)', color: 'var(--t-text-primary)' }}>Weekly Schedule</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {hours.map((h, i) => (
            <div key={i} className="p-5 border text-center transition-all" style={{ borderColor: 'var(--t-border)', borderRadius: 'var(--t-radius)', backgroundColor: h.isOpen ? 'var(--t-card-bg)' : 'transparent', opacity: h.isOpen ? 1 : 0.5 }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--t-accent)' }}>{SHORT_DAYS[h.dayOfWeek]}</p>
              {h.isOpen ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <Clock size={10} style={{ color: 'var(--t-text-muted)' }} />
                    <span className="text-xs" style={{ color: 'var(--t-text-secondary)' }}>{h.startTime}</span>
                  </div>
                  <span className="text-[10px]" style={{ color: 'var(--t-text-muted)' }}>to</span>
                  <p className="text-xs" style={{ color: 'var(--t-text-secondary)' }}>{h.endTime}</p>
                </div>
              ) : (
                <p className="text-xs italic" style={{ color: 'var(--t-text-muted)' }}>Closed</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
