import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

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

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  serviceId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'paid' | 'pending' | 'partially_paid' | 'failed' | 'refunded';
  totalAmount: number;
  paidAmount: number;
  addOns: string[];
  createdAt: string;
  notes?: string;
  end_time?: string;
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

interface BusinessState {
  id: string;
  name: string;
  category: string;
  email: string;
  phone: string;
  subdomain: string;
  logo: string | null;
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
  workingHours: WorkingHour[];
  services: Service[];
  bookings: Booking[];
  stripeConnected: boolean;
  stripeAccountId: string | null;
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
  planType: 'free' | 'pro' | 'enterprise';
}

interface AppState {
  user: User | null;
  business: BusinessState | null;
  loading: boolean;
  error: string | null;
  onboardingStep: number;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setBusiness: (business: BusinessState | null) => void;
  updateBusiness: (updates: Partial<BusinessState>) => Promise<void>;
  setOnboardingStep: (step: number) => void;
  fetchBusiness: (retryCount?: number) => Promise<void>;
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
  }) => Promise<Booking>;
  createCheckoutSession: (bookingId: string) => Promise<string | null>;
  setupStripeConnect: () => Promise<string | null>;
  refreshStripeStatus: () => Promise<void>;
  createSubscription: () => Promise<string | null>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  uploadLogo: (file: File) => Promise<string | null>;
  updateWorkingHours: (hours: WorkingHour[]) => Promise<void>;
}

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const generateSubdomain = (name: string, businessId: string): string => {
  const baseSlug = generateSlug(name);
  // Use first 20 chars of slug or fallback to business ID prefix
  return baseSlug ? baseSlug.substring(0, 20) : `biz-${businessId.substring(0, 8)}`;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
  user: null,
  business: null,
  loading: true,
  error: null,
  onboardingStep: 1,
  
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setBusiness: (business) => set({ business }),
  setOnboardingStep: (step) => set({ onboardingStep: step }),

  fetchBusiness: async (retryCount?: number) => {
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

    set({ loading: true, error: null });
    try {
      // 1. Fetch Business Profile
      const { data: business, error: bError } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (bError && bError.code !== 'PGRST116') throw bError;
      
      // If no business exists, create one for this new user
      if (!business) {
        const now = new Date();
        const trialEndDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

        const { data: newBusiness, error: createError } = await supabase
          .from('businesses')
          .insert([{
            owner_id: user.id,
            name: '',
            email: '',
            category: '',
            primary_color: '#111111',
            template_key: 'editorial_luxe',
            subscription_status: 'trialing',
            trial_start_date: now.toISOString(),
            trial_end_date: trialEndDate.toISOString(),
            plan_type: 'pro'
          }])
          .select()
          .single();

        if (createError) throw createError;
        if (!newBusiness) throw new Error('Failed to create business');
        
        // Set empty business with ID
        set({
          business: {
            ...newBusiness,
            subdomain: '',
            slug: '',
            primaryColor: '#111111',
            coverImage: null,
            logo: null,
            socials: { instagram: '', facebook: '', twitter: '' },
            isPublished: false,
            customDomain: null,
            heroTitle: '',
            heroSubtitle: '',
            ctaText: 'Book Now',
            secondaryCtaText: '',
            aboutTitle: '',
            aboutDescription: '',
            aboutImage: null,
            trustSection: 'none',
            stripeAccountId: null,
            stripeConnected: false,
            stripeOnboardingStatus: 'not_started',
            stripeChargesEnabled: false,
            stripePayouts_enabled: false,
            stripeDetailsSubmitted: false,
            templateKey: 'editorial_luxe',
            stripeCustomerId: null,
            stripeSubscriptionId: null,
            subscriptionStatus: 'trialing',
            trialStartDate: newBusiness.trial_start_date,
            trialEndDate: newBusiness.trial_end_date,
            planType: 'pro',
            services: [],
            workingHours: [],
            bookings: [],
            reviews: [],
            proofOfWork: []
          },
          loading: false
        });
        return;
      }

      // 2. Fetch Services & Addons
      const { data: services, error: sError } = await supabase
        .from('services')
        .select('*, addons(*)')
        .eq('business_id', business.id);
      
      if (sError) throw sError;

      // 3. Fetch Availability
      const { data: availability, error: aError } = await supabase
        .from('availability')
        .select('*')
        .eq('business_id', business.id);
      
      if (aError) throw aError;

      // 4. Fetch Bookings
      const { data: bookings, error: boError } = await supabase
        .from('bookings')
        .select('*, booking_addons(*)')
        .eq('business_id', business.id);
      
      if (boError) throw boError;

      // 5. Fetch Reviews
      const { data: reviews, error: rError } = await supabase
        .from('reviews')
        .select('*')
        .eq('business_id', business.id);
      
      if (rError) throw rError;

      // 6. Fetch Proof Items
      const { data: proof_items, error: pError } = await supabase
        .from('proof_items')
        .select('*')
        .eq('business_id', business.id);
      
      if (pError) throw pError;

      const mappedServices = (services || []).map((s: any) => ({
        ...s,
        bookingFeeEnabled: s.booking_fee_enabled,
        bookingFeeAmount: s.booking_fee_amount,
        addOns: s.addons || []
      }));

      const mappedBookings = (bookings || []).map((b: any) => ({
        ...b,
        customerName: b.customer_name,
        customerEmail: b.customer_email,
        customerPhone: b.customer_phone,
        date: b.date,
        time: b.start_time,
        totalAmount: b.total_amount,
        paidAmount: b.paid_amount || 0,
        paymentStatus: b.payment_status || 'pending'
      }));

      // Auto-generate subdomain if missing
      let businessSubdomain = business.subdomain;
      if (!businessSubdomain && business.name) {
        businessSubdomain = generateSubdomain(business.name, business.id);
        // Save it to the database (non-blocking)
        void supabase
          .from('businesses')
          .update({ subdomain: businessSubdomain })
          .eq('id', business.id);
      }

      // Auto-generate slug if missing
      let businessSlug = business.slug || (business.name ? generateSlug(business.name) : '');
      if (!business.slug && business.name) {
        // Save it to the database (non-blocking)
        void supabase
          .from('businesses')
          .update({ slug: businessSlug })
          .eq('id', business.id);
      }

      set({ 
        business: {
          ...business,
          subdomain: businessSubdomain,
          primaryColor: business.primary_color || '#111111',
          coverImage: business.cover_image || null,
          logo: business.logo || null,
          socials: business.socials || { instagram: '', facebook: '', twitter: '' },
          isPublished: business.is_published,
          slug: businessSlug,
          customDomain: business.custom_domain || null,
          heroTitle: business.hero_title || '',
          heroSubtitle: business.hero_subtitle || '',
          ctaText: business.cta_text || '',
          secondaryCtaText: business.secondary_cta_text || '',
          aboutTitle: business.about_title || '',
          aboutDescription: business.about_description || '',
          aboutImage: business.about_image || null,
          trustSection: business.trust_section || 'none',
          stripeAccountId: business.stripe_account_id,
          stripeConnected: business.stripe_enabled || false,
          stripeOnboardingStatus: business.stripe_onboarding_status || 'not_started',
          stripeChargesEnabled: business.stripe_charges_enabled || false,
          stripePayouts_enabled: business.stripe_payouts_enabled || false,
          stripeDetailsSubmitted: business.stripe_details_submitted || false,
          templateKey: business.template_key || 'editorial_luxe',
          stripeCustomerId: business.stripe_customer_id || null,
          stripeSubscriptionId: business.stripe_subscription_id || null,
          subscriptionStatus: business.subscription_status || 'trialing',
          trialStartDate: business.trial_start_date || null,
          trialEndDate: business.trial_end_date || null,
          planType: business.plan_type || 'pro',
          services: mappedServices,
          workingHours: (availability || []).map((h: WorkingHour) => ({ ...h, dayOfWeek: h.day_of_week, startTime: h.start_time, endTime: h.end_time, isOpen: h.is_open })),
          bookings: mappedBookings,
          reviews: reviews || [],
          proofOfWork: proof_items || []
        } 
      });
    } catch (err: any) {
      console.error('Fetch business error:', err);
      set({ error: err.message });
      
      // Auto-retry once after 2 seconds on network failure
      const count = retryCount || 0;
      if (count < 1) {
        setTimeout(() => get().fetchBusiness(count + 1), 2000);
      }
    } finally {
      set({ loading: false });
    }
  },

  updateBusiness: async (updates) => {
    const { business, user } = get();
    if (!business || !user) return;

    // 1. Update local state IMMEDIATELY (no await, no network)
    set((state) => ({
      business: state.business ? { ...state.business, ...updates } : null
    }));

    // 2. Debounce the DB persist
    if ((window as any).__bookrly_save_timer) {
      clearTimeout((window as any).__bookrly_save_timer);
    }

    (window as any).__bookrly_save_timer = setTimeout(async () => {
      const latestBusiness = get().business;
      if (!latestBusiness) return;

      try {
        // Map frontend camelCase to Postgres snake_case
        const dbUpdates: any = {};
        
        // Only persist the fields that were in the original update
        if ('name' in updates) dbUpdates.name = updates.name;
        if ('email' in updates) dbUpdates.email = updates.email;
        if ('phone' in updates) dbUpdates.phone = updates.phone;
        if ('category' in updates) dbUpdates.category = updates.category;
        if ('subdomain' in updates) dbUpdates.subdomain = updates.subdomain;
        if ('logo' in updates) dbUpdates.logo = updates.logo;
        if ('isPublished' in updates) dbUpdates.is_published = updates.isPublished;
        if ('slug' in updates) dbUpdates.slug = updates.slug;
        if ('customDomain' in updates) dbUpdates.custom_domain = updates.customDomain;
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

        // Handle workingHours sync: Delete existing and re-insert all for this business
        if ('workingHours' in updates && updates.workingHours) {
          await supabase
            .from('availability')
            .delete()
            .eq('business_id', latestBusiness.id);

          const { error: aError } = await supabase
            .from('availability')
            .insert(
              updates.workingHours.map((h: any) => ({
                business_id: latestBusiness.id,
                day_of_week: h.dayOfWeek,
                start_time: h.startTime,
                end_time: h.endTime,
                is_open: h.isOpen
              }))
            );
          if (aError) console.error('Availability sync error:', aError);
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
          }
        }
      } catch (err: any) {
        console.error('Save error:', err.message);
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
          service.addOns.map((a: any) => ({
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
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  updateService: async (id, service) => {
    set(state => ({
      business: state.business ? {
        ...state.business,
        services: state.business.services.map(s => s.id === id ? { ...s, ...service } : s)
      } : null
    }));

    if ((window as any)[`__bookrly_timer_svc_${id}`]) {
      clearTimeout((window as any)[`__bookrly_timer_svc_${id}`]);
    }

    (window as any)[`__bookrly_timer_svc_${id}`] = setTimeout(async () => {
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
        if (service.addOns?.length > 0) {
          await supabase.from('addons').insert(
            service.addOns.map((a: any) => ({
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
      // Try to find business by subdomain first, then slug, then custom domain
      // Use slug as fallback since it's always generated
      const { data: business, error } = await supabase
        .from('businesses')
        .select('*')
        .or(`subdomain.eq.${identifier},slug.eq.${identifier},custom_domain.eq.${identifier}`)
        .single();
      
      if (error) {
        throw error;
      }

      if (!business) {
        throw new Error('Business not found');
      }

      const [servicesRes, availabilityRes, reviewsRes, proofRes, bookingsRes] = await Promise.all([
        supabase.from('services').select('*, addons(*)').eq('business_id', business.id).eq('active', true),
        supabase.from('availability').select('*').eq('business_id', business.id),
        supabase.from('reviews').select('*').eq('business_id', business.id),
        supabase.from('proof_items').select('*').eq('business_id', business.id),
        supabase.from('bookings').select('*').eq('business_id', business.id)
      ]);

      if (servicesRes.error) throw servicesRes.error;

      const mappedServices = (servicesRes.data || []).map((s: any) => ({
        ...s,
        bookingFeeEnabled: s.booking_fee_enabled,
        bookingFeeAmount: s.booking_fee_amount,
        addOns: s.addons || []
      }));

      const mappedBookings = (bookingsRes.data || []).map((b: any) => ({
        ...b,
        customerName: b.customer_name,
        customerEmail: b.customer_email,
        customerPhone: b.customer_phone,
        date: b.date,
        time: b.start_time,
        totalAmount: b.total_amount,
        paidAmount: b.paid_amount || 0,
        paymentStatus: b.payment_status || 'pending'
      }));

      // Auto-generate subdomain if missing
      let businessSubdomain = business.subdomain;
      if (!businessSubdomain && business.name) {
        businessSubdomain = generateSubdomain(business.name, business.id);
        // Save it to the database (non-blocking)
        void supabase
          .from('businesses')
          .update({ subdomain: businessSubdomain })
          .eq('id', business.id);
      }

      // Auto-generate slug if missing
      let businessSlug = business.slug || (business.name ? generateSlug(business.name) : '');
      if (!business.slug && business.name) {
        // Save it to the database (non-blocking)
        void supabase
          .from('businesses')
          .update({ slug: businessSlug })
          .eq('id', business.id);
      }

      set({ 
        business: {
          ...business,
          subdomain: businessSubdomain,
          slug: businessSlug,
          isPublished: business.is_published,
          heroTitle: business.hero_title,
          heroSubtitle: business.hero_subtitle,
          ctaText: business.cta_text,
          secondaryCtaText: business.secondary_cta_text,
          aboutTitle: business.about_title,
          aboutDescription: business.about_description,
          aboutImage: business.about_image,
          trustSection: business.trust_section,
          stripeAccountId: business.stripe_account_id,
          stripeEnabled: business.stripe_enabled,
          templateKey: business.template_key || 'editorial_luxe',
          services: mappedServices,
          workingHours: (availabilityRes.data || []).map((h: any) => ({ ...h, dayOfWeek: h.day_of_week, startTime: h.start_time, endTime: h.end_time, isOpen: h.is_open })),
          bookings: mappedBookings,
          reviews: reviewsRes.data || [],
          proofOfWork: proofRes.data || []
        } 
      });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  createBooking: async (data: any) => {
    const { business } = get();
    if (!business) throw new Error('Business not found');

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
        const addon = service.addOns.find((a: any) => a.id === id);
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
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone,
        date: data.date,
        start_time: startTime24,
        end_time: endTime24,
        total_amount: data.totalPrice,
        paid_amount: data.depositDue || 0,
        payment_status: data.depositDue > 0 ? 'pending' : 'paid',
        status: data.depositDue > 0 ? 'pending' : 'confirmed',
        notes: data.notes
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

    return bData;
  },

  createCheckoutSession: async (bookingId: string) => {
    const { business } = get();
    if (!business) return null;

    const protocol = window.location.hostname.includes('localhost') ? 'http' : 'https';
    const domain = import.meta.env.VITE_ROOT_DOMAIN || 'localhost:5173';
    const successUrl = `${protocol}://${business.subdomain}.${domain}/?booking_success=true`;
    const cancelUrl = `${protocol}://${business.subdomain}.${domain}/?booking_cancel=true`;

    const { data, error } = await supabase.functions.invoke('stripe-checkout', {
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
    if (!error) get().fetchBusiness();
  },

  updateReview: async (id, updates) => {
    set(state => ({
      business: state.business ? {
        ...state.business,
        reviews: state.business.reviews.map(r => r.id === id ? { ...r, ...updates } : r)
      } : null
    }));

    if ((window as any)[`__bookrly_timer_rev_${id}`]) {
      clearTimeout((window as any)[`__bookrly_timer_rev_${id}`]);
    }

    (window as any)[`__bookrly_timer_rev_${id}`] = setTimeout(async () => {
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

    if ((window as any)[`__bookrly_timer_proof_${id}`]) {
      clearTimeout((window as any)[`__bookrly_timer_proof_${id}`]);
    }

    (window as any)[`__bookrly_timer_proof_${id}`] = setTimeout(async () => {
      await supabase.from('proof_items').update(updates).eq('id', id);
    }, 800);
  },

  setupStripeConnect: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.functions.invoke('stripe-connect', {
        body: { action: 'create-onboarding-link' },
      });

      if (error) throw error;
      return data.url;
    } catch (err: any) {
      set({ error: err.message });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  refreshStripeStatus: async () => {
    const { business } = get();
    if (!business?.stripeAccountId) return;

    try {
      const { data, error } = await supabase.functions.invoke('stripe-connect', {
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
    } catch (err: any) {
      console.error('Refresh Stripe status error:', err.message);
    }
  },

  createSubscription: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.functions.invoke('stripe-subscription', {
        body: { action: 'create-checkout-session' },
      });

      if (error) throw error;
      return data.url;
    } catch (err: any) {
      set({ error: err.message });
      return null;
    } finally {
      set({ loading: false });
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
      const fileExt = file.name.split('.').pop();
      const fileName = `${business.id}-${Math.random()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('business-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('business-assets')
        .getPublicUrl(filePath);

      await get().updateBusiness({ logo: publicUrl });
      return publicUrl;
    } catch (err: any) {
      console.error('Logo upload error:', err.message);
      return null;
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
      
    } catch (err: any) {
      set({ error: err.message });
      // Revert if failed
      get().fetchBusiness(0);
    }
  }
}), {
  name: 'bookflow-storage',
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({ 
    onboardingStep: state.onboardingStep,
  }),
}));
