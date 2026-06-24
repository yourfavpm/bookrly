import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Calendar, Clock, ArrowLeft, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getBusinessUrl } from '../../lib/domainUtils';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

interface BookingRow {
  id: string;
  business_id: string;
  service_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  payment_status: string;
  paid_amount: number | null;
  total_amount: number | null;
  stripe_session_id?: string | null;
}

type LoadState = {
  loading: boolean;
  error: string | null;
  booking: BookingRow | null;
  business: any | null;
  service: any | null;
};

const formatFriendlyDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
};

export const BookingConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking_id');
  const sessionId = searchParams.get('session_id');
  const cancelled = searchParams.get('cancelled') === 'true';
  const [state, setState] = useState<LoadState>({
    loading: true,
    error: null,
    booking: null,
    business: null,
    service: null
  });

  const confirmationTitle = useMemo(() => {
    if (cancelled) return 'Payment not completed';
    if (state.booking?.status === 'confirmed' || state.booking?.payment_status === 'paid') return 'Booking confirmed';
    if (state.booking?.payment_status === 'pending') return 'Payment pending';
    return 'Booking received';
  }, [cancelled, state.booking]);

  const loadBooking = async () => {
    if (!bookingId && !sessionId) {
      setState((prev) => ({ ...prev, loading: false, error: 'Missing booking details.' }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    const bookingQuery = supabase
      .from('bookings')
      .select('*')
      .limit(1);

    const bookingRes = sessionId
      ? await bookingQuery.eq('stripe_session_id', sessionId).maybeSingle()
      : await bookingQuery.eq('id', bookingId!).maybeSingle();

    if (bookingRes.error || !bookingRes.data) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: bookingRes.error?.message || 'We could not load this booking.'
      }));
      return;
    }

    const booking = bookingRes.data as BookingRow;

    const [businessRes, serviceRes] = await Promise.all([
      supabase.from('businesses').select('*').eq('id', booking.business_id).maybeSingle(),
      supabase.from('services').select('*').eq('id', booking.service_id).maybeSingle()
    ]);

    if (businessRes.error || !businessRes.data) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: businessRes.error?.message || 'We could not load the business for this booking.',
        booking
      }));
      return;
    }

    setState({
      loading: false,
      error: null,
      booking,
      business: {
        ...businessRes.data,
        customDomain: businessRes.data.custom_domain || null
      },
      service: serviceRes.data || null
    });
  };

  useEffect(() => {
    void loadBooking();
  }, [bookingId, sessionId]);

  useEffect(() => {
    if (!sessionId || !state.booking || state.booking.payment_status === 'paid') return;

    const timeout = window.setTimeout(() => {
      void loadBooking();
    }, 2500);

    return () => window.clearTimeout(timeout);
  }, [sessionId, state.booking?.payment_status]);

  const bookingUrl = state.business ? getBusinessUrl(state.business.subdomain || state.business.slug, state.business.customDomain) : '';

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (state.error || !state.booking || !state.business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="max-w-lg w-full text-center space-y-6">
          <AlertCircle size={48} className="mx-auto text-amber-500" />
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-text-primary">{state.error || 'Booking not found'}</h1>
            <p className="text-text-secondary">
              {bookingId || sessionId
                ? 'We could not load the booking details right now. Please refresh in a moment.'
                : 'We are missing the booking identifier needed to show your confirmation.'}
            </p>
          </div>
          <Button onClick={() => void loadBooking()} className="w-full h-12 rounded-2xl bg-brand text-white font-bold">
            Reload
          </Button>
        </div>
      </div>
    );
  }

  const isConfirmed = state.booking.status === 'confirmed';
  const isPaid = state.booking.payment_status === 'paid';
  const isCancelled = cancelled || state.booking.status === 'cancelled' || state.booking.payment_status === 'refunded';
  const isPendingPayment = !isConfirmed && !isPaid && !isCancelled;

  return (
    <div className="min-h-screen bg-bg-canvas flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-6">
        <button
          onClick={() => navigate(bookingUrl || '/')}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-tertiary hover:text-text-primary"
        >
          <ArrowLeft size={14} /> Back to site
        </button>

        <Card className="p-8 md:p-10 rounded-[32px] border-border-light shadow-xl space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand">
                {isPaid ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                {confirmationTitle}
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-text-primary">{state.business.name}</h1>
              <p className="text-text-secondary">
                {isConfirmed || isPaid
                  ? 'Your appointment is locked in and confirmed.'
                  : isCancelled
                    ? 'Your payment was not completed. The booking is not fully confirmed yet.'
                    : 'We have your booking details. Payment status will update as the payment finishes processing.'}
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => void loadBooking()}
              className="h-10 rounded-xl border-border-polaris flex items-center gap-2"
            >
              <RefreshCw size={14} /> Refresh
            </Button>
          </div>

          <div className="grid gap-3 text-sm">
            <div className="flex items-center gap-3 text-text-secondary">
              <Calendar size={14} className="text-text-tertiary" />
              <span>{formatFriendlyDate(state.booking.date)}</span>
            </div>
            <div className="flex items-center gap-3 text-text-secondary">
              <Clock size={14} className="text-text-tertiary" />
              <span>{state.booking.start_time.slice(0, 5)} - {state.booking.end_time.slice(0, 5)}</span>
            </div>
            <div className="flex items-center gap-3 text-text-secondary">
              <CheckCircle2 size={14} className="text-success" />
              <span>Booking status: {state.booking.status}</span>
            </div>
            <div className="flex items-center gap-3 text-text-secondary">
              <CheckCircle2 size={14} className={isPaid ? 'text-emerald-500' : 'text-amber-500'} />
              <span>Payment status: {state.booking.payment_status}</span>
            </div>
          </div>

          {(isCancelled || isPendingPayment) && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {isCancelled
                ? 'Payment did not complete. You can return to the site and try again.'
                : 'Your payment is still being finalized. Refresh this page in a moment if it has not updated yet.'}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={() => navigate(bookingUrl || '/')}
              className="h-12 rounded-2xl bg-brand text-white font-bold"
            >
              Return to site
            </Button>
            {!isPaid && (
              <Button
                variant="secondary"
                onClick={() => void loadBooking()}
                className="h-12 rounded-2xl border-border-polaris font-bold"
              >
                Check payment status
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
