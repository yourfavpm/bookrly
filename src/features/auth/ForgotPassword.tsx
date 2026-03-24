import React from 'react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  return (
    <AuthLayout>
      <div className="space-y-2 mb-8 text-left">
        <h1 className="text-3xl font-light tracking-tight text-text-primary">Reset password</h1>
        <p className="text-[13px] text-text-secondary font-light">We'll send you a link to get back in</p>
      </div>

      <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
        <Input 
          label="Email address" 
          placeholder="name@company.com" 
          type="email" 
          className="rounded-2xl h-12 border-black/5 bg-bg-secondary/30 focus:bg-white transition-all text-sm font-light"
        />

        <Button className="w-full h-12 rounded-2xl shadow-none font-medium text-[13px]">
          Send link
        </Button>
      </form>

      <div className="mt-12 text-center">
        <Link to="/login" className="inline-flex items-center gap-2 text-[13px] text-text-secondary font-light hover:text-brand transition-colors">
          <ArrowLeft size={14} />
          Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
};
