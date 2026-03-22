import React from 'react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';

export const Login: React.FC = () => {
  return (
    <AuthLayout>
      <div className="space-y-2 mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Welcome back</h1>
        <p className="text-sm text-text-secondary font-normal">Sign in to manage your bookings</p>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-4">
          <Input label="Email address" placeholder="name@company.com" type="email" />
          <div className="space-y-1">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs font-medium text-text-secondary">Password</label>
              <Link to="/forgot-password" hidden className="text-[10px] font-bold text-brand uppercase tracking-wider hover:underline underline-offset-4">
                 Forgot?
              </Link>
            </div>
            <Input placeholder="Enter your password" type="password" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Button className="w-full h-11 rounded-xl shadow-lg shadow-brand/10 font-bold" size="sm">
            Sign in
          </Button>
          <Link to="/forgot-password"  className="text-center text-xs text-text-tertiary hover:text-text-primary transition-colors">
            Forgot password?
          </Link>
        </div>
      </form>

      <div className="mt-10 pt-6 border-t border-border-light text-center">
        <p className="text-sm text-text-secondary">
          Don't have an account?{' '}
          <Link to="/signup" className="text-brand font-semibold hover:underline underline-offset-4">
            Create one
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
