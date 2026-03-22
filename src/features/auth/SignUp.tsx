import React from 'react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';

export const SignUp: React.FC = () => {
  return (
    <AuthLayout>
      <div className="space-y-2 mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Create your booking website</h1>
        <p className="text-sm text-text-secondary font-normal">Set up your business in minutes</p>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-4">
          <Input label="Email address" placeholder="name@company.com" type="email" />
          <Input label="Password" placeholder="Create a password" type="password" />
        </div>

        <Button className="w-full h-11 rounded-xl shadow-lg shadow-brand/10 font-bold" size="sm">
          Continue
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
