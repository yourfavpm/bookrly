import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { AlertTriangle, CheckCircle2, Calendar, Clock } from 'lucide-react';

export const CancelBookingPage: React.FC = () => {
  const { bookingId } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      if (!bookingId) return;
      const { data } = await supabase.from('bookings').select('*, businesses(name,subdomain,custom_domain)').eq('id', bookingId).maybeSingle();
      setBooking(data);
      setLoading(false);
    };
    void load();
  }, [bookingId]);

  const handleCancel = async () => {
    if (!bookingId) return;
    setSubmitting(true);
    const { error } = await supabase.functions.invoke('booking-cancel', { body: { bookingId } });
    setSubmitting(false);
    if (!error) setDone(true);
  };

  if (loading) return <div className="min-h-screen grid place-items-center"><div className="w-10 h-10 rounded-full border-4 border-brand border-t-transparent animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-bg-canvas flex items-center justify-center p-6">
      <Card className="max-w-xl w-full space-y-6 p-8">
        {!done ? (
          <>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-600">
                <AlertTriangle size={14} /> Cancel booking
              </div>
              <h1 className="text-2xl font-bold text-text-primary">Do you want to cancel this appointment?</h1>
            </div>
            {booking && (
              <div className="space-y-2 text-sm text-text-secondary">
                <div className="flex items-center gap-2"><Calendar size={14} /> {booking.date}</div>
                <div className="flex items-center gap-2"><Clock size={14} /> {booking.start_time} - {booking.end_time}</div>
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => window.history.back()}>Keep booking</Button>
              <Button className="flex-1 bg-slate-900 text-white" isLoading={submitting} onClick={handleCancel}>Cancel booking</Button>
            </div>
          </>
        ) : (
          <div className="space-y-4 text-center">
            <CheckCircle2 size={40} className="mx-auto text-emerald-600" />
            <h1 className="text-2xl font-bold text-text-primary">Your cancellation has been saved.</h1>
            <p className="text-text-secondary">If this booking had an associated payment, the business owner may still need to review the refund status.</p>
          </div>
        )}
      </Card>
    </div>
  );
};
