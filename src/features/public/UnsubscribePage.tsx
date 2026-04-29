import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BellOff, CheckCircle2, Mail, Smartphone, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const UnsubscribePage: React.FC = () => {
  const { businessId } = useParams();
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get('clientId');
  
  const [businessName, setBusinessName] = useState('the business');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!businessId || !clientId) return;
      
      const { data: b } = await supabase
        .from('businesses')
        .select('name')
        .eq('id', businessId)
        .single();
      
      if (b) setBusinessName(b.name);
      setLoading(false);
    };
    loadData();
  }, [businessId, clientId]);

  const handleUpdate = async (type: 'sms' | 'email' | 'all') => {
    if (!businessId || !clientId) return;
    
    let updates = {};
    if (type === 'sms') updates = { sms_opt_out: true };
    if (type === 'email') updates = { email_opt_out: true };
    if (type === 'all') updates = { sms_opt_out: true, email_opt_out: true };

    const { error } = await supabase
      .from('client_notification_preferences')
      .upsert({
        client_id: clientId,
        business_id: businessId,
        ...updates,
        updated_at: new Date().toISOString()
      });

    if (!error) {
      setSuccess(true);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-bg-canvas flex items-center justify-center p-6">
       <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-canvas flex items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card className="p-8 lg:p-12 space-y-8 shadow-xl shadow-black/5">
           <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-brand/5 text-brand rounded-[24px] flex items-center justify-center mx-auto">
                 <BellOff size={32} />
              </div>
              <div className="space-y-2">
                 <h1 className="text-2xl font-bold tracking-tight text-text-primary">Communication Preferences</h1>
                 <p className="text-sm text-text-secondary leading-relaxed">
                    Manage how you receive updates and reminders from <span className="font-semibold text-text-primary">{businessName}</span>.
                 </p>
              </div>
           </div>

           {!success ? (
             <div className="space-y-4">
                <button 
                  onClick={() => handleUpdate('sms')}
                  className="w-full flex items-center justify-between p-5 rounded-2xl border border-border-polaris hover:border-brand hover:bg-brand/5 transition-all group"
                >
                   <div className="flex items-center gap-4">
                      <div className="p-2 rounded-xl bg-bg-canvas text-text-tertiary group-hover:text-brand transition-colors">
                         <Smartphone size={20} />
                      </div>
                      <div className="text-left">
                         <p className="text-sm font-semibold text-text-primary">Stop SMS Reminders</p>
                         <p className="text-[11px] text-text-tertiary">You'll still receive email updates</p>
                      </div>
                   </div>
                   <ArrowRight size={16} className="text-text-tertiary group-hover:text-brand group-hover:translate-x-1 transition-all" />
                </button>

                <button 
                  onClick={() => handleUpdate('email')}
                  className="w-full flex items-center justify-between p-5 rounded-2xl border border-border-polaris hover:border-brand hover:bg-brand/5 transition-all group"
                >
                   <div className="flex items-center gap-4">
                      <div className="p-2 rounded-xl bg-bg-canvas text-text-tertiary group-hover:text-brand transition-colors">
                         <Mail size={20} />
                      </div>
                      <div className="text-left">
                         <p className="text-sm font-semibold text-text-primary">Stop Email Updates</p>
                         <p className="text-[11px] text-text-tertiary">You'll still receive SMS reminders</p>
                      </div>
                   </div>
                   <ArrowRight size={16} className="text-text-tertiary group-hover:text-brand group-hover:translate-x-1 transition-all" />
                </button>

                <button 
                  onClick={() => handleUpdate('all')}
                  className="w-full py-4 text-xs font-bold text-text-tertiary hover:text-red-600 transition-colors uppercase tracking-widest"
                >
                   Unsubscribe from all messages
                </button>
             </div>
           ) : (
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="text-center space-y-6 py-8"
             >
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                   <CheckCircle2 size={24} />
                </div>
                <div className="space-y-2">
                   <h3 className="text-lg font-bold text-text-primary">Settings Updated</h3>
                   <p className="text-sm text-text-secondary">Your preferences have been saved. You won't receive these messages from {businessName} anymore.</p>
                </div>
                <Button variant="secondary" onClick={() => window.close()} className="w-full">
                   Close Window
                </Button>
             </motion.div>
           )}

           <div className="pt-8 border-t border-border-polaris text-center">
              <p className="text-[10px] text-text-tertiary uppercase tracking-widest font-medium">
                 Powered by <span className="text-brand font-bold">Bukd</span>
              </p>
           </div>
        </Card>
      </motion.div>
    </div>
  );
};
