import React from 'react';
import { User } from 'lucide-react';
import type { SectionProps } from '../templates/types';

interface TeamProps extends SectionProps {
  variant?: 'cardGrid';
}

export const TeamSection: React.FC<TeamProps> = ({ business }) => {
  const staff = business.staff && business.staff.length > 0 ? business.staff : [
    { id: '1', name: 'Dr. Sarah Chen', role: 'Lead Practitioner', avatarUrl: '' },
    { id: '2', name: 'Michael Torres', role: 'Senior Specialist', avatarUrl: '' },
    { id: '3', name: 'Aisha Johnson', role: 'Therapist', avatarUrl: '' },
    { id: '4', name: 'James Kim', role: 'Consultant', avatarUrl: '' },
  ];

  return (
    <section id="team" style={{ padding: `var(--t-section-gap, 80px) 0` }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--t-accent)' }}>Our Team</p>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--t-heading-font)', fontWeight: 'var(--t-heading-weight)', color: 'var(--t-text-primary)' }}>Meet the Experts</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {staff.map(member => (
            <div key={member.id} className="group text-center space-y-4 p-6 border transition-all hover:scale-[1.02]" style={{ borderColor: 'var(--t-border)', borderRadius: 'var(--t-radius)', backgroundColor: 'var(--t-card-bg)' }}>
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: 'var(--t-bg-secondary)' }}>
                {member.avatarUrl ? (
                  <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={28} style={{ color: 'var(--t-text-muted)' }} />
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold" style={{ color: 'var(--t-text-primary)' }}>{member.name}</h3>
                <p className="text-xs mt-1" style={{ color: 'var(--t-text-secondary)' }}>{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
