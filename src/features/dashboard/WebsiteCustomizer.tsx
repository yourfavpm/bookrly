import React, { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Input } from '../../components/ui/Input';
import { Palette, Info, Image as ImageIcon, MessageSquare, Users, BookOpen, Instagram, ExternalLink, Sparkles, X, Check, Eye, Wand2, Type, Globe, Layout, Facebook, Twitter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getTemplate, TEMPLATES, getCategories } from '../public/templates/templateRegistry';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const WebsiteCustomizer: React.FC = () => {
  const { business, updateBusiness } = useAppStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('design');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [uploading, setUploading] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const categories = getCategories();

  useEffect(() => {
    if (business && !activeCategory) {
      const currentTpl = TEMPLATES.find(t => t.key === business.templateKey);
      setActiveCategory(currentTpl?.category || categories[0]);
    }
  }, [business, categories]);

  useEffect(() => {
    setIsSaving(true);
    const timer = setTimeout(() => setIsSaving(false), 1000);
    return () => clearTimeout(timer);
  }, [business]);

  const template = useMemo(() => {
    if (!business) return null;
    return getTemplate(business.templateKey || 'beauty_editorial_luxe');
  }, [business?.templateKey]);

  if (!business) return null;

  const handleUpload = async (file: File, type: 'logo' | 'cover' | 'about') => {
    if (!file) return;
    setUploading(type);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}-${Date.now()}.${fileExt}`;
      const filePath = `${business.id}/${fileName}`;
      await supabase.storage.from('business-assets').upload(filePath, file);
      const { data: { publicUrl } } = supabase.storage.from('business-assets').getPublicUrl(filePath);
      if (type === 'logo') await updateBusiness({ logo: publicUrl });
      else if (type === 'cover') await updateBusiness({ coverImage: publicUrl });
      else if (type === 'about') await updateBusiness({ aboutImage: publicUrl });
    } catch (err: any) { alert(err.message); } finally { setUploading(null); }
  };

  const TABS = [
    { id: 'design', label: 'Design', icon: <Palette size={18} /> },
    { id: 'content', label: 'Content', icon: <Type size={18} /> },
    { id: 'details', label: 'Details', icon: <Info size={18} /> },
  ];

  const extractColorFromLogo = () => {
    const colors = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    updateBusiness({ primaryColor: randomColor });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/overview')} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-text-secondary">
            <X size={20} />
          </button>
          <h1 className="text-sm font-semibold text-text-primary tracking-tight">Website Editor</h1>
          <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${isSaving ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
             <div className={`w-1 h-1 rounded-full ${isSaving ? 'bg-amber-600 animate-pulse' : 'bg-emerald-600'}`} />
             {isSaving ? 'Saving' : 'Saved'}
          </div>
        </div>

        <div className="flex items-center gap-3">
           <button 
             onClick={() => window.open('/preview', '_blank')}
             className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-[10px] font-semibold uppercase tracking-widest hover:border-brand hover:text-brand transition-all bg-white"
           >
             <Eye size={14} /> Preview
           </button>
           <button 
             onClick={() => navigate('/dashboard/overview')}
             className="px-6 py-2 rounded-xl bg-text-primary text-white text-[10px] font-semibold uppercase tracking-widest shadow-sm hover:bg-slate-800 transition-colors"
           >
             Finish
           </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/30 p-4 space-y-1 shrink-0 overflow-y-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id ? 'bg-white text-brand shadow-sm border border-slate-200' : 'text-text-secondary hover:bg-white/50'
              }`}
            >
              <div className={`${activeTab === tab.id ? 'text-brand' : 'text-slate-400'}`}>
                {tab.icon}
              </div>
              <span className="text-xs font-semibold">{tab.label}</span>
            </button>
          ))}
          
          <div className="mt-8 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
             <div className="flex items-center gap-2 text-brand mb-1">
                <Globe size={14} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Active Site</span>
             </div>
             <p className="text-[11px] font-medium text-text-primary truncate">{business.subdomain}.bukd.co</p>
          </div>
        </aside>

        {/* Editing Canvas */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12">
           <div className="max-w-5xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-10 pb-20"
                >
                  {activeTab === 'design' && (
                    <div className="space-y-10">
                        <section className="space-y-4">
                          <h2 className="text-lg font-bold tracking-tight text-text-primary">Choose Your Industry</h2>
                          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                            {categories.map(cat => (
                              <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                                  activeCategory === cat ? 'border-brand bg-brand/5 shadow-sm' : 'border-slate-100 hover:border-slate-200'
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeCategory === cat ? 'bg-brand text-white shadow-sm' : 'bg-slate-100 text-slate-400'}`}>
                                  <Users size={16} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider">{cat.replace('_', ' ')}</span>
                              </button>
                            ))}
                          </div>
                        </section>

                        <section className="space-y-4">
                          <h2 className="text-lg font-bold tracking-tight text-text-primary">Select a Template</h2>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {TEMPLATES.filter(t => t.category === activeCategory).map(t => (
                              <button
                                key={t.key}
                                onClick={() => updateBusiness({ templateKey: t.key })}
                                className={`group relative rounded-2xl border-2 aspect-[4/3] overflow-hidden transition-all ${
                                  business.templateKey === t.key ? 'border-brand shadow-md scale-[1.01]' : 'border-slate-100 hover:border-brand/20'
                                }`}
                              >
                                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundColor: t.color }} />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl transition-transform group-hover:scale-110" style={{ backgroundColor: t.color }}>
                                    {t.name.charAt(0)}
                                  </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t border-slate-50 flex items-center justify-between">
                                  <p className="text-[10px] font-bold uppercase tracking-widest">{t.name}</p>
                                  {business.templateKey === t.key && <div className="bg-brand text-white p-1 rounded-full"><Check size={12} strokeWidth={4} /></div>}
                                </div>
                              </button>
                            ))}
                          </div>
                        </section>

                        <section className="space-y-4 pt-4 border-t border-slate-100">
                          <h2 className="text-lg font-bold tracking-tight text-text-primary">Brand Identity</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-6">
                                <div className="relative">
                                  <input 
                                    type="color" 
                                    value={business.primaryColor} 
                                    onChange={e => updateBusiness({ primaryColor: e.target.value })}
                                    className="w-16 h-16 rounded-xl border-none cursor-pointer p-0 overflow-hidden bg-transparent shadow-sm"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary">Brand Color</p>
                                  <p className="text-base font-mono font-bold text-brand uppercase">{business.primaryColor}</p>
                                  <button onClick={extractColorFromLogo} className="text-[9px] font-bold text-brand uppercase tracking-widest flex items-center gap-1.5 hover:underline mt-1">
                                    <Wand2 size={10} /> Sync from logo
                                  </button>
                                </div>
                            </div>
                            <div className="p-6 rounded-2xl bg-white border border-slate-200 flex items-center gap-6 group hover:border-brand/40 transition-colors">
                                <div className="w-16 h-16 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden cursor-pointer group-hover:border-brand/50 transition-all">
                                  {business.logo ? <img src={business.logo} className="w-full h-full object-contain p-2" /> : <ImageIcon size={20} className="text-slate-300" />}
                                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], 'logo')} />
                                  {uploading === 'logo' && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>}
                                </div>
                                <div className="space-y-0.5">
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary">Business Logo</p>
                                  <p className="text-[11px] font-bold text-text-primary">Click to upload</p>
                                  <p className="text-[9px] text-text-tertiary mt-1">SVG or PNG recommended.</p>
                                </div>
                            </div>
                          </div>
                        </section>
                    </div>
                  )}

                  {activeTab === 'content' && (
                    <div className="space-y-12">
                        {template?.sectionOrder.map((section, idx) => {
                          if (section === 'hero') {
                            return (
                              <section key={section} className="space-y-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-brand/5 text-brand flex items-center justify-center"><Layout size={20} /></div>
                                  <h2 className="text-xl font-bold tracking-tight text-text-primary">Hero Section</h2>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                      <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Main Headline</label>
                                        <Input value={business.heroTitle} onChange={e => updateBusiness({ heroTitle: e.target.value })} className="h-11 text-sm rounded-xl px-4 border-slate-200" />
                                      </div>
                                      <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Sub-headline</label>
                                        <textarea 
                                          value={business.heroSubtitle || ''} 
                                          onChange={e => updateBusiness({ heroSubtitle: e.target.value })}
                                          className="w-full p-4 rounded-xl border border-slate-200 text-sm min-h-[100px] focus:outline-none focus:border-brand transition-all"
                                        />
                                      </div>
                                      <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Button Text</label>
                                        <Input value={business.ctaText || ''} onChange={e => updateBusiness({ ctaText: e.target.value })} className="h-11 text-sm rounded-xl px-4 border-slate-200" />
                                      </div>
                                    </div>
                                    <div className="space-y-3">
                                      <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Cover Image</label>
                                      <div className="aspect-video rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center relative overflow-hidden group cursor-pointer hover:border-brand/40 transition-all">
                                          {business.coverImage ? <img src={business.coverImage} className="w-full h-full object-cover" /> : <ImageIcon size={32} className="text-slate-200" />}
                                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white text-[10px] font-bold uppercase tracking-widest">Replace Photo</span>
                                          </div>
                                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], 'cover')} />
                                      </div>
                                    </div>
                                </div>
                                {idx < template.sectionOrder.length - 1 && <div className="pt-10 border-t border-slate-50" />}
                              </section>
                            );
                          }

                          if (section === 'about') {
                            return (
                              <section key={section} className="space-y-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-brand/5 text-brand flex items-center justify-center"><BookOpen size={20} /></div>
                                  <h2 className="text-xl font-bold tracking-tight text-text-primary">About Section</h2>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                      <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Title</label>
                                        <Input value={business.aboutTitle || ''} onChange={e => updateBusiness({ aboutTitle: e.target.value })} className="h-11 text-sm rounded-xl px-4 border-slate-200" />
                                      </div>
                                      <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Description</label>
                                        <textarea 
                                          value={business.aboutDescription || ''} 
                                          onChange={e => updateBusiness({ aboutDescription: e.target.value })}
                                          className="w-full p-4 rounded-xl border border-slate-200 text-sm min-h-[140px] focus:outline-none focus:border-brand transition-all"
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-3">
                                      <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">About Image</label>
                                      <div className="aspect-square max-w-xs rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center relative overflow-hidden group cursor-pointer hover:border-brand/40 transition-all">
                                          {business.aboutImage ? <img src={business.aboutImage} className="w-full h-full object-cover" /> : <ImageIcon size={32} className="text-slate-200" />}
                                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], 'about')} />
                                      </div>
                                    </div>
                                </div>
                                {idx < template.sectionOrder.length - 1 && <div className="pt-10 border-t border-slate-50" />}
                              </section>
                            );
                          }

                          const linkSections: Record<string, { label: string, icon: any, to: string, desc: string }> = {
                            'services': { label: 'Services', icon: <Layout size={18} />, to: '/dashboard/services', desc: 'List of services' },
                            'team': { label: 'Team', icon: <Users size={18} />, to: '/dashboard/staff', desc: 'Staff profiles' },
                            'reviews': { label: 'Reviews', icon: <MessageSquare size={18} />, to: '/dashboard/testimonials', desc: 'Client feedback' },
                            'testimonials': { label: 'Reviews', icon: <MessageSquare size={18} />, to: '/dashboard/testimonials', desc: 'Client feedback' },
                            'gallery': { label: 'Portfolio', icon: <ImageIcon size={18} />, to: '/dashboard/portfolio', desc: 'Work gallery' },
                            'portfolio': { label: 'Portfolio', icon: <ImageIcon size={18} />, to: '/dashboard/portfolio', desc: 'Work gallery' },
                            'schedule': { label: 'Working Hours', icon: <Info size={18} />, to: '/dashboard/settings', desc: 'Availability' }
                          };

                          if (linkSections[section]) {
                            const link = linkSections[section];
                            return (
                              <section key={section} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white text-brand shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
                                      {link.icon}
                                    </div>
                                    <div>
                                      <h3 className="text-sm font-bold text-text-primary">{link.label}</h3>
                                      <p className="text-[10px] text-text-tertiary uppercase tracking-widest">{link.desc}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => navigate(link.to)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-[9px] font-bold uppercase tracking-widest hover:border-brand hover:text-brand transition-all"
                                >
                                  Manage <ExternalLink size={12} />
                                </button>
                              </section>
                            );
                          }
                          return null;
                        })}
                    </div>
                  )}

                  {activeTab === 'details' && (
                    <div className="space-y-12 max-w-3xl">
                        <section className="space-y-6">
                          <h2 className="text-xl font-bold tracking-tight text-text-primary">Contact Info</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Email</label>
                                <Input value={business.email || ''} onChange={e => updateBusiness({ email: e.target.value })} className="h-11 rounded-xl px-4" />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Phone</label>
                                <Input value={business.phone || ''} onChange={e => updateBusiness({ phone: e.target.value })} className="h-11 rounded-xl px-4" />
                              </div>
                              <div className="space-y-1.5 col-span-full">
                                <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Address</label>
                                <Input value={business.address || ''} onChange={e => updateBusiness({ address: e.target.value })} className="h-11 rounded-xl px-4" />
                              </div>
                          </div>
                        </section>

                        <section className="space-y-6 pt-10 border-t border-slate-50">
                          <h2 className="text-xl font-bold tracking-tight text-text-primary">Social Links</h2>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {['instagram', 'facebook', 'twitter'].map(p => (
                                <div key={p} className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest capitalize">{p}</label>
                                  <Input value={business.socials?.[p] || ''} onChange={e => updateBusiness({ socials: { ...business.socials, [p]: e.target.value } })} className="h-11 rounded-xl px-4 text-xs" placeholder="@handle" />
                                </div>
                              ))}
                          </div>
                        </section>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
           </div>
        </div>
      </main>
    </div>
  );
};
