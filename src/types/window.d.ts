export {};

declare global {
  interface Window {
    __skeduley_dash_cache?: Record<string, {
      data: any;
      timestamp: number;
    }>;
  }
}
