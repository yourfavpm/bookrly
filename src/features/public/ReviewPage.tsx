import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Star, CheckCircle2 } from 'lucide-react';

export const ReviewPage: React.FC = () => {
  const { bookingId } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [rating, setRating] = useState(5);
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!bookingId) return;
      const { data } = await supabase.from('bookings').select('customer_name').eq('id', bookingId).maybeSingle();
      setAuthorName(data?.customer_name || '');
      setLoading(false);
    };
    void load();
  }, [bookingId]);

  const handleSubmit = async () => {
    if (!bookingId) return;
    setSubmitting(true);
    const { error } = await supabase.functions.invoke('booking-review', {
      body: { bookingId, authorName, rating, content },
    });
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
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand">Leave a review</p>
              <h1 className="text-2xl font-bold text-text-primary">How was your visit?</h1>
            </div>
            <div className="flex gap-2">
              {[1,2,3,4,5].map((star) => (
                <button key={star} onClick={() => setRating(star)} className={`${star <= rating ? 'text-amber-500' : 'text-slate-300'}`}>
                  <Star size={24} fill="currentColor" />
                </button>
              ))}
            </div>
            <input className="w-full h-12 rounded-xl border border-border-polaris px-4" value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Your name" />
            <textarea className="w-full min-h-[140px] rounded-xl border border-border-polaris p-4" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Tell others about your experience" />
            <Button className="w-full bg-slate-900 text-white" isLoading={submitting} onClick={handleSubmit}>Submit review</Button>
          </>
        ) : (
          <div className="space-y-4 text-center">
            <CheckCircle2 size={40} className="mx-auto text-emerald-600" />
            <h1 className="text-2xl font-bold text-text-primary">Thanks for sharing your feedback.</h1>
            <p className="text-text-secondary">Your review has been posted.</p>
          </div>
        )}
      </Card>
    </div>
  );
};
