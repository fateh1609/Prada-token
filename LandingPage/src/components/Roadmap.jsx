
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Circle, Rocket } from 'lucide-react';

const Roadmap = () => {
  const phases = [
    {
      phase: 'Phase 1',
      period: 'Q1 2025',
      title: 'Launch & Foundation',
      status: 'completed',
      items: [
        'Token Smart Contract Deployment',
        'Initial Token Sale Launch',
        'Community Building',
        'Basic MLM Structure Implementation',
        'Security Audits'
      ]
    },
    {
      phase: 'Phase 2',
      period: 'Q2 2025',
      title: 'Partnership Integration',
      status: 'in-progress',
      items: [
        'Advanced Team Building Features',
        'Credit System For Prada365.com',
        'Universal Management',
        'Mobile App Development',
        'Partnership Integrations'
      ]
    },
    {
      phase: 'Phase 3',
      period: 'Q3 2025',
      title: 'Global Expansion',
      status: 'upcoming',
      items: [
        'Multi-language Support',
        'Global Marketing Campaign',
        'Exchange Listings',
        'DeFi Protocol Integration',
        'NFT Marketplace'
      ]
    },
    {
      phase: 'Phase 4',
      period: 'Q4 2025',
      title: 'DAO Governance',
      status: 'upcoming',
      items: [
        'DAO Implementation',
        'Community Governance',
        'Advanced Staking Features',
        'Cross-chain Integration',
        'Ecosystem Expansion'
      ]
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-6 h-6 text-gold" />;
      default:
        return <Circle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-500/10';
      case 'in-progress':
        return 'border-gold bg-gold/10 glow-gold';
      default:
        return 'border-gray-600 bg-gray-600/10';
    }
  };

  return (
    <section id="roadmap" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Roadmap</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Our strategic development plan to build the future of decentralized finance and MLM
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold via-purple to-gold"></div>

            {phases.map((phase, index) => (
              <motion.div
                key={phase.phase}
                className="relative flex items-start mb-12 last:mb-0"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                {/* Timeline Node */}
                <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 ${getStatusColor(phase.status)}`}>
                  {getStatusIcon(phase.status)}
                </div>

                {/* Content */}
                <div className="ml-8 flex-1">
                  <div className={`glass-effect p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                    phase.status === 'completed' 
                      ? 'border-green-500/50' 
                      : phase.status === 'in-progress'
                        ? 'border-gold glow-gold'
                        : 'border-purple/50'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white">{phase.title}</h3>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-sm font-semibold text-gold">{phase.phase}</span>
                          <span className="text-sm text-gray-400">{phase.period}</span>
                        </div>
                      </div>
                      
                      {phase.status === 'in-progress' && (
                        <div className="flex items-center space-x-2 bg-gold/20 px-3 py-1 rounded-full">
                          <Rocket className="w-4 h-4 text-gold" />
                          <span className="text-sm font-semibold text-gold">In Progress</span>
                        </div>
                      )}
                    </div>

                    <ul className="space-y-2">
                      {phase.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            phase.status === 'completed' 
                              ? 'bg-green-500' 
                              : phase.status === 'in-progress'
                                ? 'bg-gold'
                                : 'bg-gray-400'
                          }`}></div>
                          <span className="text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Progress Stats */}
        <motion.div
          className="mt-16 glass-effect p-8 rounded-2xl border border-gold/30 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-center mb-8 gradient-text">Development Progress</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">100%</div>
              <div className="text-sm text-gray-400">Phase 1 Complete</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gold mb-2">90%</div>
              <div className="text-sm text-gray-400">Phase 2 Progress</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple mb-2">45%</div>
              <div className="text-sm text-gray-400">Overall Complete</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Roadmap;
