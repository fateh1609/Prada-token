import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Wallet, Copy, ExternalLink } from 'lucide-react';

const AddToWallet = () => {
  const { toast } = useToast();
  const tokenDetails = {
    address: '0xeF0169B129E5f66FDfA5cC1631B18CE2Fc6E370B',
    symbol: 'PRADA',
    decimals: 18,
    image: 'https://i.imgur.com/Jk85aQ1.png', // Placeholder logo
  };

  const bscScanLink = `https://bscscan.com/token/${tokenDetails.address}`;

  const handleAddToWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: 'MetaMask Not Found',
        description: 'Please install MetaMask to add the token to your wallet.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenDetails.address,
            symbol: tokenDetails.symbol,
            decimals: tokenDetails.decimals,
            image: tokenDetails.image,
          },
        },
      });

      if (wasAdded) {
        toast({
          title: 'Token Added!',
          description: `$${tokenDetails.symbol} has been added to your wallet.`,
        });
      } else {
        toast({
          title: 'Token Not Added',
          description: 'You chose not to add the token.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Something went wrong while trying to add the token.',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to Clipboard!',
      description: 'Contract address has been copied.',
    });
  };

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">
            Add <span className="gradient-text">$PRADA</span> to Your Wallet
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Easily add our token to your MetaMask wallet to view your balance.
          </p>
        </motion.div>

        <motion.div
          className="max-w-2xl mx-auto glass-effect p-8 rounded-2xl border-2 border-purple glow-purple"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-black/50 p-4 rounded-lg">
              <span className="text-gray-300">Token Symbol</span>
              <span className="font-bold text-gold">${tokenDetails.symbol}</span>
            </div>
            <div className="flex justify-between items-center bg-black/50 p-4 rounded-lg">
              <span className="text-gray-300">Decimals</span>
              <span className="font-bold text-white">{tokenDetails.decimals}</span>
            </div>
            <div className="bg-black/50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Contract Address</span>
                <div className="flex items-center space-x-2">
                  <a
                    href={bscScanLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple hover:text-purple/80 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => copyToClipboard(tokenDetails.address)}
                    className="text-purple hover:text-purple/80 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-white break-all font-mono">{tokenDetails.address}</p>
            </div>

            <Button
              onClick={handleAddToWallet}
              className="w-full bg-purple hover:bg-purple/90 text-white font-semibold py-4 text-lg rounded-full glow-purple"
            >
              <Wallet className="mr-2 w-5 h-5" />
              Add to MetaMask
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AddToWallet;