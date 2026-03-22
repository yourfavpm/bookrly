import React, { useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAppStore } from '../../store/useAppStore';

export const AuthObserver: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    let mounted = true;
    let authCheckComplete = false;

    const handleAuthStateChange = async (_event: string, session: any) => {
      if (!mounted) return;
      
      const user = session?.user ?? null;
      useAppStore.setState({ user, loading: !!user });
      
      if (user) {
        try {
          await useAppStore.getState().fetchBusiness();
        } catch (err) {
          console.error('Failed to fetch business:', err);
        }
      }
      
      useAppStore.setState({ loading: false });
    };

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          authCheckComplete = true;
          if (session?.user) {
            await handleAuthStateChange('initial', session);
          } else {
            useAppStore.setState({ user: null, loading: false });
          }
        }
      } catch (err) {
        console.error('Session check error:', err);
        if (mounted) {
          useAppStore.setState({ loading: false });
        }
      }
    };

    // Start initial auth check
    initAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Skip if initial check hasn't completed yet to avoid duplicate calls
        if (!authCheckComplete && event === 'INITIAL_SESSION') {
          return;
        }
        
        handleAuthStateChange(event, session);
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return <>{children}</>;
};
