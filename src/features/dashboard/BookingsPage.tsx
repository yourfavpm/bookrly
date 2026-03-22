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
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BookingsPage: React.FC = () => {
  const { business, updateBookingStatus } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const filteredBookings = useMemo(() => {
    if (!business) return [];
    return business.bookings.filter(booking => {
      const matchesSearch = booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             booking.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [business, searchQuery, statusFilter]);

  if (!business) return null;

  const selectedBooking = business.bookings.find(b => b.id === selectedBookingId);
  const selectedService = business.services.find(s => s.id === selectedBooking?.serviceId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-brand bg-brand/5 border-brand/20';
      case 'completed': return 'text-emerald-700 bg-emerald-50 border-emerald-100';
      case 'cancelled': return 'text-red-700 bg-red-50 border-red-100';
      default: return 'text-text-tertiary bg-bg-canvas border-border-polaris';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-emerald-700 bg-emerald-50';
      case 'partially_paid': return 'text-brand bg-brand/5';
      case 'pending': return 'text-amber-700 bg-amber-50';
      default: return 'text-text-tertiary bg-bg-canvas';
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
           <h1 className="text-2xl font-medium tracking-tight text-text-primary">Bookings</h1>
           <p className="text-[11px] text-text-tertiary font-normal leading-none tracking-tight">Track and manage your customer appointments.</p>
         </div>
         <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" className="rounded-lg font-bold px-4 h-11 border-border-polaris border uppercase text-[10px] tracking-widest bg-white">
               <Download size={14} className="mr-2" />
               Export CSV
            </Button>
         </div>
      </header>

      {/* Filters */}
      <Card className="border-border-polaris shadow-none bg-white overflow-hidden p-0" padding="none">
        <div className="flex flex-col md:flex-row md:items-center gap-0">
           <div className="relative flex-1">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input 
                type="text"
                placeholder="Search customers..."
                className="w-full h-12 pl-12 pr-4 bg-transparent outline-none text-xs font-normal"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
           
           <div className="h-12 w-px bg-border-polaris hidden md:block" />
 
           <div className="flex items-center gap-2 px-6">
              <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mr-2">Status:</span>
              <div className="flex bg-bg-canvas p-1 rounded-lg border border-border-polaris/40">
                 {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((s) => (
                   <button
                     key={s}
                     onClick={() => setStatusFilter(s)}
                     className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${statusFilter === s ? 'bg-white shadow-sm text-brand' : 'text-text-tertiary hover:text-text-secondary'}`}
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
                <Card className="hover:border-brand/40 transition-all cursor-pointer group p-8 border-border-polaris bg-white shadow-none">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                         <div className="w-12 h-12 rounded-lg bg-bg-canvas flex items-center justify-center text-text-tertiary group-hover:bg-brand group-hover:text-white transition-all">
                            <User size={20} />
                         </div>
                         <div className="space-y-1">
                            <h3 className="font-semibold text-sm text-text-primary capitalize tracking-tight">{booking.customerName}</h3>
                            <div className="flex items-center gap-3">
                               <p className="text-[11px] text-text-tertiary font-medium uppercase tracking-tight">{service?.name}</p>
                               <div className="w-1 h-1 rounded-full bg-border-polaris" />
                               <div className="flex items-center gap-1.5 text-[11px] text-text-tertiary font-normal">
                                  <Calendar size={12} />
                                  {new Date(booking.date).toLocaleDateString()}
                               </div>
                            </div>
                         </div>
                      </div>
 
                      <div className="flex items-center gap-10">
                         <div className="text-right space-y-1 hidden sm:block">
                            <p className="text-xs font-semibold text-text-primary flex items-center justify-end gap-1.5">
                               <Clock size={12} className="text-text-tertiary" />
                               {booking.time}
                            </p>
                            <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-[0.2em]">{service?.duration} Min</p>
                         </div>
 
                         <div className="flex items-center gap-6">
                            <div className={`px-3 py-1.5 rounded-md border text-[9px] font-bold uppercase tracking-[0.15em] ${getStatusColor(booking.status)}`}>
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
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-20 flex flex-col items-center justify-center text-center"
          >
             <motion.div 
               className="relative mb-10"
               animate={{ rotate: [0, 2, -2, 0] }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             >
                <div className="absolute inset-0 bg-brand/5 rounded-full blur-3xl" />
                <img 
                  src="/illustrations/empty_bookings.png" 
                  alt="No bookings" 
                  className="w-72 h-72 object-contain relative z-10"
                />
             </motion.div>
             <div className="space-y-2 max-w-xs mx-auto">
                <h3 className="text-xl font-medium text-text-primary tracking-tight">Your calendar is quiet</h3>
                <p className="text-sm text-text-tertiary font-normal leading-relaxed">No bookings match your current filters. Share your link to fill up your schedule.</p>
             </div>
             <Button 
               variant="secondary"
               className="mt-8 rounded-lg font-bold px-10 h-12 bg-white border-border-polaris text-[10px] uppercase tracking-widest hover:bg-bg-canvas/40"
               onClick={() => window.open(`/p/${business.subdomain}`, '_blank')}
             >
                Share Booking Link
             </Button>
          </motion.div>
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
                 <header className="p-8 border-b border-border-polaris flex items-center justify-between bg-white">
                    <div className="flex items-center gap-4">
                       <div className={`p-3 rounded-lg border ${getStatusColor(selectedBooking.status)}`}>
                          {selectedBooking.status === 'confirmed' ? <Clock size={24} /> : 
                           selectedBooking.status === 'completed' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                       </div>
                       <div>
                          <h2 className="text-lg font-semibold tracking-tight text-text-primary">Booking Details</h2>
                          <p className="text-[9px] text-text-tertiary uppercase tracking-[0.2em] font-bold">ID: {selectedBooking.id}</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setSelectedBookingId(null)}
                      className="p-3 hover:bg-bg-canvas rounded-lg transition-all text-text-tertiary"
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
                       <div className="flex items-center gap-5 p-6 rounded-lg bg-bg-canvas/30 border border-border-polaris">
                          <div className="w-14 h-14 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-xl">
                             {selectedBooking.customerName.charAt(0)}
                          </div>
                          <div className="space-y-1">
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
                             <p className="text-sm font-semibold text-text-primary pt-1">{selectedBooking.time}</p>
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
                     {(selectedBooking.status === "confirmed" || selectedBooking.status === "pending") && (
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
