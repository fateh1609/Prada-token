import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import TokenSale from '@/components/TokenSale';

const Hero = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="token-sale" className="min-h-screen flex items-center justify-center relative overflow-hidden hero-pattern pt-24 pb-12 md:pt-32 md:pb-20">
      <div className="absolute inset-0 blockchain-bg"></div>
      
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-gold/10 animate-float"></div>
      <div className="absolute top-40 right-20 w-16 h-16 rounded-full bg-purple/10 animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 rounded-full bg-gold/10 animate-float" style={{ animationDelay: '4s' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl lg:text-7xl font-bold leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              The Future of{' '}
              <span className="gradient-text">Decentralized Finance</span>{' '}
              is Here.
            </motion.h1>

            <motion.p
              className="text-xl lg:text-2xl text-gray-300 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Experience the power of PradaFund's Web3 ecosystem, combining advanced staking with unparalleled DeFi solutions for maximum earning potential.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                onClick={() => scrollToSection('roadmap')}
                className="bg-gold hover:bg-gold/90 text-black font-semibold px-8 py-4 text-lg rounded-full glow-gold hover:glow-gold"
              >
                View Roadmap
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={() => scrollToSection('tokenomics')}
                variant="outline"
                className="border-purple text-purple hover:bg-purple hover:text-white px-8 py-4 text-lg rounded-full"
              >
                <Play className="mr-2 w-5 h-5" />
                Learn More
              </Button>
            </motion.div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <TokenSale isHeroWidget={true} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;