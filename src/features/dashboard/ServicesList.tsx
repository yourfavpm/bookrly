import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Plus, Edit2, Trash2, Clock, DollarSign, ShieldCheck, ChevronRight } from 'lucide-react';
import { ServiceEditor } from './ServiceEditor';
import { motion, AnimatePresence } from 'framer-motion';

export const ServicesList: React.FC = () => {
  const { business, deleteService, updateService } = useAppStore();
  const [editingId, setEditingId] = useState<string | null | undefined>(undefined);

  if (!business) return null;

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      await deleteService(id);
    }
  };

  const handleToggleActive = async (id: string) => {
    const service = business.services.find(s => s.id === id);
    if (service) {
      await updateService(id, { ...service, active: !service.active });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
         <div className="space-y-1">
            <h1 className="text-2xl font-light tracking-tight text-text-primary">Services</h1>
            <p className="text-[10px] text-text-tertiary uppercase tracking-widest font-light">Offerings & Pricing</p>
         </div>
         <Button 
           size="sm" 
           className="w-full sm:w-auto rounded-xl font-medium px-6 h-10 shadow-lg shadow-brand/10 transition-all text-[10px] uppercase tracking-widest bg-brand text-white"
           onClick={() => setEditingId(null)}
         >
           <Plus size={16} className="mr-2" />
           Add New
         </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {business.services.length > 0 ? (
          business.services.map((service) => (
            <Card key={service.id} className={`flex flex-col sm:flex-row sm:items-center justify-between group transition-all relative overflow-hidden border-black/5 bg-white shadow-sm rounded-2xl ${!service.active ? 'opacity-60 grayscale' : ''}`}>
               {!service.active && (
                 <div className="absolute top-0 left-0 w-1.5 h-full bg-text-tertiary/20" />
               )}
               <div className="flex items-center gap-8 mb-6 sm:mb-0">
                  <div 
                    className={`w-14 h-14 rounded-lg flex items-center justify-center font-medium text-xl transition-all duration-500 ${service.active ? 'bg-brand/5 text-brand shadow-none border border-brand/10' : 'bg-bg-canvas text-text-tertiary'}`}
                  >
                    {service.name.charAt(0)}
                  </div>
                  <div className="space-y-1 lg:space-y-2">
                    <div className="flex items-center gap-3">
                       <h3 className="font-medium text-base lg:text-lg tracking-tight text-text-primary">
                         {service.name}
                       </h3>
                    </div>
                    {service.description && (
                       <p className="text-[11px] lg:text-xs text-text-tertiary font-normal line-clamp-1 max-w-sm lg:max-w-lg">
                         {service.description}
                       </p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 lg:pt-0">
                       <span className="text-[9px] lg:text-[10px] font-normal text-text-tertiary flex items-center gap-1.5 uppercase tracking-widest bg-bg-secondary/50 px-2.5 py-1 rounded-lg">
                         <Clock size={10} /> {service.duration} MIN
                       </span>
                       <span className="text-[9px] lg:text-[10px] font-medium text-brand flex items-center gap-1.5 uppercase tracking-widest">
                         <DollarSign size={10} /> ${service.price}
                       </span>
                       {service.bookingFeeEnabled && (
                         <span className="text-[9px] lg:text-[10px] font-normal text-success flex items-center gap-1.5 uppercase tracking-widest bg-success/5 px-2.5 py-1 rounded-lg">
                           <ShieldCheck size={10} /> Deposit
                         </span>
                       )}
                    </div>
                  </div>
               </div>
               
               <div className="flex items-center justify-between sm:justify-end gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-border-light/40">
                  <div className="flex items-center gap-2">
                     <button 
                        onClick={() => handleToggleActive(service.id)}
                        className={`h-9 px-4 rounded-lg text-[9px] font-semibold uppercase tracking-widest transition-all ${service.active ? 'bg-bg-canvas text-text-secondary hover:bg-bg-canvas/80' : 'bg-emerald-600 text-white shadow-none'}`}
                     >
                        {service.active ? 'Disable' : 'Enable'}
                     </button>
                     <button 
                        onClick={() => setEditingId(service.id)}
                        className="h-9 w-9 flex items-center justify-center hover:bg-bg-canvas hover:text-brand rounded-lg text-text-tertiary transition-all bg-bg-canvas/20"
                     >
                        <Edit2 size={16} />
                     </button>
                     <button 
                        onClick={() => handleDelete(service.id)}
                        className="h-9 w-9 flex items-center justify-center hover:bg-error/5 hover:text-error rounded-lg text-text-tertiary transition-all bg-bg-canvas/20"
                     >
                        <Trash2 size={16} />
                     </button>
                  </div>
                  <ChevronRight size={14} className="text-text-tertiary sm:hidden" />
               </div>
            </Card>
          ))
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center justify-center py-20 px-6 text-center"
          >
             <div className="relative mb-8 group cursor-pointer" onClick={() => setEditingId(null)}>
                <div className="absolute inset-0 bg-brand/5 rounded-[40px] blur-3xl group-hover:bg-brand/10 transition-colors duration-500" />
                <motion.img 
                  src="/illustrations/empty_services.png" 
                  alt="No services" 
                  className="w-64 h-64 lg:w-80 lg:h-80 object-contain relative z-10"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
             </div>
             <div className="space-y-2 lg:space-y-3 relative z-10 max-w-sm mx-auto">
                <h3 className="text-xl lg:text-2xl font-medium tracking-tight text-text-primary">Ready to launch?</h3>
                <p className="text-xs lg:text-sm text-text-tertiary font-normal leading-relaxed">Create your first service offering to start taking appointments and building your brand.</p>
             </div>
              <Button 
                size="sm" 
                className="mt-8 rounded-lg font-semibold px-8 h-12 shadow-none transition-all text-[10px] uppercase tracking-widest bg-brand text-white"
                onClick={() => setEditingId(null)}
              >
               <Plus size={18} className="mr-2" />
               Create Service
             </Button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {editingId !== undefined && (
          <ServiceEditor 
            serviceId={editingId} 
            onClose={() => setEditingId(undefined)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};
