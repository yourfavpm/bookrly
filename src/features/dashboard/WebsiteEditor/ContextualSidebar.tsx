import React, { useState } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { ChevronLeft, Image as ImageIcon, Type, Layout, Wand2, BookOpen, MessageSquare, ChevronRight, Check, Clock, AlertCircle } from 'lucide-react';
import { ServicesEditor, ReviewsEditor, GalleryEditor, FooterEditor, FAQEditor, BeforeAfterEditor, HeroEditor, AboutEditor, AvailabilityEditor } from './SectionEditors';
import { getEditorSectionLabel, normalizeEditorSectionKey, uploadEditorAsset } from './editorUtils';

interface ContextualSidebarProps {
  onOpenThemeGallery: () => void;
}

export const ContextualSidebar: React.FC<ContextualSidebarProps> = ({ onOpenThemeGallery }) => {
  const { business, updateBusiness, activeEditorSection, setActiveEditorSection } = useAppStore();
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [mainMenu, setMainMenu] = useState<'brand' | 'sections'>('sections');

  if (!business) return null;

  const selectSection = (section: string) => {
    const sectionKey = normalizeEditorSectionKey(section);
    setActiveEditorSection(sectionKey);
    window.setTimeout(() => {
      document.getElementById(`editor-section-${sectionKey}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 80);
  };

  const handleUpload = async (file: File, type: 'logo' | 'cover' | 'about') => {
    if (!file) return;
    setUploading(type);
    setUploadError(null);
    try {
      const publicUrl = await uploadEditorAsset({ businessId: business.id, file, folder: type, maxSizeMb: type === 'logo' ? 5 : 10 });
      if (type === 'logo') updateBusiness({ logo: publicUrl });
      else if (type === 'cover') updateBusiness({ coverImage: publicUrl });
      else if (type === 'about') updateBusiness({ aboutImage: publicUrl });
    } catch (err) {
      setUploadError((err as Error).message);
    } finally {
      setUploading(null);
    }
  };

  // 1. If a section is selected, show its contextual controls
  if (activeEditorSection) {
    return (
      <div className="h-full bg-white border-r border-[#e0e0e0] flex flex-col shrink-0 overflow-y-auto z-10 shadow-xl shadow-black/5 relative">
         <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100 p-4 flex items-center gap-3 z-10">
            <button onClick={() => setActiveEditorSection(null)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-brand transition-colors">
               <ChevronLeft size={18} />
            </button>
            <h2 className="text-sm font-bold text-text-primary tracking-tight">{getEditorSectionLabel(activeEditorSection)} Settings</h2>
         </div>

         <div className="p-6 space-y-8">
            {uploadError && (
              <div className="p-3 rounded-xl border border-red-100 bg-red-50 text-red-600 flex items-start gap-2">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <p className="text-xs leading-relaxed">{uploadError}</p>
              </div>
            )}
            {/* VISIBILITY TOGGLE */}
            {activeEditorSection !== 'hero' && (
              <div className="p-4 rounded-xl border border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="text-xs font-bold text-text-primary">Show Section</h3>
                  <p className="text-[10px] text-text-tertiary">Display this on your website</p>
                </div>
                <button 
                  onClick={() => {
                    const sectionKey = normalizeEditorSectionKey(activeEditorSection);
                    const isHidden = business.hiddenSections?.includes(sectionKey);
                    if (isHidden) {
                      updateBusiness({ hiddenSections: (business.hiddenSections || []).filter(s => normalizeEditorSectionKey(s) !== sectionKey) });
                    } else {
                      updateBusiness({ hiddenSections: [...(business.hiddenSections || []), sectionKey] });
                    }
                  }}
                  className={`w-9 h-5 rounded-full transition-all relative flex items-center px-0.5 cursor-pointer ${!(business.hiddenSections || []).map(normalizeEditorSectionKey).includes(normalizeEditorSectionKey(activeEditorSection)) ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-all ${!(business.hiddenSections || []).map(normalizeEditorSectionKey).includes(normalizeEditorSectionKey(activeEditorSection)) ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            )}

            {/* NEW INLINE EDITORS */}
            {activeEditorSection === 'hero' && <HeroEditor />}
            {activeEditorSection === 'about' && <AboutEditor />}
            {activeEditorSection === 'services' && <ServicesEditor />}
            {activeEditorSection === 'reviews' && <ReviewsEditor />}
            {activeEditorSection === 'gallery' && <GalleryEditor />}
            {activeEditorSection === 'footer' && <FooterEditor />}
            {activeEditorSection === 'faq' && <FAQEditor />}
            {activeEditorSection === 'before_after' && <BeforeAfterEditor />}
            {activeEditorSection === 'availability' && <AvailabilityEditor />}
         </div>
      </div>
    );
  }

  // 2. Default View: Main navigation
  return (
    <div className="h-full bg-white border-r border-[#e0e0e0] flex flex-col shrink-0 overflow-y-auto z-10 shadow-xl shadow-black/5 relative">
      <div className="p-4 border-b border-slate-100 flex flex-col gap-4 sticky top-0 bg-white/90 backdrop-blur-md z-10">
         <button 
           onClick={onOpenThemeGallery}
           className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-brand/5 border border-slate-200 hover:border-brand/30 transition-all group"
         >
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center">
               <Layout size={16} />
             </div>
             <div className="text-left">
               <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Current Theme</p>
               <p className="text-xs font-bold text-text-primary capitalize">{business.templateKey.replace('_', ' ')}</p>
             </div>
           </div>
           <ChevronRight size={16} className="text-slate-400 group-hover:text-brand transition-colors" />
         </button>

         <div className="flex gap-2">
           {[
             { id: 'sections', label: 'Sections' },
             { id: 'brand', label: 'Brand' }
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setMainMenu(tab.id as any)}
               className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
                 mainMenu === tab.id ? 'bg-slate-100 text-brand' : 'text-slate-400 hover:text-slate-600'
               }`}
             >
               {tab.label}
             </button>
           ))}
         </div>
      </div>

      <div className="py-6 flex-1 overflow-y-auto">
        {mainMenu === 'brand' && (
          <div className="flex flex-col h-full">
            <div className="px-5 space-y-8 flex-1 pb-20">
               <div className="space-y-4">
                 <h2 className="text-sm font-bold text-text-primary tracking-tight">Theme Mode</h2>
                 <div className="flex bg-slate-100 p-1 rounded-xl">
                   {['light', 'dark', 'auto'].map(mode => (
                     <button
                       key={mode}
                       onClick={() => updateBusiness({ themeMode: mode as any })}
                       className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                         (business.themeMode || 'light') === mode ? 'bg-white shadow-sm text-brand' : 'text-slate-500 hover:text-slate-700'
                       }`}
                     >
                       {mode}
                     </button>
                   ))}
                 </div>
               </div>

               <div className="space-y-4">
                <h2 className="text-sm font-bold text-text-primary tracking-tight">Colors</h2>
                <div className="p-4 rounded-xl border border-slate-100 flex items-center gap-4 group hover:border-brand/20 transition-all">
                    <input 
                      type="color" 
                      value={business.primaryColor} 
                      onChange={e => updateBusiness({ primaryColor: e.target.value })}
                      className="w-12 h-12 rounded-lg border-none cursor-pointer p-0 overflow-hidden bg-transparent shadow-sm"
                    />
                    <div>
                      <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Brand Accent</p>
                      <p className="text-xs font-mono font-bold text-brand uppercase">{business.primaryColor}</p>
                    </div>
                </div>
             </div>

             <div className="space-y-4">
                <h2 className="text-sm font-bold text-text-primary tracking-tight">Logo</h2>
                <div className="p-4 rounded-xl border border-slate-100 flex items-center gap-4 group hover:border-brand/20 transition-all cursor-pointer relative overflow-hidden">
                    <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center p-1 border border-slate-100">
                      {business.logo ? <img src={business.logo} className="w-full h-full object-contain" /> : <ImageIcon size={16} className="text-slate-300" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-primary">Upload Logo</p>
                      <p className="text-[10px] text-text-tertiary">SVG or PNG</p>
                    </div>
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], 'logo')} />
                    {uploading === 'logo' && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>}
                </div>
             </div>
            </div>
            <div className="sticky bottom-0 p-4 bg-white border-t border-slate-100 mt-4">
               <button 
                 onClick={() => setMainMenu('sections')} 
                 className="w-full bg-text-primary text-white py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-lg shadow-black/5"
               >
                  Continue to Sections <ChevronRight size={16} />
               </button>
            </div>
          </div>
        )}

        {mainMenu === 'sections' && (
          <div className="flex flex-col h-full">
            <div className="px-5 space-y-4 flex-1 pb-20">
               <div>
                <h2 className="text-sm font-bold text-text-primary tracking-tight">Page Sections</h2>
                <p className="text-[10px] text-text-tertiary mt-1">Click a section to edit its content.</p>
             </div>
             
             <div className="space-y-1 mt-4">
                {['hero', 'services', 'about', 'reviews', 'gallery', 'availability', 'faq', 'before_after', 'footer'].map(section => (
                  <button 
                    key={section}
                    onClick={() => selectSection(section)}
                    className="w-full p-3 rounded-lg flex items-center gap-3 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 text-left group"
                  >
                     <div className="text-slate-400 group-hover:text-brand transition-colors">
                        {section === 'hero' ? <Layout size={16} /> :
                         section === 'services' ? <BookOpen size={16} /> :
                         section === 'about' ? <Type size={16} /> :
                         section === 'reviews' ? <MessageSquare size={16} /> :
                         section === 'gallery' ? <ImageIcon size={16} /> :
                         section === 'availability' ? <Clock size={16} /> :
                         section === 'faq' ? <MessageSquare size={16} /> :
                         section === 'before_after' ? <Wand2 size={16} /> : <Layout size={16} />}
                     </div>
                     <span className="text-xs font-bold text-text-primary">{getEditorSectionLabel(section)}</span>
                  </button>
                ))}
             </div>
            </div>
            <div className="sticky bottom-0 p-4 bg-white border-t border-slate-100 mt-4">
               <button 
                 onClick={() => {
                   // Quick completion visual feedback
                   const btn = document.getElementById('finish-setup-btn');
                   if (btn) {
                     btn.innerHTML = '<span class="flex items-center gap-2"><svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Saving...</span>';
                     setTimeout(() => {
                       window.location.href = '/dashboard/overview';
                     }, 800);
                   }
                 }}
                 id="finish-setup-btn"
                 className="w-full bg-brand text-white py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-brand-hover transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand/20"
               >
                  Finish Setup <Check size={16} />
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
