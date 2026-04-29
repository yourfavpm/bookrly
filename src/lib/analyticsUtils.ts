import type { Service, WorkingHour, Booking } from '../store/useAppStore';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
export type PaymentMethod = 'CARD' | 'CASH' | 'GIFT_CARD' | 'PACKAGE' | 'UNPAID';

export interface ServiceStats {
  id: string;
  name: string;
  bookings: number;
  revenue: number;
  avgPrice: number;
  cancellationRate: number;
  noShowRate: number;
}

export interface DashboardStats {
  todayRevenue: number;
  todayRevenueDelta: number;
  monthRevenue: number;
  monthRevenueDelta: number;
  upcomingToday: number;
  upcomingTodayDelta: number;
  occupancyRate: number;
  occupancyRateDelta: number;
  revenueTrend: { date: string; amount: number; previousAmount?: number }[];
  topServices: { id: string; name: string; bookings: number; revenue: number; percent: number }[];
  upcomingAppointments: Booking[];
  // Full Analytics
  totalBookings: number;
  completed: number;
  cancelled: number;
  noShow: number;
  revenueByMethod: {
    CARD: number;
    CASH: number;
    GIFT_CARD: number;
    PACKAGE: number;
  };
  refunds: number;
  newClients: number;
  returningClients: number;
  occupancyByDay: { day: string; count: number }[];
  servicePerformance: ServiceStats[];
}

export const calculateDashboardStats = (
  bookings: Booking[],
  services: Service[],
  workingHours: WorkingHour[],
  period: string = 'last30',
  compare: boolean = false,
  staffId?: string
): DashboardStats => {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Apply staff filter if present
  const filteredBookings = staffId ? bookings.filter(b => b.staffId === staffId) : bookings;
  
  // Helper to get start/end dates for periods
  const getPeriodRange = (p: string, isPrevious = false) => {
    const start = new Date();
    const end = new Date();
    
    if (p === 'today') {
      if (isPrevious) start.setDate(start.getDate() - 1);
      start.setHours(0,0,0,0);
      end.setTime(start.getTime());
      end.setHours(23,59,59,999);
    } else if (p === 'thisWeek') {
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1); 
      start.setDate(diff);
      if (isPrevious) start.setDate(start.getDate() - 7);
      start.setHours(0,0,0,0);
      end.setTime(start.getTime());
      end.setDate(end.getDate() + 6);
      end.setHours(23,59,59,999);
    } else if (p === 'thisMonth') {
      start.setDate(1);
      if (isPrevious) start.setMonth(start.getMonth() - 1);
      start.setHours(0,0,0,0);
      const lastDay = new Date(start.getFullYear(), start.getMonth() + 1, 0);
      end.setTime(lastDay.getTime());
      end.setHours(23,59,59,999);
    } else if (p === 'last30') {
      start.setDate(start.getDate() - 29);
      if (isPrevious) start.setDate(start.getDate() - 30);
      start.setHours(0,0,0,0);
      end.setTime(start.getTime());
      end.setDate(end.getDate() + 29);
      end.setHours(23,59,59,999);
    } else if (p === 'last3Months') {
      start.setMonth(start.getMonth() - 2);
      start.setDate(1);
      if (isPrevious) start.setMonth(start.getMonth() - 3);
      start.setHours(0,0,0,0);
      if (isPrevious) {
          const lastDay = new Date(start.getFullYear(), start.getMonth() + 3, 0);
          end.setTime(lastDay.getTime());
      } else {
          end.setTime(now.getTime());
      }
      end.setHours(23,59,59,999);
    }
    return { start, end };
  };

  const currentRange = getPeriodRange(period);
  const prevRange = getPeriodRange(period, true);

  const filterBookings = (range: { start: Date; end: Date }) => {
    return filteredBookings.filter(b => {
      const bDate = new Date(b.date);
      return bDate >= range.start && bDate <= range.end;
    });
  };

  const currBookings = filterBookings(currentRange);
  const prevBookings = filterBookings(prevRange);

  // Stats
  const getRevenue = (bks: Booking[]) => bks.filter(b => b.status === 'completed' || b.status === 'confirmed').reduce((sum, b) => sum + b.totalAmount, 0);
  const getUpcoming = (bks: Booking[]) => bks.filter(b => (b.status === 'confirmed' || b.status === 'pending') && b.date === todayStr).length;
  
  const calculateOccupancy = (bks: Booking[], range: { start: Date; end: Date }) => {
    const completedCount = bks.filter(b => b.status === 'completed' || b.status === 'confirmed').length;
    // Estimate available slots
    let totalSlots = 0;
    const daysInRange = Math.ceil((range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    for (let i = 0; i < daysInRange; i++) {
      const d = new Date(range.start);
      d.setDate(d.getDate() + i);
      const dayOfWeek = d.getDay();
      const workDay = workingHours.find(h => h.dayOfWeek === dayOfWeek);
      if (workDay?.isOpen) {
        const startH = parseInt(workDay.startTime.split(':')[0]);
        const endH = parseInt(workDay.endTime.split(':')[0]);
        totalSlots += (endH - startH); 
      }
    }
    return totalSlots > 0 ? (completedCount / totalSlots) * 100 : 0;
  };

  const delta = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return ((curr - prev) / prev) * 100;
  };

  // 1. Today's Revenue
  const todayRange = getPeriodRange('today');
  const yesterdayRange = getPeriodRange('today', true);
  const todayRevenue = getRevenue(filterBookings(todayRange));
  const yesterdayRevenue = getRevenue(filterBookings(yesterdayRange));

  // 2. This Month's Revenue
  const monthRange = getPeriodRange('thisMonth');
  const lastMonthRange = getPeriodRange('thisMonth', true);
  const monthRevenue = getRevenue(filterBookings(monthRange));
  const lastMonthRevenue = getRevenue(filterBookings(lastMonthRange));

  // 3. Upcoming Today
  const upcomingToday = getUpcoming(currBookings);
  const upcomingPrev = getUpcoming(prevBookings);

  // 4. Occupancy
  const occupancyRate = calculateOccupancy(currBookings, currentRange);
  const occupancyPrev = calculateOccupancy(prevBookings, prevRange);

  // Trend Chart
  const trend: { date: string; amount: number; previousAmount?: number }[] = [];
  const days = Math.ceil((currentRange.end.getTime() - currentRange.start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  for (let i = 0; i < days; i++) {
    const d = new Date(currentRange.start);
    d.setDate(d.getDate() + i);
    const dStr = d.toISOString().split('T')[0];
    
    const amount = currBookings.filter(b => b.date === dStr && (b.status === 'completed' || b.status === 'confirmed')).reduce((sum, b) => sum + b.totalAmount, 0);
    
    let previousAmount = undefined;
    if (compare) {
        const pd = new Date(prevRange.start);
        pd.setDate(pd.getDate() + i);
        const pdStr = pd.toISOString().split('T')[0];
        previousAmount = prevBookings.filter(b => b.date === pdStr && (b.status === 'completed' || b.status === 'confirmed')).reduce((sum, b) => sum + b.totalAmount, 0);
    }

    trend.push({
      date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      amount,
      previousAmount
    });
  }

  // Top Services
  const serviceStatsData = services.map(s => {
    const sBks = currBookings.filter(b => b.serviceId === s.id && (b.status === 'completed' || b.status === 'confirmed'));
    return {
      id: s.id,
      name: s.name,
      bookings: sBks.length,
      revenue: sBks.reduce((sum, b) => sum + b.totalAmount, 0)
    };
  }).filter(s => s.bookings > 0).sort((a, b) => b.revenue - a.revenue);

  const totalRev = serviceStatsData.reduce((sum, s) => sum + s.revenue, 0);
  const topServices = serviceStatsData.slice(0, 5).map(s => ({
    ...s,
    percent: totalRev > 0 ? (s.revenue / totalRev) * 100 : 0
  }));

  // Upcoming appointments today
  const upcomingAppointments = filteredBookings
    .filter(b => b.date === todayStr && (b.status === 'confirmed' || b.status === 'pending'))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // FULL ANALYTICS
  const totalBookingsCount = currBookings.length;
  const completedCount = currBookings.filter(b => b.status === 'completed').length;
  const cancelledCount = currBookings.filter(b => b.status === 'cancelled').length;
  const noShowCount = currBookings.filter(b => b.status === 'no_show').length;

  const revenueByMethod = {
    CARD: currBookings.filter(b => b.paymentMethod === 'CARD' && (b.status === 'completed' || b.status === 'confirmed')).reduce((sum, b) => sum + b.totalAmount, 0),
    CASH: currBookings.filter(b => b.paymentMethod === 'CASH' && (b.status === 'completed' || b.status === 'confirmed')).reduce((sum, b) => sum + b.totalAmount, 0),
    GIFT_CARD: currBookings.filter(b => b.paymentMethod === 'GIFT_CARD' && (b.status === 'completed' || b.status === 'confirmed')).reduce((sum, b) => sum + b.totalAmount, 0),
    PACKAGE: currBookings.filter(b => b.paymentMethod === 'PACKAGE' && (b.status === 'completed' || b.status === 'confirmed')).reduce((sum, b) => sum + b.totalAmount, 0)
  };

  const refunds = currBookings.filter(b => b.paymentStatus === 'refunded').reduce((sum, b) => sum + b.totalAmount, 0);
  
  const clientVisits = currBookings.reduce((acc, b) => {
    acc[b.customerName] = (acc[b.customerName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const newClients = Object.values(clientVisits).filter((v: number) => v === 1).length;
  const returningClients = Object.values(clientVisits).filter((v: number) => v > 1).length;

  const occupancyByDay = [0,1,2,3,4,5,6].map(day => {
    const dayBks = currBookings.filter(b => new Date(b.date).getDay() === day && (b.status === 'completed' || b.status === 'confirmed')).length;
    return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day], count: dayBks };
  });

  const fullServiceStats = services.map(s => {
    const sBks = currBookings.filter(b => b.serviceId === s.id);
    const sCompleted = sBks.filter(b => b.status === 'completed' || b.status === 'confirmed');
    const sCancelled = sBks.filter(b => b.status === 'cancelled');
    const sNoShow = sBks.filter(b => b.status === 'no_show');
    const rev = sCompleted.reduce((sum, b) => sum + b.totalAmount, 0);
    
    return {
        id: s.id,
        name: s.name,
        bookings: sBks.length,
        revenue: rev,
        avgPrice: sBks.length > 0 ? rev / sBks.length : 0,
        cancellationRate: sBks.length > 0 ? (sCancelled.length / sBks.length) * 100 : 0,
        noShowRate: sBks.length > 0 ? (sNoShow.length / sBks.length) * 100 : 0
    };
  });

  return {
    todayRevenue,
    todayRevenueDelta: delta(todayRevenue, yesterdayRevenue),
    monthRevenue,
    monthRevenueDelta: delta(monthRevenue, lastMonthRevenue),
    upcomingToday,
    upcomingTodayDelta: delta(upcomingToday, upcomingPrev),
    occupancyRate,
    occupancyRateDelta: delta(occupancyRate, occupancyPrev),
    revenueTrend: trend,
    topServices,
    upcomingAppointments,
    // Full Analytics
    totalBookings: totalBookingsCount,
    completed: completedCount,
    cancelled: cancelledCount,
    noShow: noShowCount,
    revenueByMethod,
    refunds,
    newClients,
    returningClients,
    occupancyByDay,
    servicePerformance: fullServiceStats
  };
};
