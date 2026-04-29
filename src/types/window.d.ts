export {};

declare global {
  interface Window {
    __bukd_dash_cache?: Record<string, {
      data: any;
      timestamp: number;
    }>;
  }
}
