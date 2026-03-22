import React, { useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAppStore } from '../../store/useAppStore';

export const AuthObserver: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const setUser = useAppStore((state) => state.setUser);
  const setLoading = useAppStore((state) => state.setLoading);
  const fetchBusiness = useAppStore((state) => state.fetchBusiness);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user ?? null;
        
        if (mounted) {
          setUser(user);
          if (user) {
            await fetchBusiness();
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Session check error:', err);
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const user = session?.user ?? null;
        
        if (mounted) {
          setUser(user);
          if (user) {
            await fetchBusiness();
          }
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setLoading, fetchBusiness]);

  return <>{children}</>;
};
