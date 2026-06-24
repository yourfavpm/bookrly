import React, { useMemo, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Check, Zap } from 'lucide-react';
import { PRICING_TIERS, BILLING_CADENCES } from '../../constants/billing';
import type { BillingCadence } from '../../constants/billing';
import { Button } from '../../components/ui/Button';
import { calculateDaysRemaining } from '../../lib/dateUtils';

export const BillingPage: React.FC = () => {
  const { business, createSubscription, openBillingPortal } = useAppStore();
  const [cadence, setCadence] = useState<BillingCadence>('annual');
  const [redirectingPlan, setRedirectingPlan] = useState<string | null>(null);
  const [billingAction, setBillingAction] = useState<'portal' | 'upgrade' | null>(null);
  const priceIds = {
    starter: {
      monthly: import.meta.env.VITE_STRIPE_STARTER_MONTHLY,
      quarterly: import.meta.env.VITE_STRIPE_STARTER_QUARTERLY,
      biannual: import.meta.env.VITE_STRIPE_STARTER_BIANNUAL,
      annual: import.meta.env.VITE_STRIPE_STARTER_ANNUAL,
    },
    pro: {
      monthly: import.meta.env.VITE_STRIPE_PRO_MONTHLY,
      quarterly: import.meta.env.VITE_STRIPE_PRO_QUARTERLY,
      biannual: import.meta.env.VITE_STRIPE_PRO_BIANNUAL,
      annual: import.meta.env.VITE_STRIPE_PRO_ANNUAL,
    },
    business: {
      monthly: import.meta.env.VITE_STRIPE_BUSINESS_MONTHLY,
      quarterly: import.meta.env.VITE_STRIPE_BUSINESS_QUARTERLY,
      biannual: import.meta.env.VITE_STRIPE_BUSINESS_BIANNUAL,
      annual: import.meta.env.VITE_STRIPE_BUSINESS_ANNUAL,
    },
  } as const;

  const currentPlan = useMemo(() => {
    const planType = (business?.planType || 'pro').toLowerCase();
    if (planType === 'enterprise') return 'business';
    if (planType === 'starter' || planType === 'pro' || planType === 'business' || planType === 'free') {
      return planType;
    }
    return 'pro';
  }, [business?.planType]);

  const trialDaysLeft = calculateDaysRemaining(business?.trialEndDate);
  const statusLabel = business?.subscriptionStatus === 'trialing'
    ? 'Free Trial'
    : business?.subscriptionStatus === 'active'
      ? 'Active'
      : business?.subscriptionStatus === 'past_due'
        ? 'Past Due'
        : business?.subscriptionStatus === 'canceled'
          ? 'Canceled'
          : 'No Plan';

  const statusTone = business?.subscriptionStatus === 'active'
    ? 'text-emerald-600 bg-emerald-50 border-emerald-100'
    : business?.subscriptionStatus === 'past_due'
      ? 'text-red-600 bg-red-50 border-red-100'
      : business?.subscriptionStatus === 'canceled'
        ? 'text-slate-500 bg-slate-50 border-slate-200'
        : 'text-brand bg-brand/5 border-brand/10';

  const handleSelectPlan = async (tierId: string, priceId?: string) => {
    if (!priceId) {
      setRedirectingPlan(tierId);
      window.location.href = 'mailto:hello@skeduley.com?subject=Enterprise Inquiry';
      return;
    }

    setRedirectingPlan(tierId);
    const url = await createSubscription(priceId, tierId);
    if (url) window.location.href = url;
    else setRedirectingPlan(null);
  };

  const handleManageBilling = async () => {
    setBillingAction('portal');
    const url = await openBillingPortal();
    if (url) window.location.href = url;
    else setBillingAction(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 space-y-12 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Plan & Billing</h1>
          <p className="text-text-secondary">Manage your subscription and billing details.</p>
        </div>
        
        {/* Cadence Toggle */}
        <div className="p-1 bg-slate-100 rounded-xl flex items-center shrink-0">
          {BILLING_CADENCES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCadence(c.id)}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                cadence === c.id 
                  ? 'bg-white text-brand shadow-sm' 
                  : 'text-text-tertiary hover:text-text-secondary'
              }`}
            >
              {c.label}
              {c.id !== 'monthly' && (
                <span className="block text-[8px] opacity-60 mt-0.5">{c.discount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Current Plan Status */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-brand/5 rounded-2xl flex items-center justify-center text-brand">
            <Zap size={32} />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-brand uppercase tracking-widest">Current Plan</p>
            <h3 className="text-2xl font-bold text-text-primary">
              {business?.subscriptionStatus === 'trialing'
                ? 'Free Trial'
                : PRICING_TIERS.find(t => t.id === currentPlan)?.name || 'Pro'}
            </h3>
            <p className="text-sm text-text-secondary">
              {business?.subscriptionStatus === 'trialing'
                ? (trialDaysLeft > 0
                    ? `Your trial ends in ${trialDaysLeft} day${trialDaysLeft === 1 ? '' : 's'}.`
                    : 'Your trial ends today. Upgrade to avoid interruption.')
                : business?.subscriptionStatus === 'past_due'
                  ? 'Your last payment failed. Update your billing method to avoid interruption.'
                  : business?.subscriptionStatus === 'active'
                    ? 'Your subscription is active and billing is up to date.'
                    : 'Choose a plan to get started.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest ${statusTone}`}>{statusLabel}</span>
          <Button
            variant="secondary"
            onClick={handleManageBilling}
            isLoading={billingAction === 'portal'}
            className="rounded-xl px-6 h-12 text-[11px] font-bold uppercase tracking-widest"
          >
            Manage Billing
          </Button>
          <Button
            onClick={() => document.getElementById('billing-plans')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="bg-brand text-white rounded-xl px-8 h-12 text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-brand/20"
          >
            {business?.subscriptionStatus === 'active' ? 'View Plans' : 'Upgrade Now'}
          </Button>
        </div>
      </div>

      {/* Pricing Grid */}
      <div id="billing-plans" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PRICING_TIERS.map((tier) => (
          <div 
            key={tier.id} 
            className={`relative p-8 bg-white border rounded-[32px] flex flex-col transition-all hover:shadow-xl hover:shadow-slate-200/50 ${
              tier.popular ? 'border-brand ring-1 ring-brand/20' : 'border-slate-200'
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                Most Popular
              </div>
            )}
            
            <div className="space-y-1 mb-6">
              <h3 className="text-xl font-bold text-text-primary">{tier.name}</h3>
              <p className="text-xs text-text-tertiary leading-relaxed">{tier.description}</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-text-primary">${tier.prices[cadence]}</span>
                <span className="text-text-tertiary font-medium">/mo</span>
              </div>
              <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mt-2">
                Billed {cadence}
              </p>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {tier.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <div className="mt-0.5 w-4 h-4 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  <span className="text-text-secondary leading-tight">{feature}</span>
                </li>
              ))}
              {tier.notIncluded.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm opacity-40 grayscale">
                  <div className="mt-0.5 w-4 h-4 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                    <X size={10} strokeWidth={3} />
                  </div>
                  <span className="text-text-tertiary leading-tight">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => handleSelectPlan(tier.id, priceIds[tier.id as keyof typeof priceIds]?.[cadence])}
              isLoading={redirectingPlan === tier.id}
              disabled={currentPlan === tier.id && business?.subscriptionStatus === 'active'}
              className={`w-full h-12 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${
                tier.popular
                  ? 'bg-brand text-white shadow-lg shadow-brand/20 hover:scale-[1.02]'
                  : 'bg-slate-900 text-white hover:bg-black'
              }`}
            >
              {currentPlan === tier.id && business?.subscriptionStatus === 'active' ? 'Current Plan' : `Select ${tier.name}`}
            </Button>
          </div>
        ))}
      </div>

      {/* Feature Comparison Table */}
      <div className="pt-12 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-text-primary">Full Feature Comparison</h2>
          <p className="text-text-secondary">Decide which plan is best for your business growth.</p>
        </div>

        <div className="overflow-hidden border border-slate-200 rounded-3xl bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-6 px-8 text-[11px] font-bold uppercase tracking-widest text-text-tertiary border-b border-slate-100">Core Features</th>
                <th className="py-6 px-8 text-[11px] font-bold uppercase tracking-widest text-text-tertiary border-b border-slate-100 text-center">Starter</th>
                <th className="py-6 px-8 text-[11px] font-bold uppercase tracking-widest text-brand border-b border-slate-100 text-center bg-brand/5">Pro</th>
                <th className="py-6 px-8 text-[11px] font-bold uppercase tracking-widest text-text-tertiary border-b border-slate-100 text-center">Business</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { section: 'Website & Booking' },
                { name: 'Booking website (skeduley subdomain)', starter: true, pro: true, business: true },
                { name: 'Custom domain connection', starter: false, pro: true, business: true },
                { name: 'SSL Security (HTTPS)', starter: true, pro: true, business: true },
                { name: 'Premium Studio Templates', starter: '1', pro: '5', business: 'All (10+)' },
                { name: 'AI Website Copy Generator', starter: false, pro: true, business: true },
                
                { section: 'Payments & Revenue' },
                { name: 'Online Payments (Stripe)', starter: true, pro: true, business: true },
                { name: 'Platform Transaction Fee', starter: '2.5%', pro: '1.5%', business: '0%' },
                { name: 'Deposit Collection', starter: true, pro: true, business: true },
                { name: 'Gift Cards & Packages', starter: false, pro: true, business: true },
                
                { section: 'Operations' },
                { name: 'Staff Profiles', starter: '1', pro: '1', business: 'Up to 10' },
                { name: 'Client CRM Records', starter: '50', pro: 'Unlimited', business: 'Unlimited' },
                { name: 'Automated SMS Reminders', starter: false, pro: true, business: true },
                { name: 'Revenue Analytics', starter: 'Basic', pro: 'Advanced', business: 'Enterprise' },
                { name: 'Provider Mobile App (PWA)', starter: false, pro: false, business: true },
              ].map((row: any, i) => (
                row.section ? (
                  <tr key={`sec-${i}`} className="bg-slate-50/30">
                    <td colSpan={4} className="py-3 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary">{row.section}</td>
                  </tr>
                ) : (
                  <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-5 px-8 text-sm font-medium text-text-secondary">{row.name}</td>
                    <td className="py-5 px-8 text-sm text-center">
                      {typeof row.starter === 'boolean' ? (
                        row.starter ? <Check size={16} className="mx-auto text-emerald-500" /> : <X size={16} className="mx-auto text-slate-300" />
                      ) : (
                        <span className="font-bold text-text-primary">{row.starter}</span>
                      )}
                    </td>
                    <td className="py-5 px-8 text-sm text-center bg-brand/5">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <Check size={16} className="mx-auto text-brand" /> : <X size={16} className="mx-auto text-slate-300" />
                      ) : (
                        <span className="font-bold text-brand">{row.pro}</span>
                      )}
                    </td>
                    <td className="py-5 px-8 text-sm text-center">
                      {typeof row.business === 'boolean' ? (
                        row.business ? <Check size={16} className="mx-auto text-emerald-500" /> : <X size={16} className="mx-auto text-slate-300" />
                      ) : (
                        <span className="font-bold text-text-primary">{row.business}</span>
                      )}
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const X = ({ size, className, strokeWidth = 2 }: { size: number, className?: string, strokeWidth?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);
