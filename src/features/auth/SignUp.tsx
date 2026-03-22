import React, { useState, useEffect } from 'react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAppStore } from '../../store/useAppStore';

export const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const appLoading = useAppStore((state) => state.loading);

  // Auto-navigate to onboarding when user is authenticated and loading is complete
  useEffect(() => {
    if (user && !appLoading) {
      navigate('/onboarding', { replace: true });
    }
  }, [user, appLoading, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/onboarding',
        },
      });

      if (signUpError) throw signUpError;
      // Don't navigate here - let AuthObserver handle it via useEffect above
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/onboarding',
        },
      });
      if (error) throw error;
      // OAuth redirect will handle navigation
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-2 mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Create your booking website</h1>
        <p className="text-sm text-text-secondary font-normal">Set up your business in minutes</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-xs font-medium">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="w-full h-11 flex items-center justify-center gap-3 bg-white border border-border-default rounded-xl text-sm font-semibold text-text-primary hover:bg-bg-secondary transition-all disabled:opacity-50 mb-6"
      >
        {googleLoading ? (
          <span className="w-4 h-4 border-2 border-text-tertiary border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
        )}
        Continue with Google
      </button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-light" /></div>
        <div className="relative flex justify-center text-xs"><span className="bg-white px-4 text-text-tertiary font-medium">or</span></div>
      </div>

      <form className="space-y-6" onSubmit={handleSignUp}>
        <div className="space-y-4">
          <Input 
            label="Email address" 
            placeholder="name@company.com" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs font-medium text-text-secondary">Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-text-tertiary hover:text-brand transition-colors"
              >
                <span className="relative w-7 h-4 bg-black/5 rounded-full p-0.5 transition-colors" style={showPassword ? { backgroundColor: 'var(--color-brand)', opacity: 0.2 } : {}}>
                  <span className={`block w-3 h-3 rounded-full bg-text-tertiary shadow-sm transition-all ${showPassword ? 'translate-x-3 bg-brand!' : 'translate-x-0'}`} style={showPassword ? { backgroundColor: 'var(--color-brand)' } : {}} />
                </span>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <Input 
              placeholder="Create a password" 
              type={showPassword ? 'text' : 'password'} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <Button 
          type="submit"
          className="w-full h-11 rounded-xl shadow-lg shadow-brand/10 font-bold" 
          size="sm"
          isLoading={loading}
        >
          {loading ? 'Creating account...' : 'Continue'}
        </Button>
      </form>

      <div className="mt-10 pt-6 border-t border-border-light text-center">
        <p className="text-sm text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="text-brand font-semibold hover:underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
