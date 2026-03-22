import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface AddOn {
  id: string;
  name: string;
  price: number;
  duration: number;
  active: boolean;
  description?: string;
}

interface Service {
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

interface WorkingHour {
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
  serviceId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'paid' | 'pending' | 'partially_paid';
  totalAmount: number;
  paidAmount: number;
  addOns: string[];
  createdAt: string;
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
  reviews: any[];
  proofOfWork: any[];
  isPublished: boolean;
  workingHours: WorkingHour[];
  services: Service[];
  bookings: Booking[];
  stripeConnected: boolean;
}

interface AppState {
  user: any | null; // Supabase User
  business: BusinessState | null;
  loading: boolean;
  error: string | null;
  onboardingStep: number;
  
  // Actions
  setUser: (user: any | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setBusiness: (business: BusinessState | null) => void;
  updateBusiness: (updates: Partial<BusinessState>) => Promise<void>;
  setOnboardingStep: (step: number) => void;
  fetchBusiness: () => Promise<void>;
  signOut: () => Promise<void>;
  addReview: (review: { customer_name: string; rating: number; comment: string }) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  addProofItem: (item: { image_url: string; caption?: string }) => Promise<void>;
  deleteProofItem: (id: string) => Promise<void>;
  addService: (service: any) => Promise<void>;
  updateService: (id: string, service: any) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  fetchPublicBusiness: (subdomain: string) => Promise<void>;
  updateBookingStatus: (id: string, status: string) => Promise<void>;
  updateReview: (id: string, updates: any) => Promise<void>;
  updateProofItem: (id: string, updates: any) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  business: null,
  loading: false,
  error: null,
  onboardingStep: 1,
  
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setBusiness: (business) => set({ business }),
  setOnboardingStep: (step) => set({ onboardingStep: step }),

  fetchBusiness: async () => {
    const { user } = get();
    if (!user) return;

    set({ loading: true });
    try {
      // 1. Fetch Business Profile
      const { data: business, error: bError } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (bError && bError.code !== 'PGRST116') throw bError;
      
      if (business) {
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

        set({ 
          business: {
            ...business,
            isPublished: business.is_published,
            heroTitle: business.hero_title,
            heroSubtitle: business.hero_subtitle,
            ctaText: business.cta_text,
            aboutTitle: business.about_title,
            aboutDescription: business.about_description,
            aboutImage: business.about_image,
            trustSection: business.trust_section,
            stripeAccountId: business.stripe_account_id,
            stripeEnabled: business.stripe_enabled,
            services: mappedServices,
            workingHours: (availability || []).map((h: any) => ({ ...h, dayOfWeek: h.day_of_week, startTime: h.start_time, endTime: h.end_time, isOpen: h.is_open })),
            bookings: mappedBookings,
            reviews: reviews || [],
            proofOfWork: proof_items || []
          } 
        });
      }
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  updateBusiness: async (updates) => {
    const { business, user } = get();
    if (!business || !user) return;

    try {
      // Map frontend camelCase to Postgres snake_case
      const dbUpdates: any = { ...updates };
      if ('isPublished' in updates) dbUpdates.is_published = updates.isPublished;
      if ('heroTitle' in updates) dbUpdates.hero_title = updates.heroTitle;
      if ('heroSubtitle' in updates) dbUpdates.hero_subtitle = updates.heroSubtitle;
      if ('ctaText' in updates) dbUpdates.cta_text = updates.ctaText;
      if ('aboutTitle' in updates) dbUpdates.about_title = updates.aboutTitle;
      if ('aboutDescription' in updates) dbUpdates.about_description = updates.aboutDescription;
      if ('aboutImage' in updates) dbUpdates.about_image = updates.aboutImage;
      if ('trustSection' in updates) dbUpdates.trust_section = updates.trustSection;

      // Handle workingHours sync separately if present
      if ('workingHours' in updates && updates.workingHours) {
        const { error: aError } = await supabase
          .from('availability')
          .upsert(
            updates.workingHours.map((h: any) => ({
              business_id: business.id,
              day_of_week: h.dayOfWeek,
              start_time: h.startTime,
              end_time: h.endTime,
              is_open: h.isOpen
            })),
            { onConflict: 'business_id,day_of_week' }
          );
        if (aError) throw aError;
      }

      // Clean up keys not in 'businesses' table
      delete dbUpdates.isPublished;
      delete dbUpdates.heroTitle;
      delete dbUpdates.heroSubtitle;
      delete dbUpdates.ctaText;
      delete dbUpdates.aboutTitle;
      delete dbUpdates.aboutDescription;
      delete dbUpdates.aboutImage;
      delete dbUpdates.trustSection;
      delete dbUpdates.workingHours;
      delete dbUpdates.services;
      delete dbUpdates.bookings;
      delete dbUpdates.reviews;
      delete dbUpdates.proofOfWork;
      delete dbUpdates.address;
      delete dbUpdates.socials;

      // Add address and socials if they are in the updates
      if ('address' in updates) dbUpdates.address = updates.address;
      if ('socials' in updates) dbUpdates.socials = updates.socials;

      if (Object.keys(dbUpdates).length > 0) {
        const { error } = await supabase
          .from('businesses')
          .update(dbUpdates)
          .eq('id', business.id);

        if (error) throw error;
      }

      set((state) => ({
        business: state.business ? { ...state.business, ...updates } : null
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, business: null, onboardingStep: 1 });
  },

  addReview: async (review) => {
    const { business } = get();
    if (!business) return;
    const { error } = await supabase.from('reviews').insert([{ 
      customer_name: review.customer_name,
      rating: review.rating,
      comment: review.comment,
      business_id: business.id 
    }]);
    if (!error) get().fetchBusiness();
  },

  deleteReview: async (id) => {
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (!error) get().fetchBusiness();
  },

  addProofItem: async (item) => {
    const { business } = get();
    if (!business) return;
    const { error } = await supabase.from('proof_items').insert([{ 
      image_url: item.image_url,
      caption: item.caption,
      business_id: business.id 
    }]);
    if (!error) get().fetchBusiness();
  },

  deleteProofItem: async (id) => {
    const { error } = await supabase.from('proof_items').delete().eq('id', id);
    if (!error) get().fetchBusiness();
  },

  addService: async (service) => {
    const { business } = get();
    if (!business) return;
    const { data: sData, error: sError } = await supabase.from('services').insert([{
      business_id: business.id,
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      booking_fee_enabled: service.bookingFeeEnabled,
      booking_fee_amount: service.bookingFeeAmount,
      active: service.active
    }]).select().single();

    if (sError) throw sError;

    if (service.addOns?.length > 0) {
      await supabase.from('addons').insert(
        service.addOns.map((a: any) => ({
          service_id: sData.id,
          name: a.name,
          price: a.price,
          duration: a.duration || 0,
          active: true
        }))
      );
    }
    get().fetchBusiness();
  },

  updateService: async (id, service) => {
    const { error: sError } = await supabase.from('services').update({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      booking_fee_enabled: service.bookingFeeEnabled,
      booking_fee_amount: service.bookingFeeAmount,
      active: service.active
    }).eq('id', id);

    if (sError) throw sError;

    // Simplified add-on sync: delete all and re-insert
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
    get().fetchBusiness();
  },

  deleteService: async (id) => {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (!error) get().fetchBusiness();
  },

  fetchPublicBusiness: async (subdomain) => {
    set({ loading: true, error: null });
    try {
      const { data: business, error: bError } = await supabase
        .from('businesses')
        .select('*')
        .eq('subdomain', subdomain)
        .single();
      
      if (bError) throw bError;

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

      set({ 
        business: {
          ...business,
          isPublished: business.is_published,
          heroTitle: business.hero_title,
          heroSubtitle: business.hero_subtitle,
          ctaText: business.cta_text,
          aboutTitle: business.about_title,
          aboutDescription: business.about_description,
          aboutImage: business.about_image,
          trustSection: business.trust_section,
          stripeAccountId: business.stripe_account_id,
          stripeEnabled: business.stripe_enabled,
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

    // Calculate end time
    const [h, m] = data.time.split(':').map(Number);
    const endMinutes = h * 60 + m + service.duration;
    const endH = Math.floor(endMinutes / 60) % 24;
    const endM = endMinutes % 60;
    const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}:00`;

    const { data: bData, error: bError } = await supabase
      .from('bookings')
      .insert([{
        business_id: business.id,
        service_id: data.serviceId,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone,
        date: data.date,
        start_time: data.time,
        end_time: endTime,
        total_amount: data.totalPrice,
        status: 'confirmed',
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

  updateBookingStatus: async (id, status) => {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (!error) get().fetchBusiness();
  },

  updateReview: async (id, updates) => {
    const { error } = await supabase.from('reviews').update(updates).eq('id', id);
    if (!error) get().fetchBusiness();
  },

  updateProofItem: async (id, updates) => {
    const { error } = await supabase.from('proof_items').update(updates).eq('id', id);
    if (!error) get().fetchBusiness();
  }
}));
