import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  ChevronLeft, 
  Calendar, 
  Mail, 
  Phone,
  CreditCard,
  MessageSquare,
  Trash2,
  Edit3,
  Plus,
  Clock,
  History as HistoryIcon,
  CheckCircle2,
  Save,
  X,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getAvatarColor = (name: string) => {
  const colors = [
    'bg-indigo-500', 'bg-emerald-500', 'bg-blue-500', 
    'bg-amber-500', 'bg-rose-500', 'bg-violet-500', 
    'bg-cyan-500', 'bg-orange-500'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const ClientProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { business, currency, updateClient, deleteClient, addClientNote, deleteClientNote, updateClientNote } = useAppStore();

  const client = business?.clients?.find(c => c.id === id);
  const bookings = useMemo(() => {
    return business?.bookings.filter(b => b.client_id === id) || [];
  }, [business, id]);

  const [activeTab, setActiveTab] = useState<'history' | 'notes' | 'payments'>('history');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(client?.name || '');
  const [editedEmail, setEditedEmail] = useState(client?.email || '');
  const [editedPhone, setEditedPhone] = useState(client?.phone || '');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState('');

  // Stats calculation
  const stats = useMemo(() => {
    const completed = bookings.filter(b => b.status === 'completed');
    const totalVisits = completed.length;
    const totalSpend = completed.reduce((sum, b) => sum + b.totalAmount, 0);
    const avgSpend = totalVisits > 0 ? totalSpend / totalVisits : 0;
    const lastVisit = completed.length > 0 
      ? new Date(Math.max(...completed.map(b => new Date(b.date).getTime())))
      : null;

    return { totalVisits, totalSpend, avgSpend, lastVisit };
  }, [bookings]);

  if (!client || !business) return null;

  const handleSaveProfile = async () => {
    await updateClient(client.id, {
      name: editedName,
      email: editedEmail,
      phone: editedPhone
    });
    setIsEditing(false);
  };

  const handleDeleteClient = async () => {
    if (window.confirm('Are you sure you want to delete this client? Their booking records will be preserved for reporting, but their profile will be hidden.')) {
      await deleteClient(client.id);
      navigate('/dashboard/team'); // Or wherever clients live
    }
  };

  const handleAddNote = async () => {
    if (noteText.trim()) {
      await addClientNote(client.id, noteText.trim());
      setNoteText('');
      setIsAddingNote(false);
    }
  };

  const handleUpdateNote = async (noteId: string) => {
    if (editingNoteText.trim()) {
      await updateClientNote(noteId, editingNoteText.trim());
      setEditingNoteId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Navigation */}
      <button 
        onClick={() => navigate('/dashboard/clients')}
        className="flex items-center gap-2 text-text-tertiary hover:text-brand transition-colors group px-1"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-light">Back to Clients</span>
      </button>

      {/* Header Section */}
      <Card className="p-8 lg:p-10 border-black/5 bg-white shadow-xl relative overflow-hidden rounded-3xl">
         <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full -mr-32 -mt-32 blur-3xl" />
         
         <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
               <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-brand/10 ${getAvatarColor(client.name)}`}>
                  {client.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
               </div>
               
               <div className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-3">
                       <input 
                         className="text-3xl font-light tracking-tight text-text-primary bg-bg-canvas/50 border-b border-brand focus:outline-none w-full max-w-sm"
                         value={editedName}
                         onChange={(e) => setEditedName(e.target.value)}
                         autoFocus
                       />
                       <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-text-secondary">
                             <Phone size={14} />
                             <input 
                               className="text-sm font-light bg-transparent focus:outline-none"
                               value={editedPhone}
                               onChange={(e) => setEditedPhone(e.target.value)}
                             />
                          </div>
                          <div className="flex items-center gap-2 text-text-secondary">
                             <Mail size={14} />
                             <input 
                               className="text-sm font-light bg-transparent focus:outline-none"
                               value={editedEmail}
                               onChange={(e) => setEditedEmail(e.target.value)}
                             />
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                       <h1 className="text-3xl font-light tracking-tight text-text-primary">{client.name}</h1>
                       <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-text-secondary text-sm font-light">
                          <div className="flex items-center gap-1.5"><Phone size={14} /> {client.phone}</div>
                          {client.email && <div className="flex items-center gap-1.5"><Mail size={14} /> {client.email}</div>}
                          <div className="flex items-center gap-1.5 text-text-tertiary">
                             <Calendar size={14} /> Member since {new Date(client.joinDate).toLocaleDateString()}
                          </div>
                       </div>
                       <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
                          {client.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 rounded-full bg-bg-canvas text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                               {tag}
                            </span>
                          ))}
                          <button className="p-1.5 text-text-tertiary hover:text-brand transition-colors"><Plus size={16} /></button>
                       </div>
                    </div>
                  )}
               </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
               {isEditing ? (
                 <>
                   <Button variant="secondary" onClick={() => setIsEditing(false)} className="flex-1 md:flex-none">Cancel</Button>
                   <Button onClick={handleSaveProfile} className="flex-1 md:flex-none"><Save size={16} className="mr-2" /> Save</Button>
                 </>
               ) : (
                 <>
                   <Button variant="secondary" className="p-3 rounded-xl border-border-polaris" onClick={() => setIsEditing(true)}>
                      <Edit3 size={18} />
                   </Button>
                   <Button className="flex-1 md:flex-none bg-brand text-white font-bold text-[11px] uppercase tracking-widest px-8">Book Again</Button>
                   <Button variant="secondary" className="p-3 rounded-xl border-border-polaris text-rose-500 hover:bg-rose-50" onClick={handleDeleteClient}>
                      <Trash2 size={18} />
                   </Button>
                 </>
               )}
            </div>
         </div>

         {/* Stats Strip */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 pt-8 border-t border-black/5">
            {[
              { label: 'Total Visits', value: stats.totalVisits },
              { label: 'Lifetime Spend', value: `${currency === 'CAD' ? 'C$' : '$'}${stats.totalSpend.toFixed(0)}` },
              { label: 'Avg Per Visit', value: `${currency === 'CAD' ? 'C$' : '$'}${stats.avgSpend.toFixed(0)}` },
              { label: 'Last Visit', value: stats.lastVisit ? `${Math.floor((new Date().getTime() - stats.lastVisit.getTime()) / (1000 * 60 * 60 * 24))} days ago` : 'N/A' }
            ].map((stat, i) => (
              <div key={i} className="text-center md:text-left space-y-1">
                 <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest">{stat.label}</p>
                 <p className="text-xl font-light text-text-primary">{stat.value}</p>
              </div>
            ))}
         </div>
      </Card>

      {/* Tabs Section */}
      <div className="space-y-6">
         <div className="flex items-center gap-8 border-b border-black/5 px-2">
            {[
              { id: 'history', label: 'Booking History', icon: HistoryIcon },
              { id: 'notes', label: 'Notes', icon: MessageSquare },
              { id: 'payments', label: 'Payments', icon: CreditCard }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 pb-4 text-sm font-medium transition-all relative ${activeTab === tab.id ? 'text-brand' : 'text-text-tertiary hover:text-text-primary'}`}
              >
                 <tab.icon size={16} />
                 {tab.label}
                 {activeTab === tab.id && (
                   <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />
                 )}
              </button>
            ))}
         </div>

         <AnimatePresence mode="wait">
            {activeTab === 'history' && (
              <motion.div 
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                 {bookings.length > 0 ? (
                   [...bookings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((booking) => {
                     const service = business.services.find(s => s.id === booking.serviceId);
                     const isCanceled = booking.status === 'cancelled';
                     return (
                       <Card key={booking.id} className={`p-6 border-black/5 flex items-center justify-between transition-all ${isCanceled ? 'opacity-50 border-dashed bg-bg-canvas/10' : 'bg-white hover:shadow-md'}`}>
                          <div className="flex items-center gap-5">
                             <div className={`p-3 rounded-2xl ${isCanceled ? 'bg-bg-canvas text-text-tertiary' : 'bg-brand/5 text-brand'}`}>
                                <Calendar size={20} />
                             </div>
                             <div className="space-y-1">
                                <h3 className={`text-sm font-medium tracking-tight ${isCanceled ? 'line-through' : 'text-text-primary'}`}>{service?.name || 'Service Deleted'}</h3>
                                <div className="flex items-center gap-3 text-[11px] text-text-tertiary font-light">
                                   <span className="flex items-center gap-1"><Clock size={12} /> {new Date(booking.date).toLocaleDateString()} at {booking.startTime}</span>
                                   {booking.staffId && <span>• with {business.staff.find(s => s.id === booking.staffId)?.name}</span>}
                                </div>
                             </div>
                          </div>
                          <div className="text-right space-y-1">
                             <p className="text-sm font-medium text-text-primary">{currency === 'CAD' ? 'C$' : '$'}{booking.totalAmount}</p>
                             <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                               booking.status === 'completed' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 
                               booking.status === 'confirmed' ? 'text-brand bg-brand/5 border-brand/10' : 'text-text-tertiary bg-bg-canvas border-border-polaris'
                             }`}>
                                {booking.status}
                             </span>
                          </div>
                       </Card>
                     );
                   })
                 ) : (
                   <div className="py-20 text-center space-y-4 text-text-tertiary bg-bg-canvas/20 rounded-3xl border border-dashed border-border-polaris">
                      <HistoryIcon size={40} className="mx-auto opacity-20" />
                      <p className="text-sm font-light">No booking history yet.</p>
                   </div>
                 )}
                 {bookings.length > 0 && (
                   <div className="pt-4 px-2 text-right">
                      <p className="text-xs text-text-tertiary font-light">
                        {stats.totalVisits} visits • <span className="font-medium text-text-primary">{currency === 'CAD' ? 'C$' : '$'}{stats.totalSpend.toFixed(2)} total</span>
                      </p>
                   </div>
                 )}
              </motion.div>
            )}

            {activeTab === 'notes' && (
              <motion.div 
                key="notes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                 <div className="flex items-center justify-between px-2">
                    <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest flex items-center gap-2">
                       <AlertCircle size={12} /> Only you and your staff can see these
                    </p>
                    {!isAddingNote && (
                      <Button variant="secondary" size="sm" onClick={() => setIsAddingNote(true)} className="h-8 text-[10px] rounded-lg">
                        <Plus size={14} className="mr-1.5" /> Add Note
                      </Button>
                    )}
                 </div>

                 {isAddingNote && (
                   <Card className="p-6 border-brand/30 bg-white shadow-xl animate-in fade-in zoom-in-95">
                      <textarea 
                        autoFocus
                        placeholder="Add a note to remember preferences, allergies, or anything useful..."
                        className="w-full h-24 p-0 bg-transparent focus:outline-none text-sm font-light resize-none"
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        onBlur={() => !noteText.trim() && setIsAddingNote(false)}
                      />
                      <div className="flex items-center justify-end gap-3 pt-4 mt-2 border-t border-black/5">
                         <button onClick={() => setIsAddingNote(false)} className="text-xs text-text-tertiary hover:text-text-primary px-3">Cancel</button>
                         <Button size="sm" onClick={handleAddNote} disabled={!noteText.trim()}>Save Note</Button>
                      </div>
                   </Card>
                 )}

                 <div className="space-y-4">
                    {client.notes.length > 0 ? (
                      [...client.notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(note => (
                        <div key={note.id} className="group relative">
                           <Card className="p-6 border-black/5 bg-white hover:border-brand/20 transition-all">
                              {editingNoteId === note.id ? (
                                <div className="space-y-4">
                                   <textarea 
                                     autoFocus
                                     className="w-full bg-transparent focus:outline-none text-sm font-light resize-none"
                                     value={editingNoteText}
                                     onChange={(e) => setEditingNoteText(e.target.value)}
                                   />
                                   <div className="flex items-center justify-end gap-3 pt-2 border-t border-black/5">
                                      <button onClick={() => setEditingNoteId(null)} className="text-xs text-text-tertiary px-2"><X size={14} /></button>
                                      <button onClick={() => handleUpdateNote(note.id)} className="text-xs text-brand px-2"><Save size={14} /></button>
                                   </div>
                                </div>
                              ) : (
                                <>
                                  <p className="text-sm text-text-primary font-normal leading-relaxed whitespace-pre-wrap">{note.text}</p>
                                  <div className="mt-4 flex items-center justify-between">
                                     <p className="text-[10px] text-text-tertiary font-light">
                                        {new Date(note.createdAt).toLocaleString()} 
                                        {note.staffId && ` • by ${business.staff.find(s => s.id === note.staffId)?.name}`}
                                     </p>
                                     <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                          onClick={() => { setEditingNoteId(note.id); setEditingNoteText(note.text); }}
                                          className="p-1.5 text-text-tertiary hover:text-brand transition-colors"
                                        >
                                           <Edit3 size={14} />
                                        </button>
                                        <button 
                                          onClick={() => deleteClientNote(note.id)}
                                          className="p-1.5 text-text-tertiary hover:text-rose-500 transition-colors"
                                        >
                                           <Trash2 size={14} />
                                        </button>
                                     </div>
                                  </div>
                                </>
                              )}
                           </Card>
                        </div>
                      ))
                    ) : (
                      !isAddingNote && (
                        <div className="py-20 text-center space-y-4 text-text-tertiary bg-bg-canvas/20 rounded-3xl border border-dashed border-border-polaris">
                           <MessageSquare size={40} className="mx-auto opacity-20" />
                           <p className="text-sm font-light">No notes yet. Add a note for preferences or allergies.</p>
                        </div>
                      )
                    )}
                 </div>
              </motion.div>
            )}

            {activeTab === 'payments' && (
              <motion.div 
                key="payments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                 {bookings.length > 0 ? (
                   [...bookings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((booking) => {
                     const service = business.services.find(s => s.id === booking.serviceId);
                     return (
                       <Card key={booking.id} className="p-6 border-black/5 bg-white flex items-center justify-between group hover:shadow-md transition-all">
                          <div className="flex items-center gap-5">
                             <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                                <CreditCard size={20} />
                             </div>
                             <div className="space-y-1">
                                <h3 className="text-sm font-medium tracking-tight text-text-primary">{service?.name || 'Payment'}</h3>
                                <p className="text-[11px] text-text-tertiary font-light">
                                   {new Date(booking.date).toLocaleDateString()} • {booking.paymentStatus === 'paid' ? 'Full Payment' : 'Deposit'} via Card
                                </p>
                             </div>
                          </div>
                          <div className="text-right space-y-1">
                             <p className="text-sm font-medium text-text-primary">{currency === 'CAD' ? 'C$' : '$'}{booking.paidAmount || booking.totalAmount}</p>
                             <div className="flex items-center justify-end gap-1.5">
                                {booking.paymentStatus === 'paid' ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Clock size={12} className="text-amber-500" />}
                                <span className={`text-[9px] font-bold uppercase tracking-widest ${booking.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                   {booking.paymentStatus}
                                </span>
                             </div>
                          </div>
                       </Card>
                     );
                   })
                 ) : (
                   <div className="py-20 text-center space-y-4 text-text-tertiary bg-bg-canvas/20 rounded-3xl border border-dashed border-border-polaris">
                      <CreditCard size={40} className="mx-auto opacity-20" />
                      <p className="text-sm font-light">No transaction history yet.</p>
                   </div>
                 )}
              </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
};
