import React, { useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Users, 
  Calendar, 
  ArrowUpRight, 
  Clock,
  ChevronRight,
  ExternalLink,
  Edit3,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StatCard: React.FC<{ label: string; value: string; trend: string; icon: React.ReactNode; color: string }> = ({ label, value, trend, icon, color }) => (
  <Card className="flex flex-col gap-4 group hover:border-brand/20 transition-all duration-300 border-border-light/50 shadow-sm bg-white hover:shadow-md p-5 lg:p-6">
    <div className="flex items-center justify-between">
      <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110`} style={{ backgroundColor: `${color}10`, color: color }}>
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 18 }) : icon}
      </div>
      <div className="flex items-center gap-1 text-[9px] lg:text-[10px] font-normal text-success bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/30">
        <ArrowUpRight size={10} className="stroke-[2px]" />
        {trend}
      </div>
    </div>
    <div>
      <p className="text-[9px] lg:text-[10px] font-normal text-text-tertiary tracking-widest uppercase mb-1">{label}</p>
      <h3 className="text-xl lg:text-2xl font-medium tracking-tight text-text-primary tabular-nums">{value}</h3>
    </div>
  </Card>
);

export const DashboardOverview: React.FC = () => {
  const { business } = useAppStore();
  const navigate = useNavigate();

  const upcomingBookings = useMemo(() => {
    if (!business) return [];
    return [...business.bookings]
      .filter(b => (b.status === 'confirmed' || b.status === 'pending') && new Date(b.date).getTime() >= new Date().setHours(0,0,0,0))
      .map(b => ({
        ...b,
        serviceName: business.services.find(s => s.id === b.serviceId)?.name || 'Consultation'
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [business]);

  if (!business) return null;
  
  const firstName = business.name.split(' ')[0] || 'there';
  const today = new Date();
  const hour = today.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const nextBooking = upcomingBookings[0];
  
  const stats = {
    revenue: business.bookings.reduce((acc, b) => acc + b.totalAmount, 0),
    bookingsCount: business.bookings.length,
    newCustomers: Math.ceil(business.bookings.length * 0.7)
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 lg:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header & Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
           <h1 className="text-2xl lg:text-3xl font-medium tracking-tight text-text-primary">
             {greeting}, {firstName}
           </h1>
           <p className="text-xs lg:text-sm text-text-secondary font-normal">
             Today is {today.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}.
           </p>
        </div>
        
        <div className="flex items-center gap-2 lg:gap-3">
           <Button 
             variant="secondary" 
             size="sm"
             className="flex-1 lg:flex-none h-10 px-4 lg:px-6 rounded-xl font-medium bg-white shadow-sm border-border-light text-[10px] lg:text-xs uppercase tracking-widest"
             onClick={() => window.open(`/p/${business.subdomain}`, '_blank')}
           >
             <ExternalLink size={14} className="mr-2" />
             Preview
           </Button>
           <Button 
             size="sm"
             className="flex-1 lg:flex-none h-10 px-4 lg:px-6 rounded-xl font-medium shadow-lg shadow-brand/20 transition-all text-[10px] lg:text-xs uppercase tracking-widest bg-brand text-white"
             onClick={() => navigate('/dashboard/bookings')}
           >
             <Calendar size={14} className="mr-2" />
             Calendar
           </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <StatCard 
          label="Revenue" 
          value={`$${stats.revenue.toLocaleString()}`}
          trend="+18%" 
          icon={<DollarSign />}
          color="var(--color-brand)"
        />
        <StatCard 
          label="Bookings" 
          value={stats.bookingsCount.toString()} 
          trend="+12%" 
          icon={<TrendingUp />}
          color="#10b981"
        />
        <div className="col-span-2 lg:col-span-1">
          <StatCard 
            label="Total Clients" 
            value={stats.newCustomers.toString()} 
            trend="+5%" 
            icon={<Users />}
            color="#6366f1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
        {/* Next/Upcoming Section */}
        <div className="lg:col-span-3 space-y-6">
           <div className="flex items-center justify-between px-1">
              <h2 className="text-sm lg:text-base font-medium flex items-center gap-2 text-text-primary uppercase tracking-widest">
                 Next Bookings
                 <span className="text-[10px] font-normal text-text-tertiary bg-bg-secondary px-2 py-0.5 rounded-full">{upcomingBookings.length}</span>
              </h2>
              <button 
                onClick={() => navigate('/dashboard/bookings')}
                className="text-[10px] font-normal text-brand hover:underline underline-offset-4 tracking-widest uppercase transition-all"
              >
                View all
              </button>
           </div>

           {nextBooking ? (
             <div className="space-y-4">
                {/* Spotlight Card */}
                <Card className="p-0 overflow-hidden border border-border-light shadow-sm bg-white rounded-[32px] group transition-all duration-300 flex flex-col sm:flex-row">
                    <div className="p-6 lg:p-8 flex-1 space-y-6">
                       <div className="flex items-center gap-3">
                          <div className="px-2.5 py-1 rounded-lg bg-success/10 text-success text-[9px] font-normal uppercase tracking-widest flex items-center gap-1.5 border border-success/10">
                             <Clock size={10} /> Next Up
                          </div>
                          <span className="text-[9px] font-normal text-text-tertiary uppercase tracking-widest">{nextBooking.time} Today</span>
                       </div>
                       <div className="space-y-1">
                          <h3 className="text-xl lg:text-2xl font-medium tracking-tight text-text-primary leading-tight">{nextBooking.customerName}</h3>
                          <p className="text-xs lg:text-sm text-text-secondary font-normal">{nextBooking.serviceName}</p>
                       </div>
                       <div className="flex items-center gap-6 pt-2">
                          <Button 
                             size="sm"
                             onClick={() => navigate('/dashboard/bookings')}
                             className="h-10 px-5 rounded-xl font-medium shadow-md transition-all text-[10px] uppercase tracking-widest bg-brand text-white"
                          >
                             Manage
                          </Button>
                          <div className="text-left">
                             <p className="text-[9px] font-normal text-text-tertiary uppercase tracking-widest">Fee</p>
                             <span className="text-base lg:text-lg font-medium text-text-primary tracking-tight">${nextBooking.totalAmount}</span>
                          </div>
                       </div>
                    </div>
                    <div className="bg-bg-secondary/40 p-6 lg:p-8 flex flex-row sm:flex-col items-center justify-between lg:justify-center border-t sm:border-t-0 sm:border-l border-border-light relative group-hover:bg-brand-light/10 transition-colors sm:w-40 lg:w-48">
                       <div className="flex items-center gap-4 sm:flex-col sm:gap-2">
                          <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand font-medium text-xl lg:text-2xl relative z-10">
                             {nextBooking.customerName.charAt(0)}
                          </div>
                          <p className="text-[10px] font-normal text-text-secondary uppercase tracking-widest sm:mt-1">Profile</p>
                       </div>
                       <ChevronRight className="sm:absolute sm:right-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all text-brand" size={16} />
                    </div>
                </Card>

                {/* Smaller List for rest of schedule */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                   {upcomingBookings.slice(1, 3).map((b, idx) => (
                      <Card key={idx} className="flex items-center justify-between p-4 rounded-2xl hover:bg-bg-secondary transition-all duration-200 border-border-light/50 bg-white">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-bg-secondary flex flex-col items-center justify-center text-text-tertiary">
                               <span className="text-[9px] font-normal uppercase leading-none">{b.date.split('-')[2]}</span>
                               <span className="text-[10px] font-normal leading-none mt-1">{b.date.split('-')[1]}</span>
                            </div>
                            <div>
                               <h4 className="font-medium text-text-primary text-sm tracking-tight">{b.customerName}</h4>
                               <p className="text-[10px] font-normal text-text-tertiary uppercase tracking-normal">{b.time} • ${b.totalAmount}</p>
                            </div>
                         </div>
                         <ChevronRight size={14} className="text-text-tertiary" />
                      </Card>
                   ))}
                </div>
             </div>
           ) : (
             <div className="p-12 text-center space-y-4 bg-bg-secondary/20 rounded-3xl border border-dashed border-border-light">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto text-text-tertiary">
                   <Calendar size={20} />
                </div>
                <div className="space-y-1">
                   <h3 className="text-sm font-medium text-text-secondary">No upcoming appointments</h3>
                </div>
                <Button 
                   size="sm"
                   onClick={() => navigate('/dashboard/website')}
                   variant="secondary" 
                   className="h-10 px-6 rounded-xl font-medium border-border-light text-[10px] uppercase tracking-widest"
                >
                   Share Link
                </Button>
             </div>
           )}
        </div>

        {/* Quick Actions Sidebar */}
        <div className="lg:col-span-2 space-y-6">
           <div className="px-1">
              <h2 className="text-sm lg:text-base font-medium text-text-primary uppercase tracking-widest">Fast Actions</h2>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <Card 
                 onClick={() => navigate('/dashboard/website')}
                 className="p-5 lg:p-6 space-y-4 group cursor-pointer hover:shadow-md transition-all duration-300 rounded-[28px] border border-border-light bg-white"
              >
                 <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-all">
                    <Edit3 size={18} />
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-sm font-medium text-text-primary tracking-tight">Design Website</h4>
                    <p className="text-[10px] font-normal text-text-secondary leading-relaxed">Personalize your brand experience.</p>
                 </div>
                 <ChevronRight size={14} className="text-brand opacity-0 lg:group-hover:opacity-100 transition-all ml-auto" />
              </Card>

              <Card 
                 onClick={() => navigate('/dashboard/services')}
                 className="p-5 lg:p-6 space-y-4 group cursor-pointer hover:shadow-md transition-all duration-300 rounded-[28px] border border-border-light bg-white"
              >
                 <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-bg-secondary flex items-center justify-center text-text-tertiary group-hover:bg-brand group-hover:text-white transition-all" style={{ backgroundColor: '#10b98110', color: '#10b981' }}>
                    <Calendar size={18} />
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-sm font-medium text-text-primary tracking-tight">Add Service</h4>
                    <p className="text-[10px] font-normal text-text-secondary leading-relaxed">Offer something fresh for clients.</p>
                 </div>
                 <ChevronRight size={14} className="text-brand opacity-0 lg:group-hover:opacity-100 transition-all ml-auto" style={{ color: '#10b981' }} />
              </Card>

              {/* Growth Area */}
              <Card className="col-span-1 sm:col-span-2 lg:col-span-1 bg-text-primary text-white border-none p-6 lg:p-8 rounded-[32px] shadow-xl space-y-4 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-12 -mt-12 blur-3xl group-hover:scale-125 transition-transform duration-700" />
                 <div className="space-y-2 relative z-10">
                    <h3 className="text-base font-medium leading-tight tracking-tight uppercase">Performance</h3>
                    <p className="text-[10px] text-white/60 leading-relaxed font-normal">
                       Scale your business with detailed insights and booking patterns.
                    </p>
                 </div>
                 <Button 
                   size="sm"
                   onClick={() => navigate('/dashboard/analytics')}
                   className="w-full h-10 bg-white text-text-primary rounded-xl font-medium text-[10px] shadow-md hover:bg-white/90 transition-all relative z-10 uppercase tracking-widest"
                 >
                    Reports
                 </Button>
              </Card>
           </div>
        </div>
      </div>
    </div>
  );
};
