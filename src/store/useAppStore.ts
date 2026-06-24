import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { User, AuthError } from '@supabase/supabase-js';
import { calculateDashboardStats, type DashboardStats } from '../lib/analyticsUtils';
import {
  generateBusinessSubdomain,
  getBaseDomain,
  getBusinessUrl,
  getBookingConfirmationUrl,
  getDomainLookupCandidates,
  isDefaultSubdomain,
  normalizeDomainIdentifier,
  slugifyDomainLabel
} from '../lib/domainUtils';

export interface AddOn {
  id: string;
  name: string;
  price: number;
  duration: number;
  active: boolean;
  description?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  bufferTime: number;
  bookingFeeEnabled: boolean;
  bookingFeeAmount: number;
  addOns: AddOn[];
  active: boolean;
}

export interface WorkingHour {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_open: boolean;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isOpen: boolean;
}

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  serviceId: string;
  staffId?: string;
  client_id?: string | null;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  paymentStatus: 'unpaid' | 'pending' | 'paid' | 'partially_paid' | 'failed' | 'refunded';
  paymentMethod: 'CARD' | 'CASH' | 'GIFT_CARD' | 'PACKAGE' | 'UNPAID';
  totalAmount: number;
  paidAmount: number;
  addOns: string[];
  createdAt: string;
  notes?: string;
}

interface Review {
  id: string;
  author_name: string;
  rating: number;
  content: string;
  created_at: string;
}

interface ProofItem {
  id: string;
  image_url: string;
  title?: string;
  category?: string;
  created_at: string;
}

export interface BlockedTime {
  id: string;
  businessId: string;
  staffId?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  reason?: string;
  createdAt: string;
}

export interface StaffAvailability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isOpen: boolean;
}

export interface StaffMember {
  id: string;
  businessId: string;
  userId: string | null;
  name: string;
  email: string;
  phone: string | null;
  role: 'admin' | 'manager' | 'staff';
  status: 'invited' | 'active' | 'inactive';
  inviteToken: string | null;
  avatarUrl: string | null;
  availability: StaffAvailability[];
  serviceIds: string[];
  createdAt: string;
}

export interface ClientNote {
  id: string;
  clientId: string;
  staffId?: string;
  text: string;
  createdAt: string;
}

export interface Client {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  email?: string;
  joinDate: string;
  tags: string[];
  isDeleted: boolean;
  createdAt: string;
  notes: ClientNote[];
  totalVisits?: number;
  lifetimeSpend?: number;
  lastVisit?: string;
}

export interface ScheduledMessage {
  id: string;
  bookingId: string;
  clientId: string;
  businessId: string;
  type: 'CONFIRMATION' | 'REMINDER' | 'FOLLOWUP';
  channel: 'SMS' | 'EMAIL';
  scheduledFor: string;
  sentAt: string | null;
  status: 'QUEUED' | 'SENT' | 'DELIVERED' | 'OPENED' | 'FAILED' | 'SKIPPED';
  failureReason: string | null;
  templateSnapshot: string | null;
  twilioSid?: string;
  sendgridId?: string;
}

export interface ProviderNotificationSettings {
  businessId: string;
  confirmationEnabled: boolean;
  reminderEnabled: boolean;
  followupEnabled: boolean;
  reminderLeadTimeHours: number;
  smsConfirmTemplate: string | null;
  emailConfirmTemplate: string | null;
  smsReminderTemplate: string | null;
  emailReminderTemplate: string | null;
  emailFollowupTemplate: string | null;
}

export interface SMSUsage {
  count: number;
  limit: number;
}

interface BusinessState {
  id: string;
  name: string;
  category: string;
  email: string;
  phone: string;
  subdomain: string;
  logo: string | null;
  logoUrl: string | null;
  coverImage: string | null;
  primaryColor: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  secondaryCtaText: string;
  trustSection: 'reviews' | 'proof' | 'both' | 'none';
  aboutTitle: string;
  aboutDescription: string;
  aboutImage: string | null;
  address: string;
  socials: {
    instagram: string;
    facebook: string;
    twitter: string;
  };
  reviews: Review[];
  proofOfWork: ProofItem[];
  isPublished: boolean;
  slug: string;
  customDomain: string | null;
  timezone: string;
  workingHours: WorkingHour[];
  services: Service[];
  bookings: Booking[];
  staff: StaffMember[];
  clients: Client[];
  notificationSettings?: ProviderNotificationSettings;
  smsUsage?: SMSUsage;
  scheduledMessages?: ScheduledMessage[];
  stripeAccountId: string | null;
  stripeConnected: boolean;
  stripeOnboardingStatus: 'not_started' | 'pending' | 'complete';
  stripeChargesEnabled: boolean;
  stripePayouts_enabled: boolean;
  stripeDetailsSubmitted: boolean;
  templateKey: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  subscriptionStatus: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete';
  trialStartDate: string | null;
  trialEndDate: string | null;
  planType: 'free' | 'starter' | 'pro' | 'business' | 'enterprise';
  domains: Domain[];
  themeMode: 'light' | 'dark' | 'auto';
  hiddenSections: string[];
  faqs: FAQ[];
  beforeAfterImages: BeforeAfterImage[];
  blockedTimes: BlockedTime[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  orderIndex: number;
}

export interface BeforeAfterImage {
  id: string;
  beforeUrl: string;
  afterUrl: string;
  title: string;
  description: string;
}

export interface Domain {
  id: string;
  businessId: string;
  domain: string;
  type: 'subdomain' | 'custom';
  status: 'pending_verification' | 'dns_configured' | 'active' | 'failed' | 'suspended' | 'transferred';
  isPrimary: boolean;
  sslEnabled: boolean;
  sslStatus: string;
  dnsRecords: any;
  verifiedAt: string | null;
  createdAt: string;
}

interface AppState {
  user: User | null;
  business: BusinessState | null;
  loading: boolean;
  error: string | null;
  editorSaveStatus: 'idle' | 'saving' | 'saved' | 'error';
  editorSaveError: string | null;
  onboardingStep: number;
  isCanada: boolean;
  currency: 'USD' | 'CAD';
  staffRole: 'admin' | 'manager' | 'staff' | 'owner' | null;
  staffId: string | null;
  
  // Website Editor State
  previewTemplateKey: string | null;
  activeEditorSection: string | null;
  
  setPreviewTemplateKey: (key: string | null) => void;
  setActiveEditorSection: (section: string | null) => void;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setBusiness: (business: BusinessState | null) => void;
  resetEditorSaveStatus: () => void;
  updateBusiness: (updates: Partial<BusinessState>, immediate?: boolean) => Promise<void>;
  setOnboardingStep: (step: number) => void;
  fetchBusiness: (retryCount?: number, silent?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  addReview: (review: { author_name: string; rating: number; content: string }) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  addProofItem: (item: { image_url: string; caption?: string }) => Promise<void>;
  deleteProofItem: (id: string) => Promise<void>;
  addService: (service: Partial<Service>) => Promise<void>;
  updateService: (id: string, service: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  fetchPublicBusiness: (subdomain: string) => Promise<void>;
  updateBookingStatus: (id: string, status: string) => Promise<void>;
  updateReview: (id: string, updates: Partial<Review>) => Promise<void>;
  updateProofItem: (id: string, updates: Partial<ProofItem>) => Promise<void>;
  detectLocation: () => Promise<void>;
  // Staff management
  fetchStaff: () => Promise<void>;
  addStaff: (data: { name: string; email: string; phone?: string; role: 'admin' | 'manager' | 'staff'; serviceIds: string[] }) => Promise<StaffMember | null>;
  updateStaff: (id: string, updates: Partial<StaffMember>) => Promise<void>;
  removeStaff: (id: string) => Promise<void>;
  updateStaffAvailability: (staffId: string, hours: StaffAvailability[]) => Promise<void>;
  assignServicesToStaff: (staffId: string, serviceIds: string[]) => Promise<void>;
  acceptStaffInvite: (token: string) => Promise<StaffMember | null>;
  createBooking: (data: {
    serviceId: string;
    addOnIds: string[];
    date: string;
    time: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    notes?: string;
    totalPrice: number;
    depositDue: number;
    staffId?: string;
  }) => Promise<{ id: string } | null>;
  createCheckoutSession: (bookingId: string) => Promise<string | null>;
  setupStripeConnect: () => Promise<string | null>;
  refreshStripeStatus: () => Promise<void>;
  refundBooking: (bookingId: string) => Promise<void>;
  createSubscription: (priceId: string, planType?: string) => Promise<string | null>;
  openBillingPortal: () => Promise<string | null>;
  sendTestNotification: (channel: 'sms' | 'email', templateText?: string, notificationType?: string) => Promise<void>;
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>;
  uploadLogo: (file: File) => Promise<string | null>;
  deleteStorageAsset: (url: string) => Promise<void>;
  updateWorkingHours: (hours: WorkingHour[]) => Promise<void>;
  // CRM Actions
  fetchClients: () => Promise<void>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
  exportClientsCSV: () => void;
  deleteClient: (id: string) => Promise<void>;
  addClientNote: (clientId: string, text: string) => Promise<void>;
  updateClientNote: (id: string, text: string) => Promise<void>;
  deleteClientNote: (id: string) => Promise<void>;
  // Notification Actions
  updateNotificationSettings: (updates: Partial<ProviderNotificationSettings>) => Promise<void>;
  scheduleMessages: (bookingId: string) => Promise<void>;
  getDashboardStats: (period?: string, compare?: boolean, staffId?: string) => DashboardStats | null;
  // Domain Actions
  fetchDomains: () => Promise<void>;
  addDomain: (domain: string, type: 'subdomain' | 'custom') => Promise<{ success: boolean; error?: string }>;
  verifyDomain: (id: string) => Promise<{ verified: boolean; errors?: any }>;
  setPrimaryDomain: (id: string) => Promise<void>;
  deleteDomain: (id: string) => Promise<void>;
  // Blocked Times Actions
  addBlockedTime: (data: Omit<BlockedTime, 'id' | 'businessId' | 'createdAt'>) => Promise<void>;
  deleteBlockedTime: (id: string) => Promise<void>;
}

const generateSubdomain = (name: string, businessId: string): string => {
  return generateBusinessSubdomain(name, businessId);
};

const normalizePlanType = (planType?: string | null): BusinessState['planType'] => {
  if (!planType) return 'pro';
  const normalized = planType.toLowerCase();
  if (normalized === 'enterprise') return 'business';
  if (normalized === 'free' || normalized === 'starter' || normalized === 'pro' || normalized === 'business') {
    return normalized;
  }
  return 'pro';
};

const getSmsLimitForPlan = (planType?: string | null): number => {
  const normalized = normalizePlanType(planType);
  if (normalized === 'starter') return 1000;
  if (normalized === 'pro') return 5000;
  if (normalized === 'business') return 20000;
  return 500;
};

const isSubdomainAvailable = async (subdomain: string, businessId: string): Promise<boolean> => {
  const [{ data: businessMatch }, { data: domainMatch }] = await Promise.all([
    supabase
      .from('businesses')
      .select('id')
      .eq('subdomain', subdomain)
      .neq('id', businessId)
      .maybeSingle(),
    supabase
      .from('domains')
      .select('id,business_id')
      .eq('domain', subdomain)
      .neq('business_id', businessId)
      .maybeSingle()
  ]);

  return !businessMatch && !domainMatch;
};

const findAvailableSubdomain = async (businessName: string, businessId: string): Promise<string> => {
  const base = generateSubdomain(businessName, businessId);
  if (await isSubdomainAvailable(base, businessId)) return base;

  const suffix = businessId.slice(0, 6);
  const withId = `${base.slice(0, 56 - suffix.length).replace(/-+$/g, '')}-${suffix}`;
  if (await isSubdomainAvailable(withId, businessId)) return withId;

  for (let i = 2; i < 100; i += 1) {
    const numeric = `${base.slice(0, 61 - String(i).length).replace(/-+$/g, '')}-${i}`;
    if (await isSubdomainAvailable(numeric, businessId)) return numeric;
  }

  return `biz-${businessId.slice(0, 8)}`;
};

const ensureBusinessDomain = async (
  businessId: string,
  businessName: string,
  currentSubdomain?: string | null,
  forceFromName = false
): Promise<string> => {
  const cleanedCurrent = currentSubdomain ? slugifyDomainLabel(currentSubdomain) : '';
  let subdomain = forceFromName || isDefaultSubdomain(cleanedCurrent)
    ? await findAvailableSubdomain(businessName, businessId)
    : cleanedCurrent;

  if (!await isSubdomainAvailable(subdomain, businessId)) {
    subdomain = await findAvailableSubdomain(businessName, businessId);
  }

  const { error: businessUpdateError } = await supabase
    .from('businesses')
    .update({ subdomain, slug: subdomain })
    .eq('id', businessId);
  if (businessUpdateError) throw businessUpdateError;

  const { error: primaryResetError } = await supabase
    .from('domains')
    .update({ is_primary: false })
    .eq('business_id', businessId);
  if (primaryResetError) throw primaryResetError;

  const { data: existingDomain } = await supabase
    .from('domains')
    .select('id')
    .eq('business_id', businessId)
    .eq('type', 'subdomain')
    .maybeSingle();

  const domainPayload = {
    business_id: businessId,
    domain: subdomain,
    type: 'subdomain' as const,
    status: 'active' as const,
    is_primary: true,
    ssl_enabled: true,
    ssl_status: 'active',
    verified_at: new Date().toISOString(),
    dns_records: {}
  };

  if (existingDomain) {
    const { error } = await supabase.from('domains').update(domainPayload).eq('id', existingDomain.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('domains').insert([domainPayload]);
    if (error) throw error;
  }

  return subdomain;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
  user: null,
  business: null,
  loading: true,
  error: null,
  editorSaveStatus: 'idle',
  editorSaveError: null,
  onboardingStep: 1,
  isCanada: true,
  currency: 'CAD',
  staffRole: null,
  staffId: null,
  previewTemplateKey: null,
  activeEditorSection: null,
  
  setPreviewTemplateKey: (key) => set({ previewTemplateKey: key }),
  setActiveEditorSection: (section) => set({ activeEditorSection: section }),
  
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setBusiness: (business) => set({ business }),
  resetEditorSaveStatus: () => set({ editorSaveStatus: 'idle', editorSaveError: null }),
  setOnboardingStep: (step) => set({ onboardingStep: step }),

  fetchBusiness: async (retryCount?: number, silent: boolean = false) => {
    const { user, business } = get();
    if (!user) {
      set({ loading: false });
      return;
    }
    
    // Skip fetch if we already have business data unless retryCount is provided
    if (business && retryCount === undefined) {
      set({ loading: false });
      return;
    }

    if (!silent) {
      if (!business) {
        set({ loading: true, error: null });
      } else {
        set({ error: null });
      }
    }
    try {
      // 1. Fetch Business
      const bQuery = supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id);
      
      const { data: businessRes, error: bError } = await bQuery.single();
      
      if (bError) {
        if (bError.code === 'PGRST116') {
           // No business found, check staff members
           const { data: staffMember } = await supabase
             .from('staff_members')
             .select('*, businesses(*)')
             .eq('user_id', user.id)
             .maybeSingle();
           
           if (staffMember?.businesses) {
             set({ staffRole: staffMember.role, staffId: staffMember.id });
             return get().fetchBusiness(0); 
           }
           
           // If truly no business, create one for owner
           const now = new Date();
           const trialEndDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
           const { data: newBusiness, error: createError } = await supabase
             .from('businesses')
             .insert([{ 
                owner_id: user.id, 
                name: '',
                primary_color: '#111111',
                trust_section: 'none',
                template_key: 'clean_classic',
                is_published: false,
                subscription_status: 'trialing',
                trial_start_date: now.toISOString(),
                trial_end_date: trialEndDate.toISOString(),
                plan_type: 'pro'
             }])
             .select()
             .single();
           if (!createError && newBusiness) {
             // Send the welcome email (email is verified at this point)
             supabase.functions.invoke('send-email', {
               body: {
                 to: user.email,
                 template: 'welcome',
                 data: { name: user.user_metadata?.full_name || 'there' }
               }
             }).catch(console.error);

             return get().fetchBusiness(0);
           }
        }
        set({ error: bError.message, loading: false });
        return;
      }

      const b = businessRes;

      // Parallel fetch for all business data
      const [
        { data: availability },
        { data: services },
        { data: bookings },
        { data: staff },
        { data: reviews },
        { data: proof_items },
        { data: clientData },
        { data: notifSettings },
        { data: smsUsageData },
        { data: scheduledMessages },
        domainsRes,
        blockedTimesRes
      ] = await Promise.all([
        supabase.from('availability').select('*').eq('business_id', b.id),
        supabase.from('services').select('*, addons(*)').eq('business_id', b.id).eq('active', true),
        supabase.from('bookings').select('*, booking_addons(*)').eq('business_id', b.id),
        supabase.from('staff_members').select('*').eq('business_id', b.id),
        supabase.from('reviews').select('*').eq('business_id', b.id),
        supabase.from('proof_items').select('*').eq('business_id', b.id),
        supabase.from('clients').select('*, client_notes(*)').eq('business_id', b.id).eq('is_deleted', false),
        supabase.from('provider_notification_settings').select('*').eq('business_id', b.id).maybeSingle(),
        supabase.from('business_sms_usage').select('*').eq('business_id', b.id).eq('month_year', new Date().toISOString().substring(0, 7)).maybeSingle(),
        supabase.from('scheduled_messages').select('*').eq('business_id', b.id).order('scheduled_for', { ascending: false }).limit(100),
        supabase.from('domains').select('*').eq('business_id', b.id),
        supabase.from('blocked_times').select('*').eq('business_id', b.id)
      ]);

      // Check for individual query errors to prevent silent failures
      if (bError) throw bError;
      
      const mappedDomains: Domain[] = (domainsRes.status === 404 ? [] : (domainsRes.data || [])).map((d: any) => ({
        id: d.id,
        businessId: d.business_id,
        domain: d.domain,
        type: d.type,
        status: d.status,
        isPrimary: d.is_primary,
        sslEnabled: d.ssl_enabled,
        sslStatus: d.ssl_status,
        dnsRecords: d.dns_records,
        verifiedAt: d.verified_at,
        createdAt: d.created_at
      }));

      const mappedBookings: Booking[] = (bookings || []).map((bk) => ({
        id: bk.id,
        customerName: bk.customer_name,
        customerEmail: bk.customer_email,
        customerPhone: bk.customer_phone,
        serviceId: bk.service_id,
        staffId: bk.staff_id,
        client_id: bk.client_id,
        date: bk.date,
        startTime: bk.start_time,
        endTime: bk.end_time,
        status: bk.status,
        paymentStatus: bk.payment_status || 'unpaid',
        paymentMethod: bk.payment_method || 'UNPAID',
        totalAmount: bk.total_amount,
        paidAmount: bk.paid_amount || 0,
        addOns: (bk.booking_addons || []).map((a: { addon_id: string }) => a.addon_id),
        createdAt: bk.created_at,
        notes: bk.notes
      }));

      const mappedClients: Client[] = (clientData || []).map((c: Record<string, unknown>) => ({
         id: c.id as string,
         businessId: c.business_id as string,
         name: c.name as string,
         phone: (c.phone as string) || '',
         email: (c.email as string) || '',
         joinDate: c.join_date as string,
         tags: (c.tags || []) as string[],
         isDeleted: c.is_deleted as boolean,
         createdAt: c.created_at as string,
         notes: ((c.client_notes || []) as Record<string, unknown>[]).map((n) => ({
           id: n.id as string,
           clientId: n.client_id as string,
           staffId: n.staff_id as string,
           text: n.text as string,
           createdAt: n.created_at as string
         }))
      }));

      const mappedBlockedTimes: BlockedTime[] = (blockedTimesRes.status === 404 ? [] : (blockedTimesRes.data || [])).map((b: any) => ({
        id: b.id,
        businessId: b.business_id,
        staffId: b.staff_id,
        date: b.date,
        startTime: b.start_time,
        endTime: b.end_time,
        reason: b.reason,
        createdAt: b.created_at
      }));

      set({ 
        business: {
          ...b,
          logo: b.logo_url,
          coverImage: b.cover_image,
          primaryColor: b.primary_color || '#6B21A8',
          address: b.address || '',
          socials: b.socials || { instagram: '', facebook: '', twitter: '' },
          isPublished: b.is_published || false,
          slug: b.slug || '',
          subdomain: b.subdomain || '',
          customDomain: b.custom_domain || null,
          timezone: b.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          heroTitle: b.hero_title || '',
          heroSubtitle: b.hero_subtitle || '',
          ctaText: b.cta_text || '',
          secondaryCtaText: b.secondary_cta_text || '',
          aboutTitle: b.about_title || '',
          aboutDescription: b.about_description || '',
          aboutImage: b.about_image || null,
          trustSection: b.trust_section || 'none',
          stripeAccountId: b.stripe_account_id,
          stripeConnected: b.stripe_enabled || false,
          stripeOnboardingStatus: b.stripe_onboarding_status || 'not_started',
          stripeChargesEnabled: b.stripe_charges_enabled || false,
          stripePayouts_enabled: b.stripe_payouts_enabled || false,
          stripeDetailsSubmitted: b.stripe_details_submitted || false,
          templateKey: b.template_key || 'editorial_luxe',
          stripeCustomerId: b.stripe_customer_id || null,
          stripeSubscriptionId: b.stripe_subscription_id || null,
          subscriptionStatus: b.subscription_status || 'trialing',
          trialStartDate: b.trial_start_date || null,
          trialEndDate: b.trial_end_date || null,
          planType: normalizePlanType(b.plan_type),
          services: (services || []).map((s: Record<string, unknown>) => ({ ...s, bookingFeeEnabled: s.booking_fee_enabled, bookingFeeAmount: s.booking_fee_amount, addOns: s.addons || [] } as unknown as Service)),
          workingHours: (availability || []).map((h: Record<string, unknown>) => ({ ...h, dayOfWeek: h.day_of_week, startTime: h.start_time, endTime: h.end_time, isOpen: h.is_open } as unknown as WorkingHour)),
          bookings: mappedBookings,
          staff: (staff || []).map((s: Record<string, unknown>) => ({ ...s, inviteToken: s.invite_token, avatarUrl: s.avatar_url, serviceIds: s.service_ids || [] } as unknown as StaffMember)),
          clients: mappedClients,
          notificationSettings: notifSettings ? {
             businessId: notifSettings.business_id,
             confirmationEnabled: notifSettings.confirmation_enabled,
             reminderEnabled: notifSettings.reminder_enabled,
             followupEnabled: notifSettings.followup_enabled,
             reminderLeadTimeHours: notifSettings.reminder_lead_time_hours,
             smsConfirmTemplate: notifSettings.sms_confirm_template,
             emailConfirmTemplate: notifSettings.email_confirm_template,
             smsReminderTemplate: notifSettings.sms_reminder_template,
             emailReminderTemplate: notifSettings.email_reminder_template,
             emailFollowupTemplate: notifSettings.email_followup_template
          } : undefined,
          smsUsage: {
             count: smsUsageData?.count || 0,
             limit: getSmsLimitForPlan(b.plan_type)
          },
          scheduledMessages: (scheduledMessages || []).map((m: any) => ({
             ...m,
             bookingId: m.booking_id,
             clientId: m.client_id,
             businessId: m.business_id,
             scheduledFor: m.scheduled_for,
             sentAt: m.sent_at,
             failureReason: m.failure_reason,
             templateSnapshot: m.template_snapshot,
             twilioSid: m.twilio_sid,
             sendgridId: m.sendgrid_id
          })),
          reviews: reviews || [],
          proofOfWork: proof_items || [],
          domains: mappedDomains,
          themeMode: b.theme_mode || 'light',
          hiddenSections: b.hidden_sections || [],
          faqs: b.faqs || [],
          beforeAfterImages: b.before_after_images || [],
          blockedTimes: mappedBlockedTimes
        } 
      });
    } catch (err) {
      const error = err as Error;
      console.error('Fetch business error:', error);
      set({ error: error.message });
      
      const count = retryCount || 0;
      if (count < 1) {
        setTimeout(() => get().fetchBusiness(count + 1), 2000);
      }
    } finally {
      set({ loading: false });
    }
  },

  updateBusiness: async (updates, immediate = false) => {
    const { business, user } = get();
    if (!business || !user) return;
    set({ editorSaveStatus: 'saving', editorSaveError: null });

    const shouldEnsureDomain = Boolean(
      updates.isPublished === true || (business.isPublished && updates.name && updates.name.length >= 3)
    );
    let ensuredSubdomain: string | null = null;

    if (shouldEnsureDomain) {
      try {
        ensuredSubdomain = await ensureBusinessDomain(
          business.id,
          updates.name || business.name || 'business',
          business.subdomain,
          isDefaultSubdomain(business.subdomain)
        );
      } catch (err) {
        console.error('Domain generation failed:', err);
        set({ error: 'Could not generate a domain for this business.', editorSaveStatus: 'error', editorSaveError: 'Could not generate a domain for this business.' });
        if (updates.isPublished === true) return;
      }
    }

    // 1. Auto-generate subdomain from name if it's currently a default biz-ID
    const nextUpdates = { ...updates };
    if (ensuredSubdomain) {
      nextUpdates.subdomain = ensuredSubdomain;
      nextUpdates.slug = ensuredSubdomain;
    } else if (updates.name && updates.name.length >= 3 && isDefaultSubdomain(business.subdomain)) {
      const slugified = generateSubdomain(updates.name, business.id);
      if (slugified) {
        nextUpdates.subdomain = slugified;
        nextUpdates.slug = slugified;
      }
    }

    // 1. Update local state IMMEDIATELY (no await, no network)
    set((state) => ({
      business: state.business ? { ...state.business, ...nextUpdates } : null
    }));

    // 2. Prepare DB updates
    const dbUpdates: Record<string, unknown> = {};
    if ('name' in updates && updates.name) {
      dbUpdates.name = updates.name;
      if (ensuredSubdomain) {
        dbUpdates.subdomain = ensuredSubdomain;
        dbUpdates.slug = ensuredSubdomain;
      } else if (business.isPublished && isDefaultSubdomain(business.subdomain)) {
        const slugified = generateSubdomain(updates.name, business.id);
        if (slugified && slugified.length >= 3) {
          dbUpdates.subdomain = slugified;
          dbUpdates.slug = slugified;
        }
      }
    }
    if ('email' in updates) dbUpdates.email = updates.email;
    if ('phone' in updates) dbUpdates.phone = updates.phone;
    if ('category' in updates) dbUpdates.category = updates.category;
    if ('subdomain' in updates && updates.subdomain) {
      const slugified = slugifyDomainLabel(updates.subdomain);
      dbUpdates.subdomain = slugified;
      dbUpdates.slug = slugified;
    }
    if ('logo' in updates) {
      dbUpdates.logo = updates.logo;
      dbUpdates.logo_url = updates.logo;
    }
    if ('isPublished' in updates) dbUpdates.is_published = updates.isPublished;
    if ('slug' in updates) dbUpdates.slug = updates.slug;
    if ('timezone' in updates) dbUpdates.timezone = updates.timezone;
    if ('heroTitle' in updates) dbUpdates.hero_title = updates.heroTitle;
    if ('heroSubtitle' in updates) dbUpdates.hero_subtitle = updates.heroSubtitle;
    if ('ctaText' in updates) dbUpdates.cta_text = updates.ctaText;
    if ('secondaryCtaText' in updates) dbUpdates.secondary_cta_text = updates.secondaryCtaText;
    if ('aboutTitle' in updates) dbUpdates.about_title = updates.aboutTitle;
    if ('aboutDescription' in updates) dbUpdates.about_description = updates.aboutDescription;
    if ('aboutImage' in updates) dbUpdates.about_image = updates.aboutImage;
    if ('templateKey' in updates) dbUpdates.template_key = updates.templateKey;
    if ('primaryColor' in updates) dbUpdates.primary_color = updates.primaryColor;
    if ('address' in updates) dbUpdates.address = updates.address;

    // Handle immediate save
    if (immediate) {
      if ((window as any).__skeduley_save_timer) {
        clearTimeout((window as any).__skeduley_save_timer);
      }
      try {
        const { error } = await supabase.from('businesses').update(dbUpdates).eq('id', business.id);
        if (error) throw error;
        set({ editorSaveStatus: 'saved', editorSaveError: null });
      } catch (err) {
        console.error('Immediate save failed:', err);
        const message = (err as Error).message || 'Save failed.';
        set({ editorSaveStatus: 'error', editorSaveError: message, error: message });
        get().fetchBusiness(0);
      }
      return;
    }

    // Debounce the DB persist
    if ((window as unknown as { __skeduley_save_timer: ReturnType<typeof setTimeout> }).__skeduley_save_timer) {
      clearTimeout((window as unknown as { __skeduley_save_timer: ReturnType<typeof setTimeout> }).__skeduley_save_timer);
    }

    (window as unknown as { __skeduley_save_timer: ReturnType<typeof setTimeout> }).__skeduley_save_timer = setTimeout(async () => {
      const latestBusiness = get().business;
      if (!latestBusiness) return;

      try {
        // Map frontend camelCase to Postgres snake_case
        const dbUpdates: Record<string, unknown> = {};
        
        // Only persist the fields that were in the original update
        if ('name' in updates && updates.name) {
          dbUpdates.name = updates.name;
          // Auto-update subdomain in DB if current is default
          if (ensuredSubdomain) {
            dbUpdates.subdomain = ensuredSubdomain;
            dbUpdates.slug = ensuredSubdomain;
          } else if (latestBusiness.isPublished && isDefaultSubdomain(latestBusiness.subdomain)) {
            const slugified = generateSubdomain(updates.name, latestBusiness.id);
            if (slugified && slugified.length >= 3) {
              dbUpdates.subdomain = slugified;
              dbUpdates.slug = slugified;
            }
          }
        }
        if ('email' in updates) dbUpdates.email = updates.email;
        if ('phone' in updates) dbUpdates.phone = updates.phone;
        if ('category' in updates) dbUpdates.category = updates.category;
        if ('subdomain' in updates && updates.subdomain) {
          const slugified = slugifyDomainLabel(updates.subdomain);
          dbUpdates.subdomain = slugified;
          dbUpdates.slug = slugified; // Sync slug with subdomain for now
        }
        if ('logo' in updates) {
          dbUpdates.logo = updates.logo;
          dbUpdates.logo_url = updates.logo;
        }
        if ('isPublished' in updates) dbUpdates.is_published = updates.isPublished;
        if ('slug' in updates) dbUpdates.slug = updates.slug;
        if ('timezone' in updates) dbUpdates.timezone = updates.timezone;
        if ('heroTitle' in updates) dbUpdates.hero_title = updates.heroTitle;
        if ('heroSubtitle' in updates) dbUpdates.hero_subtitle = updates.heroSubtitle;
        if ('ctaText' in updates) dbUpdates.cta_text = updates.ctaText;
        if ('secondaryCtaText' in updates) dbUpdates.secondary_cta_text = updates.secondaryCtaText;
        if ('aboutTitle' in updates) dbUpdates.about_title = updates.aboutTitle;
        if ('aboutDescription' in updates) dbUpdates.about_description = updates.aboutDescription;
        if ('aboutImage' in updates) dbUpdates.about_image = updates.aboutImage;
        if ('trustSection' in updates) dbUpdates.trust_section = updates.trustSection;
        if ('coverImage' in updates) dbUpdates.cover_image = updates.coverImage;
        if ('primaryColor' in updates) dbUpdates.primary_color = updates.primaryColor;
        if ('templateKey' in updates) dbUpdates.template_key = updates.templateKey;
        if ('address' in updates) dbUpdates.address = updates.address;
        if ('socials' in updates) dbUpdates.socials = updates.socials;
        if ('themeMode' in updates) dbUpdates.theme_mode = updates.themeMode;
        if ('hiddenSections' in updates) dbUpdates.hidden_sections = updates.hiddenSections;
        if ('faqs' in updates) dbUpdates.faqs = updates.faqs;
        if ('beforeAfterImages' in updates) dbUpdates.before_after_images = updates.beforeAfterImages;

        // Handle workingHours sync: Delete existing and re-insert all for this business
        if ('workingHours' in updates && updates.workingHours) {
          await supabase
            .from('availability')
            .delete()
            .eq('business_id', latestBusiness.id);

          const { error: aError } = await supabase
            .from('availability')
            .insert(
              updates.workingHours.map((h) => ({
                business_id: latestBusiness.id,
                day_of_week: h.dayOfWeek,
                start_time: h.startTime,
                end_time: h.endTime,
                is_open: h.isOpen
              }))
            );
          if (aError) console.error('Availability sync error:', aError);
          if (aError) throw aError;
        }

        if (Object.keys(dbUpdates).length > 0) {
          const { error } = await supabase
            .from('businesses')
            .update(dbUpdates)
            .eq('id', latestBusiness.id);

          if (error) {
            console.error('Business update error:', error);
            if (error.code === '23505') {
               alert('That subdomain or slug is already taken by another business. Reverting your changes.');
               get().fetchBusiness(0);
            }
            throw error;
          }
        }
        set({ editorSaveStatus: 'saved', editorSaveError: null });
      } catch (err) {
        const message = (err as Error).message || 'Save failed.';
        console.error('Save error:', message);
        set({ editorSaveStatus: 'error', editorSaveError: message, error: message });
      }
    }, 800);
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, business: null, onboardingStep: 1 });
  },

  addReview: async (review) => {
    const { business } = get();
    if (!business) return;

    const tempId = `temp-${Date.now()}`;
    const newReview: Review = { 
      id: tempId, 
      author_name: review.author_name,
      rating: review.rating,
      content: review.content,
      created_at: new Date().toISOString()
    };
    
    set({ business: { ...business, reviews: [newReview, ...(business.reviews || [])] } });

    const { data, error } = await supabase.from('reviews').insert([{ 
      author_name: review.author_name,
      rating: review.rating,
      content: review.content,
      business_id: business.id 
    }]).select().single();
    
    if (!error && data) {
      set(state => ({
        business: state.business ? { ...state.business, reviews: state.business.reviews?.map(r => r.id === tempId ? data as Review : r) } : null
      }));
    } else get().fetchBusiness();
  },

  deleteReview: async (id) => {
    const { business } = get();
    if (!business) return;

    set({ business: { ...business, reviews: business.reviews?.filter(r => r.id !== id) } });

    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) get().fetchBusiness();
  },

  addProofItem: async (item) => {
    const { business } = get();
    if (!business) return;

    const tempId = `temp-${Date.now()}`;
    const newItem: ProofItem = { 
      id: tempId, 
      image_url: item.image_url, 
      title: item.caption,
      created_at: new Date().toISOString()
    };
    
    set({ business: { ...business, proofOfWork: [newItem, ...(business.proofOfWork || [])] } });

    const { data, error } = await supabase.from('proof_items').insert([{ 
      image_url: item.image_url,
      title: item.caption,
      business_id: business.id 
    }]).select().single();
    
    if (!error && data) {
      set(state => ({
        business: state.business ? { ...state.business, proofOfWork: state.business.proofOfWork?.map(p => p.id === tempId ? data as ProofItem : p) } : null
      }));
    } else get().fetchBusiness();
  },

  deleteProofItem: async (id) => {
    const { business } = get();
    if (!business) return;

    set({ business: { ...business, proofOfWork: business.proofOfWork?.filter(p => p.id !== id) } });

    const { error } = await supabase.from('proof_items').delete().eq('id', id);
    if (error) get().fetchBusiness();
  },

  addService: async (service) => {
    const { business } = get();
    if (!business) return;

    try {
      const { data: sData, error: sError } = await supabase.from('services').insert([{
        business_id: business.id,
        name: service.name || 'New Service',
        description: service.description || '',
        price: service.price || 0,
        duration: service.duration || 60,
        booking_fee_enabled: service.bookingFeeEnabled || false,
        booking_fee_amount: service.bookingFeeAmount || 0,
        active: true
      }]).select().single();

      if (sError) throw sError;

      let newAddOns: AddOn[] = [];
      if (service.addOns && service.addOns.length > 0) {
        const { data: aData, error: aError } = await supabase.from('addons').insert(
          service.addOns.map((a) => ({
            service_id: sData.id,
            name: a.name,
            price: a.price,
            duration: a.duration || 0,
            active: true
          }))
        ).select();
        
        if (aError) console.error('Addons save error:', aError);
        if (aData) newAddOns = aData;
      }
      
      const newService: Service = {
        ...sData,
        bookingFeeEnabled: sData.booking_fee_enabled,
        bookingFeeAmount: sData.booking_fee_amount,
        addOns: newAddOns,
        active: sData.active
      };

      set({ 
        business: { 
          ...business, 
          services: [...(business.services || []), newService] 
        } 
      });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  updateService: async (id, service) => {
    set(state => ({
      business: state.business ? {
        ...state.business,
        services: state.business.services.map(s => s.id === id ? { ...s, ...service } : s)
      } : null
    }));

    if ((window as unknown as Record<string, ReturnType<typeof setTimeout>>)[`__skeduley_timer_svc_${id}`]) {
      clearTimeout((window as unknown as Record<string, ReturnType<typeof setTimeout>>)[`__skeduley_timer_svc_${id}`]);
    }

    (window as unknown as Record<string, ReturnType<typeof setTimeout>>)[`__skeduley_timer_svc_${id}`] = setTimeout(async () => {
      try {
        await supabase.from('services').update({
          name: service.name,
          description: service.description,
          price: service.price,
          duration: service.duration,
          booking_fee_enabled: service.bookingFeeEnabled,
          booking_fee_amount: service.bookingFeeAmount,
          active: service.active
        }).eq('id', id);

        await supabase.from('addons').delete().eq('service_id', id);
        if ((service.addOns?.length ?? 0) > 0) {
          await supabase.from('addons').insert(
            (service.addOns ?? []).map((a) => ({
              service_id: id,
              name: a.name,
              price: a.price,
              duration: a.duration || 0,
              active: true
            }))
          );
        }
      } catch(e) {
        console.error('Save error', e);
      }
    }, 800);
  },

  deleteService: async (id) => {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (!error) get().fetchBusiness();
  },

  fetchPublicBusiness: async (identifier: string) => {
    if (!identifier) {
      set({ error: 'Invalid business identifier', loading: false });
      return;
    }

    set({ loading: true, error: null });
    try {
      const cleanId = normalizeDomainIdentifier(identifier);
      const lookupCandidates = getDomainLookupCandidates(cleanId);

      const { data: activeDomains, error: domainError } = await supabase
        .from('domains')
        .select('business_id')
        .in('domain', lookupCandidates)
        .eq('status', 'active')
        .order('is_primary', { ascending: false })
        .limit(1);

      if (domainError) {
        console.warn('[fetchPublicBusiness] Domain lookup failed:', domainError);
      }

      const activeDomain = activeDomains?.[0] || null;

      const createPublishedBusinessQuery = () => supabase
          .from('businesses')
          .select('*')
          .eq('is_published', true);

      let business = null;
      let error = null;

      if (activeDomain) {
        const domainBusinessRes = await createPublishedBusinessQuery().eq('id', activeDomain.business_id).maybeSingle();
        business = domainBusinessRes.data;
        error = domainBusinessRes.error;
      }

      if (!business && !error) {
        const fallbackFilter = lookupCandidates
          .flatMap((candidate) => [
            `subdomain.eq.${candidate}`,
            `slug.eq.${candidate}`
          ])
          .join(',');
        const fallbackRes = await createPublishedBusinessQuery().or(fallbackFilter).maybeSingle();
        business = fallbackRes.data;
        error = fallbackRes.error;
      }

      if (error) {
        console.error('[fetchPublicBusiness] Supabase query error:', error);
        throw new Error(error.message);
      }

      if (!business) {
        console.warn(`[fetchPublicBusiness] No published business found for identifier: "${cleanId}"`, lookupCandidates);
        throw new Error('Business not found');
      }

      const [servicesRes, availabilityRes, reviewsRes, proofRes, staffRes] = await Promise.all([
        supabase.from('services').select('*, addons(*)').eq('business_id', business.id).eq('active', true),
        supabase.from('availability').select('*').eq('business_id', business.id),
        supabase.from('reviews').select('*').eq('business_id', business.id),
        supabase.from('proof_items').select('*').eq('business_id', business.id),
        supabase.from('staff_members').select('*, staff_availability(*), staff_services(*)').eq('business_id', business.id).eq('status', 'active')
      ]);

      const mappedServices = (servicesRes.data || []).map((s) => ({
        ...s,
        bookingFeeEnabled: s.booking_fee_enabled,
        bookingFeeAmount: s.booking_fee_amount,
        addOns: s.addons || []
      }));

      const businessSubdomain = business.subdomain || generateSubdomain(business.name || '', business.id);
      const businessSlug = business.slug || businessSubdomain;

      // Resolve logo: support both old 'logo' text column and new 'logo_url'
      const logoResolved = business.logo_url || business.logo || null;

      set({
        business: {
          id: business.id,
          name: business.name || '',
          category: business.category || '',
          email: business.email || '',
          phone: business.phone || '',
          subdomain: businessSubdomain || '',
          slug: businessSlug,
          // Logo: support both old and new column names
          logo: logoResolved,
          logoUrl: logoResolved,
          coverImage: business.cover_image || null,
          primaryColor: business.primary_color || '#6B21A8',
          heroTitle: business.hero_title || '',
          heroSubtitle: business.hero_subtitle || '',
          ctaText: business.cta_text || 'Book Now',
          secondaryCtaText: business.secondary_cta_text || '',
          aboutTitle: business.about_title || '',
          aboutDescription: business.about_description || '',
          aboutImage: business.about_image || null,
          address: business.address || '',
          socials: business.socials || { instagram: '', facebook: '', twitter: '' },
          trustSection: business.trust_section || 'none',
          isPublished: business.is_published || false,
          customDomain: business.custom_domain || null,
          timezone: business.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          templateKey: business.template_key || 'beauty_editorial_luxe',
          // Stripe fields
          stripeAccountId: business.stripe_account_id || null,
          stripeConnected: business.stripe_enabled || false,
          stripeOnboardingStatus: business.stripe_onboarding_status || 'not_started',
          stripeChargesEnabled: business.stripe_charges_enabled || false,
          stripePayouts_enabled: business.stripe_payouts_enabled || false,
          stripeDetailsSubmitted: business.stripe_details_submitted || false,
          stripeCustomerId: business.stripe_customer_id || null,
          stripeSubscriptionId: business.stripe_subscription_id || null,
          // Subscription / trial
          subscriptionStatus: business.subscription_status || 'trialing',
          trialStartDate: business.trial_start_date || null,
          trialEndDate: business.trial_end_date || null,
          planType: normalizePlanType(business.plan_type),
          // Relations
          services: mappedServices,
          workingHours: (availabilityRes.data || []).map((h) => ({
            ...h,
            dayOfWeek: h.day_of_week,
            startTime: h.start_time,
            endTime: h.end_time,
            isOpen: h.is_open
          })),
          bookings: [],
          staff: (staffRes.data || []).map((s: Record<string, unknown>) => ({
            id: s.id as string,
            businessId: s.business_id as string,
            userId: s.user_id as string | null,
            name: s.name as string,
            email: s.email as string,
            phone: s.phone as string | null,
            role: s.role as 'admin' | 'manager' | 'staff',
            status: s.status as 'invited' | 'active' | 'inactive',
            inviteToken: null,
            avatarUrl: s.avatar_url as string | null,
            createdAt: s.created_at as string,
            availability: ((s.staff_availability as Record<string, unknown>[]) || []).map((a: Record<string, unknown>) => ({
              dayOfWeek: a.day_of_week as number,
              startTime: a.start_time as string,
              endTime: a.end_time as string,
              isOpen: a.is_open as boolean
            })),
            serviceIds: ((s.staff_services as Record<string, unknown>[]) || []).map((ss: Record<string, unknown>) => ss.service_id as string)
          })),
          clients: [],
          reviews: reviewsRes.data || [],
          proofOfWork: proofRes.data || [],
          domains: [],
          themeMode: business.theme_mode || 'light',
          hiddenSections: business.hidden_sections || [],
          faqs: business.faqs || [],
          beforeAfterImages: business.before_after_images || [],
          blockedTimes: [],
        }
      });
    } catch (err) {
      console.error('[fetchPublicBusiness] Error:', (err as Error).message);
      set({ error: (err as Error).message });
    } finally {
      set({ loading: false });
    }
  },

    detectLocation: async () => {
      // Check if we already detected or set manually to avoid rate limiting
      if (localStorage.getItem('skeduley_geo_detected')) return;

      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        if (data.country_code === 'CA') {
          set({ isCanada: true, currency: 'CAD' });
          console.log('[AppStore] Canada detected. Switching to CAD pricing.');
        } else {
          set({ isCanada: false, currency: 'USD' });
        }
        localStorage.setItem('skeduley_geo_detected', 'true');
      } catch (err) {
        console.warn('[AppStore] Geolocation failed (Rate limited or CORS). Defaulting to USD.');
        set({ isCanada: false, currency: 'USD' });
      }
    },

    // ==========================================
    // STAFF MANAGEMENT ACTIONS
    // ==========================================

    fetchStaff: async () => {
      const { business } = get();
      if (!business) return;

      const { data: staffData } = await supabase
        .from('staff_members')
        .select('*, staff_availability(*), staff_services(*)')
        .eq('business_id', business.id);

      const mappedStaff: StaffMember[] = (staffData || []).map((s: Record<string, unknown>) => ({
        id: s.id as string,
        businessId: s.business_id as string,
        userId: s.user_id as string | null,
        name: s.name as string,
        email: s.email as string,
        phone: s.phone as string | null,
        role: s.role as 'admin' | 'manager' | 'staff',
        status: s.status as 'invited' | 'active' | 'inactive',
        inviteToken: s.invite_token as string | null,
        avatarUrl: s.avatar_url as string | null,
        createdAt: s.created_at as string,
        availability: ((s.staff_availability as Record<string, unknown>[]) || []).map((a: Record<string, unknown>) => ({
          dayOfWeek: a.day_of_week as number,
          startTime: a.start_time as string,
          endTime: a.end_time as string,
          isOpen: a.is_open as boolean
        })),
        serviceIds: ((s.staff_services as Record<string, unknown>[]) || []).map((ss: Record<string, unknown>) => ss.service_id as string)
      }));

      set({ business: { ...business, staff: mappedStaff } });
    },

    addStaff: async (data) => {
      const { business } = get();
      if (!business) return null;

      try {
        const { data: newStaff, error } = await supabase
          .from('staff_members')
          .insert([{
            business_id: business.id,
            name: data.name,
            email: data.email,
            phone: data.phone || null,
            role: data.role
          }])
          .select()
          .single();

        if (error) throw error;

        // Assign services
        if (data.serviceIds.length > 0) {
          await supabase.from('staff_services').insert(
            data.serviceIds.map(serviceId => ({
              staff_id: newStaff.id,
              service_id: serviceId
            }))
          );
        }

        const staffMember: StaffMember = {
          id: newStaff.id,
          businessId: newStaff.business_id,
          userId: newStaff.user_id,
          name: newStaff.name,
          email: newStaff.email,
          phone: newStaff.phone,
          role: newStaff.role,
          status: newStaff.status,
          inviteToken: newStaff.invite_token,
          avatarUrl: newStaff.avatar_url,
          createdAt: newStaff.created_at,
          availability: [],
          serviceIds: data.serviceIds
        };

        // Send invite email
        const inviteUrl = `${window.location.origin}/invite/${newStaff.invite_token}`;
        supabase.functions.invoke('send-email', {
          body: {
            to: data.email,
            template: 'staff_invite',
            data: { 
              businessName: business.name,
              inviteUrl 
            }
          }
        }).catch(console.error);

        set({ business: { 
          ...business, 
          staff: [...(business.staff || []), staffMember] 
        }});
        return staffMember;
      } catch (err) {
        set({ error: (err as Error).message });
        return null;
      }
    },

    updateStaff: async (id, updates) => {
      const { business } = get();
      if (!business) return;

      // Optimistic update
      set({
        business: {
          ...business,
          staff: business.staff.map(s => s.id === id ? { ...s, ...updates } : s)
        }
      });

      try {
        const dbUpdates: Record<string, unknown> = {};
        if ('name' in updates) dbUpdates.name = updates.name;
        if ('email' in updates) dbUpdates.email = updates.email;
        if ('phone' in updates) dbUpdates.phone = updates.phone;
        if ('role' in updates) dbUpdates.role = updates.role;
        if ('status' in updates) dbUpdates.status = updates.status;

        if (Object.keys(dbUpdates).length > 0) {
          const { error } = await supabase
            .from('staff_members')
            .update(dbUpdates)
            .eq('id', id);
          if (error) throw error;
        }
      } catch (err) {
        set({ error: (err as Error).message });
        get().fetchStaff();
      }
    },

    removeStaff: async (id) => {
      const { business } = get();
      if (!business) return;

      const upcomingBookings = (business.bookings || []).filter(b => b.staffId === id && (b.status === 'confirmed' || b.status === 'pending') && new Date(`${b.date}T${b.startTime}`) > new Date());

      // Re-assign upcoming bookings to unassigned (null)
      if (upcomingBookings.length > 0) {
        for (const booking of upcomingBookings) {
          await supabase.from('bookings').update({ staff_id: null }).eq('id', booking.id);
          
          const service = business.services.find(s => s.id === booking.serviceId);
          supabase.functions.invoke('send-email', {
            body: {
              to: booking.customerEmail,
              template: 'reassignment',
              data: {
                businessName: business.name,
                clientName: booking.customerName.split(' ')[0],
                serviceName: service?.name || 'your appointment',
                timeStr: `${new Date(booking.date).toLocaleDateString()} at ${booking.startTime}`
              }
            }
          }).catch(console.error);
        }
      }

      // Optimistic removal
      set({
        business: {
          ...business,
          staff: business.staff.filter(s => s.id !== id),
          bookings: business.bookings.map(b => upcomingBookings.some(ub => ub.id === b.id) ? { ...b, staffId: undefined } : b)
        }
      });

      const { error } = await supabase.from('staff_members').delete().eq('id', id);
      if (error) {
        set({ error: error.message });
        get().fetchStaff();
      }
    },

    updateStaffAvailability: async (staffId, hours) => {
      const { business } = get();
      if (!business) return;

      // Optimistic update
      set({
        business: {
          ...business,
          staff: business.staff.map(s => s.id === staffId ? { ...s, availability: hours } : s)
        }
      });

      try {
        // Delete existing, re-insert
        await supabase.from('staff_availability').delete().eq('staff_id', staffId);

        const openHours = hours.filter(h => h.isOpen);
        if (openHours.length > 0) {
          const { error } = await supabase.from('staff_availability').insert(
            openHours.map(h => ({
              staff_id: staffId,
              day_of_week: h.dayOfWeek,
              start_time: h.startTime,
              end_time: h.endTime,
              is_open: h.isOpen
            }))
          );
          if (error) throw error;
        }
      } catch (err) {
        set({ error: (err as Error).message });
        get().fetchStaff();
      }
    },

    assignServicesToStaff: async (staffId, serviceIds) => {
      const { business } = get();
      if (!business) return;

      // Optimistic update
      set({
        business: {
          ...business,
          staff: business.staff.map(s => s.id === staffId ? { ...s, serviceIds } : s)
        }
      });

      try {
        // Delete existing, re-insert
        await supabase.from('staff_services').delete().eq('staff_id', staffId);

        if (serviceIds.length > 0) {
          const { error } = await supabase.from('staff_services').insert(
            serviceIds.map(serviceId => ({
              staff_id: staffId,
              service_id: serviceId
            }))
          );
          if (error) throw error;
        }
      } catch (err) {
        set({ error: (err as Error).message });
        get().fetchStaff();
      }
    },

    acceptStaffInvite: async (token: string) => {
      const { user } = get();
      if (!user) return null;

      try {
        // Find staff member by invite token
        const { data: staffRecord, error: findError } = await supabase
          .from('staff_members')
          .select('*')
          .eq('invite_token', token)
          .single();

        if (findError || !staffRecord) throw new Error('Invalid or expired invite link');

        // Link user and activate
        const { error: updateError } = await supabase
          .from('staff_members')
          .update({
            user_id: user.id,
            status: 'active',
            invite_token: null
          })
          .eq('id', staffRecord.id);

        if (updateError) throw updateError;

        const staffMember: StaffMember = {
          id: staffRecord.id,
          businessId: staffRecord.business_id,
          userId: user.id,
          name: staffRecord.name,
          email: staffRecord.email,
          phone: staffRecord.phone,
          role: staffRecord.role,
          status: 'active',
          inviteToken: null,
          avatarUrl: staffRecord.avatar_url,
          createdAt: staffRecord.created_at,
          availability: [],
          serviceIds: []
        };

        set({ staffRole: staffRecord.role, staffId: staffRecord.id });
        return staffMember;
      } catch (err) {
        set({ error: (err as Error).message });
        return null;
      }
    },

    exportClientsCSV: () => {
      const { business } = get();
      if (!business || !business.clients) return;
      const headers = ['Name', 'Email', 'Phone', 'Total Bookings', 'Total Spent', 'Join Date'];
      const rows = business.clients.map(c => [
        c.name,
        c.email,
        c.phone || '',
        c.totalBookings.toString(),
        c.totalSpent.toString(),
        new Date(c.joinDate).toLocaleDateString()
      ]);
      const csvContent = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${business.name.replace(/\s+/g, '_')}_Clients.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    deleteClient: async (id: string) => {
      const { business } = get();
      if (!business) return;
      set({
        business: {
          ...business,
          clients: business.clients.filter(c => c.id !== id)
        }
      });
      const { error } = await supabase.from('clients').update({ is_deleted: true }).eq('id', id);
      if (error) {
        set({ error: error.message });
        get().fetchClients();
      }
    },

    createBooking: async (data: {
      serviceId: string;
      addOnIds: string[];
      date: string;
      time: string;
      customerName: string;
      customerEmail: string;
      customerPhone?: string;
      notes?: string;
      totalPrice: number;
      depositDue: number;
      staffId?: string;
    }) => {
    const { business } = get();
    if (!business) throw new Error('Business not found');

    // 1. Auto-CRM Logic: Match/Create Client
    let clientId = null;
    if (data.customerEmail || data.customerPhone) {
      try {
        const { data: rpcClientId, error: rpcError } = await supabase.rpc('skeduley_upsert_booking_client', {
          p_business_id: business.id,
          p_name: data.customerName,
          p_email: data.customerEmail?.trim() || null,
          p_phone: data.customerPhone || null
        });

        if (!rpcError && rpcClientId) {
          clientId = rpcClientId;
        } else if (rpcError) {
          console.warn('Auto-CRM RPC failed:', rpcError);
        }
      } catch (crmErr) {
        console.warn('Auto-CRM match failed:', crmErr);
        // Continue booking even if CRM fails
      }
    }

    const service = business.services.find(s => s.id === data.serviceId);
    if (!service) throw new Error('Service not found');

    // Parse 12-hour time "02:15 PM" into 24-hour minutes
    const timeMatch = data.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    let startMinutes = 0;
    
    if (timeMatch) {
       let h = parseInt(timeMatch[1], 10);
       const m = parseInt(timeMatch[2], 10);
       const period = timeMatch[3].toUpperCase();
       
       if (period === 'PM' && h < 12) h += 12;
       if (period === 'AM' && h === 12) h = 0;
       
       startMinutes = h * 60 + m;
    } else {
       // Fallback for 24h
       const [h, m] = data.time.split(':').map(Number);
       startMinutes = h * 60 + m;
    }

    const startH = Math.floor(startMinutes / 60) % 24;
    const startM = startMinutes % 60;
    const startTime24 = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}:00`;

    // Calculate end time using service + addon durations
    let totalDuration = service.duration;
    if (data.addOnIds && data.addOnIds.length > 0) {
      data.addOnIds.forEach((id: string) => {
        const addon = service.addOns.find((a) => a.id === id);
        if (addon) totalDuration += addon.duration;
      });
    }

    const endMinutes = startMinutes + totalDuration;
    const endH = Math.floor(endMinutes / 60) % 24;
    const endM = endMinutes % 60;
    const endTime24 = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}:00`;

    const { data: bData, error: bError } = await supabase
      .from('bookings')
      .insert([{
        business_id: business.id,
        service_id: data.serviceId,
        staff_id: data.staffId || null,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone,
        date: data.date,
        start_time: startTime24,
        end_time: endTime24,
        timezone: business.timezone,
        total_amount: data.totalPrice,
        paid_amount: data.depositDue || 0,
        payment_status: data.depositDue > 0 ? 'pending' : 'unpaid',
        status: data.depositDue > 0 ? 'pending' : 'confirmed',
        notes: data.notes,
        client_id: clientId
      }])
      .select()
      .single();

    if (bError) throw bError;

    if (data.addOnIds?.length > 0) {
      await supabase.from('booking_addons').insert(
        data.addOnIds.map((id: string) => ({
          booking_id: bData.id,
          addon_id: id
        }))
      );
    }

    // Schedule reminders
    await get().scheduleMessages(bData.id);

    return bData;
  },

  // ==========================================
  // CRM ACTIONS
  // ==========================================

  fetchClients: async () => {
    const { business } = get();
    if (!business) return;

    const { data: clientData, error } = await supabase
      .from('clients')
      .select('*, client_notes(*)')
      .eq('business_id', business.id)
      .eq('is_deleted', false);

    if (error) {
      set({ error: error.message });
      return;
    }

    const mappedClients: Client[] = (clientData || []).map((c: any) => ({
      id: c.id,
      businessId: c.business_id,
      name: c.name,
      phone: c.phone,
      email: c.email,
      joinDate: c.join_date,
      tags: c.tags || [],
      isDeleted: c.is_deleted,
      createdAt: c.created_at,
      notes: (c.client_notes || []).map((n: any) => ({
        id: n.id,
        clientId: n.client_id,
        staffId: n.staff_id,
        text: n.text,
        createdAt: n.created_at
      }))
    }));

    set({ business: { ...business, clients: mappedClients } });
  },

  updateClient: async (id, updates) => {
    const { business } = get();
    if (!business) return;

    const { error } = await supabase
      .from('clients')
      .update({
        name: updates.name,
        email: updates.email,
        phone: updates.phone,
        tags: updates.tags,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (!error) get().fetchClients();
  },

  deleteClient: async (id) => {
    const { business } = get();
    if (!business) return;

    // Soft delete
    const { error } = await supabase
      .from('clients')
      .update({ is_deleted: true, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (!error) get().fetchClients();
  },

  addClientNote: async (clientId, text) => {
    const { business, staffId } = get();
    if (!business) return;

    const { error } = await supabase
      .from('client_notes')
      .insert([{
        client_id: clientId,
        text,
        staff_id: staffId || null
      }]);

    if (!error) get().fetchClients();
  },

  updateClientNote: async (id, text) => {
    const { error } = await supabase
      .from('client_notes')
      .update({ text, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (!error) get().fetchClients();
  },

  deleteClientNote: async (id) => {
    const { error } = await supabase
      .from('client_notes')
      .delete()
      .eq('id', id);

    if (!error) get().fetchClients();
  },


  createCheckoutSession: async (bookingId: string) => {
    const { business } = get();
    if (!business) return null;

    const bookingUrl = getBusinessUrl(business.subdomain, business.customDomain);
    const successUrl = getBookingConfirmationUrl(bookingUrl, { bookingId, sessionId: '{CHECKOUT_SESSION_ID}' });
    const cancelUrl = getBookingConfirmationUrl(bookingUrl, { bookingId, cancelled: true });

    const { data, error } = await supabase.functions.invoke('booking-checkout', {
      body: { 
        bookingId, 
        businessId: business.id,
        successUrl,
        cancelUrl
      }
    });

    if (error) throw error;
    return data.url;
  },

  updateBookingStatus: async (id, status) => {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (!error) {
      if (status === 'cancelled') {
        await supabase
          .from('scheduled_messages')
          .update({ status: 'SKIPPED', failure_reason: 'Booking cancelled' })
          .eq('booking_id', id)
          .eq('status', 'QUEUED');
      }
      get().fetchBusiness();
    }
  },

  refundBooking: async (bookingId: string) => {
    set({ error: null });
    try {
      const { error } = await supabase.functions.invoke('booking-refund', {
        body: { bookingId },
      });

      if (error) throw error;

      // Update local state
      set(state => ({
        business: state.business ? {
          ...state.business,
          bookings: state.business.bookings.map(b =>
            b.id === bookingId ? { ...b, paymentStatus: 'refunded', status: 'cancelled' } : b
          )
        } : null
      }));
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },

  updateReview: async (id, updates) => {
    set(state => ({
      business: state.business ? {
        ...state.business,
        reviews: state.business.reviews.map(r => r.id === id ? { ...r, ...updates } : r)
      } : null
    }));

    if ((window as unknown as Record<string, ReturnType<typeof setTimeout>>)[`__skeduley_timer_rev_${id}`]) {
      clearTimeout((window as unknown as Record<string, ReturnType<typeof setTimeout>>)[`__skeduley_timer_rev_${id}`]);
    }

    (window as unknown as Record<string, ReturnType<typeof setTimeout>>)[`__skeduley_timer_rev_${id}`] = setTimeout(async () => {
      await supabase.from('reviews').update(updates).eq('id', id);
    }, 800);
  },

  updateProofItem: async (id, updates) => {
    set(state => ({
      business: state.business ? {
        ...state.business,
        proofOfWork: state.business.proofOfWork.map(p => p.id === id ? { ...p, ...updates } : p)
      } : null
    }));

    if ((window as unknown as Record<string, ReturnType<typeof setTimeout>>)[`__skeduley_timer_proof_${id}`]) {
      clearTimeout((window as unknown as Record<string, ReturnType<typeof setTimeout>>)[`__skeduley_timer_proof_${id}`]);
    }

    (window as unknown as Record<string, ReturnType<typeof setTimeout>>)[`__skeduley_timer_proof_${id}`] = setTimeout(async () => {
      await supabase.from('proof_items').update(updates).eq('id', id);
    }, 800);
  },

  setupStripeConnect: async () => {
    set({ error: null });
    try {
      const { data, error } = await supabase.functions.invoke('connect-onboarding', {
        body: { action: 'create-onboarding-link' },
      });

      if (error) throw error;
      return data.url;
    } catch (err) {
      set({ error: (err as Error).message });
      return null;
    }
  },

  refreshStripeStatus: async () => {
    const { business } = get();
    if (!business?.stripeAccountId) return;

    try {
      const { data, error } = await supabase.functions.invoke('connect-onboarding', {
        body: { action: 'refresh-status' },
      });

      if (error) throw error;
      
      // Update local state with refreshed data
      set((state) => ({
        business: state.business ? {
          ...state.business,
          stripeOnboardingStatus: data.stripe_onboarding_status,
          stripeChargesEnabled: data.stripe_charges_enabled,
          stripePayouts_enabled: data.stripe_payouts_enabled,
          stripeDetailsSubmitted: data.stripe_details_submitted,
          stripeConnected: data.stripe_enabled
        } : null
      }));
    } catch (err) {
      console.error('Refresh Stripe status error:', (err as Error).message);
    }
  },

  createSubscription: async (priceId: string, planType?: string) => {
    set({ error: null });
    try {
      const { data, error } = await supabase.functions.invoke('stripe-subscription-checkout', {
        body: { action: 'create-checkout-session', priceId, planType },
      });

      if (error) throw error;
      return data.url;
    } catch (err) {
      set({ error: (err as Error).message });
      return null;
    }
  },

  openBillingPortal: async () => {
    set({ error: null });
    try {
      const { data, error } = await supabase.functions.invoke('stripe-subscription-checkout', {
        body: { action: 'create-portal-session' },
      });

      if (error) throw error;
      return data.url;
    } catch (err) {
      set({ error: (err as Error).message });
      return null;
    }
  },

  sendTestNotification: async (channel: 'sms' | 'email', templateText?: string, notificationType?: string) => {
    const { business } = get();
    if (!business) return;

    set({ error: null });
    try {
      const { data, error } = await supabase.functions.invoke('notification-test-send', {
        body: {
          businessId: business.id,
          channel,
          templateText,
          notificationType
        },
      });

      if (error) throw error;
      if (data && data.error) throw new Error(data.error);
      
      await get().fetchBusiness(0, true);
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },

  updatePassword: async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    return { error };
  },

  uploadLogo: async (file: File) => {
    const { business } = get();
    if (!business) return null;

    try {
      let fileToUpload = file;
      if (file.type.startsWith('image/') && file.type !== 'image/svg+xml') {
        const imageCompression = (await import('browser-image-compression')).default;
        try {
          fileToUpload = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1024, useWebWorker: true });
        } catch (e) {
          console.warn('Image compression failed', e);
        }
      }

      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `${business.id}-${Math.random()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('business-assets')
        .upload(filePath, fileToUpload);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('business-assets')
        .getPublicUrl(filePath);

      await get().updateBusiness({ logo: publicUrl });
      return publicUrl;
    } catch (err) {
      console.error('Logo upload error:', (err as Error).message);
      return null;
    }
  },

  deleteStorageAsset: async (url: string) => {
    try {
      if (!url.includes('supabase.co/storage/v1/object/public/business-assets/')) return;
      
      const filePath = url.split('business-assets/')[1];
      if (!filePath) return;

      const { error } = await supabase.storage
        .from('business-assets')
        .remove([filePath]);

      if (error) {
        console.error('Asset deletion error:', error.message);
      }
    } catch (err) {
      console.error('Asset deletion error:', (err as Error).message);
    }
  },

  updateWorkingHours: async (hours) => {
    const { business } = get();
    if (!business) return;

    set(state => ({
      business: state.business ? { ...state.business, workingHours: hours } : null
    }));

    try {
      // 1. Delete existing hours for this business
      const { error: dError } = await supabase
        .from('availability')
        .delete()
        .eq('business_id', business.id);

      if (dError) throw dError;

      // 2. Insert new hours
      const { error: iError } = await supabase
        .from('availability')
        .insert(
          hours.map(h => ({
            business_id: business.id,
            day_of_week: h.dayOfWeek !== undefined ? h.dayOfWeek : h.day_of_week,
            start_time: h.startTime || h.start_time,
            end_time: h.endTime || h.end_time,
            is_open: h.isOpen !== undefined ? h.isOpen : h.is_open
          }))
        );

      if (iError) throw iError;
      
    } catch (err) {
      set({ error: (err as Error).message });
      // Revert if failed
      get().fetchBusiness(0);
    }
  },

  updateNotificationSettings: async (updates: Partial<ProviderNotificationSettings>) => {
    const { business } = get();
    if (!business) return;

    const previousSettings = business.notificationSettings;
    
    // Optimistic update
    set({
      business: {
        ...business,
        notificationSettings: {
          ...(previousSettings || { businessId: business.id } as ProviderNotificationSettings),
          ...updates
        }
      }
    });

    try {
      const dbUpdates: any = {};
      if ('confirmationEnabled' in updates) dbUpdates.confirmation_enabled = updates.confirmationEnabled;
      if ('reminderEnabled' in updates) dbUpdates.reminder_enabled = updates.reminderEnabled;
      if ('followupEnabled' in updates) dbUpdates.followup_enabled = updates.followupEnabled;
      if ('reminderLeadTimeHours' in updates) dbUpdates.reminder_lead_time_hours = updates.reminderLeadTimeHours;
      if ('smsConfirmTemplate' in updates) dbUpdates.sms_confirm_template = updates.smsConfirmTemplate;
      if ('emailConfirmTemplate' in updates) dbUpdates.email_confirm_template = updates.emailConfirmTemplate;
      if ('smsReminderTemplate' in updates) dbUpdates.sms_reminder_template = updates.smsReminderTemplate;
      if ('emailReminderTemplate' in updates) dbUpdates.email_reminder_template = updates.emailReminderTemplate;
      if ('emailFollowupTemplate' in updates) dbUpdates.email_followup_template = updates.emailFollowupTemplate;

      const { error } = await supabase
        .from('provider_notification_settings')
        .upsert({
          business_id: business.id,
          ...dbUpdates,
          updated_at: new Date().toISOString()
        }, { onConflict: 'business_id' });

      if (error) throw error;
      
      // Refresh business data to get updated settings
      await get().fetchBusiness(0);
    } catch (err) {
      console.error('Update settings error:', err);
      // Revert on error
      set({ 
        business: {
          ...business,
          notificationSettings: previousSettings
        },
        error: (err as Error).message 
      });
    }
  },

  scheduleMessages: async (bookingId: string) => {
    const { business } = get();
    if (!business) return;

    let booking = business.bookings.find(b => b.id === bookingId);
    
    // If booking was just created, it might not be in the store yet. Fetch it.
    if (!booking) {
      const { data: bData } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .maybeSingle();
        
      if (!bData) return;
      
      booking = {
        id: bData.id,
        customerName: bData.customer_name,
        customerEmail: bData.customer_email,
        customerPhone: bData.customer_phone,
        serviceId: bData.service_id,
        staffId: bData.staff_id,
        client_id: bData.client_id,
        date: bData.date,
        startTime: bData.start_time,
        endTime: bData.end_time,
        status: bData.status,
        paymentStatus: bData.payment_status || 'unpaid',
        paymentMethod: bData.payment_method || 'UNPAID',
        totalAmount: bData.total_amount,
        paidAmount: bData.paid_amount || 0,
        addOns: [],
        createdAt: bData.created_at,
        notes: bData.notes
      };
    }

    const settings = business.notificationSettings;
    const clientId = booking.client_id;
    if (!clientId) return;

    const service = business.services.find(s => s.id === booking.serviceId);
    const provider = business.staff.find(s => s.id === booking.staffId);

    // Check if client opted out
    const { data: pref } = await supabase
      .from('client_notification_preferences')
      .select('*')
      .eq('client_id', clientId)
      .eq('business_id', business.id)
      .maybeSingle();

    const render = (template: string | null, type: 'SMS' | 'EMAIL') => {
      if (!template) {
        // Fallback defaults if no template saved
        if (type === 'SMS') {
          template = "Hi {client_name}, your {service} with {provider_name} is confirmed for {date} at {time}. Need to cancel? {cancel_link} — {business_name}";
        } else {
          template = "Hi {client_name},\n\nYour booking for {service} is confirmed for {date} at {time}.\n\nLocation: {business_name}\n\nWe look forward to seeing you!";
        }
      }

      let text = template
        .replace(/{client_name}/g, booking.customerName)
        .replace(/{service}/g, service?.name || 'Service')
        .replace(/{date}/g, new Date(booking.date).toLocaleDateString())
        .replace(/{time}/g, booking.startTime)
        .replace(/{provider_name}/g, provider?.name || business.name)
        .replace(/{business_name}/g, business.name)
        .replace(/{cancel_link}/g, `${getBusinessUrl(business.subdomain, business.customDomain)}/c/${booking.id}`)
        .replace(/{booking_link}/g, getBusinessUrl(business.subdomain, business.customDomain))
        .replace(/{review_link}/g, `${getBusinessUrl(business.subdomain, business.customDomain)}/r/${booking.id}`);

      // Append Opt-out
      if (type === 'SMS') {
        text += " \nReply STOP to unsubscribe";
      } else {
        text += `\n\n---\nManage your preferences: ${getBusinessUrl(business.subdomain, business.customDomain)}/unsubscribe/${business.id}?clientId=${clientId}`;
      }

      return text;
    };

    const messages = [];

    // 1. Confirmation
    if (!settings || settings.confirmationEnabled) {
      if (!pref?.sms_opt_out && (booking.customerPhone || '')) {
        messages.push({
          booking_id: bookingId,
          client_id: clientId,
          business_id: business.id,
          type: 'CONFIRMATION',
          channel: 'SMS',
          scheduled_for: new Date(Date.now() + 30000).toISOString(),
          status: 'QUEUED',
          template_snapshot: render(settings?.smsConfirmTemplate || null, 'SMS')
        });
      }
      if (!pref?.email_opt_out && (booking.customerEmail || '')) {
        messages.push({
          booking_id: bookingId,
          client_id: clientId,
          business_id: business.id,
          type: 'CONFIRMATION',
          channel: 'EMAIL',
          scheduled_for: new Date(Date.now() + 30000).toISOString(),
          status: 'QUEUED',
          template_snapshot: render(settings?.emailConfirmTemplate || null, 'EMAIL')
        });
      }
    }

    // 2. Reminder
    if (settings?.reminderEnabled) {
      const appointmentTime = new Date(`${booking.date} ${booking.startTime}`).getTime();
      const leadTimeMs = (settings.reminderLeadTimeHours || 24) * 60 * 60 * 1000;
      const scheduledTime = new Date(appointmentTime - leadTimeMs);
      const tooClose = (appointmentTime - Date.now()) <= leadTimeMs;

      if (!pref?.sms_opt_out && (booking.customerPhone || '')) {
        messages.push({
          booking_id: bookingId,
          client_id: clientId,
          business_id: business.id,
          type: 'REMINDER',
          channel: 'SMS',
          scheduled_for: scheduledTime.toISOString(),
          status: tooClose ? 'SKIPPED' : 'QUEUED',
          failure_reason: tooClose ? 'Booked too close to appointment time' : null,
          template_snapshot: tooClose ? null : render(settings?.smsReminderTemplate || null, 'SMS')
        });
      }
      if (!pref?.email_opt_out && (booking.customerEmail || '')) {
        messages.push({
          booking_id: bookingId,
          client_id: clientId,
          business_id: business.id,
          type: 'REMINDER',
          channel: 'EMAIL',
          scheduled_for: scheduledTime.toISOString(),
          status: tooClose ? 'SKIPPED' : 'QUEUED',
          failure_reason: tooClose ? 'Booked too close to appointment time' : null,
          template_snapshot: tooClose ? null : render(settings?.emailReminderTemplate || null, 'EMAIL')
        });
      }
    }

    // 3. Followup
    if (settings?.followupEnabled) {
      const endTime = new Date(`${booking.date} ${booking.endTime}`).getTime();
      messages.push({
        booking_id: bookingId,
        client_id: clientId,
        business_id: business.id,
        type: 'FOLLOWUP',
        channel: 'EMAIL',
        scheduled_for: new Date(endTime + 2 * 60 * 60 * 1000).toISOString(),
        status: 'QUEUED',
        template_snapshot: render(settings?.emailFollowupTemplate || null, 'EMAIL')
      });
    }

    if (messages.length > 0) {
      await supabase.from('scheduled_messages').insert(messages);
      get().fetchBusiness(0);
    }
  },

  getDashboardStats: (period = 'last30', compare = false, staffId?: string) => {
    const { business } = get();
    if (!business) return null;

    // Use a simple local variable for caching since we don't want it persisted
    const CACHE_KEY = `${business.id}_${period}_${compare}_${staffId || 'all'}`;
    const now = Date.now();
    
    // Check global cache window object to avoid persistence issues
    if (!window.__skeduley_dash_cache) {
      window.__skeduley_dash_cache = {};
    }
    
    const cache = window.__skeduley_dash_cache[CACHE_KEY];
    if (cache && (now - cache.timestamp < 5 * 60 * 1000)) {
      return cache.data;
    }

    const stats = calculateDashboardStats(
      business.bookings,
      business.services,
      business.workingHours,
      period,
      compare,
      staffId
    );

    window.__skeduley_dash_cache[CACHE_KEY] = {
      data: stats,
      timestamp: now
    };

    return stats;
  },

  fetchDomains: async () => {
    const { business } = get();
    if (!business) return;
    const { data, error } = await supabase.from('domains').select('*').eq('business_id', business.id);
    if (!error && data) {
      set((state) => ({
        business: state.business ? {
          ...state.business,
          domains: data.map((d: any) => ({
            id: d.id,
            businessId: d.business_id,
            domain: d.domain,
            type: d.type,
            status: d.status,
            isPrimary: d.is_primary,
            sslEnabled: d.ssl_enabled,
            sslStatus: d.ssl_status,
            dnsRecords: d.dns_records,
            verifiedAt: d.verified_at,
            createdAt: d.created_at
          }))
        } : null
      }));
    }
  },

  addDomain: async (domain, type) => {
    const { business } = get();
    if (!business) return { success: false, error: 'No business loaded' };
    const normalizedDomain = type === 'subdomain'
      ? slugifyDomainLabel(domain)
      : normalizeDomainIdentifier(domain);
    
    // Do not allow reserved subdomains
    if (type === 'subdomain') {
      const reserved = ['www', 'api', 'app', 'admin', 'proxy', 'assets', 'static', 'mail', 'remote', 'blog', 'store', 'shop'];
      if (reserved.includes(normalizedDomain)) {
        return { success: false, error: 'This is a reserved subdomain and cannot be used.' };
      }
    }

    const dnsRecords = type === 'custom' ? {
      A: { host: '@', value: '76.76.21.21' },
      CNAME: { host: 'www', value: `proxy.${getBaseDomain()}` }
    } : {};

    const { error } = await supabase.from('domains').insert([{
      business_id: business.id,
      domain: normalizedDomain,
      type,
      status: type === 'subdomain' ? 'active' : 'pending_verification',
      ssl_enabled: type === 'subdomain',
      ssl_status: type === 'subdomain' ? 'active' : 'none',
      verified_at: type === 'subdomain' ? new Date().toISOString() : null,
      dns_records: dnsRecords,
      is_primary: (business.domains || []).length === 0
    }]);

    if (error) {
      if (error.code === '23505') {
        return { success: false, error: 'This domain is already in use by another business.' };
      }
      return { success: false, error: error.message };
    }

    await get().fetchDomains();
    return { success: true };
  },

  verifyDomain: async (id) => {
    const { error } = await supabase.from('domains').update({
      status: 'active',
      verified_at: new Date().toISOString(),
      ssl_enabled: true,
      ssl_status: 'active'
    }).eq('id', id);

    if (error) return { verified: false, errors: error };
    get().fetchDomains();
    return { verified: true };
  },

  setPrimaryDomain: async (id) => {
    const { business } = get();
    if (!business) return;

    await supabase.from('domains').update({ is_primary: false }).eq('business_id', business.id);
    await supabase.from('domains').update({ is_primary: true }).eq('id', id);
    
    const domain = (business.domains || []).find(d => d.id === id);
    if (domain?.type === 'subdomain') {
      await supabase.from('businesses').update({
        subdomain: domain.domain,
        slug: domain.domain
      }).eq('id', business.id);
    }

    get().fetchDomains();
  },

  deleteDomain: async (id) => {
    const { error } = await supabase.from('domains').delete().eq('id', id);
    if (!error) get().fetchDomains();
  },

  addBlockedTime: async (data) => {
    const { business } = get();
    if (!business) return;

    const { data: newBlocked, error } = await supabase.from('blocked_times').insert([{
      business_id: business.id,
      staff_id: data.staffId,
      date: data.date,
      start_time: data.startTime,
      end_time: data.endTime,
      reason: data.reason
    }]).select().single();

    if (!error && newBlocked) {
      set((state) => ({
        business: state.business ? {
          ...state.business,
          blockedTimes: [...state.business.blockedTimes, {
            id: newBlocked.id,
            businessId: newBlocked.business_id,
            staffId: newBlocked.staff_id,
            date: newBlocked.date,
            startTime: newBlocked.start_time,
            endTime: newBlocked.end_time,
            reason: newBlocked.reason,
            createdAt: newBlocked.created_at
          }]
        } : null
      }));
    }
  },

  deleteBlockedTime: async (id) => {
    const { business } = get();
    if (!business) return;

    const { error } = await supabase.from('blocked_times').delete().eq('id', id);
    if (!error) {
      set((state) => ({
        business: state.business ? {
          ...state.business,
          blockedTimes: state.business.blockedTimes.filter((b) => b.id !== id)
        } : null
      }));
    }
  }

}), {
  name: 'skeduley-storage',
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({ 
    onboardingStep: state.onboardingStep,
  }),
}));
