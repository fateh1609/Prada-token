
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Crown, Star, Diamond, Award, Trophy, Target } from 'lucide-react';

const ROIPlans = () => {
  const { toast } = useToast();

  const plans = [
    {
      tier: 'Bronze',
      minMax: '$100 – $499',
      monthlyROI: '3.5%',
      lockDays: 60,
      cap: '4×',
      icon: Award,
      color: 'bg-amber-600',
      popular: false
    },
    {
      tier: 'Silver',
      minMax: '$500 – $999',
      monthlyROI: '4.5%',
      lockDays: 55,
      cap: '4×',
      icon: Star,
      color: 'bg-gray-400',
      popular: false
    },
    {
      tier: 'Gold',
      minMax: '$1000 – $2499',
      monthlyROI: '5.5%',
      lockDays: 50,
      cap: '4×',
      icon: Crown,
      color: 'bg-gold',
      popular: true
    },
    {
      tier: 'Platinum',
      minMax: '$2.5K – $4999',
      monthlyROI: '6.5%',
      lockDays: 45,
      cap: '4×',
      icon: Diamond,
      color: 'bg-purple',
      popular: false
    },
    {
      tier: 'Diamond',
      minMax: '$5000 – $9999',
      monthlyROI: '7.5%',
      lockDays: 45,
      cap: '4×',
      icon: Diamond,
      color: 'bg-blue-500',
      popular: false
    },
    {
      tier: 'Investor',
      minMax: '$10000',
      monthlyROI: '8.5%',
      lockDays: 35,
      cap: '4×',
      icon: Trophy,
      color: 'bg-gradient-to-r from-gold to-purple',
      popular: false
    }
  ];

  const handleSelectPlan = (tier) => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
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
            <span className="gradient-text">Staking Returns</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Choose your investment tier and start earning monthly returns with our structured ROI plans
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.tier}
              className={`relative glass-effect p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? 'border-gold glow-gold' 
                  : index % 2 === 0 
                    ? 'border-gold hover:glow-gold' 
                    : 'border-purple hover:glow-purple'
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gold text-black px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <div className={`inline-flex p-4 rounded-full mb-4 ${plan.color}`}>
                  <plan.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{plan.tier}</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <span className="text-gray-400 text-sm">Investment Range</span>
                    <div className="text-lg font-semibold text-white">{plan.minMax}</div>
                  </div>
                  
                  <div>
                    <span className="text-gray-400 text-sm">Monthly ROI</span>
                    <div className="text-2xl font-bold text-gold">{plan.monthlyROI}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-400 text-sm">Lock Period</span>
                      <div className="text-lg font-semibold text-white">{plan.lockDays} days</div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Max Return</span>
                      <div className="text-lg font-semibold text-purple">{plan.cap}</div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleSelectPlan(plan.tier)}
                  className={`w-full font-semibold py-3 rounded-full transition-all ${
                    plan.popular
                      ? 'bg-gold hover:bg-gold/90 text-black glow-gold'
                      : 'bg-purple hover:bg-purple/90 text-white'
                  }`}
                >
                  Select {plan.tier}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="glass-effect p-6 rounded-2xl border border-gold/30 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold mb-4 gradient-text">Important Information</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-300">
              <div>
                <strong className="text-white">Lock Period:</strong> Your investment is locked for the specified duration
              </div>
              <div>
                <strong className="text-white">Monthly ROI:</strong> Returns are calculated and distributed monthly
              </div>
              <div>
                <strong className="text-white">Max Return:</strong> Total returns are capped at the specified multiplier
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ROIPlans;
