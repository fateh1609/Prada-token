
import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Users, Lock, Zap, Globe, Shield } from 'lucide-react';

const Tokenomics = () => {
  const tokenomicsData = [
    {
      title: 'Total Supply',
      value: '1,000,000,000',
      suffix: 'PRADA',
      icon: PieChart,
      color: 'gold'
    },
    {
      title: 'Token Sale',
      value: '40%',
      description: '400M tokens',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Liquidity Pool',
      value: '20%',
      description: '200M tokens',
      icon: Zap,
      color: 'gold'
    },
    {
      title: 'Team & Advisors',
      value: '15%',
      description: '150M tokens (24 months vesting)',
      icon: Lock,
      color: 'purple'
    },
    {
      title: 'Marketing',
      value: '10%',
      description: '100M tokens',
      icon: Globe,
      color: 'gold'
    },
    {
      title: 'Reserve Fund',
      value: '15%',
      description: '150M tokens',
      icon: Shield,
      color: 'purple'
    }
  ];

  return (
    <section id="tokenomics" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Tokenomics</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover the economic structure and distribution of PRADA tokens designed for sustainable growth and community rewards
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tokenomicsData.map((item, index) => (
            <motion.div
              key={item.title}
              className={`glass-effect p-6 rounded-2xl border-2 ${
                item.color === 'gold' ? 'border-gold hover:glow-gold' : 'border-purple hover:glow-purple'
              } transition-all duration-300 hover:scale-105`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <div className={`inline-flex p-3 rounded-full mb-4 ${
                  item.color === 'gold' ? 'bg-gold/20' : 'bg-purple/20'
                }`}>
                  <item.icon className={`w-6 h-6 ${
                    item.color === 'gold' ? 'text-gold' : 'text-purple'
                  }`} />
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                
                <div className={`text-2xl font-bold mb-2 ${
                  item.color === 'gold' ? 'text-gold' : 'text-purple'
                }`}>
                  {item.value}
                  {item.suffix && <span className="text-sm ml-1">{item.suffix}</span>}
                </div>
                
                {item.description && (
                  <p className="text-sm text-gray-400">
                    {item.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Token Utility Section */}
        <motion.div
          className="mt-16 glass-effect p-8 rounded-2xl border border-gold/30"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-center mb-8 gradient-text">Token Utility</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-gold font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2">Staking Rewards</h4>
              <p className="text-sm text-gray-400">Earn passive income through staking</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2">Governance</h4>
              <p className="text-sm text-gray-400">Vote on protocol decisions</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-gold font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2">MLM Rewards</h4>
              <p className="text-sm text-gray-400">Referral and rank bonuses</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple font-bold">4</span>
              </div>
              <h4 className="font-semibold mb-2">Platform Access</h4>
              <p className="text-sm text-gray-400">Premium features and services</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Tokenomics;
