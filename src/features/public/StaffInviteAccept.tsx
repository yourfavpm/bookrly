import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export const StaffInviteAccept: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { acceptStaffInvite, user, fetchBusiness } = useAppStore();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'auth_required'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    const processInvite = async () => {
      if (!token) {
        if (mounted) {
          setStatus('error');
          setErrorMessage('Invalid invite link.');
        }
        return;
      }

      if (!user) {
        if (mounted) {
          setStatus('auth_required');
          // Save the intended destination so they return here after login
          sessionStorage.setItem('redirect_after_login', `/invite/${token}`);
        }
        return;
      }

      try {
        const staffMember = await acceptStaffInvite(token);
        if (staffMember) {
           await fetchBusiness(); // Refresh state to load their business dashboard
           if (mounted) setStatus('success');
        } else {
           if (mounted) {
             setStatus('error');
             setErrorMessage('This invite link is invalid or has already been used.');
           }
        }
      } catch (err) {
        if (mounted) {
          setStatus('error');
          setErrorMessage((err as Error).message);
        }
      }
    };

    processInvite();

    return () => {
      mounted = false;
    };
  }, [token, user, acceptStaffInvite, fetchBusiness]);

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-4">
       <Card className="w-full max-w-md p-8 border-border-polaris shadow-xl text-center space-y-6">
         {status === 'loading' && (
           <div className="flex flex-col items-center space-y-4 py-8">
             <Loader2 className="animate-spin text-brand" size={40} />
             <p className="text-text-secondary">Processing your invite...</p>
           </div>
         )}

         {status === 'auth_required' && (
           <div className="flex flex-col items-center space-y-4 py-4">
             <div className="w-16 h-16 rounded-full bg-brand/10 text-brand flex items-center justify-center">
               <CheckCircle2 size={32} />
             </div>
             <div className="space-y-2">
                <h1 className="text-xl font-bold tracking-tight">Login Required</h1>
                <p className="text-sm text-text-secondary">Please create an account or sign in to accept your team invitation.</p>
             </div>
             <Button onClick={() => navigate('/auth')} className="w-full h-12 bg-brand text-white rounded-xl mt-4">
                Continue to Login
             </Button>
           </div>
         )}

         {status === 'success' && (
           <div className="flex flex-col items-center space-y-4 py-4">
             <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
               <CheckCircle2 size={32} />
             </div>
             <div className="space-y-2">
                <h1 className="text-xl font-bold tracking-tight">Invite Accepted!</h1>
                <p className="text-sm text-text-secondary">You've successfully joined the team.</p>
             </div>
             <Button onClick={() => navigate('/dashboard')} className="w-full h-12 bg-brand text-white rounded-xl mt-4">
                Go to Dashboard
             </Button>
           </div>
         )}

         {status === 'error' && (
           <div className="flex flex-col items-center space-y-4 py-4">
             <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
               <XCircle size={32} />
             </div>
             <div className="space-y-2">
                <h1 className="text-xl font-bold tracking-tight text-text-primary">Something went wrong</h1>
                <p className="text-sm text-text-secondary">{errorMessage}</p>
             </div>
             <Button onClick={() => navigate('/')} variant="secondary" className="w-full h-12 rounded-xl mt-4 border-border-polaris">
                Return to Home
             </Button>
           </div>
         )}
       </Card>
    </div>
  );
};
