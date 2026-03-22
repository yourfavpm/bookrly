import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Star, Clock, MapPin, Phone, Instagram, Facebook, Globe, ShieldCheck, ChevronRight, Image as ImageIcon } from 'lucide-react';

export const PublicPreview: React.FC = () => {
  const { business } = useAppStore();

  if (!business) return null;

  return (
    <div className="min-h-full bg-white flex flex-col">
      {/* Navigation Preview */}
      <nav className="h-20 px-8 flex items-center justify-between border-b border-border-light sticky top-0 bg-white/90 backdrop-blur-md z-40">
        <div className="flex items-center gap-3">
           {business.logo ? (
             <img src={business.logo} alt="Logo" className="h-8 w-auto" />
           ) : (
             <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center text-white font-bold italic text-sm" style={{ backgroundColor: business.primaryColor }}>B</div>
           )}
           <span className="text-lg font-bold tracking-tight">{business.name || 'Your Business'}</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
           <span className="text-sm font-medium text-text-secondary hover:text-brand cursor-pointer">Services</span>
           <span className="text-sm font-medium text-text-secondary hover:text-brand cursor-pointer">About</span>
           <span className="text-sm font-medium text-text-secondary hover:text-brand cursor-pointer">Reviews</span>
           <button 
             className="px-6 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg shadow-brand/10 transition-transform active:scale-95"
             style={{ backgroundColor: business.primaryColor }}
           >
             Book Now
           </button>
        </div>
      </nav>

      {/* Hero Preview */}
      <section className="relative min-h-[600px] flex items-center justify-center text-center overflow-hidden">
        <div className={`absolute inset-0 transition-opacity duration-1000 ${business.coverImage ? 'opacity-100' : 'opacity-0'}`}>
          {business.coverImage && <img src={business.coverImage} className="w-full h-full object-cover" alt="Hero" />}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </div>
        <div className={`absolute inset-0 transition-opacity duration-1000 ${business.coverImage ? 'opacity-0' : 'opacity-100'} bg-bg-secondary`} />
        
        <div className="relative z-10 max-w-3xl px-6 space-y-8 py-20">
           <h1 className={`text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] animate-in fade-in slide-in-from-bottom-6 duration-700 ${business.coverImage ? 'text-white drop-shadow-xl' : 'text-text-primary'}`}>
             {business.heroTitle || "Your premium headline goes here"}
           </h1>
           <p className={`text-lg md:text-xl max-w-xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 ${business.coverImage ? 'text-white/90 drop-shadow-md' : 'text-text-secondary'}`}>
             {business.heroSubtitle || "Enter a supporting subheadline that builds trust and explains what you do best."}
           </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <button 
                className="px-10 py-4 rounded-2xl text-white font-bold text-lg shadow-2xl transition-all hover:scale-[1.03] active:scale-95" 
                style={{ backgroundColor: business.primaryColor }}
              >
                {business.ctaText || 'Book Appointment'}
              </button>
              <button className={`px-10 py-4 rounded-2xl font-bold text-lg border-2 backdrop-blur-md transition-all hover:bg-white/10 active:scale-95 ${business.coverImage ? 'border-white/30 text-white' : 'border-border-default text-text-primary'}`}>
                Our Services
              </button>
           </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 px-6 max-w-6xl mx-auto w-full space-y-16">
         <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">Our Services</h2>
            <div className="w-12 h-1 bg-brand mx-auto rounded-full" style={{ backgroundColor: business.primaryColor }} />
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {business.services.length > 0 ? business.services.map(s => (
               <div key={s.id} className="p-8 rounded-[32px] border border-border-light bg-white hover:shadow-2xl hover:border-brand/10 transition-all duration-500 group cursor-pointer flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="font-bold text-xl group-hover:text-brand transition-colors">{s.name}</h3>
                    <span className="text-lg font-bold text-text-secondary" style={{ color: business.primaryColor }}>${s.price}</span>
                  </div>
                   <div className="flex items-center gap-4 text-xs font-bold text-text-tertiary uppercase tracking-widest mb-10">
                      <span className="flex items-center gap-1.5"><Clock size={14} /> {s.duration} MIN</span>
                      {s.bookingFeeEnabled && (
                        <span className="flex items-center gap-1.5 text-success">
                          <ShieldCheck size={14} /> ${s.bookingFeeAmount} DEPOSIT
                        </span>
                      )}
                   </div>
                  <button className="mt-auto w-full py-4 rounded-2xl border-2 border-border-default font-bold text-sm text-text-secondary group-hover:bg-brand group-hover:text-white group-hover:border-brand transition-all">Select Service</button>
               </div>
            )) : [1, 2, 3].map(i => (
               <div key={i} className="p-8 rounded-[32px] border border-border-light bg-bg-secondary opacity-60 flex flex-col h-64 justify-center items-center text-center">
                  <p className="text-sm font-semibold text-text-tertiary italic">Service item {i} placeholder</p>
               </div>
            ))}
         </div>
      </section>

      {/* Trust Section - Reviews */}
      {(business.trustSection === 'reviews' || business.trustSection === 'both') && (
        <section className="py-32 bg-bg-secondary w-full px-6">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-3">
               <h2 className="text-3xl font-bold tracking-tight">What our clients say</h2>
               <div className="w-12 h-1 bg-brand mx-auto rounded-full" style={{ backgroundColor: business.primaryColor }} />
            </div>
            {business.reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {business.reviews.map(r => (
                  <div key={r.id} className="p-8 rounded-3xl bg-white border border-border-light shadow-sm space-y-6">
                    <div className="flex gap-1 text-amber-400">
                      {[1,2,3,4,5].map(s => <Star key={s} size={16} className={s <= r.rating ? 'fill-current' : 'text-border-default'} />)}
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed italic">"{r.text || 'No review content yet...'}"</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-border-light">
                       <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand font-bold text-xs" style={{ backgroundColor: `${business.primaryColor}15`, color: business.primaryColor }}>
                          {r.name?.charAt(0) || '?'}
                       </div>
                       <span className="font-bold text-sm text-text-primary">{r.name || 'Anonymous'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-text-tertiary italic">No reviews added yet.</div>
            )}
          </div>
        </section>
      )}

      {/* Trust Section - Proof of Work */}
      {(business.trustSection === 'proof' || business.trustSection === 'both') && (
        <section className="py-32 px-6 w-full overflow-hidden">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-3">
               <h2 className="text-3xl font-bold tracking-tight">Recent Results</h2>
               <div className="w-12 h-1 bg-brand mx-auto rounded-full" style={{ backgroundColor: business.primaryColor }} />
            </div>
            {business.proofOfWork.length > 0 ? (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                {business.proofOfWork.map(p => (
                  <div key={p.id} className="break-inside-avoid rounded-3xl overflow-hidden border border-border-light bg-white group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500">
                    <div className="relative">
                      {p.image ? (
                        <img src={p.image} alt={p.caption} className="w-full h-auto" />
                      ) : (
                        <div className="h-64 bg-bg-secondary flex items-center justify-center text-text-tertiary"><ImageIcon size={40} /></div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                         <p className="text-white text-sm font-medium">{p.caption || 'Project visual'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-text-tertiary italic">No proof of work gallery items yet.</div>
            )}
          </div>
        </section>
      )}

      {/* About Section */}
      {business.aboutDescription && (
        <section className="py-32 px-6 max-w-6xl mx-auto w-full">
           <div className={`grid grid-cols-1 ${business.aboutImage ? 'lg:grid-cols-2' : ''} gap-20 items-center`}>
              {business.aboutImage && (
                <div className="relative">
                   <div className="absolute -top-6 -left-6 w-24 h-24 bg-brand/5 rounded-full" style={{ backgroundColor: `${business.primaryColor}10` }} />
                   <img src={business.aboutImage} alt="About Us" className="rounded-3xl shadow-2xl relative z-10 w-full object-cover aspect-4/5" />
                   <div className="absolute -bottom-6 -right-6 w-48 h-48 border-4 border-brand/10 rounded-3xl" style={{ borderColor: `${business.primaryColor}20` }} />
                </div>
              )}
              <div className="space-y-8">
                 <div className="space-y-3">
                    <h2 className="text-3xl font-bold tracking-tight">Our Story</h2>
                    <div className="w-12 h-1 bg-brand rounded-full" style={{ backgroundColor: business.primaryColor }} />
                 </div>
                 <p className="text-lg text-text-secondary leading-relaxed font-normal whitespace-pre-wrap">
                   {business.aboutDescription}
                  </p>
                 <div className="pt-4 flex items-center gap-6">
                    <div className="flex gap-3">
                      <Instagram size={20} className="text-text-tertiary hover:text-brand cursor-pointer transition-colors" />
                      <Facebook size={20} className="text-text-tertiary hover:text-brand cursor-pointer transition-colors" />
                    </div>
                    <div className="h-6 w-px bg-border-light" />
                    <button className="text-sm font-bold text-brand flex items-center gap-2 hover:gap-3 transition-all" style={{ color: business.primaryColor }}>
                       Contact Us <ChevronRight size={16} />
                    </button>
                 </div>
              </div>
           </div>
        </section>
      )}

      {/* Footer Preview */}
      <footer className="py-20 bg-bg-secondary w-full px-6 flex flex-col items-center">
         <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="space-y-6">
              <div className="flex items-center justify-center md:justify-start gap-3">
                 <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center text-white font-bold italic text-sm" style={{ backgroundColor: business.primaryColor }}>B</div>
                 <span className="text-lg font-bold tracking-tight">{business.name}</span>
              </div>
              <p className="text-sm text-text-tertiary font-normal">Premium booking powered by Bookflow Canada.</p>
            </div>
            <div className="space-y-6">
               <h4 className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Navigation</h4>
               <ul className="space-y-4 text-sm font-semibold text-text-secondary">
                  <li className="hover:text-brand cursor-pointer">Services</li>
                  <li className="hover:text-brand cursor-pointer">About Us</li>
                  <li className="hover:text-brand cursor-pointer">Book Appointment</li>
               </ul>
            </div>
            <div className="space-y-6">
               <h4 className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Connect</h4>
               <ul className="space-y-4 text-sm font-semibold text-text-secondary">
                  <li className="flex items-center justify-center md:justify-start gap-3"><MapPin size={16} /> Vancouver, Canada</li>
                  <li className="flex items-center justify-center md:justify-start gap-3"><Phone size={16} /> (555) 123-4567</li>
                  <li className="flex items-center justify-center md:justify-start gap-3"><Globe size={16} /> {business.name.toLowerCase().replace(/\s+/g, '-')}.bookflow.ca</li>
               </ul>
            </div>
         </div>
      </footer>
    </div>
  );
};
