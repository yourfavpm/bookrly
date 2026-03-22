import React, { useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAppStore } from '../../store/useAppStore';

export const AuthObserver: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const setUser = useAppStore((state) => state.setUser);
  const setLoading = useAppStore((state) => state.setLoading);
  const fetchBusiness = useAppStore((state) => state.fetchBusiness);

  useEffect(() => {
    setLoading(true);
    
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchBusiness().finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const user = session?.user ?? null;
        setUser(user);
        if (user) {
          await fetchBusiness();
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [setUser, setLoading, fetchBusiness]);

  return <>{children}</>;
};
