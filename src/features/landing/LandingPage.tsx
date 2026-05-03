import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  ArrowRight, 
  Shield, 
  Zap, 
  Globe, 
  Star,
  Calendar,
  CreditCard,
  Trophy,
  Users,
  DollarSign,
  Check
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

interface Template {
  name: string;
  niche: string;
  image: string;
}

const MarqueeColumn: React.FC<{ 
  templates: Template[]; 
  speed?: number; 
  reverse?: boolean; 
  className?: string;
}> = ({ templates, speed = 20, reverse = false, className = "" }) => {
  // Multiply templates for a seamless loop
  const duplicatedTemplates = [...templates, ...templates];

  return (
    <div className={`flex flex-col gap-6 md:gap-8 ${className}`}>
      <motion.div
        animate={{
          y: reverse ? ["-50%", "0%"] : ["0%", "-50%"],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop"
        }}
        className="flex flex-col gap-6 md:gap-8"
      >
        {duplicatedTemplates.map((template, i) => (
          <div 
            key={i} 
            className="w-[280px] md:w-[360px] flex-none group cursor-pointer"
          >
            <div className="relative aspect-4/5 overflow-hidden bg-white shadow-sm border border-black/3 transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-black/5">
              <img 
                src={template.image} 
                alt={template.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-700" />
            </div>
            <div className="mt-5 space-y-1 px-1">
               <p className="text-[10px] font-bold text-brand uppercase tracking-[0.2em]">{template.niche}</p>
               <h3 className="text-xl font-medium tracking-tight text-black">{template.name}</h3>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};


export const LandingPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const user = useAppStore((state) => state.user);

  // Allow logged-in users to still view the landing page freely.
  // The Login/Signup endpoints natively auto-redirect them if they proceed.

  const companies = [
    { name: 'STUDIO', icon: <div className="w-5 h-5 bg-black rounded-lg" /> },
    { name: 'NOMAD', icon: <Globe size={18} /> },
    { name: 'VELOCITY', icon: <Zap size={18} /> },
    { name: 'FORTRESS', icon: <Shield size={18} /> },
    { name: 'AURORA', icon: <Star size={18} /> },
    { name: 'ZENITH', icon: <div className="w-5 h-5 border-2 border-black rounded-full" /> },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-black selection:bg-brand/10 selection:text-brand font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-[#FAFAF8]/80 backdrop-blur-xl z-50 border-b border-black/3">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-brand rounded-xl flex items-center justify-center shadow-lg shadow-brand/20">
                <div className="w-3.5 h-3.5 bg-white rounded-[2px]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-black">Skeduley</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button size="sm" className="h-10 px-6 font-bold text-[10px] uppercase tracking-widest bg-black text-white hover:bg-black/90 transition-all" style={{ borderRadius: 9999 }}>
                  Go to Dashboard <ArrowRight size={14} className="ml-1.5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/60 hover:text-black transition-colors px-6">Login</Link>
                <Link to="/signup">
                  <Button size="sm" className="h-10 px-6 font-bold text-[10px] uppercase tracking-widest bg-black text-white hover:bg-black/90 transition-all" style={{ borderRadius: 9999 }}>
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-8 lg:pt-28 lg:pb-12 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6"
                >
                  <h1 className="text-4xl lg:text-6xl font-medium tracking-tight leading-[1.08] text-black">
                    Launch your booking website <span className="text-brand">in minutes</span>
                  </h1>
                  
                  <p className="text-xl text-black/70 font-medium leading-relaxed max-w-md">
                    Get booked and paid without the back and forth. Get started for free and only pay $6/mo after 14 days.
                  </p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3 p-1.5 bg-white border border-black/10 rounded-full max-w-md group focus-within:border-brand/40 transition-all shadow-sm"
                >
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 min-w-0 bg-transparent border-none outline-none px-5 py-3 text-sm font-semibold text-black placeholder:text-black/30"
                  />
                  <Button className="h-11 px-7 font-bold shadow-lg shadow-black/5 transition-all hover:scale-[1.02] active:scale-[0.98] bg-black text-white shrink-0 text-sm" style={{ borderRadius: 9999 }}>
                    Get Started
                    <ArrowRight size={15} className="ml-1.5" />
                  </Button>
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex justify-center"
              >
                {/* Light purple decorative drop */}
                <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-[320px] h-[320px] lg:w-[420px] lg:h-[420px] rounded-full bg-brand/7 blur-3xl pointer-events-none" />
                <div className="absolute -right-12 top-1/3 w-[200px] h-[200px] lg:w-[260px] lg:h-[260px] rounded-full bg-brand/5 blur-2xl pointer-events-none" />

                <div className="relative z-10 bg-white/50 backdrop-blur-sm rounded-[32px] lg:rounded-[48px] shadow-2xl shadow-black/5 border border-black/3 overflow-hidden p-1.5 lg:p-2 group max-w-[90%] lg:max-w-[85%]">
                   <img 
                     src="/images/hero_illustration.png" 
                     alt="Skeduley Dashboard"
                     className="w-full h-auto rounded-[26px] lg:rounded-[40px] shadow-sm transform group-hover:scale-[1.01] transition-transform duration-700"
                   />
                </div>
                {/* Floating Elements */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-4 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-black/3 flex items-center gap-3 z-20"
                >
                  <div className="w-8 h-8 bg-brand/5 rounded-lg flex items-center justify-center">
                    <CreditCard size={14} className="text-brand" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-black/60 uppercase tracking-widest">Payment Received</p>
                    <p className="text-sm font-bold tracking-tight text-black">$240.00</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trust Strip */}
        <section className="py-10 bg-white border-y border-black/5">
          <div className="max-w-7xl mx-auto px-6 space-y-8">
            <p className="text-[11px] font-bold text-black/30 uppercase tracking-[0.25em] text-center">Built for service providers in North America</p>
            <div className="overflow-hidden">
              <motion.div 
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear", repeatType: "loop" }}
                className="flex items-center gap-16 whitespace-nowrap select-none"
              >
                {[...companies, ...companies].map((company, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-black">
                    {company.icon}
                    <span className="text-xs font-bold tracking-[0.2em] uppercase">{company.name}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Template Showcase (Moving Gallery Redesign) */}
        <section className="py-32 bg-[#FAFAF8] overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-6 mb-20">
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
               viewport={{ once: true }}
               className="max-w-2xl"
             >
                <div className="flex items-center gap-4 mb-6">
                   <span className="h-px w-12 bg-brand/30" />
                   <span className="text-[12px] font-bold text-brand uppercase tracking-[0.3em]">The Collection</span>
                </div>
                <h2 className="text-5xl lg:text-7xl font-medium tracking-tight text-black leading-[1.1] mb-8">
                   Designed for your <br />
                   <span className="italic font-serif">kind of business</span>
                </h2>
                <p className="text-lg text-black/60 max-w-lg">
                  Beautifully crafted templates optimized for speed, conversion, and your unique brand identity.
                </p>
             </motion.div>
          </div>

          <div className="relative h-[700px] overflow-hidden">
            {/* Gradient Overlays for smooth entry/exit */}
            <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-[#FAFAF8] to-transparent z-10" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#FAFAF8] to-transparent z-10" />

            <div className="flex justify-center gap-6 md:gap-12 px-6">
               <MarqueeColumn 
                 speed={12} 
                 templates={[
                    { name: "Editorial Luxe", niche: "Salon & Spa", image: "/images/templates/salon_luxe.png" },
                    { name: "Minimalist Studio", niche: "Creative Agency", image: "/images/templates/creative_studio.png" },
                    { name: "Active Flow", niche: "Fitness & Yoga", image: "/images/templates/fitness_zen.png" }
                 ]} 
               />
               <MarqueeColumn 
                 speed={10} 
                 reverse
                 className="hidden md:block"
                 templates={[
                    { name: "Professional Core", niche: "Consulting & Law", image: "/images/templates/professional_consulting.png" },
                    { name: "Bold Ink", niche: "Tattoo & Barber", image: "/images/templates/tattoo_ink.png" },
                    { name: "Editorial Luxe", niche: "Salon & Spa", image: "/images/templates/salon_luxe.png" }
                 ]} 
               />
               <MarqueeColumn 
                 speed={14} 
                 className="hidden lg:block lg:mt-32"
                 templates={[
                    { name: "Active Flow", niche: "Fitness & Yoga", image: "/images/templates/fitness_zen.png" },
                    { name: "Professional Core", niche: "Consulting & Law", image: "/images/templates/professional_consulting.png" },
                    { name: "Minimalist Studio", niche: "Creative Agency", image: "/images/templates/creative_studio.png" }
                 ]} 
               />
            </div>
          </div>
        </section>

        {/* Why Skeduley (Editorial Differentiation) */}
        <section className="py-32 bg-white border-t border-black/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-24">
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                 viewport={{ once: true }}
                 className="space-y-6"
               >
                 <span className="text-[12px] font-bold text-brand uppercase tracking-[0.3em]">The Differentiation</span>
                 <h2 className="text-5xl lg:text-7xl font-medium tracking-tight text-black leading-[1.1]">
                   More than a <br />
                   <span className="italic font-serif">booking link</span>
                 </h2>
               </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 relative">
               {/* Vertical Dividers (Desktop) */}
               <div className="absolute inset-y-0 left-1/3 w-px bg-black/3 hidden md:block" />
               <div className="absolute inset-y-0 left-2/3 w-px bg-black/3 hidden md:block" />

               {/* Column 1: Booking Tools */}
               <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                 viewport={{ once: true }}
                 className="pb-16 md:pb-0 md:pr-12 lg:pr-20 group"
               >
                  <div className="space-y-8">
                     <div className="space-y-2">
                        <h3 className="text-[11px] font-bold text-black/40 uppercase tracking-[0.2em]">Competitors</h3>
                        <p className="text-3xl font-medium text-black/90">Booking tools give you a link</p>
                     </div>
                     <ul className="space-y-6">
                        {[
                           "Zero brand control",
                           "Fragmented customer flow",
                           "No custom domains",
                           "Limited SEO discovery"
                        ].map((point, i) => (
                           <li key={i} className="flex items-center gap-3 text-sm font-medium text-black/40 group-hover:text-black/60 transition-colors">
                              <span className="w-1.5 h-1.5 rounded-full bg-black/10" />
                              {point}
                           </li>
                        ))}
                     </ul>
                  </div>
               </motion.div>

               {/* Column 2: Website Builders */}
               <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                 viewport={{ once: true }}
                 className="py-16 md:py-0 border-y border-black/3 md:border-none md:px-12 lg:px-20 group"
               >
                  <div className="space-y-8">
                     <div className="space-y-2">
                        <h3 className="text-[11px] font-bold text-black/40 uppercase tracking-[0.2em]">Alternatives</h3>
                        <p className="text-3xl font-medium text-black/90">Website builders give you complexity</p>
                     </div>
                     <ul className="space-y-6">
                        {[
                           "Steep learning curve",
                           "Decision fatigue",
                           "Performance lag",
                           "Manual plugin management"
                        ].map((point, i) => (
                           <li key={i} className="flex items-center gap-3 text-sm font-medium text-black/40 group-hover:text-black/60 transition-colors">
                              <span className="w-1.5 h-1.5 rounded-full bg-black/10" />
                              {point}
                           </li>
                        ))}
                     </ul>
                  </div>
               </motion.div>

               {/* Column 3: Skeduley */}
               <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                 viewport={{ once: true }}
                 className="pt-16 md:pt-0 md:pl-12 lg:pl-20 group"
               >
                  <div className="space-y-8">
                     <div className="space-y-2">
                        <h3 className="text-[11px] font-bold text-brand uppercase tracking-[0.2em]">The Skeduley Way</h3>
                        <p className="text-3xl font-medium text-black underline decoration-brand/30 decoration-2 underline-offset-8">Skeduley gives you a complete booking website</p>
                     </div>
                     <ul className="space-y-6">
                        {[
                           "Your brand, your domain",
                           "Conversion-optimized flow",
                           "Ready in under 5 minutes",
                           "Unified management dashboard"
                        ].map((point, i) => (
                           <li key={i} className="flex items-center gap-3 text-sm font-bold text-black group-hover:text-brand transition-colors">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                              {point}
                           </li>
                        ))}
                     </ul>
                  </div>
               </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Highlight Strip */}
        <section className="py-16 max-w-7xl mx-auto px-6">
          <div className="bg-black text-white rounded-[48px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
              <div className="absolute -top-1/4 -right-1/4 w-full h-full bg-brand rounded-full blur-[120px]" />
            </div>
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
              <div className="p-10 lg:p-14 text-center space-y-3">
                <Trophy size={24} className="text-brand mx-auto" />
                <p className="text-3xl lg:text-4xl font-bold tracking-tight">#1</p>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Platform for Service Providers</p>
              </div>
              <div className="p-10 lg:p-14 text-center space-y-3">
                <DollarSign size={24} className="text-brand mx-auto" />
                <p className="text-3xl lg:text-4xl font-bold tracking-tight">$300k+</p>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Booking Revenue Processed</p>
              </div>
              <div className="p-10 lg:p-14 text-center space-y-3">
                <Users size={24} className="text-brand mx-auto" />
                <p className="text-3xl lg:text-4xl font-bold tracking-tight">500+</p>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Businesses Powered</p>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial Features Section */}
        <section className="py-24 max-w-7xl mx-auto px-6 overflow-hidden">
          <div className="space-y-4 mb-20">
            <span className="text-[11px] font-bold text-brand uppercase tracking-[0.2em]">What you can do</span>
            <h2 className="text-5xl lg:text-7xl font-medium tracking-tight leading-[0.9] text-black max-w-2xl">
              Everything you need to <i className="font-serif">get booked</i>
            </h2>
          </div>

          <div className="border-t border-black/5">
             {[
               {
                 icon: <Globe size={20} />,
                 label: "Website Builder",
                 title: "Create your conversion-ready website",
                 description: "Launch a stunning, branded booking page in minutes. No designers, no developers — just your vision brought to life with total brand control.",
                 visual: (
                    <div className="w-full h-full bg-black flex items-center justify-center relative group-hover:scale-105 transition-transform duration-1000">
                       <div className="absolute inset-0 bg-linear-to-br from-brand/20 to-transparent" />
                       <div className="relative px-8 py-4 bg-white border border-white/20 shadow-2xl text-[10px] font-bold tracking-widest uppercase">Launch Live</div>
                    </div>
                 )
               },
               {
                 icon: <Calendar size={20} />,
                 label: "Scheduling",
                 title: "Automated bookings, 24/7 efficiency",
                 description: "Let your clients book while you sleep. Our intelligent calendar handles time zones, availability, and reminders without you lifting a finger.",
                 visual: (
                    <div className="w-full h-full bg-[#f8f8f8] p-8 flex flex-col justify-end group-hover:scale-105 transition-transform duration-1000">
                       <div className="space-y-4">
                          {[1,2,3].map(i => (
                             <div key={i} className="h-12 bg-white border border-black/5 flex items-center px-4 justify-between">
                                <span className="w-2 h-2 rounded-full bg-brand" />
                                <div className="w-20 h-2 bg-black/5" />
                                <div className="w-8 h-2 bg-black/5" />
                             </div>
                          ))}
                       </div>
                    </div>
                 )
               },
               {
                 icon: <CreditCard size={20} />,
                 label: "Payments",
                 title: "Accept payments and deposits instantly",
                 description: "Secure your revenue upfront. Integrate Stripe in one click to accept full payments or deposits, reducing no-shows to near zero.",
                 visual: (
                    <div className="w-full h-full bg-brand flex items-center justify-center group-hover:scale-105 transition-transform duration-1000">
                       <div className="text-white text-5xl font-bold tracking-tighter">$4,250.00</div>
                    </div>
                 )
               },
               {
                 icon: <Star size={20} />,
                 label: "Social Proof",
                 title: "Showcase proof and build instant trust",
                 description: "Display beautiful client galleries and verified reviews. Turn your past work into your strongest sales tool with built-in portfolios.",
                 visual: (
                    <div className="w-full h-full bg-black overflow-hidden relative group-hover:scale-105 transition-transform duration-1000">
                       <img src="/images/templates/salon_luxe.png" className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700" alt="Proof" />
                    </div>
                 )
               }
             ].map((feature, i) => (
               <div key={i} className="py-24 border-b border-black/5 group">
                 <div className={`grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center`}>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      viewport={{ once: true }}
                      className={`space-y-8 ${i % 2 === 1 ? 'md:order-last' : ''}`}
                    >
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-black text-white flex items-center justify-center">{feature.icon}</div>
                          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/40">{feature.label}</span>
                       </div>
                       <h3 className="text-4xl lg:text-5xl font-medium tracking-tight leading-[1.1] text-black">{feature.title}</h3>
                       <p className="text-lg text-black/50 font-medium leading-relaxed max-w-md">{feature.description}</p>
                       <div className="pt-4">
                          <button className="text-[11px] font-bold uppercase tracking-widest border-b-2 border-brand pb-1 hover:text-brand transition-colors">Learn more</button>
                       </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      viewport={{ once: true }}
                      className="aspect-video md:aspect-4/3 lg:aspect-video bg-bg-secondary border border-black/5 overflow-hidden relative"
                    >
                       {feature.visual}
                    </motion.div>
                 </div>
               </div>
             ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 bg-[#FAFAF8] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-4 mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <span className="text-[12px] font-bold text-brand uppercase tracking-[0.3em]">Pricing</span>
                <h2 className="text-5xl lg:text-7xl font-medium tracking-tight text-black leading-[1.1]">
                   Built to grow <br />
                   <span className="italic font-serif">with your business</span>
                </h2>
                <p className="text-lg text-black/50 max-w-xl mx-auto font-medium">
                  Aggressive pricing built for global scale. Choose the plan that fits your current stage.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {[
                {
                  id: 'starter',
                  name: 'Starter',
                  price: '$9',
                  annualPrice: '$6',
                  desc: 'For solo providers just getting started',
                  features: ['1 provider profile', 'Free subdomain', 'Unlimited services', 'Email confirmations', 'Mobile website'],
                  cta: 'Start for Free',
                  popular: false
                },
                {
                  id: 'pro',
                  name: 'Pro',
                  price: '$25',
                  annualPrice: '$18',
                  desc: 'For growing providers ready to scale',
                  features: ['Custom domain', 'SMS reminders', 'Analytics dashboard', 'Automated reviews', 'AI website copy'],
                  cta: 'Get Started',
                  popular: true
                },
                {
                  id: 'business',
                  name: 'Business',
                  price: '$59',
                  annualPrice: '$44',
                  desc: 'For multi-staff businesses & salons',
                  features: ['Up to 10 staff', 'Per-staff calendars', 'Packages & bundles', 'Provider mobile app', 'Zero transaction fees'],
                  cta: 'Scale Now',
                  popular: false
                }
              ].map((plan, i) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative p-10 bg-white border flex flex-col rounded-[48px] transition-all hover:shadow-2xl hover:shadow-black/5 ${plan.popular ? 'border-brand ring-1 ring-brand/20 scale-105 z-10' : 'border-black/5'}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-brand text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold tracking-tight text-black mb-2">{plan.name}</h3>
                    <p className="text-sm text-black/50 font-medium leading-relaxed">{plan.desc}</p>
                  </div>

                  <div className="mb-10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold text-black">{plan.annualPrice}</span>
                      <span className="text-black/30 font-medium">/mo</span>
                    </div>
                    <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mt-2">Billed Annually</p>
                  </div>

                  <ul className="space-y-4 mb-12 flex-1">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm font-medium text-black/70">
                        <Check size={16} className="text-brand shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button className={`w-full h-14 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all ${plan.popular ? 'bg-brand text-white shadow-xl shadow-brand/20 hover:scale-[1.02]' : 'bg-black text-white hover:bg-black/90'}`}>
                    {plan.cta}
                  </Button>
                </motion.div>
              ))}
            </div>

            <div className="mt-20 text-center">
              <p className="text-sm text-black/40 font-medium mb-6">Need more? We have an Enterprise plan for chains and franchises.</p>
              <button className="text-sm font-bold text-black hover:text-brand transition-colors border-b border-black pb-1">Contact Sales</button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-black text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-4 space-y-6">
                <span className="text-[11px] font-bold text-brand uppercase tracking-[0.2em]">FAQ</span>
                <h2 className="text-4xl font-bold tracking-tight leading-tight">
                  Questions?<br />We've got answers.
                </h2>
                <p className="text-white/50 font-medium text-sm">
                  Everything you need to know about getting started with Skeduley.
                </p>
              </div>

              <div className="lg:col-span-8 space-y-3">
                {[
                  { q: "How quickly can I launch my booking website?", a: "Most businesses go live in under 10 minutes. Just add your services, set your hours, and share your link." },
                  { q: "Do I need any technical skills?", a: "Not at all. Skeduley is designed for service professionals — no coding, no design experience needed." },
                  { q: "How do payments work?", a: "We integrate directly with Stripe. Your customers pay securely online, and funds go straight to your bank account." },
                  { q: "Can I customize my website to match my brand?", a: "Absolutely. Upload your logo, choose your colors, add your cover image, and write your own content." },
                  { q: "Is there a free plan?", a: "Yes. You can start for free and upgrade as your business grows. No credit card required to get started." },
                  { q: "What types of businesses use Skeduley?", a: "Salons, spas, consultants, coaches, photographers, tattoo artists, barbers — any service-based business." }
                ].map((faq, i) => (
                  <details key={i} className="group">
                    <summary className="flex items-center justify-between p-6 bg-white/3 border border-white/6 rounded-2xl cursor-pointer list-none hover:bg-white/6 transition-all">
                      <span className="font-bold text-sm tracking-tight pr-4">{faq.q}</span>
                      <ChevronRight size={16} className="text-white/40 group-open:rotate-90 transition-transform shrink-0" />
                    </summary>
                    <div className="px-6 pb-6 pt-2">
                      <p className="text-sm text-white/50 font-medium leading-relaxed">{faq.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-28">
          <div className="max-w-2xl mx-auto px-6 text-center space-y-8">
            <h2 className="text-4xl lg:text-5xl font-medium tracking-tight text-black leading-tight">
              Launch your booking website today
            </h2>
            <p className="text-lg text-black/50 font-medium">
              It takes just a few minutes
            </p>
            
            <div className="flex items-center gap-3 p-1.5 bg-white border border-black/8 rounded-full max-w-md mx-auto group focus-within:border-brand/40 transition-all shadow-sm">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 min-w-0 bg-transparent border-none outline-none px-5 py-3 text-sm font-semibold text-black placeholder:text-black/30"
              />
              {user ? (
                <Link to="/dashboard">
                  <Button className="h-11 px-7 font-bold shadow-lg shadow-black/5 transition-all hover:scale-[1.02] active:scale-[0.98] bg-black text-white shrink-0 text-sm" style={{ borderRadius: 9999 }}>
                    Go to Dashboard
                    <ArrowRight size={15} className="ml-1.5" />
                  </Button>
                </Link>
              ) : (
                <Link to="/signup">
                  <Button className="h-11 px-7 font-bold shadow-lg shadow-black/5 transition-all hover:scale-[1.02] active:scale-[0.98] bg-black text-white shrink-0 text-sm" style={{ borderRadius: 9999 }}>
                    Get Started
                    <ArrowRight size={15} className="ml-1.5" />
                  </Button>
                </Link>
              )}
            </div>
            
            <p className="text-black/30 text-[11px] font-bold uppercase tracking-widest">Free to start · No credit card needed</p>
          </div>
        </section>
      </main>


      <footer className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Main Footer Grid */}
          <div className="py-16 grid grid-cols-2 md:grid-cols-4 gap-12">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1 space-y-5">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand rounded-xl flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-sm" />
                </div>
                <span className="text-lg font-bold tracking-tight">Skeduley</span>
              </Link>
              <p className="text-sm text-white/40 font-medium leading-relaxed max-w-xs">
                The easiest way to launch a booking website and accept payments for your service business.
              </p>
              <div className="flex items-center gap-3">
                <a href="#" className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white/60"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white/60"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white/60"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>

            {/* Product Column */}
            <div className="space-y-5">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Product</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-white/60 font-medium hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-sm text-white/60 font-medium hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-sm text-white/60 font-medium hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="text-sm text-white/60 font-medium hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="space-y-5">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-white/60 font-medium hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-sm text-white/60 font-medium hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-white/60 font-medium hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-sm text-white/60 font-medium hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="space-y-5">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-white/60 font-medium hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-white/60 font-medium hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-sm text-white/60 font-medium hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="py-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">© 2026 Skeduley. All rights reserved.</p>
            <p className="text-[10px] text-white/20 font-medium">Made with care for service businesses everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
