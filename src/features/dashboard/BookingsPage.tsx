import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Search, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  CreditCard, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Download,
  ChevronLeft,
  Bell,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BookingsPage: React.FC = () => {
  const { business, updateBookingStatus, refundBooking, staffRole, staffId } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [isRefunding, setIsRefunding] = useState(false);

  const filteredBookings = useMemo(() => {
    if (!business) return [];
    
    const isStaffView = staffRole === 'staff' || staffRole === 'manager';
    let baseBookings = business.bookings;
    if (isStaffView && staffId) {
       baseBookings = baseBookings.filter(b => b.staffId === staffId);
    }

    return baseBookings
      .filter(b => {
        const matchesSearch = b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            b.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (statusFilter === 'all') return matchesSearch;
        if (statusFilter === 'upcoming') return matchesSearch && (b.status === 'confirmed' || b.status === 'pending');
        return matchesSearch && b.status === statusFilter;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [business, searchQuery, statusFilter, staffRole, staffId]);

  const selectedBooking = useMemo(() => 
    business?.bookings.find(b => b.id === selectedBookingId),
    [business, selectedBookingId]
  );

  const selectedService = useMemo(() => 
    business?.services.find(s => s.id === selectedBooking?.serviceId),
    [business, selectedBooking]
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'completed': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'partially_paid': return 'bg-brand/5 text-brand border-brand/10';
      case 'refunded': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Bookings</h1>
          <p className="text-text-secondary">Manage your upcoming appointments and history.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-border-polaris rounded-2xl pl-12 pr-6 py-3.5 text-sm outline-none focus:ring-2 focus:ring-brand/10 focus:border-brand transition-all w-full lg:w-72 shadow-sm"
            />
          </div>
          <Button variant="secondary" className="hidden lg:flex items-center gap-2 rounded-2xl border-border-polaris px-6">
            <Download size={18} /> Export
          </Button>
        </div>
      </header>

      <div className="space-y-8">
        <div className="flex items-center gap-1.5 p-1.5 bg-bg-canvas/50 rounded-2xl border border-border-polaris w-fit shadow-sm overflow-x-auto no-scrollbar">
          {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                statusFilter === filter 
                  ? 'bg-white text-brand shadow-sm border border-border-polaris' 
                  : 'text-text-tertiary hover:text-text-primary'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <Card 
                key={booking.id}
                onClick={() => setSelectedBookingId(booking.id)}
                className="group p-6 lg:p-8 hover:border-brand/40 transition-all cursor-pointer bg-white active:scale-[0.99]"
              >
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-6 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-brand/5 flex items-center justify-center text-brand font-bold text-xl shrink-0 group-hover:bg-brand group-hover:text-white transition-all duration-300">
                      {booking.customerName.charAt(0)}
                    </div>
                    <div className="min-w-0 space-y-1.5">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-lg text-text-primary truncate tracking-tight">{booking.customerName}</h3>
                        <div className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </div>
                      </div>
                      <div className="flex items-center flex-wrap gap-x-6 gap-y-1 text-xs text-text-tertiary font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-brand/60" />
                          {new Date(booking.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-brand/60" />
                          {booking.startTime}
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard size={14} className="text-brand/60" />
                          ${booking.totalAmount}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="hidden lg:flex items-center gap-4 shrink-0">
                     <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${booking.paymentStatus === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {booking.paymentStatus.replace('_', ' ')}
                     </div>
                    <ChevronRight className="text-text-tertiary group-hover:text-brand group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 flex flex-col items-center text-center space-y-6 bg-bg-canvas/20 rounded-[40px] border border-dashed border-border-polaris"
            >
              <div className="w-20 h-20 rounded-[32px] bg-white shadow-xl shadow-black/5 flex items-center justify-center text-text-tertiary">
                 <Calendar size={32} />
              </div>
              <div className="space-y-2">
                 <h3 className="text-xl font-bold text-text-primary tracking-tight">No bookings found</h3>
                 <p className="text-text-secondary text-sm max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
              </div>
              <Button 
                 variant="secondary" 
                 onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                 className="rounded-2xl px-8"
              >
                 Share Booking Link
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Booking Detail Drawer */}
      <AnimatePresence>
        {selectedBookingId && selectedBooking && (
          <div className="fixed inset-0 z-50 flex justify-end">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSelectedBookingId(null)}
               className="absolute inset-0 bg-text-primary/20 backdrop-blur-sm hidden lg:block"
             />
             
             <motion.div 
               initial={{ x: '100%' }}
               animate={{ x: 0 }}
               exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col"
             >
                  <header className="p-5 lg:p-8 border-b border-black/5 flex items-center justify-between bg-white shrink-0">
                     <div className="flex items-center gap-4">
                        <button onClick={() => setSelectedBookingId(null)} className="lg:hidden p-2 -ml-2 text-text-tertiary">
                           <ChevronLeft size={24} />
                        </button>
                        <div className={`p-3 rounded-xl border hidden lg:block ${getStatusColor(selectedBooking.status)}`}>
                           {selectedBooking.status === 'confirmed' ? <Clock size={24} /> : 
                            selectedBooking.status === 'completed' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                        </div>
                        <div>
                           <h2 className="text-lg font-medium tracking-tight text-text-primary">Booking Details</h2>
                           <p className="text-[9px] text-text-tertiary uppercase tracking-widest font-light">ID: {selectedBooking.id}</p>
                        </div>
                     </div>
                     <button 
                       onClick={() => setSelectedBookingId(null)}
                       className="hidden lg:block p-3 hover:bg-bg-canvas rounded-lg transition-all text-text-tertiary"
                     >
                        <XCircle size={24} />
                     </button>
                  </header>

                 <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-12 custom-scrollbar pb-32">
                    {/* Customer Info */}
                     <section className="space-y-6">
                        <div className="flex items-center gap-2 text-text-tertiary">
                           <User size={14} />
                           <span className="text-[10px] font-bold uppercase tracking-widest">Customer Information</span>
                        </div>
                        <div className="flex items-center gap-5 p-6 rounded-lg bg-bg-canvas/30 border border-border-polaris">
                           <div className="w-14 h-14 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-xl">
                              {selectedBooking.customerName.charAt(0)}
                           </div>
                           <div className="flex-1 min-w-0 space-y-1">
                              <h3 className="font-semibold text-base text-text-primary tracking-tight">{selectedBooking.customerName}</h3>
                              <div className="flex items-center gap-4">
                                 <div className="flex items-center gap-1.5 text-xs text-text-tertiary font-normal">
                                    <Mail size={12} />
                                    {selectedBooking.customerEmail}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </section>

                    {/* Appointment Info */}
                     <section className="space-y-6">
                        <div className="flex items-center gap-2 text-text-tertiary">
                           <Calendar size={14} />
                           <span className="text-[10px] font-bold uppercase tracking-widest">Appointment Summary</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-5 rounded-lg border border-border-polaris space-y-1 bg-white">
                              <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest leading-none">Date</span>
                              <p className="text-sm font-semibold text-text-primary pt-1">{new Date(selectedBooking.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                           </div>
                           <div className="p-5 rounded-lg border border-border-polaris space-y-1 bg-white">
                              <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest leading-none">Time</span>
                              <p className="text-sm font-semibold text-text-primary pt-1">{selectedBooking.startTime}</p>
                           </div>
                        </div>
                        <div className="p-6 rounded-lg border border-border-polaris bg-bg-canvas/20 flex items-center justify-between">
                           <div className="space-y-1">
                              <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest">Service</span>
                              <p className="text-sm font-semibold text-text-primary capitalize">{selectedService?.name}</p>
                           </div>
                           <div className="text-right space-y-1">
                              <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest">Duration</span>
                              <p className="text-sm font-semibold text-text-primary">{selectedService?.duration} Min</p>
                           </div>
                        </div>
                     </section>

                    {/* Payment Status */}
                     <section className="space-y-6">
                        <div className="flex items-center gap-2 text-text-tertiary">
                           <CreditCard size={14} />
                           <span className="text-[10px] font-bold uppercase tracking-widest">Payment & Billing</span>
                        </div>
                        <div className="p-8 rounded-lg bg-white border border-border-polaris shadow-none space-y-6">
                           <div className="flex justify-between items-center text-xs font-semibold text-text-secondary uppercase tracking-wider">
                              <span>Total Amount</span>
                              <span className="font-bold text-text-primary tabular-nums">${selectedBooking.totalAmount}</span>
                           </div>
                           <div className="flex justify-between items-center text-xs font-semibold text-text-secondary uppercase tracking-wider">
                              <span>Paid Amount</span>
                              <span className="font-bold text-emerald-600 tabular-nums">${selectedBooking.paidAmount}</span>
                           </div>
                           <div className="pt-6 border-t border-border-polaris flex justify-between items-center">
                              <span className="text-[10px] font-bold text-text-primary uppercase tracking-[0.2em]">Balance Due</span>
                              <span className="text-2xl font-bold text-text-primary tabular-nums">${selectedBooking.totalAmount - selectedBooking.paidAmount}</span>
                           </div>
                        </div>
                        
                        <div className={`p-4 rounded-lg flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest border border-transparent ${getPaymentStatusColor(selectedBooking.paymentStatus)}`}>
                           <div className={`w-2 h-2 rounded-full ${selectedBooking.paymentStatus === 'paid' ? 'bg-emerald-600' : selectedBooking.paymentStatus === 'partially_paid' ? 'bg-brand' : 'bg-amber-600'}`} />
                           {selectedBooking.paymentStatus.replace('_', ' ')}
                        </div>
                     </section>

                     {/* Delivery Log */}
                     <section className="space-y-6">
                        <div className="flex items-center gap-2 text-text-tertiary">
                           <Bell size={14} />
                           <span className="text-[10px] font-bold uppercase tracking-widest">Message Delivery Log</span>
                        </div>
                        <div className="bg-bg-canvas/10 rounded-2xl border border-border-polaris overflow-hidden">
                           <table className="w-full text-left border-collapse">
                              <thead className="bg-bg-canvas/20">
                                 <tr>
                                    <th className="px-4 py-3 text-[9px] font-bold text-text-tertiary uppercase tracking-widest">Message</th>
                                    <th className="px-4 py-3 text-[9px] font-bold text-text-tertiary uppercase tracking-widest text-center">Channel</th>
                                    <th className="px-4 py-3 text-[9px] font-bold text-text-tertiary uppercase tracking-widest text-right">Status</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-border-polaris">
                                 {(!business?.scheduledMessages || business.scheduledMessages.filter(m => m.bookingId === selectedBookingId).length === 0) ? (
                                    <tr>
                                       <td colSpan={3} className="px-4 py-10 text-center text-xs text-text-tertiary italic">
                                          No messages scheduled
                                       </td>
                                    </tr>
                                 ) : (
                                    business.scheduledMessages.filter(m => m.bookingId === selectedBookingId).map(msg => (
                                       <tr key={msg.id} className="group hover:bg-white/50 transition-colors">
                                          <td className="px-4 py-4">
                                             <p className="text-xs font-semibold text-text-primary capitalize">{msg.type.toLowerCase()}</p>
                                             <p className="text-[10px] text-text-tertiary">{new Date(msg.scheduledFor).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                          </td>
                                          <td className="px-4 py-4 text-center">
                                             <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                                                {msg.channel === 'SMS' ? <Smartphone size={12} /> : <Mail size={12} />}
                                                {msg.channel}
                                             </div>
                                          </td>
                                          <td className="px-4 py-4 text-right">
                                             <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                                                msg.status === 'SENT' || msg.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                msg.status === 'FAILED' ? 'bg-red-50 text-red-600 border-red-100' :
                                                msg.status === 'QUEUED' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                msg.status === 'OPENED' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                'bg-gray-50 text-gray-400 border-gray-100'
                                             }`}>
                                                {msg.status}
                                             </div>
                                          </td>
                                       </tr>
                                    ))
                                 )}
                              </tbody>
                           </table>
                        </div>
                     </section>
                  </div>
 
                   <footer className="p-8 border-t border-border-polaris bg-bg-canvas/10 flex flex-col sm:flex-row gap-4 pb-24 lg:pb-8">
                      {selectedBooking.status === "pending" && (
                         <Button
                           className="flex-1 rounded-lg font-bold h-12 bg-emerald-600 text-white uppercase text-[10px] tracking-widest"
                           onClick={async () => {
                             await updateBookingStatus(selectedBooking.id, "confirmed");
                             setSelectedBookingId(null);
                           }}
                         >
                            Confirm Booking
                         </Button>
                      )}
                      {selectedBooking.paymentStatus === "paid" && selectedBooking.status !== "cancelled" && (
                         <Button
                           variant="secondary"
                           disabled={isRefunding}
                           className="flex-1 rounded-lg font-bold h-12 text-red-600 hover:bg-red-50 border-red-100 uppercase text-[10px] tracking-widest disabled:opacity-60"
                           onClick={async () => {
                             if (confirm("Refund this booking? The full amount will be returned to the customer.")) {
                               setIsRefunding(true);
                               try {
                                 await refundBooking(selectedBooking.id);
                                 setSelectedBookingId(null);
                               } catch { /* error handled by store */ }
                               setIsRefunding(false);
                             }
                           }}
                         >
                            {isRefunding ? 'Refunding...' : 'Refund Payment'}
                         </Button>
                      )}
                      {(selectedBooking.status === "confirmed" || selectedBooking.status === "pending") && selectedBooking.paymentStatus !== "paid" && (
                         <Button
                           variant="secondary"
                           className="flex-1 rounded-lg font-bold h-12 text-red-600 hover:bg-red-50 border-red-100 uppercase text-[10px] tracking-widest"
                           onClick={async () => {
                             if (confirm("Are you sure you want to cancel this booking?")) {
                               await updateBookingStatus(selectedBooking.id, "cancelled");
                               setSelectedBookingId(null);
                             }
                           }}
                         >
                            Cancel
                         </Button>
                      )}
                      <Button variant="secondary" className="flex-1 rounded-lg font-bold h-12 border-border-polaris uppercase text-[10px] tracking-widest" onClick={() => setSelectedBookingId(null)}>
                         Close
                      </Button>
                   </footer>
              </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
