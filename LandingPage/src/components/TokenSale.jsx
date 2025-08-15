// src/components/TokenSale.jsx
import React, { useState, useEffect } from 'react';
import { Loader2 }               from 'lucide-react';
import { Button }                from '@/components/ui/button';
import { Input }                 from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
}                               from '@/components/ui/select';
import { useToast }              from '@/components/ui/use-toast';
import { useWallet }             from '@/contexts/WalletContext';
import { ArrowRight, Mail as MailIcon } from 'lucide-react';

// On‑chain token addresses & icons...
const USDT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955';
const USDC_ADDRESS = '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d';
const USDT_ICON    = 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png';
const USDC_ICON    = 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png';

export default function TokenSale({ isHeroWidget = false }) {
  const [paymentToken, setPaymentToken] = useState('USDT');
  const [amount,       setAmount]       = useState('10');
  const [email,        setEmail]        = useState('');
  const [pradaAmount,  setPradaAmount]  = useState('100.00');
  
  // NEW:
  const [isLoading,    setIsLoading]    = useState(false);
  const [status,       setStatus]       = useState('');

  const { toast } = useToast();
  const {
    isConnected,
    connectWallet,
    usdtBalance,
    usdcBalance,
    getBalances,     // ← pull in the new method
    purchaseTokens
  } = useWallet();

  // Recompute PRADA
  useEffect(() => {
    const val = parseFloat(amount);
    setPradaAmount(
      !isNaN(val) && val > 0
        ? (val * 10).toFixed(2)
        : '0.00'
    );
  }, [amount]);

  const handleBuyTokens = async () => {
    if (!isConnected) {
      toast({ title: 'Please connect wallet', variant: 'destructive' });
      return connectWallet();
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return toast({ title: 'Invalid email', variant: 'destructive' });
    }
    const usd = parseFloat(amount);
    if (usd < 10) {
      return toast({ title: 'Minimum $10', variant: 'destructive' });
    }
    const bal = paymentToken === 'USDT'
      ? parseFloat(usdtBalance)
      : parseFloat(usdcBalance);
    if (usd > bal) {
      return toast({ title: 'Insufficient funds', variant: 'destructive' });
    }

    // START loader in-widget
    setIsLoading(true);
    setStatus('Sending payment to sale wallet…');

    try {
      // 1) on‑chain transfer + backend
      await purchaseTokens({
        email,
        paymentTokenAddress:
          paymentToken === 'USDT'
            ? USDT_ADDRESS
            : USDC_ADDRESS,
        amountUsd:   usd,
        pradaAmount: parseFloat(pradaAmount)
      });

      // 2) refresh balances
      setStatus('Updating balances…');
      await getBalances();        // will re‑fetch your USDT/USDC

      setStatus('Purchase complete!');
      setTimeout(() => {
        setIsLoading(false);
        setStatus('');
        toast({ title: 'Tokens purchased!', description: `${pradaAmount} PRADA on the way.` });
      }, 1200);

    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setStatus('');
      toast({ title: 'Purchase failed', description: err.message, variant: 'destructive' });
    }
  };

  // The actual widget
  const widgetContent = (
    <div className="glass-effect p-8 rounded-2xl border-2 border-gold glow-gold">
      {isLoading ? (
        // Loading state inside the widget
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="animate-spin w-12 h-12 text-gold" />
          <p className="text-lg text-gray-300">{status}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Email */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-300">
              <MailIcon className="w-4 h-4 mr-2 text-gold" /> Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-black/50 text-white"
            />
          </div>

          {/* Amount & Token */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-300">Amount (USD)</label>
              <Input
                type="number"
                min="10"
                step="1"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="bg-black/50 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Payment Token</label>
              <Select value={paymentToken} onValueChange={setPaymentToken}>
                <SelectTrigger className="bg-black/50 text-white">
                  <div className="flex items-center space-x-2 px-2">
                    <img
                      src={paymentToken === 'USDT' ? USDT_ICON : USDC_ICON}
                      alt={`${paymentToken} logo`}
                      className="w-5 h-5"
                    />
                    <SelectValue placeholder="Select" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USDT">USDT (Bal: {usdtBalance})</SelectItem>
                  <SelectItem value="USDC">USDC (Bal: {usdcBalance})</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* You Receive */}
          <div>
            <label className="text-sm font-medium text-purple-300">You Will Receive</label>
            <div className="p-4 bg-purple-900/10 rounded-lg text-center">
              <span className="text-3xl font-bold text-purple-400">{pradaAmount}</span>{' '}
              <span className="text-xl text-purple-400">PRADA</span>
            </div>
          </div>

          {/* Buy Button */}
          <Button
            onClick={handleBuyTokens}
            disabled={!email || parseFloat(amount) < 10}
            className="w-full bg-gold text-black"
          >
            Buy Tokens <ArrowRight className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  );

  // render as-is (no modal needed)
  return isHeroWidget
    ? widgetContent
    : <section id="token-sale-section" className="py-20"><div className="max-w-md mx-auto">{widgetContent}</div></section>;
}
