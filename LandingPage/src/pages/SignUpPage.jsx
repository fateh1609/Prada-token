import React, { useState, useEffect, useRef } from 'react';
import { Helmet }            from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout            from '@/components/AuthLayout';
import { Input }             from '@/components/ui/input';
import { Button }            from '@/components/ui/button';
import { useToast }          from '@/components/ui/use-toast';
import { useWallet }         from '@/contexts/WalletContext';
import { useAuth }           from '@/contexts/AuthContext';
import {
  Eye, EyeOff, CheckCircle,
  XCircle, Loader2, Wallet as WalletIcon
} from 'lucide-react';

export default function SignUpPage() {
  const { toast }               = useToast();
  const navigate                = useNavigate();
  const { walletAddress, isConnected, connectWallet } = useWallet();
  const { loginWithToken }      = useAuth();
  const API                     = import.meta.env.VITE_BACKEND_URL;

  const [form, setForm] = useState({
    firstName:'', lastName:'',
    username:'',  email:'',
    walletAddress:'', sponsorCode:'',
    password:'', confirmPassword:'',
    pin:''
  });

  const [valid, setValid] = useState({
    username:'idle', email:'idle',
    wallet:'idle',  sponsor:'idle'
  });
  const [msgs, setMsgs] = useState({
    username:'', email:'',
    wallet:'',  sponsor:''
  });
  const lastValue = useRef({ username:'', email:'', wallet:'', sponsor:'' });
  const [showPw, setShowPw]   = useState(false);
  const [showCpw, setShowCpw] = useState(false);

  useEffect(() => {
    if (isConnected && walletAddress) {
      setForm(f => ({ ...f, walletAddress }));
      validateField('wallet', walletAddress);
    }
  }, [isConnected, walletAddress]);

  function updateField(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    const fld = name==='walletAddress'? 'wallet'
              : name==='sponsorCode'?   'sponsor'
              : name;
    setValid(v => ({ ...v, [fld]:'idle' }));
    setMsgs(m => ({ ...m, [fld]:'' }));
  }

  async function validateField(field, value) {
    if (!value) return;
    if (lastValue.current[field] === value) return;
    lastValue.current[field] = value;

    setValid(v => ({ ...v, [field]:'loading' }));
    // wallet format
    if (field==='wallet' && !/^0x[a-fA-F0-9]{40}$/.test(value)) {
      setValid(v => ({ ...v, wallet:'error' }));
      setMsgs(m => ({ ...m, wallet:'Invalid format' }));
      return;
    }

    const url = field==='sponsor'
      ? `${API}/api/auth/sponsor/${encodeURIComponent(value)}`
      : `${API}/api/auth/${field}`;
    const opts = field==='sponsor'
      ? { method:'GET' }
      : {
          method:'POST',
          headers:{ 'Content-Type':'application/json' },
          body: JSON.stringify({
            [field==='wallet'?'walletAddress':field]: value
          })
        };

    try {
      const res  = await fetch(url, opts);
      const data = res.headers.get('content-type')?.includes('json')
        ? await res.json() : {};
      const occupied = !res.ok || data.available===false;

      if (occupied) {
        setValid(v => ({ ...v, [field]:'error' }));
        setMsgs(m => ({ ...m, [field]: data.error||'Taken' }));
      } else if (field==='sponsor') {
        setValid(v => ({ ...v, sponsor:'success' }));
        setMsgs(m => ({ ...m, sponsor:`Sponsor: ${data.fullName}` }));
      } else {
        setValid(v => ({ ...v, [field]:'success' }));
        setMsgs(m => ({ ...m, [field]:'' }));
      }
    } catch {
      setValid(v => ({ ...v, [field]:'error' }));
      setMsgs(m => ({ ...m, [field]:'Network error' }));
    }
  }

  function renderIcon(f) {
    if (valid[f]==='loading') return <Loader2 className="animate-spin w-4 h-4" />;
    if (valid[f]==='success') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (valid[f]==='error')   return <XCircle className="w-4 h-4 text-red-500" />;
    return null;
  }

  function allValid() {
    const must = ['firstName','lastName','username','email','walletAddress','sponsorCode','password','confirmPassword','pin'];
    if (!must.every(k=>form[k])) return false;
    if (form.password!==form.confirmPassword) return false;
    if (form.pin.length!==4) return false;
    return ['username','email','wallet','sponsor'].every(f=>valid[f]==='success');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!allValid()) {
      toast({ title:'Please fix errors', variant:'destructive' });
      return;
    }
    const res  = await fetch(`${API}/api/auth/register`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok) {
      toast({ title:data.error||'Signup failed', variant:'destructive' });
      return;
    }
    // auto login + redirect
    loginWithToken(data.token, data.user);
    toast({ title:'Account created!' });
    navigate('/dashboard');
  }

  return (
    <>
      <Helmet><title>Sign Up • PradaFund</title></Helmet>
      <AuthLayout
        title="Create Your Account"
        description="Join the future of decentralized finance."
        headerLink="/login"
        headerLinkText="Sign In"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <Input name="firstName" placeholder="First & Middle Name"
              value={form.firstName} onChange={updateField} required />
            <Input name="lastName" placeholder="Last Name"
              value={form.lastName} onChange={updateField} required />
          </div>

          {/* Username */}
          <div className="relative">
            <Input name="username" placeholder="Username"
              value={form.username} onChange={updateField}
              onBlur={()=>validateField('username',form.username)}
              required />
            <div className="absolute inset-y-0 right-3 flex items-center">
              {renderIcon('username')}
            </div>
          </div>
          {valid.username==='error' && <p className="text-red-500 text-xs">{msgs.username}</p>}

          {/* Email */}
          <div className="relative">
            <Input name="email" type="email" placeholder="Email Address"
              value={form.email} onChange={updateField}
              onBlur={()=>validateField('email',form.email)}
              required />
            <div className="absolute inset-y-0 right-3 flex items-center">
              {renderIcon('email')}
            </div>
          </div>
          {valid.email==='error' && <p className="text-red-500 text-xs">{msgs.email}</p>}

          {/* Wallet */}
          <div className="relative">
            <Input name="walletAddress" placeholder="Wallet Address"
              value={form.walletAddress} onChange={updateField}
              onBlur={()=>validateField('wallet',form.walletAddress)}
              pattern="^0x[a-fA-F0-9]{40}$" title="0x + 40 hex chars"
              className="pr-10" required />
            <div className="absolute inset-y-0 right-10 flex items-center">
              {renderIcon('wallet')}
            </div>
            {!isConnected && (
              <Button type="button" onClick={connectWallet}
                variant="ghost" size="icon"
                className="absolute inset-y-0 right-1"
              >
                <WalletIcon className="w-5 h-5 text-gold" />
              </Button>
            )}
          </div>
          {valid.wallet==='error' && <p className="text-red-500 text-xs">{msgs.wallet}</p>}

          {/* Sponsor */}
          <div className="relative">
            <Input name="sponsorCode" placeholder="Sponsor Code"
              value={form.sponsorCode} onChange={updateField}
              onBlur={()=>validateField('sponsor',form.sponsorCode)}
              required />
            <div className="absolute inset-y-0 right-3 flex items-center">
              {renderIcon('sponsor')}
            </div>
          </div>
          {valid.sponsor==='error' && <p className="text-red-500 text-xs">{msgs.sponsor}</p>}
          {valid.sponsor==='success' && <p className="text-green-500 text-xs">{msgs.sponsor}</p>}

          {/* Password */}
          <div className="relative">
            <Input name="password" type={showPw?'text':'password'} placeholder="Password"
              value={form.password} onChange={updateField} required />
            <Button type="button" onClick={()=>setShowPw(x=>!x)}
              variant="ghost" size="icon" className="absolute inset-y-0 right-0"
            >
              {showPw?<EyeOff/>:<Eye/>}
            </Button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Input name="confirmPassword" type={showCpw?'text':'password'} placeholder="Confirm Password"
              value={form.confirmPassword} onChange={updateField} required />
            <Button type="button" onClick={()=>setShowCpw(x=>!x)}
              variant="ghost" size="icon" className="absolute inset-y-0 right-0"
            >
              {showCpw?<EyeOff/>:<Eye/>}
            </Button>
          </div>
          {form.password && form.confirmPassword && form.password!==form.confirmPassword &&
            <p className="text-red-500 text-xs">Passwords must match</p>
          }

          {/* PIN */}
          <Input name="pin" type="password" inputMode="numeric" maxLength={4}
            placeholder="4-digit PIN" value={form.pin} onChange={updateField}
            required className="text-center tracking-[0.5em]" />

          {/* Submit */}
          <Button type="submit" disabled={!allValid()} className="w-full bg-gold text-black">
            Sign Up
          </Button>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-gold hover:underline">Sign In</Link>
          </p>
        </form>
      </AuthLayout>
    </>
  );
}
