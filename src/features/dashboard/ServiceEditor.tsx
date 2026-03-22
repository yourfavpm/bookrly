import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { 
  X, 
  Trash2, 
  Plus, 
  Clock, 
  Info,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ServiceEditorProps {
  serviceId: string | null; // null for 'Add New'
  onClose: () => void;
}

export const ServiceEditor: React.FC<ServiceEditorProps> = ({ serviceId, onClose }) => {
  const { business, addService, updateService } = useAppStore();

  const existingService = business?.services.find(s => s.id === serviceId);

  const [formData, setFormData] = useState(() => ({
    id: serviceId || Date.now().toString(),
    name: existingService?.name || '',
    description: existingService?.description || '',
    price: existingService?.price || 0,
    duration: existingService?.duration || 60,
    bookingFeeEnabled: existingService?.bookingFeeEnabled ?? false,
    bookingFeeAmount: existingService?.bookingFeeAmount || 0,
    active: existingService?.active ?? true,
    addOns: existingService?.addOns || []
  }));

  if (!business) return null;

  const handleSave = async () => {
    if (serviceId) {
      await updateService(serviceId, formData);
    } else {
      await addService(formData);
    }
    onClose();
  };

  const handleAddAddOn = () => {
    setFormData({
      ...formData,
      addOns: [...formData.addOns, { id: Date.now().toString(), name: '', price: 0, duration: 0, active: true, description: '' }]
    });
  };

  const handleUpdateAddOn = (index: number, updates: any) => {
    const updatedSub = formData.addOns.map((addon, i) => i === index ? { ...addon, ...updates } : addon);
    setFormData({ ...formData, addOns: updatedSub });
  };

  const handleRemoveAddOn = (index: number) => {
    setFormData({ ...formData, addOns: formData.addOns.filter((_, i) => i !== index) });
  };

  if (!business) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-text-primary/20 backdrop-blur-sm"
      />
      
      {/* Panel */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col"
      >
        <header className="p-6 border-b border-border-light flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${serviceId ? 'bg-brand/10 text-brand' : 'bg-emerald-50 text-emerald-600'}`}>
               {serviceId ? <Clock size={18} /> : <Plus size={18} />}
            </div>
            <div>
              <h2 className="text-lg font-medium tracking-tight text-text-primary">
                {serviceId ? 'Edit Service' : 'Add New Service'}
              </h2>
              <p className="text-[10px] text-text-tertiary uppercase tracking-widest font-normal">Configure your offering</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-bg-secondary rounded-full transition-colors text-text-tertiary">
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {/* Base Info */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-text-tertiary mb-2">
              <Info size={14} />
              <span className="text-[10px] font-normal uppercase tracking-widest">Base Details</span>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-normal text-text-secondary">Service Name</label>
                <Input 
                  placeholder="e.g. Signature Lash Lift"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="rounded-xl"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-normal text-text-secondary">Description</label>
                <textarea 
                  className="w-full p-3 rounded-xl border border-border-default focus:border-brand focus:ring-1 focus:ring-brand/20 outline-none text-sm font-normal transition-all min-h-[100px] resize-none"
                  placeholder="What does this service include?"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-normal text-text-secondary">Basic Price ($)</label>
                  <Input 
                    type="number"
                    placeholder="0.00"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-normal text-text-secondary">Duration (Min)</label>
                  <Input 
                    type="number"
                    placeholder="60"
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 0})}
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Booking Fees */}
          <section className="space-y-6">
             <div className="flex items-center justify-between p-4 rounded-3xl border border-border-light/50 bg-bg-secondary/50">
                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-xl ${formData.bookingFeeEnabled ? 'bg-success/10 text-success' : 'bg-text-tertiary/10 text-text-tertiary'}`}>
                      <ShieldCheck size={18} />
                   </div>
                   <div>
                      <p className="text-sm font-medium text-text-primary">Require Booking Fee</p>
                      <p className="text-[10px] text-text-tertiary font-normal">Take a deposit during booking</p>
                   </div>
                </div>
                <button 
                  onClick={() => setFormData({...formData, bookingFeeEnabled: !formData.bookingFeeEnabled})}
                  className={`w-11 h-6.5 rounded-full transition-all duration-300 relative flex items-center px-1 cursor-pointer ${formData.bookingFeeEnabled ? 'bg-brand shadow-lg shadow-brand/20' : 'bg-bg-tertiary'}`}
                >
                   <div className={`w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-all duration-300 ${formData.bookingFeeEnabled ? 'translate-x-4.5' : 'translate-x-0'}`} />
                </button>
             </div>

             {formData.bookingFeeEnabled && (
               <motion.div 
                 initial={{ opacity: 0, y: -10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="space-y-1.5"
               >
                 <label className="text-xs font-normal text-text-secondary">Booking Fee Amount ($)</label>
                 <Input 
                   type="number"
                   placeholder="25.00"
                   value={formData.bookingFeeAmount || ''}
                   onChange={(e) => setFormData({...formData, bookingFeeAmount: parseFloat(e.target.value) || 0})}
                   className="rounded-xl"
                 />
                 <p className="text-[10px] text-text-tertiary italic mt-1 font-normal flex items-center gap-1">
                   <AlertCircle size={10} /> This amount will be deducted from the total at the appointment.
                 </p>
               </motion.div>
             )}
          </section>

          {/* Add-ons */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-text-tertiary">
                <Plus size={14} />
                <span className="text-[10px] font-normal uppercase tracking-widest">Optional Add-ons</span>
              </div>
              <button 
                onClick={handleAddAddOn}
                className="text-[10px] font-normal text-brand uppercase tracking-widest hover:underline"
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-4">
               {formData.addOns.map((addon, index) => (
                 <div key={index} className="p-5 rounded-[24px] border border-border-light/50 bg-white space-y-4 shadow-sm">
                    <div className="flex justify-between items-start gap-4">
                       <div className="flex-1 space-y-4">
                          <Input 
                            placeholder="Add-on Name (e.g. Lash Tint)"
                            value={addon.name}
                            onChange={(e) => handleUpdateAddOn(index, { name: e.target.value })}
                            className="rounded-xl"
                          />
                          <div className="flex gap-4">
                            <Input 
                              className="w-24 rounded-xl"
                              type="number"
                              placeholder="$0"
                              value={addon.price || ''}
                              onChange={(e) => handleUpdateAddOn(index, { price: parseFloat(e.target.value) || 0 })}
                            />
                            <Input 
                              placeholder="Optional description"
                              value={addon.description}
                              onChange={(e) => handleUpdateAddOn(index, { description: e.target.value })}
                              className="rounded-xl"
                            />
                          </div>
                       </div>
                       <button 
                         onClick={() => handleRemoveAddOn(index)}
                         className="p-2 text-text-tertiary hover:text-error hover:bg-error/5 rounded-lg transition-colors"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                 </div>
               ))}
               
               {formData.addOns.length === 0 && (
                 <div className="text-center py-8 border-2 border-dashed border-border-light/40 rounded-[24px]">
                    <p className="text-[10px] font-normal text-text-tertiary uppercase tracking-widest">No add-ons yet</p>
                 </div>
               )}
            </div>
          </section>

          {/* Status */}
          <section className="pt-6 border-t border-border-light/50">
             <div className="flex items-center justify-between">
                <div>
                   <p className="text-sm font-medium text-text-primary">Service Status</p>
                   <p className="text-[10px] text-text-tertiary font-normal">Active services are visible to customers</p>
                </div>
                <button 
                  onClick={() => setFormData({...formData, active: !formData.active})}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-normal uppercase tracking-widest transition-colors ${formData.active ? 'bg-success/10 text-success' : 'bg-text-tertiary/10 text-text-tertiary'}`}
                >
                   {formData.active ? 'Active' : 'Inactive'}
                </button>
             </div>
          </section>
        </div>

        <footer className="p-8 border-t border-border-light/50 bg-bg-secondary/30 flex gap-4 pb-24 lg:pb-8">
          <Button variant="secondary" className="flex-1 rounded-xl font-medium h-12" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1 rounded-xl font-medium h-12 bg-brand text-white shadow-lg shadow-brand/10" onClick={handleSave}>
            {serviceId ? 'Save Changes' : 'Create Service'}
          </Button>
        </footer>
      </motion.div>
    </div>
  );
};
