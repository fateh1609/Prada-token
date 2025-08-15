import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ExternalLink, Gamepad2 } from 'lucide-react';

const ClaimInfo = () => {
  const handleClaimClick = () => {
    window.open('https://prada365.com/mobile-number?agent_code=PRDA76TNQ', '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <motion.div
          className="glass-effect p-8 md:p-12 rounded-2xl border-2 border-purple glow-purple text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex p-4 rounded-full bg-purple/20 mb-6">
            <Gamepad2 className="w-10 h-10 text-purple" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Claim Your Tokens & Play
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
            Your purchased $PRADA tokens can be claimed and used at our premier online casino partner.
          </p>
          <Button
            onClick={handleClaimClick}
            className="bg-purple hover:bg-purple/90 text-white font-semibold px-8 py-4 text-lg rounded-full glow-purple-hover"
          >
            Claim at Prada365.com
            <ExternalLink className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ClaimInfo;