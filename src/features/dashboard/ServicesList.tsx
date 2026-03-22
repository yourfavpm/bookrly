import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Plus, Edit2, Trash2, Clock, DollarSign, ShieldCheck, ChevronRight } from 'lucide-react';
import { ServiceEditor } from './ServiceEditor';
import { AnimatePresence } from 'framer-motion';

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
            <h1 className="text-2xl font-black tracking-tight text-text-primary">Services</h1>
            <p className="text-[10px] text-text-tertiary uppercase tracking-widest font-bold">Offerings & Pricing</p>
         </div>
         <Button 
           size="sm" 
           className="w-full sm:w-auto rounded-xl font-bold px-6 h-12 shadow-lg shadow-brand/20 transition-all text-xs uppercase tracking-widest bg-brand text-white"
           onClick={() => setEditingId(null)}
         >
           <Plus size={16} className="mr-2" />
           Add New
         </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
        {business.services.length > 0 ? (
          business.services.map((service) => (
            <Card key={service.id} className={`flex flex-col sm:flex-row sm:items-center justify-between group transition-all p-6 lg:p-8 relative overflow-hidden rounded-[28px] lg:rounded-[32px] border-border-light/60 bg-white ${!service.active ? 'opacity-60 grayscale' : 'hover:shadow-xl'}`}>
               {!service.active && (
                 <div className="absolute top-0 left-0 w-1.5 h-full bg-text-tertiary/20" />
               )}
               <div className="flex items-center gap-5 lg:gap-8 mb-6 sm:mb-0">
                  <div 
                    className={`w-12 h-12 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center font-black text-xl transition-all duration-500 ${service.active ? 'bg-brand/10 text-brand scale-100 group-hover:scale-110' : 'bg-bg-secondary text-text-tertiary'}`}
                  >
                    {service.name.charAt(0)}
                  </div>
                  <div className="space-y-1 lg:space-y-2">
                    <div className="flex items-center gap-3">
                       <h3 className="font-bold text-base lg:text-lg tracking-tight text-text-primary">
                         {service.name}
                       </h3>
                    </div>
                    {service.description && (
                       <p className="text-[11px] lg:text-xs text-text-tertiary line-clamp-1 max-w-sm lg:max-w-lg">
                         {service.description}
                       </p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 lg:pt-0">
                       <span className="text-[9px] lg:text-[10px] font-bold text-text-tertiary flex items-center gap-1.5 uppercase tracking-widest bg-bg-secondary/50 px-2.5 py-1 rounded-lg">
                         <Clock size={10} /> {service.duration} MIN
                       </span>
                       <span className="text-[9px] lg:text-[10px] font-black text-brand flex items-center gap-1.5 uppercase tracking-widest">
                         <DollarSign size={10} /> ${service.price}
                       </span>
                       {service.bookingFeeEnabled && (
                         <span className="text-[9px] lg:text-[10px] font-bold text-success flex items-center gap-1.5 uppercase tracking-widest bg-success/5 px-2.5 py-1 rounded-lg">
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
                       className={`h-9 px-4 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${service.active ? 'bg-bg-secondary text-text-tertiary hover:bg-bg-tertiary' : 'bg-brand text-white'}`}
                    >
                       {service.active ? 'Disable' : 'Enable'}
                    </button>
                    <button 
                       onClick={() => setEditingId(service.id)}
                       className="h-9 w-9 flex items-center justify-center hover:bg-brand/5 hover:text-brand rounded-xl text-text-tertiary transition-all bg-bg-secondary/30"
                    >
                       <Edit2 size={16} />
                    </button>
                    <button 
                       onClick={() => handleDelete(service.id)}
                       className="h-9 w-9 flex items-center justify-center hover:bg-error/5 hover:text-error rounded-xl text-text-tertiary transition-all bg-bg-secondary/30"
                    >
                       <Trash2 size={16} />
                    </button>
                  </div>
                  <ChevronRight size={14} className="text-text-tertiary sm:hidden" />
               </div>
            </Card>
          ))
        ) : (
          <Card className="border-dashed flex flex-col items-center justify-center py-20 text-center bg-bg-secondary/20 group hover:border-brand/40 transition-all cursor-pointer rounded-[40px]" onClick={() => setEditingId(null)}>
             <div className="w-16 h-16 rounded-3xl bg-white shadow-sm flex items-center justify-center text-text-tertiary mb-6 group-hover:bg-brand group-hover:text-white transition-all shadow-xl shadow-brand/5" style={{ '--hover-bg': business.primaryColor } as any}>
               <Plus size={32} />
             </div>
             <p className="text-sm font-bold text-text-primary uppercase tracking-widest">No services yet</p>
             <p className="text-[10px] text-text-tertiary mt-2 font-medium">Create your first offering to start taking bookings.</p>
             <Button 
               size="sm"
               className="mt-8 rounded-xl font-bold h-11 px-8 text-[10px] uppercase tracking-widest bg-brand text-white"
             >
               Add Service
             </Button>
          </Card>
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
