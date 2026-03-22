import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AddOn {
  name: string;
  price: number;
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
  start: string;
  end: string;
  active: boolean;
}

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  serviceId: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
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
  address: string;
  logo: string | null;
  primaryColor: string;
  coverImage: string | null;
  headline: string;
  subtext: string;
  heroButtons: { primary: string; secondary: string };
  trustSection: 'reviews' | 'proof' | 'both' | 'none';
  reviews: { id: string; name: string; text: string; rating: number }[];
  proofOfWork: { id: string; image: string; caption: string }[];
  aboutText: string;
  aboutImage: string | null;
  workingHours: Record<string, WorkingHour>;
  services: Service[];
  bookings: Booking[];
  stripeConnected: boolean;
  subdomain: string;
  socials: {
    instagram: string;
    facebook: string;
    twitter: string;
  };
}

interface AppState {
  user: { email: string } | null;
  business: BusinessState;
  onboardingStep: number;
  isPublished: boolean;
  
  // Actions
  setUser: (user: { email: string } | null) => void;
  updateBusiness: (updates: Partial<BusinessState>) => void;
  setOnboardingStep: (step: number) => void;
  setPublished: (status: boolean) => void;
  resetOnboarding: () => void;
}

const initialBusinessState: BusinessState = {
  id: 'glow-beauty',
  name: '',
  category: '',
  email: '',
  phone: '',
  address: '',
  logo: null,
  primaryColor: '#4F46E5',
  coverImage: null,
  headline: '',
  subtext: '',
  heroButtons: { primary: 'Book Now', secondary: 'Our Services' },
  trustSection: 'none',
  reviews: [],
  proofOfWork: [],
  aboutText: '',
  aboutImage: null,
  workingHours: {
    monday: { start: '09:00', end: '17:00', active: true },
    tuesday: { start: '09:00', end: '17:00', active: true },
    wednesday: { start: '09:00', end: '17:00', active: true },
    thursday: { start: '09:00', end: '17:00', active: true },
    friday: { start: '09:00', end: '17:00', active: true },
    saturday: { start: '09:00', end: '17:00', active: false },
    sunday: { start: '09:00', end: '17:00', active: false },
  },
  services: [
    { 
      id: '1', 
      name: 'Signature lash Lift', 
      description: 'A premium treatment that lifts and curls your natural lashes from the base.',
      price: 85, 
      duration: 60, 
      bookingFeeEnabled: true,
      bookingFeeAmount: 25,
      active: true,
      addOns: [
        { name: 'Tinting', price: 15, description: 'Darken your lashes for a bolder look.' }
      ]
    },
    { 
      id: '2', 
      name: 'Classic Full Set', 
      description: 'Individual lash extensions applied to every single natural lash.',
      price: 150, 
      duration: 120, 
      bookingFeeEnabled: true,
      bookingFeeAmount: 50,
      active: true,
      addOns: []
    }
  ],
  bookings: [
    {
      id: 'b1',
      customerName: 'Sarah Jenkins',
      customerEmail: 'sarah.j@example.com',
      serviceId: '1',
      date: '2026-03-24',
      time: '10:00',
      status: 'upcoming',
      paymentStatus: 'partially_paid',
      totalAmount: 85,
      paidAmount: 25,
      addOns: ['Tinting'],
      createdAt: '2026-03-21T14:30:00Z'
    },
    {
      id: 'b2',
      customerName: 'Michael Chen',
      customerEmail: 'm.chen@example.com',
      serviceId: '2',
      date: '2026-03-25',
      time: '14:00',
      status: 'upcoming',
      paymentStatus: 'pending',
      totalAmount: 150,
      paidAmount: 0,
      addOns: [],
      createdAt: '2026-03-21T16:45:00Z'
    },
    {
      id: 'b3',
      customerName: 'Elena Rodriguez',
      customerEmail: 'elena.r@example.com',
      serviceId: '1',
      date: '2026-03-20',
      time: '11:00',
      status: 'completed',
      paymentStatus: 'paid',
      totalAmount: 85,
      paidAmount: 85,
      addOns: [],
      createdAt: '2026-03-15T09:00:00Z'
    }
  ],
  stripeConnected: false,
  subdomain: 'glow-beauty',
  socials: {
    instagram: '',
    facebook: '',
    twitter: ''
  }
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      business: initialBusinessState,
      onboardingStep: 1,
      isPublished: false,
      
      setUser: (user) => set({ user }),
      updateBusiness: (updates) => 
        set((state) => ({ 
          business: { ...state.business, ...updates } 
        })),
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      setPublished: (status) => set({ isPublished: status }),
      resetOnboarding: () => set({ 
        onboardingStep: 1, 
        business: initialBusinessState,
        isPublished: false 
      }),
    }),
    {
      name: 'bookflow-storage',
    }
  )
);
