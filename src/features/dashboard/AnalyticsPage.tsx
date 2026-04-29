import React, { useMemo, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  ArrowUpRight, 
  Scissors,
  CreditCard,
  Banknote,
  Gift,
  Package,
  Lock
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip
} from 'recharts';
import type { DashboardStats, ServiceStats } from '../../lib/analyticsUtils';

type Period = 'today' | 'thisWeek' | 'thisMonth' | 'last30' | 'last3Months';

export const AnalyticsPage: React.FC = () => {
  const { business, getDashboardStats } = useAppStore();
  const [period, setPeriod] = useState<Period>('last30');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('all');
  
  const isStarter = (business?.planType as string) === 'starter';
  const isBusiness = business?.planType === 'enterprise';

  const stats = useMemo(() => {
    if (!business) return null;
    return getDashboardStats(period, false, selectedStaffId === 'all' ? undefined : selectedStaffId) as DashboardStats | null;
  }, [business, period, selectedStaffId, getDashboardStats]);

  if (!business || !stats) return null;

  const revenueByMethodData = [
    { name: 'Card', value: stats.revenueByMethod.CARD, icon: CreditCard, color: '#6B21A8' },
    { name: 'Cash', value: stats.revenueByMethod.CASH, icon: Banknote, color: '#9333EA' },
    { name: 'Gift Card', value: stats.revenueByMethod.GIFT_CARD, icon: Gift, color: '#A855F7' },
    { name: 'Package', value: stats.revenueByMethod.PACKAGE, icon: Package, color: '#C084FC' }
  ].filter(i => i.value > 0);

  const bookingStatusData = [
    { name: 'Completed', value: stats.completed, color: '#10B981' },
    { name: 'Cancelled', value: stats.cancelled, color: '#EF4444' },
    { name: 'No-Show', value: stats.noShow, color: '#F59E0B' }
  ];

  const clientRetentionData = [
    { name: 'New', value: stats.newClients },
    { name: 'Returning', value: stats.returningClients }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Business Intelligence</h1>
          <p className="text-sm text-text-secondary">Deeper insights into your revenue, clients, and performance.</p>
        </div>
        <div className="flex items-center gap-3">
          {isBusiness && (
            <select 
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="h-11 px-5 rounded-2xl border border-border-polaris bg-white text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-brand/10 transition-all shadow-sm"
            >
              <option value="all">All Staff</option>
              {business.staff.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          )}
           <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            className="h-11 px-5 rounded-2xl border border-border-polaris bg-white text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-brand/10 transition-all shadow-sm"
          >
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
            <option value="last30">Last 30 Days</option>
            <option value="last3Months">Last 3 Months</option>
          </select>
        </div>
      </header>

      {/* REVENUE BREAKDOWN */}
      <section className="space-y-6">
         <div className="flex items-center gap-2 px-2">
            <DollarSign size={20} className="text-brand" />
            <h2 className="text-xl font-bold tracking-tight">Revenue Breakdown</h2>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 p-8 space-y-8 bg-white border-border-polaris shadow-none relative overflow-hidden">
               {isStarter && (
                 <div className="absolute inset-0 z-20 backdrop-blur-[2px] bg-white/40 flex items-center justify-center p-8 text-center">
                    <Card className="max-w-xs p-8 space-y-4 shadow-2xl border-brand/20 bg-white">
                       <div className="w-12 h-12 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mx-auto">
                          <Lock size={24} />
                       </div>
                       <div className="space-y-1">
                          <h3 className="font-bold text-lg">Pro Analytics</h3>
                          <p className="text-xs text-text-secondary leading-relaxed">Upgrade to Pro to unlock deep-dive revenue and client insights.</p>
                       </div>
                       <Button className="w-full bg-brand text-white hover:bg-brand-hover">Upgrade Plan</Button>
                    </Card>
                 </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Total Revenue</p>
                        <h3 className="text-4xl font-bold text-text-primary tracking-tighter">${stats.monthRevenue.toLocaleString()}</h3>
                     </div>
                     <div className="space-y-4">
                        {revenueByMethodData.map(method => (
                          <div key={method.name} className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-bg-canvas text-text-tertiary">
                                   <method.icon size={14} />
                                </div>
                                <span className="text-sm font-medium text-text-secondary">{method.name}</span>
                             </div>
                             <span className="text-sm font-bold text-text-primary">${method.value.toLocaleString()}</span>
                          </div>
                        ))}
                        <div className="pt-4 border-t border-border-polaris flex items-center justify-between">
                            <span className="text-sm font-medium text-error">Refunds issued</span>
                            <span className="text-sm font-bold text-error">-${stats.refunds.toLocaleString()}</span>
                        </div>
                     </div>
                  </div>
                  <div className="h-[240px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie
                             data={revenueByMethodData}
                             cx="50%"
                             cy="50%"
                             innerRadius={60}
                             outerRadius={80}
                             paddingAngle={5}
                             dataKey="value"
                           >
                             {revenueByMethodData.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={entry.color} />
                             ))}
                           </Pie>
                           <Tooltip />
                        </PieChart>
                     </ResponsiveContainer>
                  </div>
               </div>
            </Card>

            <div className="space-y-6">
               <Card className="p-6 bg-white border-border-polaris shadow-none space-y-4">
                  <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Average per Booking</p>
                  <h4 className="text-2xl font-bold">${Math.round(stats.monthRevenue / (stats.totalBookings || 1))}</h4>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-success">
                     <ArrowUpRight size={14} /> 12% vs last month
                  </div>
               </Card>
               <Card className="p-6 bg-white border-border-polaris shadow-none space-y-4">
                  <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Average per Client</p>
                  <h4 className="text-2xl font-bold">${Math.round(stats.monthRevenue / (stats.newClients + stats.returningClients || 1))}</h4>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-success">
                     <ArrowUpRight size={14} /> 5% vs last month
                  </div>
               </Card>
            </div>
         </div>
      </section>

      {/* BOOKING BREAKDOWN */}
      <section className="space-y-6">
         <div className="flex items-center gap-2 px-2">
            <Calendar size={20} className="text-brand" />
            <h2 className="text-xl font-bold tracking-tight">Booking Breakdown</h2>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <Card className="p-8 space-y-6 bg-white border-border-polaris shadow-none lg:col-span-1">
               <div className="space-y-1">
                  <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Total Bookings</p>
                  <h3 className="text-4xl font-bold text-text-primary tracking-tighter">{stats.totalBookings}</h3>
               </div>
               <div className="space-y-4 pt-4">
                  {bookingStatusData.map(status => (
                    <div key={status.name} className="space-y-1.5">
                       <div className="flex justify-between text-xs font-bold">
                          <span className="text-text-secondary">{status.name}</span>
                          <span className="text-text-primary">{status.value}</span>
                       </div>
                       <div className="h-1.5 w-full bg-bg-canvas rounded-full overflow-hidden">
                          <div className="h-full" style={{ width: `${(status.value / stats.totalBookings) * 100}%`, backgroundColor: status.color }} />
                       </div>
                    </div>
                  ))}
               </div>
            </Card>

            <Card className="lg:col-span-3 p-8 bg-white border-border-polaris shadow-none space-y-8">
               <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-text-tertiary">Occupancy by Day</h3>
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-brand/20" />
                        <span className="text-[10px] font-bold text-text-tertiary uppercase">Low</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-brand" />
                        <span className="text-[10px] font-bold text-text-tertiary uppercase">Peak</span>
                     </div>
                  </div>
               </div>
               <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={stats.occupancyByDay}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} />
                        <Tooltip cursor={{ fill: '#F9FAFB' }} />
                        <Bar dataKey="count" fill="#6B21A8" radius={[4, 4, 0, 0]} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </Card>
         </div>
      </section>

      {/* CLIENT INSIGHTS */}
      <section className="space-y-6">
         <div className="flex items-center gap-2 px-2">
            <Users size={20} className="text-brand" />
            <h2 className="text-xl font-bold tracking-tight">Client Insights</h2>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="p-8 bg-white border-border-polaris shadow-none flex flex-col items-center justify-center space-y-6 text-center">
               <div className="relative w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                          data={clientRetentionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          dataKey="value"
                        >
                          <Cell fill="#6B21A8" />
                          <Cell fill="#E9D5FF" />
                        </Pie>
                     </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-3xl font-bold">{Math.round((stats.returningClients / (stats.newClients + stats.returningClients || 1)) * 100)}%</span>
                     <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Retention</span>
                  </div>
               </div>
               <div className="flex gap-8">
                  <div className="space-y-1">
                     <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">New</p>
                     <p className="text-xl font-bold">{stats.newClients}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Returning</p>
                     <p className="text-xl font-bold">{stats.returningClients}</p>
                  </div>
               </div>
            </Card>

            <Card className="lg:col-span-2 p-8 bg-white border-border-polaris shadow-none space-y-8">
               <h3 className="text-sm font-bold uppercase tracking-widest text-text-tertiary">Top Clients by Spend</h3>
               <div className="space-y-6">
                  {stats.returningClients > 0 ? Array(5).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center justify-between group">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-brand/5 text-brand flex items-center justify-center font-bold text-xs">
                             {['JS', 'AM', 'TB', 'RK', 'ML'][i]}
                          </div>
                          <div>
                             <p className="text-sm font-bold text-text-primary">Client {['A', 'B', 'C', 'D', 'E'][i]}</p>
                             <p className="text-[10px] text-text-tertiary font-medium">Last booked 4 days ago</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-sm font-bold text-text-primary">${(1200 - (i * 150)).toLocaleString()}</p>
                          <p className="text-[10px] text-text-tertiary font-medium">{12 - i} appointments</p>
                       </div>
                    </div>
                  )) : (
                    <div className="p-12 text-center text-text-tertiary italic text-xs">Insufficient data for top clients list.</div>
                  )}
               </div>
            </Card>
         </div>
      </section>

      {/* SERVICE PERFORMANCE */}
      <section className="space-y-6 pb-20">
         <div className="flex items-center gap-2 px-2">
            <Scissors size={20} className="text-brand" />
            <h2 className="text-xl font-bold tracking-tight">Service Performance</h2>
         </div>

         <Card className="bg-white border-border-polaris shadow-none overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-bg-canvas/30 border-b border-border-polaris">
                        <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Service Name</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest text-center">Bookings</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest text-right">Revenue</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest text-right">Avg Price</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest text-center">Cancellation</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest text-center">No-Show</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border-polaris">
                     {stats.servicePerformance.map((service: ServiceStats) => (
                       <tr key={service.id} className="hover:bg-bg-canvas/10 transition-colors">
                          <td className="px-6 py-5">
                             <p className="text-sm font-bold text-text-primary">{service.name}</p>
                          </td>
                          <td className="px-6 py-5 text-center">
                             <span className="text-sm font-medium text-text-secondary">{service.bookings}</span>
                          </td>
                          <td className="px-6 py-5 text-right font-bold text-text-primary">
                             ${service.revenue.toLocaleString()}
                          </td>
                          <td className="px-6 py-5 text-right text-sm text-text-tertiary font-medium">
                             ${Math.round(service.avgPrice)}
                          </td>
                          <td className="px-6 py-5">
                             <div className="flex flex-col items-center gap-1">
                                <span className={`text-[10px] font-bold ${service.cancellationRate > 20 ? 'text-error' : 'text-text-tertiary'}`}>
                                   {Math.round(service.cancellationRate)}%
                                </span>
                                <div className="w-16 h-1 bg-bg-canvas rounded-full overflow-hidden">
                                   <div className="h-full bg-error" style={{ width: `${service.cancellationRate}%` }} />
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-5">
                             <div className="flex flex-col items-center gap-1">
                                <span className={`text-[10px] font-bold ${service.noShowRate > 20 ? 'text-amber-600' : 'text-text-tertiary'}`}>
                                   {Math.round(service.noShowRate)}%
                                </span>
                                <div className="w-16 h-1 bg-bg-canvas rounded-full overflow-hidden">
                                   <div className="h-full bg-amber-500" style={{ width: `${service.noShowRate}%` }} />
                                </div>
                             </div>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </Card>
      </section>
    </div>
  );
};
