// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/AuthLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Wallet as WalletIcon } from 'lucide-react';

export default function LoginPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading, login, walletLogin } = useAuth();
  const { walletAddress, isConnected, connectWallet } = useWallet();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [credError, setCredError] = useState('');

  const [pin, setPin] = useState('');
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [pinError, setPinError] = useState('');

  // Credential login
  const handleCredLogin = async e => {
    e.preventDefault();
    setCredError('');
    if (!identifier.trim() || !password) {
      setCredError('Please fill in both fields');
      toast({ title: 'Please fill in both fields', variant: 'destructive' });
      return;
    }
    try {
      await login(identifier.trim(), password);
      toast({ title: 'Logged in!' });
      navigate('/dashboard');
    } catch (err) {
      const msg = err.error || 'Invalid credentials';
      setCredError(msg);
      toast({ title: msg, variant: 'destructive' });
    }
  };

  // Wallet login button
  const handleWalletBtn = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      toast({ title: 'Wallet address format invalid', variant: 'destructive' });
      return;
    }
    setPinError('');
    setShowPinPrompt(true);
  };

  // PIN submit
  const handlePinSubmit = async e => {
    e.preventDefault();
    setPinError('');
    if (pin.length !== 4) {
      setPinError('Enter a 4‑digit PIN');
      toast({ title: 'Enter a 4‑digit PIN', variant: 'destructive' });
      return;
    }
    try {
      await walletLogin(walletAddress, pin);
      toast({ title: 'Wallet login successful' });
      navigate('/dashboard');
    } catch (err) {
      const msg = err.error || 'Wrong PIN';
      setPinError(msg);
      toast({ title: msg, variant: 'destructive' });
    }
  };

  // PIN prompt screen
  if (showPinPrompt) {
    return (
      <AuthLayout
        title="Enter PIN"
        description={`Wallet ${walletAddress.slice(0, 6)}…`}
      >
        <Helmet><title>Unlock Wallet • PradaFund</title></Helmet>
        <form onSubmit={handlePinSubmit} className="space-y-4">
          <Input
            type="password"
            inputMode="numeric"
            maxLength={4}
            placeholder="••••"
            value={pin}
            onChange={e => setPin(e.target.value)}
            required
            className="text-center tracking-[0.5em]"
          />
          {pinError && <p className="text-red-500 text-sm">{pinError}</p>}
          <Button type="submit" className="w-full">Unlock</Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          <button
            className="text-gold hover:underline"
            onClick={() => setShowPinPrompt(false)}
          >
            Back to Sign In
          </button>
        </p>
      </AuthLayout>
    );
  }

  // Main login screen
  return (
    <AuthLayout title="Sign In" description="Use credentials or wallet">
      <Helmet><title>Sign In • PradaFund</title></Helmet>

      <form onSubmit={handleCredLogin} className="space-y-4">
        <Input
          placeholder="Email or Username"
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
          required
        />

        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            size="icon"
            variant="ghost"
            className="absolute inset-y-0 right-0"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </Button>
        </div>
        {credError && <p className="text-red-500 text-sm">{credError}</p>}

        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-gold hover:underline">
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" className="w-full">Sign In</Button>
      </form>

      <div className="flex items-center my-4">
        <div className="flex-grow border-t" />
        <span className="px-2 text-gray-400">OR</span>
        <div className="flex-grow border-t" />
      </div>

      <Button
        onClick={handleWalletBtn}
        variant="outline"
        className="w-full flex items-center justify-center"
      >
        <WalletIcon className="mr-2" /> Connect Wallet
      </Button>

      <p className="mt-4 text-center text-sm text-gray-400">
        Don’t have an account?{' '}
        <Link to="/signup" className="text-gold hover:underline">
          Sign Up
        </Link>
      </p>
    </AuthLayout>
  );
}
