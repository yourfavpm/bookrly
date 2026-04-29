import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import type { StaffMember, StaffAvailability } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  Users, Plus, X, Mail, Phone, Shield, ShieldCheck, User,
  Clock, CheckCircle2, XCircle, ChevronRight, ChevronLeft,
  Copy, Check, Trash2, Save, Scissors
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ROLE_CONFIG = {
  admin: { label: 'Admin', color: 'text-violet-700 bg-violet-50 border-violet-200', icon: ShieldCheck },
  manager: { label: 'Manager', color: 'text-blue-700 bg-blue-50 border-blue-200', icon: Shield },
  staff: { label: 'Staff', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: User },
};

const STATUS_CONFIG = {
  invited: { label: 'Invited', color: 'text-amber-700 bg-amber-50' },
  active: { label: 'Active', color: 'text-emerald-700 bg-emerald-50' },
  inactive: { label: 'Inactive', color: 'text-red-700 bg-red-50' },
};

export const StaffPage: React.FC = () => {
  const { business, addStaff, updateStaff, removeStaff, updateStaffAvailability, assignServicesToStaff } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [drawerTab, setDrawerTab] = useState<'details' | 'services' | 'schedule'>('details');

  // Add Staff Form
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'manager' | 'staff'>('staff');
  const [newServiceIds, setNewServiceIds] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  // Schedule editing
  const [editingHours, setEditingHours] = useState<StaffAvailability[]>([]);
  const [savingSchedule, setSavingSchedule] = useState(false);

  // Invite copy
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!business) return null;

  const staff = business.staff || [];
  const selectedStaff = staff.find(s => s.id === selectedStaffId);

  const handleAddStaff = async () => {
    if (!newName || !newEmail) return;
    setIsAdding(true);
    await addStaff({ name: newName, email: newEmail, phone: newPhone || undefined, role: newRole, serviceIds: newServiceIds });
    setNewName(''); setNewEmail(''); setNewPhone(''); setNewRole('staff'); setNewServiceIds([]);
    setIsAdding(false);
    setShowAddModal(false);
  };

  const handleOpenStaff = (s: StaffMember) => {
    setSelectedStaffId(s.id);
    setDrawerTab('details');
    setEditingHours(
      DAY_NAMES.map((_, i) => {
        const existing = s.availability.find(a => a.dayOfWeek === i);
        return existing || { dayOfWeek: i, startTime: '09:00', endTime: '17:00', isOpen: false };
      })
    );
  };

  const handleSaveSchedule = async () => {
    if (!selectedStaffId) return;
    setSavingSchedule(true);
    await updateStaffAvailability(selectedStaffId, editingHours);
    setSavingSchedule(false);
  };

  const handleCopyInvite = (staff: StaffMember) => {
    if (!staff.inviteToken) return;
    const url = `${window.location.origin}/invite/${staff.inviteToken}`;
    navigator.clipboard.writeText(url);
    setCopiedId(staff.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleService = (serviceId: string) => {
    if (!selectedStaff) return;
    const current = selectedStaff.serviceIds;
    const updated = current.includes(serviceId)
      ? current.filter(id => id !== serviceId)
      : [...current, serviceId];
    assignServicesToStaff(selectedStaff.id, updated);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Team</h1>
          <p className="text-sm text-text-secondary">Manage your staff, assign services, and set individual schedules.</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-brand hover:bg-brand/90 text-white rounded-xl px-6"
        >
          <Plus size={18} className="mr-2" /> Add Staff
        </Button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Staff', value: staff.length, icon: Users },
          { label: 'Active', value: staff.filter(s => s.status === 'active').length, icon: CheckCircle2 },
          { label: 'Invited', value: staff.filter(s => s.status === 'invited').length, icon: Mail },
          { label: 'Services Covered', value: new Set(staff.flatMap(s => s.serviceIds)).size, icon: Scissors },
        ].map(stat => (
          <Card key={stat.label} className="p-5 border-black/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-bg-canvas text-text-tertiary"><stat.icon size={16} /></div>
            </div>
            <p className="text-2xl font-bold text-text-primary tracking-tight">{stat.value}</p>
            <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Staff List */}
      {staff.length === 0 ? (
        <Card className="py-16 text-center border-dashed">
          <div className="p-4 bg-bg-canvas rounded-2xl w-fit mx-auto mb-4"><Users size={32} className="text-text-tertiary" /></div>
          <h3 className="text-lg font-semibold text-text-primary tracking-tight">No team members yet</h3>
          <p className="text-sm text-text-tertiary mt-2 max-w-sm mx-auto">Add your first staff member to start managing schedules and assigning services.</p>
          <Button onClick={() => setShowAddModal(true)} className="mt-6 bg-brand text-white rounded-xl px-6">
            <Plus size={16} className="mr-2" /> Add Your First Staff
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {staff.map((member) => {
            const roleConfig = ROLE_CONFIG[member.role];
            const statusConfig = STATUS_CONFIG[member.status];
            const serviceCount = member.serviceIds.length;
            return (
              <motion.div key={member.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card
                  className="hover:border-brand/30 transition-all cursor-pointer group p-5 lg:p-6 border-black/5 bg-white shadow-sm rounded-2xl"
                  onClick={() => handleOpenStaff(member)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-brand/10 flex items-center justify-center text-brand font-bold text-sm group-hover:bg-brand group-hover:text-white transition-all">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium text-text-primary tracking-tight">{member.name}</h3>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${roleConfig.color}`}>
                            {roleConfig.label}
                          </span>
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                          <span className="text-[10px] text-text-tertiary">{serviceCount} service{serviceCount !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {member.status === 'invited' && member.inviteToken && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCopyInvite(member); }}
                          className="p-2 rounded-lg hover:bg-bg-canvas text-text-tertiary hover:text-brand transition-all"
                          title="Copy invite link"
                        >
                          {copiedId === member.id ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                        </button>
                      )}
                      <ChevronRight size={18} className="text-text-tertiary group-hover:text-brand group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add Staff Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">Add Team Member</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-bg-canvas rounded-xl text-text-tertiary"><X size={18} /></button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Full Name *</label>
                  <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Jane Doe" className="w-full h-12 px-4 rounded-xl border border-border-polaris bg-white text-sm focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Email *</label>
                  <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="jane@example.com" className="w-full h-12 px-4 rounded-xl border border-border-polaris bg-white text-sm focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Phone</label>
                  <input type="tel" value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full h-12 px-4 rounded-xl border border-border-polaris bg-white text-sm focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['staff', 'manager', 'admin'] as const).map(role => {
                      const config = ROLE_CONFIG[role];
                      return (
                        <button key={role} onClick={() => setNewRole(role)} className={`p-3 rounded-xl border text-center transition-all ${newRole === role ? 'border-brand bg-brand/5 shadow-sm' : 'border-border-polaris hover:border-brand/30'}`}>
                          <config.icon size={16} className={`mx-auto mb-1 ${newRole === role ? 'text-brand' : 'text-text-tertiary'}`} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{config.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Assign Services</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {business.services.map(svc => (
                      <button key={svc.id} onClick={() => setNewServiceIds(prev => prev.includes(svc.id) ? prev.filter(id => id !== svc.id) : [...prev, svc.id])}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${newServiceIds.includes(svc.id) ? 'border-brand bg-brand/5' : 'border-border-polaris hover:border-brand/30'}`}>
                        <div className={`w-5 h-5 rounded flex items-center justify-center border ${newServiceIds.includes(svc.id) ? 'bg-brand border-brand text-white' : 'border-border-polaris'}`}>
                          {newServiceIds.includes(svc.id) && <Check size={12} strokeWidth={3} />}
                        </div>
                        <span className="text-sm font-medium text-text-primary">{svc.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button onClick={handleAddStaff} isLoading={isAdding} disabled={!newName || !newEmail} className="w-full h-12 bg-brand text-white rounded-xl font-bold text-[11px] uppercase tracking-widest">
                Add Team Member
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Staff Detail Drawer */}
      <AnimatePresence>
        {selectedStaffId && selectedStaff && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedStaffId(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm hidden lg:block" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col">
              {/* Header */}
              <header className="p-6 border-b border-black/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedStaffId(null)} className="lg:hidden p-2 -ml-2 text-text-tertiary"><ChevronLeft size={24} /></button>
                  <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand font-bold text-lg">
                    {selectedStaff.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">{selectedStaff.name}</h2>
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${ROLE_CONFIG[selectedStaff.role].color}`}>
                      {ROLE_CONFIG[selectedStaff.role].label}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedStaffId(null)} className="hidden lg:block p-2 hover:bg-bg-canvas rounded-xl text-text-tertiary"><X size={20} /></button>
              </header>

              {/* Tabs */}
              <div className="flex border-b border-black/5 px-6">
                {(['details', 'services', 'schedule'] as const).map(tab => (
                  <button key={tab} onClick={() => setDrawerTab(tab)} className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${drawerTab === tab ? 'text-brand border-brand' : 'text-text-tertiary border-transparent hover:text-text-primary'}`}>
                    {tab}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {drawerTab === 'details' && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-bg-canvas/50">
                        <Mail size={16} className="text-text-tertiary" />
                        <span className="text-sm text-text-primary">{selectedStaff.email}</span>
                      </div>
                      {selectedStaff.phone && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-bg-canvas/50">
                          <Phone size={16} className="text-text-tertiary" />
                          <span className="text-sm text-text-primary">{selectedStaff.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Role</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['staff', 'manager', 'admin'] as const).map(role => {
                          const config = ROLE_CONFIG[role];
                          return (
                            <button key={role} onClick={() => updateStaff(selectedStaff.id, { role })} className={`p-3 rounded-xl border text-center transition-all ${selectedStaff.role === role ? 'border-brand bg-brand/5' : 'border-border-polaris hover:border-brand/30'}`}>
                              <config.icon size={16} className={`mx-auto mb-1 ${selectedStaff.role === role ? 'text-brand' : 'text-text-tertiary'}`} />
                              <span className="text-[10px] font-bold uppercase tracking-widest">{config.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {selectedStaff.status === 'invited' && selectedStaff.inviteToken && (
                      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3">
                        <p className="text-xs text-amber-800 font-medium">Invite pending — share the link below:</p>
                        <button onClick={() => handleCopyInvite(selectedStaff)} className="w-full flex items-center justify-center gap-2 py-2 bg-white rounded-lg border border-amber-200 text-xs font-bold text-amber-700 hover:bg-amber-100 transition-all">
                          {copiedId === selectedStaff.id ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Invite Link</>}
                        </button>
                      </div>
                    )}

                    <div className="pt-4 border-t border-black/5">
                      <button onClick={async () => { if (confirm(`Remove ${selectedStaff.name} from your team?`)) { await removeStaff(selectedStaff.id); setSelectedStaffId(null); } }}
                        className="flex items-center gap-2 text-red-500 hover:text-red-700 text-xs font-medium transition-colors">
                        <Trash2 size={14} /> Remove from team
                      </button>
                    </div>
                  </div>
                )}

                {drawerTab === 'services' && (
                  <div className="space-y-3">
                    <p className="text-xs text-text-tertiary">Select which services this team member can perform.</p>
                    {business.services.map(svc => {
                      const assigned = selectedStaff.serviceIds.includes(svc.id);
                      return (
                        <button key={svc.id} onClick={() => handleToggleService(svc.id)}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${assigned ? 'border-brand bg-brand/5' : 'border-border-polaris hover:border-brand/30'}`}>
                          <div className={`w-5 h-5 rounded flex items-center justify-center border ${assigned ? 'bg-brand border-brand text-white' : 'border-border-polaris'}`}>
                            {assigned && <Check size={12} strokeWidth={3} />}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-text-primary">{svc.name}</span>
                            <p className="text-[10px] text-text-tertiary">{svc.duration} min · ${svc.price}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {drawerTab === 'schedule' && (
                  <div className="space-y-4">
                    <p className="text-xs text-text-tertiary">Set this team member's individual weekly availability.</p>
                    {editingHours.map((hour, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border transition-all ${hour.isOpen ? 'border-brand/20 bg-white' : 'border-border-polaris bg-bg-canvas/30 opacity-70'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <button onClick={() => { const updated = [...editingHours]; updated[idx] = { ...hour, isOpen: !hour.isOpen }; setEditingHours(updated); }}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${hour.isOpen ? 'bg-brand text-white' : 'bg-white border border-border-polaris text-text-tertiary'}`}>
                              {hour.isOpen ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                            </button>
                            <span className="text-sm font-medium text-text-primary">{DAY_NAMES[idx]}</span>
                          </div>
                          <span className={`text-[9px] font-bold uppercase tracking-widest ${hour.isOpen ? 'text-brand' : 'text-text-tertiary'}`}>
                            {hour.isOpen ? 'Open' : 'Closed'}
                          </span>
                        </div>
                        {hour.isOpen && (
                          <div className="grid grid-cols-2 gap-3 pl-11">
                            <div className="relative">
                              <Clock size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                              <input type="time" value={hour.startTime} onChange={e => { const updated = [...editingHours]; updated[idx] = { ...hour, startTime: e.target.value }; setEditingHours(updated); }}
                                className="w-full h-10 pl-8 pr-3 rounded-lg border border-border-polaris text-sm focus:outline-none focus:ring-2 focus:ring-brand/10 focus:border-brand" />
                            </div>
                            <div className="relative">
                              <Clock size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                              <input type="time" value={hour.endTime} onChange={e => { const updated = [...editingHours]; updated[idx] = { ...hour, endTime: e.target.value }; setEditingHours(updated); }}
                                className="w-full h-10 pl-8 pr-3 rounded-lg border border-border-polaris text-sm focus:outline-none focus:ring-2 focus:ring-brand/10 focus:border-brand" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <Button onClick={handleSaveSchedule} isLoading={savingSchedule} className="w-full h-12 bg-brand text-white rounded-xl font-bold text-[11px] uppercase tracking-widest">
                      <Save size={16} className="mr-2" /> Save Schedule
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
