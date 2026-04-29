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
      const currentUser = useAppStore.getState().user;
      const currentBusiness = useAppStore.getState().business;
      
      // If user hasn't changed and we already have business data, don't trigger a full reload
      if (user?.id === currentUser?.id && currentBusiness && _event !== 'SIGNED_OUT') {
        return;
      }

      useAppStore.setState({ user, loading: !!user });
      
      if (user) {
        try {
          // Trigger location detection once
          useAppStore.getState().detectLocation();
          
          // Check if this user is a staff member first
          const { data: staffRecord, error: staffError } = await supabase
            .from('staff_members')
            .select('role, id, business_id')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single();

          if (!staffError && staffRecord) {
            useAppStore.setState({ staffRole: staffRecord.role as any, staffId: staffRecord.id });
          } else {
             useAppStore.setState({ staffRole: 'owner', staffId: null });
          }

          // Trigger business fetch
          await useAppStore.getState().fetchBusiness();
        } catch (err) {
          console.error('Failed to fetch business or staff data:', err);
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
