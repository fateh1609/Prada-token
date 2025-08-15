import React, { useState } from 'react';
import { Helmet }           from 'react-helmet';
import { Link }             from 'react-router-dom';
import AuthLayout           from '@/components/AuthLayout';
import { Input }            from '@/components/ui/input';
import { Button }           from '@/components/ui/button';
import { useToast }         from '@/components/ui/use-toast';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch('/api/auth/forgot-password',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) {
      return toast({ title:data.error, variant:'destructive' });
    }
    toast({ title:data.message });
  }

  return (
    <>
      <Helmet><title>Forgot Password • PradaFund</title></Helmet>
      <AuthLayout
        title="Forgot Password?"
        description="Enter your email for reset instructions."
        headerLink="/login"
        headerLinkText="Back to Sign In"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="email"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full bg-gold text-black">
            Send Reset Link
          </Button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-6">
          Remembered? <Link to="/login" className="text-gold">Sign In</Link>
        </p>
      </AuthLayout>
    </>
  );
}
