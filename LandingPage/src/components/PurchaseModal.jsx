import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence }    from 'framer-motion';
import { Loader2, CheckCircle, Mail } from 'lucide-react';
import { Button }                     from '@/components/ui/button';
import { useWallet }                  from '@/contexts/WalletContext';

export default function PurchaseModal({
  email,
  saleResult,    // ← passed from TokenSale
  onComplete
}) {
  const { walletAddress, truncateAddress } = useWallet();
  const [step,       setStep]       = useState(0);
  const [error,      setError]      = useState(null);

  // extract hashes
  const depositHash = saleResult?.depositTxHash;
  const pradaHash   = saleResult?.pradaTxHash;

  const steps = [
    {
      text: `⏳ Waiting for payment…`,
      icon: <Loader2 className="animate-spin" />
    },
    {
      text: `✅ Payment sent: ${depositHash}`,
      icon: <CheckCircle className="text-green-500" />
    },
    {
      text: `⏳ Allocating PRADA…`,
      icon: <Loader2 className="animate-spin" />
    },
    {
      text: `✅ PRADA allocated: ${pradaHash}`,
      icon: <CheckCircle className="text-green-500" />
    },
    {
      text: `📧 Receipt sent to ${email}`,
      icon: <Mail className="text-gold" />
    },
    {
      text: `Sucessfully Completed`,
      icon: <CheckCircle className="text-gold" />
    }
  ];

  useEffect(() => {
    let alive = true;
    if (!saleResult) return;
    (async () => {
      try {
        for (let i = 0; i < steps.length; i++) {
          if (!alive) break;
          setStep(i);
          // allow your timing (e.g. 1s per step)
          await new Promise(r => setTimeout(r, 1000));
        }
        alive && onComplete();
      } catch (err) {
        console.error(err);
        alive && setError(err.message || 'Unexpected error');
      }
    })();
    return () => { alive = false };
  }, [saleResult, onComplete]);

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-400 mb-4">Error: {error}</p>
        <Button onClick={onComplete}>Close</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6 text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-16 h-16 flex items-center justify-center text-4xl">
            {steps[step]?.icon}
          </div>
          <p className="text-lg text-gray-300 font-medium">
            {steps[step]?.text}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
