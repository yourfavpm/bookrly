import React, { useState, useEffect } from 'react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAppStore } from '../../store/useAppStore';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const appLoading = useAppStore((state) => state.loading);

  // Auto-navigate to dashboard when user is authenticated and loading is complete
  useEffect(() => {
    if (user && !appLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, appLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
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
          redirectTo: window.location.origin + '/dashboard',
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-2 mb-8 text-left lg:text-left">
        <h1 className="text-3xl font-light tracking-tight text-text-primary">Welcome back</h1>
        <p className="text-[13px] text-text-secondary font-light">Continue building your business</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error/5 border border-error/10 rounded-2xl text-error text-[11px] font-medium leading-relaxed">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleLogin}>
        <div className="space-y-4">
          <Input 
            label="Email address" 
            placeholder="name@company.com" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-2xl h-12 border-black/5 bg-bg-secondary/30 focus:bg-white transition-all text-sm font-light"
          />
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs font-light text-text-secondary">Password</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary hover:text-brand transition-colors"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
                <Link to="/forgot-password" className="text-[10px] font-bold text-brand uppercase tracking-wider hover:underline">
                   Forgot?
                </Link>
              </div>
            </div>
            <Input 
              placeholder="Enter your password" 
              type={showPassword ? 'text' : 'password'} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-2xl h-12 border-black/5 bg-bg-secondary/30 focus:bg-white transition-all text-sm font-light"
            />
          </div>
        </div>

        <Button 
          type="submit"
          className="w-full h-12 rounded-2xl shadow-none font-medium text-[13px]" 
          isLoading={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <div className="relative py-8">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/5" /></div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-medium"><span className="bg-white px-4 text-text-tertiary">or</span></div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="w-full h-12 flex items-center justify-center gap-3 bg-white border border-black/5 rounded-2xl text-[13px] font-medium text-text-primary hover:bg-bg-secondary transition-all disabled:opacity-50"
      >
        {googleLoading ? (
          <span className="w-4 h-4 border-2 border-brand/20 border-t-brand rounded-full animate-spin" />
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

      <div className="mt-12 text-center">
        <p className="text-[13px] text-text-secondary font-light">
          Don't have an account?{' '}
          <Link to="/signup" className="text-brand font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
