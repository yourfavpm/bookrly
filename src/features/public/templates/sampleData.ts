import type { SectionProps } from './types';

export interface SampleBusiness {
  name: string;
  category: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutDescription: string;
  primaryColor: string;
  logo: string | null;
  aboutImage: string | null;
  coverImage: string | null;
  services: Array<{ id: string; name: string; description: string; price: number; duration: number }>;
  proofOfWork: Array<{ id: string; image_url: string; caption: string }>;
  reviews: Array<{ id: string; customer_name: string; rating: number; comment: string }>;
}

export const SAMPLE_DATA: Record<string, SampleBusiness> = {
  noir_editorial: {
    name: "SÉANCE BEAUTÉ",
    category: "High-End Editorial Style",
    heroTitle: "The Art of the Editorial Look",
    heroSubtitle: "High-fashion beauty, cinematic styling, and precision artistry for the modern luxury brand.",
    aboutTitle: "The Vision Behind the Lens",
    aboutDescription: "We don't just apply makeup; we craft visual narratives. Born in the heart of Paris and refined in the studios of New York, Séance Beauté brings a cinematic editorial edge to every client.",
    primaryColor: "#E8CFC0",
    logo: null,
    aboutImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1000&auto=format&fit=crop",
    services: [
      { id: "s1", name: "Editorial Makeup", description: "Camera-ready makeup for film, fashion, and high-end events.", price: 250, duration: 90 },
      { id: "s2", name: "Signature Glow Skin", description: "Advanced skin prep and dew-focused application.", price: 150, duration: 45 },
      { id: "s3", name: "Fashion Hair Styling", description: "Sleek, structural, or avant-garde hair for photography.", price: 180, duration: 60 }
    ],
    proofOfWork: [
      { id: "p1", image_url: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=1000&auto=format&fit=crop", caption: "Vogue Italia Feature" },
      { id: "p2", image_url: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=1000&auto=format&fit=crop", caption: "The New York Collection" },
      { id: "p3", image_url: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1000&auto=format&fit=crop", caption: "Cinematic Glow Prep" }
    ],
    reviews: [
      { id: "r1", customer_name: "Elena Rossi", rating: 5, comment: "Transformative experience. They understood the editorial vibe perfectly." },
      { id: "r2", customer_name: "Julian Chen", rating: 5, comment: "The champagne accents on the site reflect their actual work—luxury and precision." }
    ]
  },
  clean_classic: {
    name: "L’ELIXIR SALON",
    category: "Luxe Editorial",
    heroTitle: "Elegance Defined by Design",
    heroSubtitle: "A destination for those who seek the extraordinary in hair and skin care.",
    aboutTitle: "The Elixir Standard",
    aboutDescription: "Founded on the principles of classic beauty and modern science, L’Elixir is more than a salon—it is a sanctuary for the discerning client.",
    primaryColor: "#111111",
    logo: null,
    aboutImage: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=1000&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1000&auto=format&fit=crop",
    services: [
      { id: "s1", name: "The Signature Cut", description: "Bespoke styling tailored to your unique structure.", price: 150, duration: 75 },
      { id: "s2", name: "Premium Balayage", description: "Artistic color placement for a seamless transition.", price: 400, duration: 150 }
    ],
    proofOfWork: [
      { id: "p1", image_url: "https://images.unsplash.com/photo-1560869713-7d0a29430039?q=80&w=1000&auto=format&fit=crop", caption: "Golden Hour Highlights" }
    ],
    reviews: [
      { id: "r1", customer_name: "Sophia Loren", rating: 5, comment: "Incredible attention to detail." }
    ]
  },
  clean_classic_alt: {
    name: "THE ARCHIVE",
    category: "Trust-First Luxe",
    heroTitle: "Timeless Hair Artistry",
    heroSubtitle: "Where every strand tells a story of precision, passion, and unparalleled care.",
    aboutTitle: "The Legacy of Style",
    aboutDescription: "The Archive was established as a repository of knowledge and skill, bringing together the world's finest stylists to redefine the salon experience.",
    primaryColor: "#333333",
    logo: null,
    aboutImage: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?q=80&w=1000&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1527799822340-304cfec5a271?q=80&w=1000&auto=format&fit=crop",
    services: [
      { id: "s1", name: "Executive Styling", description: "Precision cutting for the modern professional.", price: 100, duration: 45 },
      { id: "s2", name: "Structural Colour", description: "Architectural color application for depth and movement.", price: 280, duration: 120 }
    ],
    proofOfWork: [
      { id: "p1", image_url: "https://images.unsplash.com/photo-1503910397240-93cb0241f6c9?q=80&w=1000&auto=format&fit=crop", caption: "Architectural Cut" }
    ],
    reviews: [
      { id: "r1", customer_name: "John Doe", rating: 5, comment: "The standard for professional hair." }
    ]
  },
  visual_studio: {
    name: "VIVID CAPTURE",
    category: "Creative Photography",
    heroTitle: "Motion, Light, and Life",
    heroSubtitle: "Award-winning commercial and portrait photography that tells a story in every frame.",
    aboutTitle: "Capturing the Unseen",
    aboutDescription: "Vivid Capture is a creative collective focused on high-impact visual storytelling. We specialize in fashion, product, and lifestyle photography.",
    primaryColor: "#ec4899",
    logo: null,
    aboutImage: "https://images.unsplash.com/photo-1492691523567-6172159e7f35?q=80&w=1000&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1000&auto=format&fit=crop",
    services: [
      { id: "s1", name: "Fashion Shoot", description: "Full-day editorial shoot with professional lighting.", price: 1200, duration: 480 },
      { id: "s2", name: "Commercial Product", description: "Staged product photography for high-end brands.", price: 800, duration: 240 }
    ],
    proofOfWork: [
      { id: "p1", image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop", caption: "High-Fashion Portrait" },
      { id: "p2", image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop", caption: "Commercial Campaign" }
    ],
    reviews: [
      { id: "r1", customer_name: "Marc Jacobs", rating: 5, comment: "The best commercial work we've had in years." }
    ]
  },
  visual_studio_alt: {
    name: "MOTION STUDIO",
    category: "Dynamic Video",
    heroTitle: "Stories That Move",
    heroSubtitle: "Cinematic video production for brands that refuse to blend in.",
    aboutTitle: "Motion with Purpose",
    aboutDescription: "We believe that movement captures attention where static fails. Our studio is dedicated to high-motion, high-emotion cinematography.",
    primaryColor: "#f472b6",
    logo: null,
    aboutImage: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1000&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1000&auto=format&fit=crop",
    services: [
      { id: "s1", name: "Social Motion", description: "High-impact short-form video for social platforms.", price: 600, duration: 180 },
      { id: "s2", name: "Brand Narrative", description: "A cinematic film telling your brand's unique story.", price: 2500, duration: 0 }
    ],
    proofOfWork: [
      { id: "p1", image_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop", caption: "The Motion Drop" }
    ],
    reviews: [
      { id: "r1", customer_name: "Sarah Lee", rating: 5, comment: "Captured our brand essence perfectly." }
    ]
  },
  home_services: {
    name: "RENEW HOME PRO",
    category: "Elite Home Care",
    heroTitle: "Expert Care for Your Sanctuary",
    heroSubtitle: "Professional home maintenance, repair, and revitalization services you can trust.",
    aboutTitle: "We Care for Your Home",
    aboutDescription: "With over 15 years of experience, Renew Home Pro provides white-glove maintenance services for premium residences.",
    primaryColor: "#14b8a6",
    logo: null,
    aboutImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6954?q=80&w=1000&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop",
    services: [
      { id: "s1", name: "Full Home Audit", description: "Comprehensive inspection of all major systems.", price: 300, duration: 120 },
      { id: "s2", name: "Premium Gutter Care", description: "Cleaning and structural reinforcement.", price: 200, duration: 90 }
    ],
    proofOfWork: [
      { id: "p1", image_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop", caption: "Gutter Restoration" }
    ],
    reviews: [
      { id: "r1", customer_name: "David Smith", rating: 5, comment: "Professional and thorough. Highly recommend." }
    ]
  },
  home_services_alt: {
    name: "PURE SPACE",
    category: "Eco-Cleaning",
    heroTitle: "A Healthier Home, Naturally",
    heroSubtitle: "Green cleaning services that protect your family and the planet.",
    aboutTitle: "Our Eco Promise",
    aboutDescription: "We use only biodegradable, non-toxic products to ensure your home is as safe as it is clean.",
    primaryColor: "#2dd4bf",
    logo: null,
    aboutImage: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=1000&auto=format&fit=crop",
    services: [
      { id: "s1", name: "Biophilic Clean", description: "Our signature plant-based deep cleaning.", price: 180, duration: 120 },
      { id: "s2", name: "Air Purity Reset", description: "Mechanical air filtration and surface dusting.", price: 75, duration: 45 }
    ],
    proofOfWork: [
      { id: "p1", image_url: "https://images.unsplash.com/photo-1527515637462-cff94fecc1ac?q=80&w=1000&auto=format&fit=crop", caption: "Clean Lines" }
    ],
    reviews: [
      { id: "r1", customer_name: "Emma Watson", rating: 5, comment: "Finally a cleaning service that doesn't smell like chemicals." }
    ]
  },
  modern_appointments: {
    name: "CORE WELLNESS",
    category: "Medical & Wellness",
    heroTitle: "Holistic Health for the Modern Life",
    heroSubtitle: "Evidence-based wellness treatments designed to restore balance and vitality.",
    aboutTitle: "Our Approach",
    aboutDescription: "Core Wellness combines clinical expertise with a holistic philosophy to treat the mind, body, and spirit.",
    primaryColor: "#f59e0b",
    logo: null,
    aboutImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1519824145371-296894a0daa9?q=80&w=1000&auto=format&fit=crop",
    services: [
      { id: "s1", name: "Initial Consultation", description: "Comprehensive health and lifestyle assessment.", price: 150, duration: 60 },
      { id: "s2", name: "Therapeutic Massage", description: "Deep tissue release for chronic tension.", price: 110, duration: 60 }
    ],
    proofOfWork: [
      { id: "p1", image_url: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1000&auto=format&fit=crop", caption: "Therapy Suite" }
    ],
    reviews: [
      { id: "r1", customer_name: "Lisa Wong", rating: 5, comment: "A truly restorative space." }
    ]
  },
  modern_appointments_alt: {
    name: "ZENITH SPA",
    category: "Elite Recovery",
    heroTitle: "Peak Balance, Peak Performance",
    heroSubtitle: "Advanced recovery and spa treatments for the high-performance lifestyle.",
    aboutTitle: "The Zenith Standard",
    aboutDescription: "We provide athlete-grade recovery and high-end spa services to the most demanding individuals.",
    primaryColor: "#fbbf24",
    logo: null,
    aboutImage: "https://images.unsplash.com/photo-1540555700478-4be289a5150a?q=80&w=1000&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=1000&auto=format&fit=crop",
    services: [
      { id: "s1", name: "Cryo-Recovery", description: "Whole-body cryogenic treatment for inflammation.", price: 80, duration: 15 },
      { id: "s2", name: "Infrared Sauna", description: "Private infrared heat therapy session.", price: 45, duration: 30 }
    ],
    proofOfWork: [
      { id: "p1", image_url: "https://images.unsplash.com/photo-1554433607-66b5efe9d304?q=80&w=1000&auto=format&fit=crop", caption: "The Deep Recovery Suite" }
    ],
    reviews: [
      { id: "r1", customer_name: "Chris Evans", rating: 5, comment: "Essential for my recovery routine." }
    ]
  },
  personal_brand: {
    name: "DR. ELIZA VANCE",
    category: "Executive Coaching",
    heroTitle: "Unlock Your Peak Performance",
    heroSubtitle: "Strategic advisory and high-performance coaching for founders and elite executives.",
    aboutTitle: "Meet Eliza",
    aboutDescription: "With a PhD in Psychology and a decade in venture capital, I help leaders navigate high-stakes environments with clarity and purpose.",
    primaryColor: "#8b5cf6",
    logo: null,
    aboutImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop",
    services: [
      { id: "s1", name: "1:1 Strategy Session", description: "High-impact advisory for immediate challenges.", price: 500, duration: 60 },
      { id: "s2", name: "Quarterly Advisory", description: "Retainer-based mentorship for long-term growth.", price: 5000, duration: 0 }
    ],
    proofOfWork: [
      { id: "p1", image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop", caption: "Founder Retreat" }
    ],
    reviews: [
      { id: "r1", customer_name: "The Founder of X", rating: 5, comment: "Eliza is the secret weapon for our executive team." }
    ]
  },
  personal_brand_alt: {
    name: "MARCUS WRIGHT",
    category: "Performance Coach",
    heroTitle: "Master Your Mindset",
    heroSubtitle: "Action-oriented coaching for high-impact creative professionals.",
    aboutTitle: "My Story",
    aboutDescription: "I spent years in the advertising world before realizing that the real creative bottleneck was internal. Now, I help others break through.",
    primaryColor: "#a78bfa",
    logo: null,
    aboutImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop",
    services: [
      { id: "s1", name: "Unstuck Session", description: "Break through a specific creative block.", price: 200, duration: 45 },
      { id: "s2", name: "The Catalyst Program", description: "12-week immersive coaching journey.", price: 3000, duration: 0 }
    ],
    proofOfWork: [
      { id: "p1", image_url: "https://images.unsplash.com/photo-1528605248644-14dd04cb21c7?q=80&w=1000&auto=format&fit=crop", caption: "Workshop Day" }
    ],
    reviews: [
      { id: "r1", customer_name: "Jasmine T.", rating: 5, comment: "Marcus helped me double my creative output." }
    ]
  }
};

export const getSampleBusiness = (templateKey: string, actualBusiness: SectionProps['business']) => {
  const sample = SAMPLE_DATA[templateKey] || SAMPLE_DATA['noir_editorial'];
  
  return {
    ...actualBusiness,
    name: sample.name,
    category: sample.category,
    heroTitle: sample.heroTitle,
    heroSubtitle: sample.heroSubtitle,
    aboutTitle: sample.aboutTitle,
    aboutDescription: sample.aboutDescription,
    primaryColor: sample.primaryColor,
    aboutImage: sample.aboutImage,
    coverImage: sample.coverImage,
    services: sample.services,
    proofOfWork: sample.proofOfWork,
    reviews: sample.reviews,
  };
};
