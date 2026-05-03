export type BillingCadence = 'monthly' | 'quarterly' | 'biannual' | 'annual';

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  prices: Record<BillingCadence, number>;
  features: string[];
  notIncluded: string[];
  popular?: boolean;
  transactionFee: string;
}

export const BILLING_CADENCES: { id: BillingCadence; label: string; discount: string }[] = [
  { id: 'monthly', label: 'Monthly', discount: 'No commitment' },
  { id: 'quarterly', label: 'Quarterly', discount: 'Save ~12%' },
  { id: 'biannual', label: 'Bi-Annual', discount: 'Save ~20%' },
  { id: 'annual', label: 'Annual', discount: 'Save ~33%' },
];

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'For solo providers just getting started',
    monthlyPrice: 9,
    prices: {
      monthly: 9,
      quarterly: 8,
      biannual: 7,
      annual: 6,
    },
    transactionFee: '2.5%',
    features: [
      '1 provider profile',
      'Booking website on skeduley.co subdomain',
      'Unlimited services listed',
      'Basic booking calendar',
      'Online payments (2.5% fee)',
      'Client booking history (last 50)',
      'Email booking confirmations',
      'Mobile-responsive website',
      '1 starter site template',
    ],
    notIncluded: [
      'Custom domain',
      'SMS reminders & CRM',
      'Analytics dashboard',
      'Multi-staff, packages, or AI copy',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For growing providers ready to scale',
    monthlyPrice: 25,
    popular: true,
    prices: {
      monthly: 25,
      quarterly: 22,
      biannual: 20,
      annual: 18,
    },
    transactionFee: '1.5%',
    features: [
      'Custom domain connection',
      'Revenue & analytics dashboard',
      'Unlimited client CRM',
      'Automated SMS & email reminders',
      'Automated review collection',
      'Waitlist & cancellation backfill',
      'AI website copy generator',
      'Embeddable booking widget',
      'Gift cards (sell from booking page)',
      '5 premium templates',
      'Reduced transaction fee (1.5%)',
    ],
    notIncluded: [
      'Multi-staff & role management',
      'Packages & bundles',
      'Provider mobile app (PWA)',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For multi-staff businesses & salons',
    monthlyPrice: 59,
    prices: {
      monthly: 59,
      quarterly: 52,
      biannual: 48,
      annual: 44,
    },
    transactionFee: '0%',
    features: [
      'Multi-staff & role management (up to 10)',
      'Per-staff booking calendars & permissions',
      'Packages & bundles (prepaid sessions)',
      'Provider mobile app (PWA + push alerts)',
      'Advanced analytics (staff performance)',
      'All premium templates (10+)',
      'Zero transaction fees',
      'Priority email support',
    ],
    notIncluded: [
      'Unlimited staff (11+)',
      'White-label or API access',
      'Dedicated account manager',
    ],
  },
];

export const ENTERPRISE_TIER = {
  id: 'enterprise',
  name: 'Enterprise',
  description: 'For chains, franchises & large teams',
  price: 'Custom',
  features: [
    'Unlimited staff & locations',
    'Dedicated account manager',
    'Custom onboarding & migration support',
    'White-label option (your brand, your domain)',
    'API access for custom integrations',
    'SLA guarantees & uptime commitment',
    'Bulk staff import & management',
    'Custom reporting & data exports',
    'Phone & priority Slack support',
    'Negotiated annual contract pricing',
  ],
};
