import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Bell, 
  MessageSquare, 
  Mail, 
  Smartphone, 
  CheckCircle2, 
  Clock, 
  ArrowLeft,
  Type,
  Eye,
  RotateCcw,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { getBaseDomain } from '../../lib/domainUtils';

const TOKENS = [
  { label: 'Client Name', value: '{client_name}' },
  { label: 'Service', value: '{service}' },
  { label: 'Date', value: '{date}' },
  { label: 'Time', value: '{time}' },
  { label: 'Provider', value: '{provider_name}' },
  { label: 'Business', value: '{business_name}' },
  { label: 'Cancel Link', value: '{cancel_link}' },
  { label: 'Review Link', value: '{review_link}' }
];

export const NotificationSettings: React.FC = () => {
  const { business, updateNotificationSettings } = useAppStore();
  const settings = business?.notificationSettings;
  const smsUsage = business?.smsUsage;
  const isStarter = (business?.planType as string) === 'starter';

  const [activeTab, setActiveTab] = useState<'overview' | 'editor'>('overview');
  const [editingType, setEditingType] = useState<'confirmation' | 'reminder' | 'followup'>('confirmation');
  const [editingChannel, setEditingChannel] = useState<'sms' | 'email'>('sms');
  
  const [localTemplates, setLocalTemplates] = useState({
    smsConfirm: settings?.smsConfirmTemplate || "Hi {client_name}, your {service} with {provider_name} is confirmed for {date} at {time}. Need to cancel? {cancel_link} — {business_name}",
    emailConfirm: settings?.emailConfirmTemplate || "Hi {client_name},\n\nYour booking for {service} is confirmed for {date} at {time}.\n\nLocation: {business_name}\n\nWe look forward to seeing you!",
    smsReminder: settings?.smsReminderTemplate || "Reminder: {service} with {provider_name} tomorrow at {time}. Need to cancel? {cancel_link} — {business_name}",
    emailReminder: settings?.emailReminderTemplate || "Just a reminder of your {service} tomorrow at {time}.\n\nLooking forward to seeing you!",
    emailFollowup: settings?.emailFollowupTemplate || "Thanks for coming in, {client_name}!\n\nIt would mean a lot if you left us a quick review: {review_link}\n\nReady for your next appointment? {booking_link}"
  });

  const handleSaveTemplates = async () => {
    await updateNotificationSettings({
      smsConfirmTemplate: localTemplates.smsConfirm,
      emailConfirmTemplate: localTemplates.emailConfirm,
      smsReminderTemplate: localTemplates.smsReminder,
      emailReminderTemplate: localTemplates.emailReminder,
      emailFollowupTemplate: localTemplates.emailFollowup
    });
    setActiveTab('overview');
  };

  const insertToken = (token: string) => {
    const field = editingType === 'confirmation' 
      ? (editingChannel === 'sms' ? 'smsConfirm' : 'emailConfirm')
      : editingType === 'reminder'
      ? (editingChannel === 'sms' ? 'smsReminder' : 'emailReminder')
      : 'emailFollowup';
    
    setLocalTemplates(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev] + ' ' + token
    }));
  };

  if (activeTab === 'editor') {
    const currentTemplate = editingType === 'confirmation' 
      ? (editingChannel === 'sms' ? localTemplates.smsConfirm : localTemplates.emailConfirm)
      : editingType === 'reminder'
      ? (editingChannel === 'sms' ? localTemplates.smsReminder : localTemplates.emailReminder)
      : localTemplates.emailFollowup;

    const charCount = editingChannel === 'sms' ? currentTemplate.length : 0;
    const smsCredits = Math.ceil(charCount / 160);

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-2 text-sm text-text-tertiary hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft size={16} /> Back to notifications
        </button>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">Edit Template</h1>
            <p className="text-sm text-text-tertiary capitalize">{editingType} • {editingChannel}</p>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="secondary" onClick={() => setActiveTab('overview')}>Cancel</Button>
             <Button onClick={handleSaveTemplates}>Save Template</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-0 overflow-hidden">
               <div className="p-4 border-b border-border-polaris bg-bg-canvas/30 flex items-center gap-2">
                  <Type size={16} className="text-text-tertiary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-text-tertiary">Message Content</span>
               </div>
               <div className="p-6 space-y-4">
                  <textarea 
                    value={currentTemplate}
                    onChange={(e) => {
                      const field = editingType === 'confirmation' 
                        ? (editingChannel === 'sms' ? 'smsConfirm' : 'emailConfirm')
                        : editingType === 'reminder'
                        ? (editingChannel === 'sms' ? 'smsReminder' : 'emailReminder')
                        : 'emailFollowup';
                      setLocalTemplates(prev => ({ ...prev, [field]: e.target.value }));
                    }}
                    className="w-full min-h-[200px] p-4 bg-bg-canvas/20 rounded-2xl border border-border-polaris focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all resize-none text-sm leading-relaxed"
                    placeholder="Enter your message template here..."
                  />

                  {editingChannel === 'sms' && (
                    <div className="flex items-center justify-between px-2">
                       <div className={`flex items-center gap-2 text-xs font-medium ${charCount > 140 ? 'text-amber-600' : 'text-text-tertiary'}`}>
                          {charCount > 140 && <AlertTriangle size={12} />}
                          {charCount} / 160 characters
                       </div>
                       <div className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary">
                          Sends as {smsCredits} SMS credit{smsCredits !== 1 ? 's' : ''}
                       </div>
                    </div>
                  )}

                  <div className="pt-4 space-y-3">
                     <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Available Tokens</p>
                     <div className="flex flex-wrap gap-2">
                        {TOKENS.map(token => (
                          <button 
                            key={token.value}
                            onClick={() => insertToken(token.value)}
                            className="px-3 py-1.5 rounded-lg bg-brand/5 border border-brand/10 text-[11px] font-medium text-brand hover:bg-brand/10 transition-colors"
                          >
                            {token.label}
                          </button>
                        ))}
                     </div>
                  </div>
               </div>
            </Card>

            <div className="flex items-center justify-center p-6 border border-dashed border-border-polaris rounded-[32px] bg-bg-canvas/10">
               <button className="flex items-center gap-2 text-xs font-bold text-text-tertiary hover:text-brand transition-colors">
                  <RotateCcw size={14} /> Reset to default template
               </button>
            </div>
          </div>

          <div className="space-y-6">
             <div className="sticky top-8 space-y-6">
                <div className="space-y-3">
                   <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest flex items-center gap-2 px-2">
                      <Eye size={12} /> Live Preview
                   </p>
                   <Card className="bg-emerald-50/30 border-emerald-100/50 p-6">
                      <div className="space-y-4">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center">
                               <Zap size={14} />
                            </div>
                            <span className="text-xs font-bold text-brand uppercase tracking-tighter">Instant Preview</span>
                         </div>
                         <div className="bg-white rounded-2xl p-4 shadow-sm border border-border-polaris text-sm leading-relaxed text-text-secondary">
                            {currentTemplate
                              .replace(/{client_name}/g, 'Sarah')
                              .replace(/{service}/g, 'Full Leg Wax')
                              .replace(/{date}/g, 'Monday, Apr 24')
                              .replace(/{time}/g, '10:00 AM')
                              .replace(/{provider_name}/g, 'Jane')
                              .replace(/{business_name}/g, business?.name || 'Skeduley Salon')
                              .replace(/{cancel_link}/g, `${getBaseDomain()}/c/abc123`)
                              .replace(/{review_link}/g, `${getBaseDomain()}/r/abc123`)
                            }
                         </div>
                         <p className="text-[10px] text-text-tertiary italic text-center px-4">
                            This is how your clients will see the message.
                         </p>
                      </div>
                   </Card>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">Notifications</h1>
        <p className="text-text-secondary">Manage how you and your clients are notified about bookings.</p>
      </header>

      {isStarter && (
        <Card className="bg-brand/5 border-brand/10 p-6 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-brand/10 text-brand">
                 <Smartphone size={24} />
              </div>
              <div className="space-y-1">
                 <h3 className="font-bold text-sm text-brand">SMS Usage: {smsUsage?.count} / {smsUsage?.limit} messages</h3>
                 <p className="text-xs text-text-secondary">Upgrade to Pro for unlimited SMS reminders.</p>
              </div>
           </div>
           <Button className="bg-brand text-white hover:bg-brand-hover shadow-lg shadow-brand/20">Upgrade Plan</Button>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-8">
        {/* Client Notifications */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <Bell size={18} className="text-brand" />
            <h2 className="text-lg font-bold tracking-tight text-text-primary">Client Reminders</h2>
          </div>

          <Card className="p-0 overflow-hidden divide-y divide-border-polaris">
            {/* Booking Confirmation */}
            <div className="p-8 flex items-start justify-between group hover:bg-bg-canvas/10 transition-colors">
               <div className="flex gap-6">
                  <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                     <CheckCircle2 size={24} />
                  </div>
                  <div className="space-y-2">
                     <h3 className="font-bold text-text-primary">Booking Confirmation</h3>
                     <p className="text-sm text-text-secondary max-w-md leading-relaxed">
                        Sent immediately after a client books. Includes service details, time, and cancellation link.
                     </p>
                     <div className="flex items-center gap-4 pt-2">
                        <button 
                          onClick={() => { setEditingType('confirmation'); setEditingChannel('sms'); setActiveTab('editor'); }}
                          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-tertiary hover:text-brand transition-colors"
                        >
                          <Smartphone size={12} /> Edit SMS
                        </button>
                        <button 
                          onClick={() => { setEditingType('confirmation'); setEditingChannel('email'); setActiveTab('editor'); }}
                          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-tertiary hover:text-brand transition-colors"
                        >
                          <Mail size={12} /> Edit Email
                        </button>
                     </div>
                  </div>
               </div>
               <div className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings?.confirmationEnabled} 
                    onChange={(e) => updateNotificationSettings({ confirmationEnabled: e.target.checked })}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-border-polaris rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
               </div>
            </div>

            {/* Appointment Reminder */}
            <div className="p-8 flex items-start justify-between group hover:bg-bg-canvas/10 transition-colors">
               <div className="flex gap-6">
                  <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
                     <Clock size={24} />
                  </div>
                  <div className="space-y-2">
                     <div className="flex items-center gap-3">
                        <h3 className="font-bold text-text-primary">Automated Reminder</h3>
                        <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">Passive Growth</span>
                     </div>
                     <p className="text-sm text-text-secondary max-w-md leading-relaxed">
                        Reduces no-shows by 85%. Automatically sends a reminder before the appointment.
                     </p>
                     
                     <div className="flex items-center gap-6 pt-4">
                        <div className="space-y-1.5">
                           <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Timing</p>
                           <select 
                             value={settings?.reminderLeadTimeHours || 24}
                             onChange={(e) => updateNotificationSettings({ reminderLeadTimeHours: parseInt(e.target.value) })}
                             className="bg-bg-canvas/30 border border-border-polaris rounded-lg px-3 py-1.5 text-xs font-medium outline-none focus:ring-1 focus:ring-brand"
                           >
                              <option value={48}>48 hours before</option>
                              <option value={24}>24 hours before</option>
                              <option value={12}>12 hours before</option>
                              <option value={2}>2 hours before</option>
                           </select>
                        </div>
                        <div className="space-y-1.5">
                           <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Templates</p>
                           <div className="flex items-center gap-4">
                              <button 
                                onClick={() => { setEditingType('reminder'); setEditingChannel('sms'); setActiveTab('editor'); }}
                                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-tertiary hover:text-brand transition-colors"
                              >
                                <Smartphone size={12} /> SMS
                              </button>
                              <button 
                                onClick={() => { setEditingType('reminder'); setEditingChannel('email'); setActiveTab('editor'); }}
                                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-tertiary hover:text-brand transition-colors"
                              >
                                <Mail size={12} /> Email
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings?.reminderEnabled} 
                    onChange={(e) => updateNotificationSettings({ reminderEnabled: e.target.checked })}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-border-polaris rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
               </div>
            </div>

            {/* Follow-up / Review */}
            <div className="p-8 flex items-start justify-between group hover:bg-bg-canvas/10 transition-colors">
               <div className="flex gap-6">
                  <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                     <MessageSquare size={24} />
                  </div>
                  <div className="space-y-2">
                     <h3 className="font-bold text-text-primary">Post-visit Follow-up</h3>
                     <p className="text-sm text-text-secondary max-w-md leading-relaxed">
                        Sent 2 hours after completion. Collect reviews and encourage re-booking automatically.
                     </p>
                     <div className="flex items-center gap-4 pt-2">
                        <button 
                          onClick={() => { setEditingType('followup'); setEditingChannel('email'); setActiveTab('editor'); }}
                          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-tertiary hover:text-brand transition-colors"
                        >
                          <Mail size={12} /> Edit Follow-up Email
                        </button>
                     </div>
                  </div>
               </div>
               <div className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings?.followupEnabled} 
                    onChange={(e) => updateNotificationSettings({ followupEnabled: e.target.checked })}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-border-polaris rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
               </div>
            </div>
          </Card>
        </section>

        {/* Global Controls */}
        <section className="bg-bg-canvas/20 rounded-[40px] p-10 border border-border-polaris space-y-6">
           <div className="space-y-2">
              <h3 className="font-bold text-text-primary">Ready to ship?</h3>
              <p className="text-sm text-text-secondary">Reminders are enabled by default for all new bookings. Changes saved here will apply to future bookings only.</p>
           </div>
           <div className="flex flex-col sm:flex-row gap-4">
              <Card className="flex-1 bg-white p-6 space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-tertiary uppercase tracking-widest">Auto-Confirm</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                 </div>
                 <p className="text-xl font-bold text-text-primary">Passive Growth</p>
                 <p className="text-xs text-text-tertiary leading-relaxed">reminders fire automatically, no-show rates drop within the first week.</p>
              </Card>
              <Card className="flex-1 bg-white p-6 space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-tertiary uppercase tracking-widest">SMS Credits</span>
                    <span className="text-xs font-bold text-text-primary">{isStarter ? '100 / mo' : 'Unlimited'}</span>
                 </div>
                 <p className="text-xl font-bold text-text-primary">{isStarter ? `${100 - (smsUsage?.count || 0)} Left` : 'Pro Active'}</p>
                 <p className="text-xs text-text-tertiary leading-relaxed">Your plan includes high-priority SMS delivery for all reminders.</p>
              </Card>
           </div>
        </section>
      </div>
    </div>
  );
};
