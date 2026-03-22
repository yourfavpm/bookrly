import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  Star, 
  MapPin, 
  Phone, 
  Instagram, 
  Facebook, 
  ChevronRight, 
  Clock,
  Calendar as CalendarIcon,
  Twitter,
  Mail,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingFlow } from './BookingFlow';

interface PublicWebsiteProps {
  forcedView?: 'desktop' | 'mobile';
}

export const PublicWebsite: React.FC<PublicWebsiteProps> = ({ forcedView }) => {
  const { business } = useAppStore();
  const [isBooking, setIsBooking] = useState(false);
  
  // Determine if we should render as mobile
  const isMobile = forcedView === 'mobile';

  // Scroll to section
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-full bg-white flex flex-col relative font-sans">
      {/* Navigation */}
      <nav className="h-16 px-6 md:px-12 flex items-center justify-between border-b border-border-light sticky top-0 bg-white/95 backdrop-blur-md z-40">
        <div className={`flex items-center gap-2 ${isMobile ? 'scale-90 origin-left' : ''}`}>
           {business.logo ? (
             <img src={business.logo} alt="Logo" className="h-6 w-auto" />
           ) : (
             <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center text-white font-bold italic text-sm" style={{ backgroundColor: business.primaryColor }}>B</div>
           )}
           <span className="text-lg font-bold tracking-tight text-text-primary">{business.name || 'Your Business'}</span>
        </div>
        <div className={`${isMobile ? 'hidden' : 'hidden md:flex'} items-center gap-8`}>
           <button onClick={() => scrollTo('services')} className="text-xs font-bold text-text-secondary hover:text-brand transition-colors bg-transparent border-none cursor-pointer">Services</button>
           <button onClick={() => scrollTo('about')} className="text-xs font-bold text-text-secondary hover:text-brand transition-colors bg-transparent border-none cursor-pointer">About</button>
           <button 
             onClick={() => setIsBooking(true)}
             className="px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-lg transition-all hover:scale-[1.03] active:scale-95 border-none cursor-pointer"
             style={{ backgroundColor: business.primaryColor }}
           >
             Book Now
           </button>
        </div>
        <button 
          onClick={() => setIsBooking(true)}
          className={`${isMobile ? 'block' : 'md:hidden'} p-2 rounded-xl text-white border-none cursor-pointer`} 
          style={{ backgroundColor: business.primaryColor }}
        >
          <CalendarIcon size={18} />
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center text-center overflow-hidden">
        <div className={`absolute inset-0 transition-opacity duration-1000 ${business.coverImage ? 'opacity-100' : 'opacity-0'}`}>
          {business.coverImage && <img src={business.coverImage} className="w-full h-full object-cover" alt="Hero" />}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
        </div>
        <div className={`absolute inset-0 transition-opacity duration-1000 ${business.coverImage ? 'opacity-0' : 'opacity-100'} bg-bg-secondary`} />
        
        <div className="relative z-10 max-w-4xl px-6 space-y-8 py-20">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             className="space-y-6"
           >
              <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl md:text-6xl'} font-black tracking-tight leading-[1.1] ${business.coverImage ? 'text-white' : 'text-text-primary'}`}>
                {business.headline || "Your premium headline goes here"}
              </h1>
              <p className={`${isMobile ? 'text-sm' : 'text-base md:text-lg'} max-w-xl mx-auto leading-relaxed font-medium opacity-90 ${business.coverImage ? 'text-white' : 'text-text-secondary'}`}>
                {business.subtext || "Enter a supporting subheadline that builds trust and explains what you do best."}
              </p>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.4, duration: 0.6 }}
             className="flex flex-col sm:flex-row gap-4 justify-center"
           >
              <button 
                onClick={() => setIsBooking(true)}
                className="px-10 py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all hover:scale-[1.03] active:scale-95 border-none cursor-pointer" 
                style={{ backgroundColor: business.primaryColor }}
              >
                Schedule Now
              </button>
              <button 
                onClick={() => scrollTo('services')}
                className={`px-10 py-4 rounded-2xl font-bold text-lg border-2 backdrop-blur-md transition-all hover:bg-white/10 active:scale-95 cursor-pointer ${business.coverImage ? 'border-white/40 text-white' : 'border-border-default text-text-primary'}`}
              >
                Our Services
              </button>
           </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 max-w-6xl mx-auto w-full space-y-16 text-center">
         <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: business.primaryColor }}>The Experience</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">Our Signature Services</h2>
            <div className="w-12 h-1 mx-auto rounded-full" style={{ backgroundColor: business.primaryColor }} />
         </div>
         <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2 lg:grid-cols-3'} gap-8`}>
            {business.services.map(s => (
               <div key={s.id} className="p-8 rounded-3xl border border-border-light bg-white hover:shadow-xl transition-all duration-500 group flex flex-col items-start text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-[64px] translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-700" style={{ backgroundColor: `${business.primaryColor}08` }} />
                  
                  <div className="flex justify-between items-start w-full mb-8 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-bg-secondary flex items-center justify-center text-text-tertiary transition-all duration-500 group-hover:bg-brand-light/20 group-hover:scale-105" style={{ color: business.primaryColor }}>
                       <Clock size={24} />
                    </div>
                    <span className="text-2xl font-bold tracking-tight" style={{ color: business.primaryColor }}>${s.price}</span>
                  </div>
                  
                  <h3 className="font-bold text-xl mb-3 text-text-primary leading-tight">{s.name}</h3>
                  <p className="text-text-secondary text-sm font-medium leading-relaxed mb-8 line-clamp-3 opacity-80">{s.description}</p>
                  
                  <div className="flex items-center gap-4 mt-auto w-full relative z-10">
                     <div className="flex items-center gap-2 text-[10px] font-bold text-text-tertiary uppercase tracking-widest bg-bg-secondary px-4 py-2 rounded-full">
                        <Clock size={12} /> {s.duration} MIN
                     </div>
                     <button 
                       onClick={() => setIsBooking(true)}
                       className="flex-1 py-3 px-6 rounded-xl text-white font-bold text-xs hover:scale-[1.03] active:scale-95 transition-all shadow-lg border-none cursor-pointer"
                       style={{ backgroundColor: business.primaryColor }}
                     >
                       Book
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* Trust Section - Reviews */}
      {(business.trustSection === 'reviews' || business.trustSection === 'both') && business.reviews.length > 0 && (
        <section id="reviews" className="py-24 bg-bg-secondary/40 w-full px-6 text-center">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="space-y-3">
               <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: business.primaryColor }}>Testimonials</span>
               <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">What our clients say</h2>
               <div className="w-12 h-1 mx-auto rounded-full" style={{ backgroundColor: business.primaryColor }} />
            </div>
            <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2 lg:grid-cols-3'} gap-8`}>
              {business.reviews.map(r => (
                <div key={r.id} className="p-8 rounded-3xl bg-white border border-border-light shadow-sm space-y-6 flex flex-col h-full hover:shadow-lg transition-all duration-500">
                  <div className="flex gap-1.5 text-amber-400">
                    {[1,2,3,4,5].map(s => <Star key={s} size={16} className={s <= r.rating ? 'fill-current' : 'text-border-default'} />)}
                  </div>
                  <p className="text-lg text-text-secondary leading-relaxed font-medium italic opacity-90 overflow-hidden line-clamp-4">"{r.text}"</p>
                  <div className="flex items-center gap-4 pt-6 mt-auto border-t border-dashed border-border-light">
                     <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm" style={{ backgroundColor: `${business.primaryColor}10`, color: business.primaryColor }}>
                        {r.name.charAt(0)}
                     </div>
                     <div className="text-left">
                        <span className="block font-bold text-sm text-text-primary">{r.name}</span>
                        <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Client</span>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Proof of Work Gallery */}
      {(business.trustSection === 'proof' || business.trustSection === 'both') && business.proofOfWork.length > 0 && (
        <section id="gallery" className="py-24 px-6 max-w-7xl mx-auto w-full space-y-16 text-center">
          <div className="space-y-3">
             <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: business.primaryColor }}>Our Work</span>
             <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">Portfolio Showcase</h2>
             <div className="w-12 h-1 mx-auto rounded-full" style={{ backgroundColor: business.primaryColor }} />
          </div>
          <div className={`grid grid-cols-2 ${isMobile ? '' : 'lg:grid-cols-4'} gap-4 md:gap-6`}>
             {business.proofOfWork.map((item, index) => (
               <motion.div 
                 key={item.id}
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 transition={{ delay: index * 0.1 }}
                 viewport={{ once: true }}
                 className="group relative aspect-square rounded-[32px] overflow-hidden shadow-md"
               >
                  {item.image ? (
                    <img src={item.image} alt={item.caption} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-bg-secondary flex items-center justify-center text-text-tertiary">
                       <ImageIcon size={32} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                     <span className="text-white text-xs font-bold tracking-wider uppercase">{item.caption}</span>
                  </div>
               </motion.div>
             ))}
          </div>
        </section>
      )}

      {/* About Section */}
      {business.aboutText && (
        <section id="about" className="py-24 px-6 max-w-6xl mx-auto w-full">
           <div className={`grid grid-cols-1 ${business.aboutImage ? 'lg:grid-cols-2' : ''} gap-16 md:gap-24 items-center`}>
              {business.aboutImage && (
                <div className="relative group">
                   <div className="absolute -top-24 -left-20 w-64 h-64 rounded-full blur-2xl opacity-20 animate-pulse" style={{ backgroundColor: business.primaryColor }} />
                   <img src={business.aboutImage} alt="About Us" className="rounded-[40px] shadow-2xl relative z-10 w-full object-cover aspect-4/5 transform group-hover:scale-[1.01] transition-transform duration-700" />
                </div>
              )}
              <div className="space-y-10 text-left">
                 <div className="space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: business.primaryColor }}>Our Story</span>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary leading-tight">Elevating your lifestyle daily</h2>
                    <div className="w-12 h-1 rounded-full" style={{ backgroundColor: business.primaryColor }} />
                 </div>
                 <p className="text-lg text-text-secondary leading-relaxed font-medium opacity-80 whitespace-pre-wrap">
                   {business.aboutText}
                 </p>
                 <div className="pt-4 flex flex-wrap items-center gap-8">
                    <div className="flex gap-6">
                      {business.socials?.instagram && <a href={business.socials.instagram} target="_blank" rel="noreferrer"><Instagram size={20} className="text-text-tertiary hover:text-brand transition-all cursor-pointer" /></a>}
                      {business.socials?.facebook && <a href={business.socials.facebook} target="_blank" rel="noreferrer"><Facebook size={20} className="text-text-tertiary hover:text-brand transition-all cursor-pointer" /></a>}
                      {business.socials?.twitter && <a href={business.socials.twitter} target="_blank" rel="noreferrer"><Twitter size={20} className="text-text-tertiary hover:text-brand transition-all cursor-pointer" /></a>}
                    </div>
                    <button 
                      onClick={() => setIsBooking(true)}
                      className="text-lg font-bold flex items-center gap-2 group bg-transparent border-none cursor-pointer transition-all hover:translate-x-1" 
                      style={{ color: business.primaryColor }}
                    >
                       Book Visit <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                 </div>
              </div>
           </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-20 bg-bg-secondary w-full px-6 border-t border-border-light">
         <div className="max-w-6xl mx-auto space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
               <div className="col-span-1 md:col-span-2 space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-xl text-white font-bold italic text-sm shadow-lg flex items-center justify-center" style={{ backgroundColor: business.primaryColor }}>B</div>
                     <span className="text-xl font-bold tracking-tight text-text-primary">{business.name}</span>
                  </div>
                  <p className="text-sm text-text-secondary font-medium max-w-sm leading-relaxed opacity-70">A premium service destination. Book your next appointment online in seconds.</p>
               </div>
               <div className="space-y-6">
                  <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.3em]">Contact</span>
                  <ul className="list-none p-0 space-y-3 text-sm font-bold text-text-secondary">
                     {business.address && <li className="flex items-center gap-3"><MapPin size={16} className="text-text-tertiary" /> {business.address}</li>}
                     {business.phone && <li className="flex items-center gap-3"><Phone size={16} className="text-text-tertiary" /> {business.phone}</li>}
                     {business.email && <li className="flex items-center gap-3"><Mail size={16} className="text-text-tertiary" /> {business.email}</li>}
                  </ul>
               </div>
               <div className="space-y-6">
                  <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.3em]">Platform</span>
                  <p className="text-lg font-bold tracking-tight text-text-primary">Powered by <span className="font-black italic" style={{ color: business.primaryColor }}>Bookflow</span></p>
               </div>
            </div>
            <div className="pt-10 border-t border-border-light flex flex-col md:flex-row justify-between items-center gap-6">
               <p className="text-[8px] font-bold text-text-tertiary uppercase tracking-[.25em]">© 2026 {business.name}. ALL RIGHTS RESERVED.</p>
               <div className="flex gap-8 text-[8px] font-bold text-text-tertiary uppercase tracking-[.25em]">
                  <span className="hover:text-text-primary cursor-pointer transition-all">Privacy</span>
                  <span className="hover:text-text-primary cursor-pointer transition-all">Terms</span>
               </div>
            </div>
         </div>
      </footer>

      {/* Booking Flow Modal Overlay */}
      <AnimatePresence>
        {isBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-8 overflow-hidden">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsBooking(false)}
               className="absolute inset-0 bg-text-primary/10 backdrop-blur-xl"
             />
             
             <motion.div 
               initial={{ y: 50, opacity: 0, scale: 0.98 }}
               animate={{ y: 0, opacity: 1, scale: 1 }}
               exit={{ y: 50, opacity: 0, scale: 0.98 }}
               transition={{ type: 'spring', damping: 30, stiffness: 300 }}
               className="relative w-full max-w-4xl h-full md:h-auto md:max-h-[85vh] bg-white md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
             >
                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                   <BookingFlow onCancel={() => setIsBooking(false)} />
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
