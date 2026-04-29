import React, { useMemo, useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { calculateDaysRemaining } from '../../lib/dateUtils';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { 
  Calendar, 
  ArrowRight, 
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Clock,
  ChevronRight,
  PlusCircle,
  BarChart3,
  ExternalLink,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { getBusinessUrl } from '../../lib/domainUtils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

type Period = 'today' | 'thisWeek' | 'thisMonth' | 'last30' | 'last3Months';

const formatCurrency = (val: number) => {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
  return `$${val}`;
};

export const DashboardOverview: React.FC = () => {
  const { business, getDashboardStats } = useAppStore();
  const navigate = useNavigate();
  const [copying, setCopying] = useState(false);
  const [period, setPeriod] = useState<Period>('last30');
  const [compare, setCompare] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     if (business) {
        const timer = setTimeout(() => setLoading(false), 400);
        return () => clearTimeout(timer);
     }
  }, [business]);

  const stats = useMemo(() => {
    if (!business) return null;
    return getDashboardStats(period, compare);
  }, [business, period, compare, getDashboardStats]);

  const handleCopyLink = React.useCallback(() => {
    if (!business) return;
    const publicUrl = getBusinessUrl(business.subdomain);
    navigator.clipboard.writeText(publicUrl);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  }, [business]);

  const onboardingSteps = useMemo(() => {
    if (!business) return [];
    
    return [
      {
        id: 'services',
        title: 'Add your services',
        description: 'Create what customers can book',
        isCompleted: business.services.length > 0,
        action: () => navigate('/dashboard/services'),
        actionLabel: 'Add service'
      },
      {
        id: 'availability',
        title: 'Set your availability',
        description: "Choose when you're open for bookings",
        isCompleted: business.workingHours.some(h => h.isOpen),
        action: () => navigate('/dashboard/availability'),
        actionLabel: 'Set schedule'
      },
      {
        id: 'payments',
        title: 'Connect payments',
        description: 'Start receiving payments for your services',
        isCompleted: business.stripeConnected && business.stripeDetailsSubmitted,
        action: () => navigate('/dashboard/settings?section=payments'),
        actionLabel: 'Set up'
      },
      {
        id: 'website',
        title: 'Customize your website',
        description: 'Make your booking page match your brand',
        isCompleted: business.isPublished || !!business.heroTitle,
        action: () => navigate('/dashboard/website'),
        actionLabel: 'Customize'
      }
    ];
  }, [business, navigate]);

  const completedSteps = onboardingSteps.filter(s => s.isCompleted).length;
  const progressPercent = Math.round((completedSteps / onboardingSteps.length) * 100);

  const trialDaysLeft = calculateDaysRemaining(business?.trialEndDate);

  if (!business) return null;

  const today = new Date();
  const hour = today.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const MetricCard = ({ label, value, delta, icon: Icon, prefix = '', suffix = '' }: any) => (
    <Card className="p-6 border-border-polaris shadow-none bg-white hover:border-brand/20 transition-all group overflow-hidden relative">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 rounded-xl bg-bg-canvas/50 text-text-tertiary group-hover:bg-brand/5 group-hover:text-brand transition-colors">
          <Icon size={18} />
        </div>
        {delta !== undefined && (
          <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
            delta > 2 ? 'text-success bg-success/10' : 
            delta < -2 ? 'text-error bg-error/10' : 
            'text-text-tertiary bg-bg-canvas'
          }`}>
            {delta > 2 ? <ChevronUp size={10} /> : delta < -2 ? <ChevronDown size={10} /> : null}
            {Math.abs(Math.round(delta))}%
          </div>
        )}
      </div>
      <div className="space-y-0.5">
        <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{label}</p>
        <h3 className="text-2xl font-bold text-text-primary tracking-tight">
          {prefix}{typeof value === 'number' && value > 1000 ? formatCurrency(value) : value}{suffix}
        </h3>
      </div>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      
      {/* Trial Awareness */}
      {trialDaysLeft !== null && trialDaysLeft <= 14 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-text-primary text-white shadow-xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform duration-1000" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-2 rounded-xl bg-white/10 text-emerald-400">
              <AlertCircle size={20} />
            </div>
            <p className="text-sm font-medium">Your trial ends in <span className="text-emerald-400 font-bold">{trialDaysLeft} days</span>. Keep your business running without interruption.</p>
          </div>
          <Button 
            size="sm" 
            onClick={() => navigate('/dashboard/settings?section=billing')}
            className="w-full sm:w-auto px-8 h-10 bg-emerald-500 hover:bg-emerald-400 text-text-primary rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
          >
            Upgrade Now
          </Button>
        </div>
      )}

      {/* Greeting Bar */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em]">
            {today.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            {greeting}, {business.name.split(' ')[0]}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            className="h-10 px-4 rounded-xl border border-border-polaris bg-white text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-brand/10 transition-all"
          >
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
            <option value="last30">Last 30 Days</option>
            <option value="last3Months">Last 3 Months</option>
          </select>
          <Button 
            variant="secondary" 
            onClick={handleCopyLink}
            className="h-10 px-6 rounded-xl border-border-polaris font-bold text-[10px] uppercase tracking-widest bg-white"
          >
            {copying ? 'Copied!' : 'Booking Link'}
          </Button>
        </div>
      </header>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading || !stats ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32" />) : (
          <>
            <MetricCard 
              label="Today's Revenue" 
              value={stats.todayRevenue} 
              delta={stats.todayRevenueDelta}
              icon={DollarSign}
              prefix="$"
            />
            <MetricCard 
              label="Monthly Revenue" 
              value={stats.monthRevenue} 
              delta={stats.monthRevenueDelta}
              icon={TrendingUp}
              prefix="$"
            />
            <MetricCard 
              label="Upcoming Today" 
              value={stats.upcomingToday} 
              delta={stats.upcomingTodayDelta}
              icon={Calendar}
            />
            <MetricCard 
              label="Occupancy Rate" 
              value={Math.round(stats.occupancyRate)} 
              delta={stats.occupancyRateDelta}
              icon={BarChart3}
              suffix="%"
            />
          </>
        )}
      </div>

      {/* Main Chart Section */}
      <Card className="p-8 border-border-polaris shadow-none bg-white space-y-8">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
               <h3 className="text-lg font-bold tracking-tight">Revenue Trends</h3>
               <p className="text-xs text-text-tertiary">Performance for {period.replace(/([A-Z])/g, ' $1').toLowerCase()}</p>
            </div>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-brand" />
                     <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Current</span>
                  </div>
                  {compare && (
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full bg-text-tertiary/30" />
                       <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Previous</span>
                    </div>
                  )}
               </div>
               <div className="h-6 w-px bg-border-polaris" />
               <button 
                 onClick={() => setCompare(!compare)}
                 className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${compare ? 'text-brand' : 'text-text-tertiary hover:text-text-primary'}`}
               >
                  Compare
               </button>
            </div>
         </div>

         <div className="h-[300px] w-full">
            {loading || !stats ? <Skeleton className="h-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.revenueTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6B21A8" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6B21A8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 600, fill: '#9CA3AF' }}
                    dy={10}
                    interval={period === 'last3Months' ? 30 : period === 'last30' ? 6 : 0}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 600, fill: '#9CA3AF' }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                    labelStyle={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '4px' }}
                  />
                  {compare && (
                    <Area 
                      type="monotone" 
                      dataKey="previousAmount" 
                      stroke="#E5E7EB" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      fill="transparent" 
                    />
                  )}
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#6B21A8" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorAmount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
         </div>
      </Card>

      {/* Two Column Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* Top Services */}
         <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
               <h3 className="font-bold text-lg text-text-primary tracking-tight">Top Services</h3>
               <Link to="/dashboard/analytics" className="text-[10px] font-bold text-brand uppercase tracking-widest hover:underline flex items-center gap-1">
                  Full Report <ExternalLink size={12} />
               </Link>
            </div>
            <Card className="border-border-polaris shadow-none bg-white overflow-hidden">
               {loading || !stats ? <div className="p-8 space-y-4"><Skeleton className="h-10" /><Skeleton className="h-10" /><Skeleton className="h-10" /></div> : (
                 <div className="divide-y divide-border-polaris">
                    {stats.topServices.length > 0 ? stats.topServices.map((s: any, i: number) => (
                      <div key={s.id} className="p-5 flex items-center justify-between hover:bg-bg-canvas/10 transition-all group">
                         <div className="flex items-center gap-5">
                            <span className="text-xs font-bold text-text-tertiary group-hover:text-brand">{i + 1}</span>
                            <div className="space-y-1">
                               <p className="text-sm font-bold text-text-primary">{s.name}</p>
                               <div className="flex items-center gap-3">
                                  <span className="text-[10px] text-text-tertiary font-medium">{s.bookings} bookings</span>
                                  <div className="h-1 w-24 bg-bg-canvas rounded-full overflow-hidden">
                                     <div className="h-full bg-brand/30" style={{ width: `${s.percent}%` }} />
                                  </div>
                               </div>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-sm font-bold text-text-primary">${s.revenue.toLocaleString()}</p>
                            <p className="text-[10px] font-medium text-text-tertiary">{Math.round(s.percent)}% of total</p>
                         </div>
                      </div>
                    )) : (
                      <div className="p-12 text-center text-text-tertiary space-y-2">
                         <BarChart3 size={24} className="mx-auto opacity-20" />
                         <p className="text-xs font-medium italic">No revenue data for this period</p>
                      </div>
                    )}
                 </div>
               )}
            </Card>
         </div>

         {/* Upcoming Appointments */}
         <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
               <h3 className="font-bold text-lg text-text-primary tracking-tight">Today's Schedule</h3>
               <Link to="/dashboard/bookings" className="text-[10px] font-bold text-brand uppercase tracking-widest">View Calendar</Link>
            </div>
            <Card className="border-border-polaris shadow-none bg-white overflow-hidden">
               {loading || !stats ? <div className="p-8 space-y-4"><Skeleton className="h-10" /><Skeleton className="h-10" /><Skeleton className="h-10" /></div> : (
                 <div className="divide-y divide-border-polaris">
                    {stats.upcomingAppointments.length > 0 ? stats.upcomingAppointments.map((b: any) => (
                      <div 
                        key={b.id} 
                        onClick={() => navigate('/dashboard/bookings')}
                        className="p-5 flex items-center justify-between hover:bg-bg-canvas/10 transition-all cursor-pointer group"
                      >
                         <div className="flex items-center gap-5">
                            <div className="text-center min-w-[50px]">
                               <p className="text-xs font-bold text-text-primary">{b.startTime}</p>
                               <div className="w-1 h-1 rounded-full bg-brand mx-auto mt-1" />
                            </div>
                            <div className="space-y-0.5">
                               <p className="text-sm font-bold text-text-primary">{b.customerName}</p>
                               <div className="flex items-center gap-2 text-[10px] text-text-tertiary font-medium">
                                  <span>{business.services.find(s => s.id === b.serviceId)?.name}</span>
                                  <span className="text-text-tertiary/30">•</span>
                                  <span>{business.services.find(s => s.id === b.serviceId)?.duration} min</span>
                               </div>
                            </div>
                         </div>
                         <ChevronRight className="text-text-tertiary group-hover:text-brand transition-all" size={16} />
                      </div>
                    )) : (
                      <div className="p-12 text-center text-text-tertiary space-y-4">
                         <div className="w-16 h-16 rounded-3xl bg-bg-canvas/50 flex items-center justify-center mx-auto text-text-tertiary">
                            <Clock size={24} />
                         </div>
                         <div className="space-y-1">
                            <p className="text-sm font-bold text-text-primary">No more appointments today</p>
                            <p className="text-xs font-medium">Enjoy the rest of your day or share your link to get booked!</p>
                         </div>
                         <Button variant="secondary" onClick={handleCopyLink} className="rounded-xl px-6 h-9 text-[9px] font-bold uppercase tracking-widest bg-white">Share Link</Button>
                      </div>
                    )}
                 </div>
               )}
            </Card>
         </div>
      </div>

      {/* Onboarding Section - Moved below analytics */}
      {progressPercent < 100 && (
        <section className="space-y-6 pt-10">
          <div className="flex items-center justify-between px-1">
            <div className="space-y-1">
               <h2 className="text-xl font-bold tracking-tight">Complete your setup</h2>
               <p className="text-sm text-text-secondary">{onboardingSteps.length - completedSteps} steps left to launch your business.</p>
            </div>
            <div className="text-right space-y-1">
               <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{progressPercent}% Done</p>
               <div className="w-32 h-1.5 bg-bg-canvas rounded-full overflow-hidden">
                 <motion.div 
                   className="h-full bg-brand"
                   initial={{ width: 0 }}
                   animate={{ width: `${progressPercent}%` }}
                   transition={{ duration: 1, ease: "easeOut" }}
                 />
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {onboardingSteps.map((step) => (
              <Card 
                key={step.id}
                className={`p-6 border-border-polaris shadow-none bg-white group transition-all ${step.isCompleted ? 'opacity-60' : 'hover:border-brand/40'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className={`p-3 rounded-2xl ${step.isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-bg-canvas text-text-tertiary group-hover:text-brand group-hover:bg-brand/5'} transition-all`}>
                      {step.isCompleted ? <CheckCircle2 size={24} /> : <PlusCircle size={24} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-text-primary tracking-tight">{step.title}</h3>
                      <p className="text-xs text-text-secondary font-medium">{step.description}</p>
                    </div>
                  </div>
                  {!step.isCompleted && (
                    <button 
                      onClick={step.action}
                      className="p-2 text-text-tertiary hover:text-brand hover:bg-brand/5 rounded-xl transition-all"
                    >
                      <ArrowRight size={20} />
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
