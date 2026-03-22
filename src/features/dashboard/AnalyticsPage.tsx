import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  Scissors
} from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: 'up' | 'down';
  trendValue: string;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, trend, trendValue, color }) => (
  <Card className="flex-1 min-w-[240px] p-6 border-transparent hover:border-brand/10 transition-all group">
     <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl bg-${color}/5 text-${color} group-hover:scale-110 transition-transform duration-500`}>
           {icon}
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${trend === 'up' ? 'text-success bg-success/5' : 'text-error bg-error/5'}`}>
           {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
           {trendValue}%
        </div>
     </div>
     <div className="space-y-1">
        <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{title}</p>
        <h3 className="text-2xl font-bold text-text-primary tracking-tight">{value}</h3>
     </div>
  </Card>
);

export const AnalyticsPage: React.FC = () => {
  const { business } = useAppStore();

  if (!business) return null;

  // Simple stats calculation
  const totalBookings = business.bookings.length;
  const totalRevenue = business.bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  
  // Mock data for charts (Simplified for elegant SVG rendering)
  const bookingsData = [12, 18, 15, 22, 19, 25, 21];
  const revenueData = [800, 1200, 1100, 1600, 1400, 1900, 1700];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const maxBooking = Math.max(...bookingsData);
  const maxRevenue = Math.max(...revenueData);

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <header className="space-y-1">
         <h1 className="text-2xl font-bold tracking-tight text-text-primary">Performance Analytics</h1>
         <p className="text-xs text-text-secondary">A snapshot of your business health in Canada.</p>
      </header>

      {/* Metrics Row */}
      <div className="flex flex-wrap gap-6">
         <MetricCard 
           title="Total Bookings" 
           value={totalBookings} 
           icon={<Users size={20} />} 
           trend="up" 
           trendValue="12"
           color="brand"
         />
         <MetricCard 
           title="Total Revenue" 
           value={`$${totalRevenue.toLocaleString()}`} 
           icon={<DollarSign size={20} />} 
           trend="up" 
           trendValue="8"
           color="success"
         />
         <MetricCard 
           title="Conversion Rate" 
           value="4.2%" 
           icon={<TrendingUp size={20} />} 
           trend="down" 
           trendValue="2"
           color="brand"
         />
         <MetricCard 
           title="Active Customers" 
           value="128" 
           icon={<TrendingUp size={20} />} 
           trend="up" 
           trendValue="15"
           color="brand"
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Bookings Chart */}
         <Card className="p-8 space-y-8 h-[400px] flex flex-col border-transparent">
            <div className="flex items-center justify-between">
               <div className="space-y-1">
                  <h3 className="font-bold text-sm text-text-primary tracking-tight">Bookings Activity</h3>
                  <p className="text-[10px] text-text-tertiary uppercase tracking-widest font-bold">Past 7 Days</p>
               </div>
               <div className="flex items-center gap-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-brand" /> Volume</span>
               </div>
            </div>
            
            <div className="flex-1 flex items-end justify-between gap-4 pt-4">
               {bookingsData.map((val, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-text-primary text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                       {val}
                    </div>
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${(val / maxBooking) * 100}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="w-full bg-brand/10 hover:bg-brand rounded-t-xl transition-all duration-300 relative"
                    >
                       <div className="absolute top-0 left-0 right-0 h-1 bg-brand opacity-40 rounded-full" />
                    </motion.div>
                    <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{days[i]}</span>
                 </div>
               ))}
            </div>
         </Card>

         {/* Revenue Chart */}
         <Card className="p-8 space-y-8 h-[400px] flex flex-col border-transparent">
            <div className="flex items-center justify-between">
               <div className="space-y-1">
                  <h3 className="font-bold text-sm text-text-primary tracking-tight">Revenue Trends</h3>
                  <p className="text-[10px] text-text-tertiary uppercase tracking-widest font-bold">Past 7 Days</p>
               </div>
               <div className="flex items-center gap-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-success" /> Revenue</span>
               </div>
            </div>
            
            <div className="flex-1 relative pt-10">
               {/* Simple SVG Line Chart */}
               <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Area */}
                  <motion.path 
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2 }}
                    d={`M 0 200 ${revenueData.map((val, i) => `L ${(i * 700) / 6} ${200 - (val / maxRevenue) * 150}`).join(' ')} L 700 200 Z`}
                    fill="url(#gradient)"
                  />
                  
                  {/* Line */}
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2 }}
                    d={`M 0 ${200 - (revenueData[0] / maxRevenue) * 150} ${revenueData.map((val, i) => `L ${(i * 700) / 6} ${200 - (val / maxRevenue) * 150}`).join(' ')}`}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Dots */}
                  {revenueData.map((val, i) => (
                    <circle 
                      key={i}
                      cx={(i * 700) / 6}
                      cy={200 - (val / maxRevenue) * 150}
                      r="4"
                      fill="white"
                      stroke="#10B981"
                      strokeWidth="2"
                    />
                  ))}
               </svg>
               
               <div className="flex justify-between items-center absolute -bottom-2 left-0 right-0">
                  {days.map((d, i) => (
                    <span key={i} className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{d}</span>
                  ))}
               </div>
            </div>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Most Booked Service */}
         <Card className="lg:col-span-2 p-8 space-y-8 border-transparent">
            <div className="flex items-center justify-between">
               <div className="space-y-1">
                  <h3 className="font-bold text-sm text-text-primary tracking-tight">Most Popular Services</h3>
                  <p className="text-[10px] text-text-tertiary uppercase tracking-widest font-bold">Top performers</p>
               </div>
               <button className="text-[10px] font-bold text-brand uppercase tracking-widest hover:underline flex items-center gap-1">
                  View All <ChevronRight size={12} />
               </button>
            </div>
            
            <div className="space-y-6">
               {business.services.map((service, index) => (
                 <div key={service.id} className="space-y-3 group">
                    <div className="flex justify-between items-center text-xs">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-bg-secondary flex items-center justify-center text-text-secondary group-hover:bg-brand/5 group-hover:text-brand transition-colors">
                             <Scissors size={14} />
                          </div>
                          <span className="font-bold text-text-primary">{service.name}</span>
                       </div>
                       <div className="flex items-center gap-6">
                          <span className="text-text-tertiary font-medium">84 bookings</span>
                          <span className="font-bold text-text-primary">${(84 * service.price).toLocaleString()}</span>
                       </div>
                    </div>
                    <div className="h-2 w-full bg-bg-secondary rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${index === 0 ? 85 : 45}%` }}
                         transition={{ duration: 1, delay: 0.5 }}
                         className={`h-full ${index === 0 ? 'bg-brand' : 'bg-brand/30'} rounded-full`}
                       />
                    </div>
                 </div>
               ))}
            </div>
         </Card>

         {/* Calendar Overview */}
         <Card className="p-8 space-y-6 border-transparent bg-brand text-white overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10 space-y-6">
               <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Calendar size={20} />
               </div>
               <div className="space-y-1">
                  <h3 className="text-lg font-bold tracking-tight">March Overview</h3>
                  <p className="text-xs text-white/70">You have 48 upcoming appointments this month.</p>
               </div>
               <div className="pt-4 space-y-4">
                  <div className="flex justify-between items-end border-b border-white/10 pb-4">
                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Next Appointment</p>
                        <p className="text-sm font-bold mt-1">Today at 2:00 PM</p>
                     </div>
                     <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                        <ChevronRight size={16} />
                     </button>
                  </div>
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Most Active Day</p>
                        <p className="text-sm font-bold mt-1">Friday</p>
                     </div>
                     <p className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase">Busy</p>
                  </div>
               </div>
               <Button variant="secondary" className="w-full bg-white text-brand hover:bg-white/90 border-none rounded-xl font-bold h-12 shadow-xl shadow-black/10">
                  Open Schedule
               </Button>
            </div>
         </Card>
      </div>
    </div>
  );
};
