import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  CreditCard, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BookingsPage: React.FC = () => {
  const { business, updateBookingStatus } = useAppStore();

  if (!business) return null;
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);


  const selectedBooking = business.bookings.find(b => b.id === selectedBookingId);
  const selectedService = business.services.find(s => s.id === selectedBooking?.serviceId);

  const filteredBookings = useMemo(() => {
    return business.bookings.filter(booking => {
      const matchesSearch = booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             booking.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [business.bookings, searchQuery, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-brand bg-brand/5 border-brand/10';
      case 'completed': return 'text-success bg-success/5 border-success/10';
      case 'cancelled': return 'text-error bg-error/5 border-error/10';
      default: return 'text-text-tertiary bg-bg-secondary border-border-default';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-success bg-success/5';
      case 'partially_paid': return 'text-brand bg-brand/5';
      case 'pending': return 'text-warning bg-warning/5';
      default: return 'text-text-tertiary bg-bg-secondary';
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
           <h1 className="text-2xl font-bold tracking-tight text-text-primary">Bookings</h1>
           <p className="text-xs text-text-secondary">Track and manage your customer appointments.</p>
         </div>
         <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" className="rounded-xl font-bold px-4 h-11">
               <Download size={16} className="mr-2" />
               Export CSV
            </Button>
         </div>
      </header>

      {/* Filters */}
      <Card className="p-4" padding="none">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
           <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input 
                type="text"
                placeholder="Search customers or emails..."
                className="w-full h-12 pl-12 pr-4 bg-transparent outline-none text-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
           
           <div className="h-8 w-px bg-border-light hidden md:block" />

           <div className="flex items-center gap-2 px-4">
              <Filter size={14} className="text-text-tertiary" />
              <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mr-2">Status:</span>
              <div className="flex bg-bg-secondary p-1 rounded-xl">
                 {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((s) => (
                   <button
                     key={s}
                     onClick={() => setStatusFilter(s)}
                     className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${statusFilter === s ? 'bg-white shadow-sm text-brand' : 'text-text-tertiary hover:text-text-secondary'}`}
                   >
                     {s}
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </Card>

      {/* Bookings Table/List */}
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => {
            const service = business.services.find(s => s.id === booking.serviceId);
            return (
              <motion.div 
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedBookingId(booking.id)}
              >
                <Card className="hover:border-brand/20 transition-all cursor-pointer group p-6 border-transparent">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                         <div className="w-12 h-12 rounded-2xl bg-bg-secondary flex items-center justify-center text-text-tertiary group-hover:bg-brand/5 group-hover:text-brand transition-colors">
                            <User size={20} />
                         </div>
                         <div className="space-y-1">
                            <h3 className="font-bold text-sm text-text-primary capitalize">{booking.customerName}</h3>
                            <div className="flex items-center gap-3">
                               <p className="text-xs text-text-tertiary font-medium">{service?.name}</p>
                               <div className="w-1 h-1 rounded-full bg-border-default" />
                               <div className="flex items-center gap-1.5 text-xs text-text-tertiary font-medium">
                                  <Calendar size={12} />
                                  {new Date(booking.date).toLocaleDateString()}
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="flex items-center gap-8">
                         <div className="text-right space-y-1 hidden sm:block">
                            <p className="text-xs font-bold text-text-primary flex items-center justify-end gap-1.5">
                               <Clock size={12} className="text-text-tertiary" />
                               {booking.time}
                            </p>
                            <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{service?.duration} min</p>
                         </div>

                         <div className="flex items-center gap-4">
                            <div className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${getStatusColor(booking.status)}`}>
                               {booking.status}
                            </div>
                            <ChevronRight size={18} className="text-text-tertiary group-hover:text-brand transition-all group-hover:translate-x-1" />
                         </div>
                      </div>
                   </div>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <div className="py-20 text-center space-y-4 opacity-40 grayscale">
             <div className="w-20 h-20 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar size={40} className="text-text-tertiary" />
             </div>
             <p className="text-sm font-bold text-text-primary">No bookings found</p>
             <p className="text-xs text-text-tertiary">Try adjusting your filters or search query.</p>
          </div>
        )}
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
               className="absolute inset-0 bg-text-primary/20 backdrop-blur-sm"
             />
             
             <motion.div 
               initial={{ x: '100%' }}
               animate={{ x: 0 }}
               exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col"
             >
                <header className="p-8 border-b border-border-light flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${getStatusColor(selectedBooking.status)}`}>
                         {selectedBooking.status === 'confirmed' ? <Clock size={24} /> : 
                          selectedBooking.status === 'completed' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                      </div>
                      <div>
                         <h2 className="text-lg font-bold tracking-tight text-text-primary">Booking Details</h2>
                         <p className="text-[10px] text-text-tertiary uppercase tracking-widest font-bold">ID: {selectedBooking.id}</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => setSelectedBookingId(null)}
                     className="p-3 hover:bg-bg-secondary rounded-2xl transition-all text-text-tertiary"
                   >
                      <XCircle size={24} />
                   </button>
                </header>

                <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar">
                   {/* Customer Info */}
                   <section className="space-y-6">
                      <div className="flex items-center gap-2 text-text-tertiary">
                         <User size={14} />
                         <span className="text-[10px] font-bold uppercase tracking-widest">Customer Information</span>
                      </div>
                      <div className="flex items-center gap-5 p-5 rounded-2xl bg-bg-secondary/50 border border-border-light">
                         <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center text-brand font-bold text-xl">
                            {selectedBooking.customerName.charAt(0)}
                         </div>
                         <div className="space-y-1">
                            <h3 className="font-bold text-base text-text-primary">{selectedBooking.customerName}</h3>
                            <div className="flex items-center gap-4">
                               <div className="flex items-center gap-1.5 text-xs text-text-tertiary font-medium">
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
                         <div className="p-5 rounded-2xl border border-border-light space-y-1">
                            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest leading-none">Date</span>
                            <p className="text-sm font-bold text-text-primary pt-1">{new Date(selectedBooking.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                         </div>
                         <div className="p-5 rounded-2xl border border-border-light space-y-1">
                            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest leading-none">Time</span>
                            <p className="text-sm font-bold text-text-primary pt-1">{selectedBooking.time}</p>
                         </div>
                      </div>
                      <div className="p-6 rounded-2xl border border-border-light bg-bg-secondary/20 flex items-center justify-between">
                         <div className="space-y-1">
                            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Service</span>
                            <p className="text-sm font-bold text-text-primary capitalize">{selectedService?.name}</p>
                         </div>
                         <div className="text-right space-y-1">
                            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Duration</span>
                            <p className="text-sm font-bold text-text-primary">{selectedService?.duration} min</p>
                         </div>
                      </div>
                   </section>

                   {/* Payment Status */}
                   <section className="space-y-6">
                      <div className="flex items-center gap-2 text-text-tertiary">
                         <CreditCard size={14} />
                         <span className="text-[10px] font-bold uppercase tracking-widest">Payment & Billing</span>
                      </div>
                      <div className="p-6 rounded-2xl bg-white border border-border-light shadow-sm space-y-6">
                         <div className="flex justify-between items-center text-sm font-medium text-text-secondary">
                            <span>Total Amount</span>
                            <span className="font-bold text-text-primary">${selectedBooking.totalAmount}</span>
                         </div>
                         <div className="flex justify-between items-center text-sm font-medium text-text-secondary">
                            <span>Paid to Date</span>
                            <span className="font-bold text-success">${selectedBooking.paidAmount}</span>
                         </div>
                         <div className="pt-6 border-t border-border-light flex justify-between items-center">
                            <span className="text-xs font-bold text-text-primary uppercase tracking-widest">Balance Due</span>
                            <span className="text-lg font-bold text-text-primary">${selectedBooking.totalAmount - selectedBooking.paidAmount}</span>
                         </div>
                      </div>
                      
                      <div className={`p-4 rounded-xl flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest ${getPaymentStatusColor(selectedBooking.paymentStatus)}`}>
                         <div className={`w-2 h-2 rounded-full ${selectedBooking.paymentStatus === 'paid' ? 'bg-success' : selectedBooking.paymentStatus === 'partially_paid' ? 'bg-brand' : 'bg-warning'}`} />
                         {selectedBooking.paymentStatus.replace('_', ' ')}
                      </div>
                   </section>
                </div>

                 <footer className="p-8 border-t border-border-light bg-bg-secondary/30 flex flex-col sm:flex-row gap-4 pb-24 lg:pb-8">
                    {selectedBooking.status === "pending" && (
                       <Button 
                         className="flex-1 rounded-xl font-bold h-12 bg-success text-white"
                         onClick={async () => {
                           await updateBookingStatus(selectedBooking.id, "confirmed");
                           setSelectedBookingId(null);
                         }}
                       >
                          Confirm Booking
                       </Button>
                    )}
                    {(selectedBooking.status === "confirmed" || selectedBooking.status === "pending") && (
                       <Button 
                         variant="secondary"
                         className="flex-1 rounded-xl font-bold h-12 text-error hover:bg-error/5 border-error/10"
                         onClick={async () => {
                           if (confirm("Are you sure you want to cancel this booking?")) {
                             await updateBookingStatus(selectedBooking.id, "cancelled");
                             setSelectedBookingId(null);
                           }
                         }}
                       >
                          Cancel Appointment
                       </Button>
                    )}
                    <Button variant="secondary" className="flex-1 rounded-xl font-bold h-12" onClick={() => setSelectedBookingId(null)}>
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
