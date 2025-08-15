import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Users, Zap, TrendingUp, Crown, Star, Award } from 'lucide-react';

const StakingPlan = () => {
  const [activeTab, setActiveTab] = useState('referral');
  const { toast } = useToast();

  const boosterPrograms = [
    {
      boost: '+25%',
      duration: '7 days',
      requirements: '3 Directs + $2,500 Total Volume',
      color: 'gold'
    },
    {
      boost: '+50%',
      duration: '15 days',
      requirements: '5 Directs + $10,000 Total Volume',
      color: 'purple'
    },
    {
      boost: '+100%',
      duration: '30 days',
      requirements: '10 Directs + $25,000 Total Volume',
      color: 'gold'
    }
  ];

  const ranks = [
    { rank: 'Explorer', volume: '$0', match: '5%', levels: 3, cap: '2.5×', icon: Star },
    { rank: 'Pathfinder', volume: '$10K', match: '6%', levels: 5, cap: '4×', icon: Users },
    { rank: 'Strategist', volume: '$50K', match: '7%', levels: 8, cap: '4×', icon: TrendingUp },
    { rank: 'Architect', volume: '$100K', match: '8%', levels: 12, cap: '4×', icon: Award },
    { rank: 'Visionary', volume: '$250K', match: '9%', levels: 18, cap: '4×', icon: Crown },
    { rank: 'Commander', volume: '$1M', match: '10%', levels: 24, cap: '4×', icon: Crown },
    { rank: 'Chancellor', volume: '$10M', match: '11%', levels: 30, cap: '4×', icon: Crown },
    { rank: 'Dominion Partner', volume: '$50M', match: '12%', levels: 36, cap: '4×', icon: Crown },
    { rank: 'Global Guardian', volume: '$100M', match: '13%', levels: '∞', cap: '4×', icon: Crown },
    { rank: 'Empire Founder', volume: '$250M', match: '14%', levels: '∞', cap: '4×', icon: Crown },
    { rank: 'World Sovereign', volume: '$500M', match: '15%', levels: '∞', cap: '4×', icon: Crown },
    { rank: 'Supreme Leader', volume: '$1B', match: '16%', levels: '∞', cap: '4×', icon: Crown }
  ];

  const handleJoinStaking = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  return (
    <section id="staking-plan" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Staking Plan</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Maximize your earnings through our comprehensive staking and community building system with multiple income streams.
          </p>
        </motion.div>

        <div className="flex justify-center mb-8">
          <div className="glass-effect p-2 rounded-full border border-gold/30">
            <div className="flex space-x-2">
              {[
                { id: 'referral', label: 'Direct Referral', icon: Users },
                { id: 'booster', label: 'Booster Program', icon: Zap },
                { id: 'ranks', label: 'Rank System', icon: Crown }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all ${
                    activeTab === tab.id
                      ? 'bg-gold text-black font-semibold'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {activeTab === 'referral' && (
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-effect p-8 rounded-2xl border-2 border-gold glow-gold">
              <div className="text-center mb-8">
                <div className="inline-flex p-4 rounded-full bg-gold/20 mb-4">
                  <Users className="w-8 h-8 text-gold" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Direct Referral Commission</h3>
                <div className="text-5xl font-bold text-gold mb-4">7.5%</div>
                <p className="text-gray-300 text-lg">
                  Earn 7.5% commission on each direct downline investment
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-black/50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3 text-gold">How it Works</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Refer new users to PradaFund</li>
                    <li>• Earn 7.5% of their investment amount</li>
                    <li>• Commission credited to locked balance</li>
                    <li>• Unlocks after 12 hours</li>
                  </ul>
                </div>
                <div className="bg-black/50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3 text-purple">Example</h4>
                  <div className="space-y-2 text-gray-300">
                    <div>Referral invests: <span className="text-white font-semibold">$1,000</span></div>
                    <div>Your commission: <span className="text-gold font-semibold">$75</span></div>
                    <div>Lock period: <span className="text-purple font-semibold">12 hours</span></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'booster' && (
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid md:grid-cols-3 gap-6">
              {boosterPrograms.map((program, index) => (
                <div
                  key={index}
                  className={`glass-effect p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                    program.color === 'gold' ? 'border-gold hover:glow-gold' : 'border-purple hover:glow-purple'
                  }`}
                >
                  <div className="text-center">
                    <div className={`inline-flex p-4 rounded-full mb-4 ${
                      program.color === 'gold' ? 'bg-gold/20' : 'bg-purple/20'
                    }`}>
                      <Zap className={`w-8 h-8 ${
                        program.color === 'gold' ? 'text-gold' : 'text-purple'
                      }`} />
                    </div>
                    
                    <div className={`text-3xl font-bold mb-2 ${
                      program.color === 'gold' ? 'text-gold' : 'text-purple'
                    }`}>
                      {program.boost}
                    </div>
                    
                    <div className="text-lg font-semibold text-white mb-4">
                      {program.duration}
                    </div>
                    
                    <p className="text-gray-300 text-sm">
                      {program.requirements}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'ranks' && (
          <motion.div
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full glass-effect rounded-2xl border border-gold/30">
                <thead>
                  <tr className="bg-gold/20 border-b border-gold/30">
                    <th className="p-4 text-left font-semibold text-gold">Rank</th>
                    <th className="p-4 text-left font-semibold text-gold">Team Volume</th>
                    <th className="p-4 text-left font-semibold text-gold">Match %</th>
                    <th className="p-4 text-left font-semibold text-gold">Levels Paid</th>
                    <th className="p-4 text-left font-semibold text-gold">Cap</th>
                  </tr>
                </thead>
                <tbody>
                  {ranks.map((rank, index) => (
                    <tr
                      key={rank.rank}
                      className={`border-b border-gray-700 hover:bg-white/5 transition-colors ${
                        index % 2 === 0 ? 'bg-black/20' : 'bg-gold/5'
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <rank.icon className="w-5 h-5 text-purple" />
                          <span className="font-semibold text-white">{rank.rank}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{rank.volume}</td>
                      <td className="p-4 text-purple font-semibold">{rank.match}</td>
                      <td className="p-4 text-gray-300">{rank.levels}</td>
                      <td className="p-4 text-gold font-semibold">{rank.cap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Button
            onClick={handleJoinStaking}
            className="bg-gold hover:bg-gold/90 text-black font-semibold px-8 py-4 text-lg rounded-full glow-gold"
          >
            Join Staking Program
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default StakingPlan;