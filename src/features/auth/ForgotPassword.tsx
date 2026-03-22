import React from 'react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  return (
    <AuthLayout>
      <div className="space-y-2 mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Reset password</h1>
        <p className="text-sm text-text-secondary font-normal">We'll send you a link to get back in</p>
      </div>

      <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
        <Input label="Email address" placeholder="name@company.com" type="email" />

        <Button className="w-full h-11 rounded-xl shadow-lg shadow-brand/10 font-bold" size="sm">
          Send link
        </Button>
      </form>

      <div className="mt-10 pt-6 border-t border-border-light text-center">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft size={16} />
          Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
};
