import React, { useState, useEffect } from 'react';
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
  DollarSign
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export const LandingPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const user = useAppStore((state) => state.user);
  const loading = useAppStore((state) => state.loading);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if user is already authenticated
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

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
      <nav className="fixed top-0 left-0 right-0 h-20 bg-[#FAFAF8]/80 backdrop-blur-xl z-50 border-b border-black/[0.03]">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand rounded-xl flex items-center justify-center shadow-lg shadow-brand/20">
                <div className="w-3 h-3 bg-white rounded-sm" />
              </div>
              <span className="text-lg font-bold tracking-tight text-black">Bookflow</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/60 hover:text-black transition-colors px-6">Login</Link>
            <Link to="/signup">
              <Button size="sm" className="h-10 px-6 font-bold text-[10px] uppercase tracking-widest bg-black text-white hover:bg-black/90 transition-all" style={{ borderRadius: 9999 }}>
                Get Started
              </Button>
            </Link>
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
                    Get booked and paid without the back and forth. Get started for free and only pay $10/month after 14 days.
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
                <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-[320px] h-[320px] lg:w-[420px] lg:h-[420px] rounded-full bg-brand/[0.07] blur-3xl pointer-events-none" />
                <div className="absolute -right-12 top-1/3 w-[200px] h-[200px] lg:w-[260px] lg:h-[260px] rounded-full bg-brand/[0.05] blur-2xl pointer-events-none" />

                <div className="relative z-10 bg-white/50 backdrop-blur-sm rounded-[32px] lg:rounded-[48px] shadow-2xl shadow-black/5 border border-black/3 overflow-hidden p-1.5 lg:p-2 group max-w-[90%] lg:max-w-[85%]">
                   <img 
                     src="/images/hero_illustration.png" 
                     alt="Bookflow Dashboard"
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
                animate={{ x: [0, -1200] }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="flex items-center gap-16 whitespace-nowrap select-none"
              >
                {[...companies, ...companies, ...companies, ...companies].map((company, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-black">
                    {company.icon}
                    <span className="text-xs font-bold tracking-[0.2em] uppercase">{company.name}</span>
                  </div>
                ))}
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

        {/* Bento Feature Grid */}
        <section className="py-16 max-w-7xl mx-auto px-6">
          <div className="space-y-4 mb-12">
            <span className="text-[11px] font-bold text-brand uppercase tracking-[0.2em]">What you can do</span>
            <h2 className="text-4xl lg:text-5xl font-medium tracking-tight leading-tight text-black max-w-lg">
              Everything you need to <span className="text-brand">get booked</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Large card */}
            <div className="md:col-span-4 bg-white rounded-[32px] border border-black/5 p-10 space-y-6 group hover:shadow-xl transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/3 h-full bg-brand/3 blur-[80px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white"><Globe size={22} /></div>
              <h3 className="text-2xl font-bold tracking-tight">Create your website</h3>
              <p className="text-black/50 font-medium max-w-sm">Launch a stunning, branded booking page in minutes. No designers, no developers — just you.</p>
            </div>
            {/* Small card */}
            <div className="md:col-span-2 bg-white rounded-[32px] border border-black/5 p-10 space-y-6 group hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center text-white"><Calendar size={22} /></div>
              <h3 className="text-2xl font-bold tracking-tight">Accept bookings</h3>
              <p className="text-black/50 font-medium">24/7 automated scheduling.</p>
            </div>
            {/* Small card */}
            <div className="md:col-span-2 bg-white rounded-[32px] border border-black/5 p-10 space-y-6 group hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white"><CreditCard size={22} /></div>
              <h3 className="text-2xl font-bold tracking-tight">Get paid online</h3>
              <p className="text-black/50 font-medium">Secure Stripe payments, instantly.</p>
            </div>
            {/* Large card */}
            <div className="md:col-span-4 bg-white rounded-[32px] border border-black/5 p-10 space-y-6 group hover:shadow-xl transition-all relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-1/3 h-full bg-brand/3 blur-[80px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center text-white"><Star size={22} /></div>
              <h3 className="text-2xl font-bold tracking-tight">Showcase your proof</h3>
              <p className="text-black/50 font-medium max-w-sm">Display reviews, portfolios, and social proof to build trust before your clients even book.</p>
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
                  Everything you need to know about getting started with Bookflow.
                </p>
              </div>

              <div className="lg:col-span-8 space-y-3">
                {[
                  { q: "How quickly can I launch my booking website?", a: "Most businesses go live in under 10 minutes. Just add your services, set your hours, and share your link." },
                  { q: "Do I need any technical skills?", a: "Not at all. Bookflow is designed for service professionals — no coding, no design experience needed." },
                  { q: "How do payments work?", a: "We integrate directly with Stripe. Your customers pay securely online, and funds go straight to your bank account." },
                  { q: "Can I customize my website to match my brand?", a: "Absolutely. Upload your logo, choose your colors, add your cover image, and write your own content." },
                  { q: "Is there a free plan?", a: "Yes. You can start for free and upgrade as your business grows. No credit card required to get started." },
                  { q: "What types of businesses use Bookflow?", a: "Salons, spas, consultants, coaches, photographers, tattoo artists, barbers — any service-based business." }
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
              <Link to="/signup">
                <Button className="h-11 px-7 font-bold shadow-lg shadow-black/5 transition-all hover:scale-[1.02] active:scale-[0.98] bg-black text-white shrink-0 text-sm" style={{ borderRadius: 9999 }}>
                  Get Started
                  <ArrowRight size={15} className="ml-1.5" />
                </Button>
              </Link>
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
                <span className="text-lg font-bold tracking-tight">Bookflow</span>
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
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">© 2026 Bookflow. All rights reserved.</p>
            <p className="text-[10px] text-white/20 font-medium">Made with care for service businesses everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
