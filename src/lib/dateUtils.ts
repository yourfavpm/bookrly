/**
 * Calculates the number of full calendar days remaining between now and an end date.
 * If the end date is today, it returns 0.
 * If the end date was yesterday, it returns 0 (clamped).
 * 
 * This approach is more intuitive for users than a strict 24-hour Math.ceil,
 * as it ticks down as soon as a new day begins.
 */
export const calculateDaysRemaining = (endDate: string | Date | null | undefined): number => {
  if (!endDate) return 0;
  
  const end = new Date(endDate);
  const now = new Date();
  
  // Normalize both dates to midnight to compare calendar days
  const endMidnight = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffTime = endMidnight.getTime() - nowMidnight.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};
