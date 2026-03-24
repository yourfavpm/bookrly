import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Clock } from 'lucide-react';
import { Card } from '../ui/Card';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'booking' | 'payment' | 'system';
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'New Booking Request',
    description: 'Sarah Miller requested a Haircut & Styling for tomorrow at 10:00 AM.',
    time: '2 mins ago',
    read: false,
    type: 'booking'
  },
  {
    id: '2',
    title: 'Payment Received',
    description: 'Received $85.00 from John Doe for Balayage Coloring.',
    time: '1 hour ago',
    read: false,
    type: 'payment'
  },
  {
    id: '3',
    title: 'System Update',
    description: 'The new Availability module is now live and simplified.',
    time: '3 hours ago',
    read: true,
    type: 'system'
  }
];

interface NotificationPopoverProps {
  onClose: () => void;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({ onClose }) => {
  return (
    <>
      {/* Backdrop for closing */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="absolute top-14 right-0 w-[360px] z-50 origin-top-right"
      >
        <Card className="p-0 overflow-hidden shadow-2xl border-white/20 bg-white/95 backdrop-blur-xl">
          <header className="p-4 border-b border-border-polaris/30 flex items-center justify-between bg-bg-canvas/30">
            <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
            <button className="text-[10px] font-bold text-brand uppercase tracking-widest hover:underline">
              Mark all as read
            </button>
          </header>

          <div className="max-h-[400px] overflow-y-auto">
            {MOCK_NOTIFICATIONS.length > 0 ? (
              <div className="divide-y divide-border-polaris/20">
                {MOCK_NOTIFICATIONS.map((n) => (
                  <div key={n.id} className={`p-4 hover:bg-bg-canvas/20 transition-colors relative group ${!n.read ? 'bg-brand/5' : ''}`}>
                    <div className="flex gap-3">
                      <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                        n.type === 'booking' ? 'bg-indigo-50 text-indigo-600' :
                        n.type === 'payment' ? 'bg-emerald-50 text-emerald-600' :
                        'bg-slate-50 text-slate-600'
                      }`}>
                        {n.type === 'booking' ? <Clock size={16} /> : 
                         n.type === 'payment' ? <Check size={16} /> : 
                         <Bell size={16} />}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-xs ${!n.read ? 'font-semibold text-text-primary' : 'font-medium text-text-secondary'}`}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-text-tertiary whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-2">
                          {n.description}
                        </p>
                      </div>
                    </div>
                    {!n.read && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-brand rounded-full opacity-0 group-hover:opacity-100' transition-opacity" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 bg-bg-canvas rounded-2xl flex items-center justify-center text-text-tertiary mx-auto">
                  <Bell size={24} />
                </div>
                <p className="text-xs font-medium text-text-secondary">No new notifications</p>
              </div>
            )}
          </div>

          <footer className="p-3 text-center border-t border-border-polaris/30">
            <button className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest hover:text-text-primary transition-colors">
              View All Activity
            </button>
          </footer>
        </Card>
      </motion.div>
    </>
  );
};
