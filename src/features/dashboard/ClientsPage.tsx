import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  UserCheck, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  MessageSquare,
  Plus,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Helper to generate consistent color from name hash
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

export const ClientsPage: React.FC = () => {
  const { business, currency, addClientNote } = useAppStore();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showNoteModal, setShowNoteModal] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const clients = business?.clients || [];
  const bookings = business?.bookings || [];

  // Compute stats
  const totalClients = clients.length;
  const newClientsThisMonth = useMemo(() => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    return clients.filter(c => new Date(c.joinDate) >= startOfMonth).length;
  }, [clients]);

  const stats = useMemo(() => {
    const completedBookings = bookings.filter(b => b.status === 'completed');
    const totalRevenue = completedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const avgLTV = totalClients > 0 ? totalRevenue / totalClients : 0;
    
    // Retention: % who booked more than once
    const clientVisitCounts: Record<string, number> = {};
    completedBookings.forEach(b => {
      if (b.client_id) {
        clientVisitCounts[b.client_id] = (clientVisitCounts[b.client_id] || 0) + 1;
      }
    });
    const repeatClients = Object.values(clientVisitCounts).filter(count => count > 1).length;
    const retentionRate = totalClients > 0 ? (repeatClients / totalClients) * 100 : 0;

    return { avgLTV, retentionRate };
  }, [bookings, totalClients]);

  // Process clients with computed fields for list
  const processedClients = useMemo(() => {
    return clients.map(client => {
      const clientBookings = bookings.filter(b => b.client_id === client.id);
      const completed = clientBookings.filter(b => b.status === 'completed');
      const totalVisits = completed.length;
      const lifetimeSpend = completed.reduce((sum, b) => sum + b.totalAmount, 0);
      const lastVisitDate = completed.length > 0 
        ? new Date(Math.max(...completed.map(b => new Date(b.date).getTime())))
        : null;

      return {
        ...client,
        totalVisits,
        lifetimeSpend,
        lastVisitDate
      };
    });
  }, [clients, bookings]);

  // Filtering
  const filteredClients = useMemo(() => {
    return processedClients.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             client.phone.includes(searchQuery) ||
                             (client.email && client.email.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTag = tagFilter === 'all' || client.tags.includes(tagFilter);
      return matchesSearch && matchesTag;
    }).sort((a, b) => {
      const dateA = a.lastVisitDate ? a.lastVisitDate.getTime() : 0;
      const dateB = b.lastVisitDate ? b.lastVisitDate.getTime() : 0;
      return dateB - dateA;
    });
  }, [processedClients, searchQuery, tagFilter]);

  // Pagination
  const pageSize = 25;
  const totalPages = Math.ceil(filteredClients.length / pageSize);
  const paginatedClients = filteredClients.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // All unique tags
  const allTags = Array.from(new Set(clients.flatMap(c => c.tags)));

  const handleAddNote = async () => {
    if (showNoteModal && noteText.trim()) {
      await addClientNote(showNoteModal, noteText.trim());
      setShowNoteModal(null);
      setNoteText('');
    }
  };

  const isStarter = business?.planType === 'free';
  const clientLimit = 50;
  const isNearLimit = isStarter && totalClients >= 45;

  if (!business) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Starter Upsell */}
      {isNearLimit && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="bg-brand/5 border border-brand/20 rounded-xl p-4 flex items-center justify-between gap-4 overflow-hidden"
        >
          <div className="flex items-center gap-3">
             <div className="p-2 bg-brand/10 rounded-lg text-brand">
                <AlertCircle size={18} />
             </div>
             <div>
                <p className="text-sm font-medium text-text-primary">You're almost at your client limit ({totalClients} / {clientLimit} clients)</p>
                <p className="text-xs text-text-secondary font-light">Upgrade to Pro for unlimited clients and advanced marketing tools.</p>
             </div>
          </div>
          <Button 
            size="sm" 
            className="bg-brand text-white text-[10px] uppercase tracking-widest font-bold px-6 h-9"
            onClick={() => navigate('/dashboard/settings?section=billing')}
          >
            Upgrade Now
          </Button>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div>
           <h1 className="text-2xl font-light tracking-tight text-text-primary">Client Base</h1>
           <p className="text-sm text-text-secondary font-light">Manage your customer relationships effortlessly.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative group">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand transition-colors" />
              <input 
                type="text" 
                placeholder="Search name, phone or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-10 w-full md:w-64 bg-white border border-border-polaris rounded-xl text-sm font-light focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
              />
           </div>
           <select 
             className="h-10 bg-white border border-border-polaris rounded-xl text-sm font-light px-4 focus:outline-none focus:ring-2 focus:ring-brand/20"
             value={tagFilter}
             onChange={(e) => setTagFilter(e.target.value)}
           >
              <option value="all">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
           </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
         {[
           { label: 'Total Clients', value: totalClients, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
           { label: 'New This Month', value: newClientsThisMonth, icon: UserPlus, color: 'text-emerald-600', bg: 'bg-emerald-50' },
           { label: 'Average LTV', value: `${currency === 'CAD' ? 'C$' : '$'}${stats.avgLTV.toFixed(0)}`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
           { label: 'Retention Rate', value: `${stats.retentionRate.toFixed(0)}%`, icon: UserCheck, color: 'text-rose-600', bg: 'bg-rose-50' }
         ].map((stat, i) => (
           <Card key={i} className="p-6 border-black/5 bg-white shadow-sm hover:shadow-md transition-all flex flex-col gap-4">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                 <stat.icon size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{stat.label}</p>
                 <p className="text-2xl font-light text-text-primary mt-1">{stat.value}</p>
              </div>
           </Card>
         ))}
      </div>

      {/* Client List */}
      <Card className="border-black/5 bg-white shadow-sm overflow-hidden rounded-2xl">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-bg-canvas/40 border-b border-black/5">
                     <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Client</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest hidden md:table-cell">Contact</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest hidden lg:table-cell">Last Visit</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest text-center">Visits</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest text-right">Spend</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest hidden lg:table-cell">Tags</th>
                     <th className="px-6 py-4 w-10"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-black/5">
                  {paginatedClients.length > 0 ? (
                    paginatedClients.map((client) => (
                      <motion.tr 
                        key={client.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => navigate(`/dashboard/clients/${client.id}`)}
                        className={`group hover:bg-bg-canvas/20 cursor-pointer transition-colors ${client.totalVisits === 0 ? 'opacity-60 grayscale-[0.5]' : ''}`}
                      >
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold ${getAvatarColor(client.name)}`}>
                                  {client.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                               </div>
                               <div>
                                  <p className="text-sm font-medium text-text-primary group-hover:text-brand transition-colors">{client.name}</p>
                                  <p className="text-[11px] text-text-tertiary font-light md:hidden">{client.phone}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-4 hidden md:table-cell">
                            <div className="space-y-0.5">
                               <p className="text-xs font-light text-text-primary">{client.phone}</p>
                               <p className="text-[11px] font-light text-text-tertiary">{client.email || 'No email'}</p>
                            </div>
                         </td>
                         <td className="px-6 py-4 hidden lg:table-cell">
                            <p className="text-xs font-light text-text-primary">
                               {client.lastVisitDate ? client.lastVisitDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never'}
                            </p>
                            {client.lastVisitDate && (
                              <p className="text-[10px] text-text-tertiary font-light">
                                {Math.floor((new Date().getTime() - client.lastVisitDate.getTime()) / (1000 * 60 * 60 * 24))} days ago
                              </p>
                            )}
                         </td>
                         <td className="px-6 py-4 text-center">
                            <span className="text-xs font-medium text-text-primary">{client.totalVisits}</span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <span className="text-xs font-medium text-text-primary">
                              {currency === 'CAD' ? 'C$' : '$'}{client.lifetimeSpend.toFixed(0)}
                            </span>
                         </td>
                         <td className="px-6 py-4 hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1.5 justify-end">
                               {client.tags.length > 0 ? (
                                 client.tags.slice(0, 2).map(tag => (
                                   <span key={tag} className="px-2 py-0.5 rounded-md bg-bg-canvas text-[9px] font-bold uppercase tracking-wider text-text-tertiary">
                                      {tag}
                                   </span>
                                 ))
                               ) : (
                                 <span className="text-[10px] text-text-tertiary font-light italic">No tags</span>
                               )}
                               {client.tags.length > 2 && <span className="text-[9px] font-bold text-text-tertiary">+{client.tags.length - 2}</span>}
                            </div>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button 
                                 onClick={(e) => { e.stopPropagation(); setShowNoteModal(client.id); }}
                                 className="p-2 hover:bg-white rounded-lg text-text-tertiary hover:text-brand transition-all"
                                 title="Add Note"
                               >
                                  <Plus size={16} />
                               </button>
                               <button 
                                 onClick={(e) => { 
                                   e.stopPropagation(); 
                                   // Pre-fill booking flow (mock logic - would need store update to handle client prefill)
                                   window.open(`/preview`, '_blank');
                                 }}
                                 className="p-2 hover:bg-white rounded-lg text-text-tertiary hover:text-brand transition-all"
                                 title="Book Again"
                               >
                                  <Calendar size={16} />
                               </button>
                            </div>
                         </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                       <td colSpan={7} className="px-6 py-20 text-center">
                          <div className="flex flex-col items-center gap-4">
                             <div className="w-20 h-20 rounded-full bg-bg-canvas flex items-center justify-center text-text-tertiary">
                                <Users size={32} />
                             </div>
                             <div className="space-y-1">
                                <h3 className="text-lg font-medium text-text-primary tracking-tight">
                                   {searchQuery ? 'No matching clients' : 'Your first client will appear here'}
                                </h3>
                                <p className="text-sm text-text-tertiary font-light max-w-xs mx-auto">
                                   {searchQuery ? `No clients match "${searchQuery}". Try a different search.` : 'Clients are automatically added when they book an appointment on your website.'}
                                </p>
                             </div>
                             {!searchQuery && (
                               <Button 
                                 variant="secondary" 
                                 onClick={() => window.open(`/preview`, '_blank')}
                                 className="rounded-lg h-10 px-6 font-bold text-[10px] uppercase tracking-widest border-border-polaris"
                               >
                                  <ExternalLink size={14} className="mr-2" />
                                  Preview Booking Page
                               </Button>
                             )}
                          </div>
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>

         {/* Pagination */}
         {totalPages > 1 && (
           <div className="px-6 py-4 border-t border-black/5 flex items-center justify-between bg-bg-canvas/10">
              <p className="text-xs text-text-tertiary font-light">
                 Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredClients.length)} of {filteredClients.length} clients
              </p>
              <div className="flex items-center gap-2">
                 <Button 
                   variant="secondary" 
                   size="sm" 
                   disabled={currentPage === 1}
                   onClick={() => setCurrentPage(p => p - 1)}
                   className="p-2 h-9 w-9 rounded-lg border-border-polaris"
                 >
                    <ChevronLeft size={16} />
                 </Button>
                 <span className="text-xs font-medium px-2">{currentPage} / {totalPages}</span>
                 <Button 
                   variant="secondary" 
                   size="sm" 
                   disabled={currentPage === totalPages}
                   onClick={() => setCurrentPage(p => p + 1)}
                   className="p-2 h-9 w-9 rounded-lg border-border-polaris"
                 >
                    <ChevronRight size={16} />
                 </Button>
              </div>
           </div>
         )}
      </Card>

      {/* Quick Note Modal */}
      <AnimatePresence>
        {showNoteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowNoteModal(null)}
               className="absolute inset-0 bg-text-primary/20 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-8"
             >
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <MessageSquare size={20} />
                   </div>
                   <h2 className="text-xl font-medium tracking-tight">Add Quick Note</h2>
                </div>
                <textarea 
                  autoFocus
                  placeholder="Preferences, allergies, or anything useful..."
                  className="w-full h-32 p-4 bg-bg-canvas/50 border border-border-polaris rounded-xl text-sm font-light focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all resize-none"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <div className="flex items-center justify-end gap-3 mt-8">
                   <Button variant="secondary" onClick={() => setShowNoteModal(null)}>Cancel</Button>
                   <Button onClick={handleAddNote} disabled={!noteText.trim()}>Save Note</Button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
