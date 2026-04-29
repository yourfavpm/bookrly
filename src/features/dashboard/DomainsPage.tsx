import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Globe, 
  Copy, 
  Plus, 
  ShieldCheck, 
  ArrowRight,
  Trash2,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBaseDomain, getBusinessUrl } from '../../lib/domainUtils';

export const DomainsPage: React.FC = () => {
  const { business, fetchDomains, addDomain, verifyDomain, deleteDomain, setPrimaryDomain } = useAppStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  const isPro = business?.planType === 'pro' || business?.planType === 'enterprise';

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain) return;
    await addDomain(newDomain, 'custom');
    setNewDomain('');
    setIsAdding(false);
  };

  const handleVerify = async (id: string) => {
    setVerifyingId(id);
    await verifyDomain(id);
    setVerifyingId(null);
  };

  if (!business) return null;

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Domains</h1>
          <p className="text-text-secondary">Manage how clients access your booking site.</p>
        </div>
        <Button 
          onClick={() => setIsAdding(true)}
          disabled={!isPro}
          className="bg-brand text-white rounded-xl px-6 h-12 text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-brand/20 disabled:opacity-50 disabled:grayscale"
        >
          <Plus size={16} className="mr-2" />
          Connect Domain
        </Button>
      </div>

      {!isPro && (
        <Card className="bg-brand/5 border-brand/10 p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand shrink-0">
            <Lock size={20} />
          </div>
          <div className="space-y-1 flex-1">
            <h3 className="font-bold text-text-primary">Custom Domains are a Pro feature</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Connect your own domain (e.g. www.yourname.com) to remove bukd branding and improve SEO.
            </p>
            <div className="pt-3">
              <Button variant="ghost" className="text-brand text-xs font-bold p-0 hover:bg-transparent">
                Upgrade to Pro <ArrowRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-6">
        <h2 className="text-lg font-bold text-text-primary px-1">Your Domains</h2>
        <div className="grid grid-cols-1 gap-4">
          {(business.domains || []).map((domain) => (
            <Card key={domain.id} className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${domain.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                    <Globe size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-text-primary">
                        {domain.type === 'subdomain' ? getBusinessUrl(domain.domain) : domain.domain}
                      </h4>
                      {domain.isPrimary && (
                        <span className="px-2 py-0.5 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest rounded-md">Primary</span>
                      )}
                      {domain.type === 'subdomain' && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[8px] font-black uppercase tracking-widest rounded-md">Subdomain</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${domain.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
                          {domain.status.replace('_', ' ')}
                        </span>
                      </div>
                      {domain.sslEnabled && (
                        <div className="flex items-center gap-1 text-emerald-600">
                          <ShieldCheck size={12} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">SSL Secure</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {domain.status === 'pending_verification' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleVerify(domain.id)}
                      isLoading={verifyingId === domain.id}
                      className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest h-9 px-4 rounded-lg"
                    >
                      Verify DNS
                    </Button>
                  )}
                  {domain.status === 'active' && !domain.isPrimary && (
                    <Button 
                      variant="ghost" 
                      onClick={() => setPrimaryDomain(domain.id)}
                      className="text-text-tertiary text-[10px] font-bold uppercase tracking-widest h-9 px-4 rounded-lg"
                    >
                      Set as Primary
                    </Button>
                  )}
                  <button onClick={() => deleteDomain(domain.id)} className="p-2 text-text-tertiary hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {domain.status === 'pending_verification' && domain.type === 'custom' && (
                <div className="mt-8 pt-8 border-t border-slate-100 space-y-6">
                  <div className="space-y-2">
                    <h5 className="text-[11px] font-black uppercase tracking-widest text-text-tertiary">DNS Configuration Required</h5>
                    <p className="text-sm text-text-secondary">Add these records at your domain provider (GoDaddy, Namecheap, etc.) to verify ownership.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Type: A Record</span>
                        <Copy size={12} className="text-text-tertiary cursor-pointer hover:text-brand" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-text-tertiary">Host: @ (or leave blank)</p>
                        <p className="text-sm font-mono font-bold text-text-primary">76.76.21.21</p>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Type: CNAME</span>
                        <Copy size={12} className="text-text-tertiary cursor-pointer hover:text-brand" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-text-tertiary">Host: www</p>
                        <p className="text-sm font-mono font-bold text-text-primary">proxy.{getBaseDomain()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[40px] p-10 w-full max-w-lg shadow-2xl"
            >
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <h3 className="text-2xl font-bold text-text-primary">Connect Custom Domain</h3>
                  <p className="text-sm text-text-secondary">Enter the domain you'd like to use for your site.</p>
                </div>

                <form onSubmit={handleAdd} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary ml-1">Domain Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. glowsalon.com"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      className="w-full h-14 bg-bg-secondary border-none rounded-2xl px-6 text-sm focus:ring-2 ring-brand/20 outline-none transition-all"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => setIsAdding(false)}
                      className="flex-1 h-14 rounded-2xl text-[11px] font-bold uppercase tracking-widest"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={!newDomain}
                      className="flex-1 h-14 bg-brand text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-brand/20"
                    >
                      Connect Domain
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
