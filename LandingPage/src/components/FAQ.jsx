
import React from 'react';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ = () => {
  const faqs = [
    {
      question: 'How do I participate in the token sale?',
      answer: 'To participate in the token sale, you need to connect your wallet (MetaMask recommended), select your payment token (USDT or USDC), enter the amount you want to invest, and click "Buy Tokens". The minimum investment is $100 USD and maximum is $50,000 USD.'
    },
    {
      question: 'What is the minimum investment amount?',
      answer: 'The minimum investment amount is $100 USD across all our ROI plans. This applies to both the Bronze tier and direct token purchases. There are no hidden fees or additional charges.'
    },
    {
      question: 'How are ROI earnings distributed?',
      answer: 'ROI earnings are calculated and distributed monthly based on your investment tier. Returns range from 3.5% to 8.5% monthly depending on your plan. All earnings are automatically credited to your account and can be withdrawn after the lock period expires.'
    },
    {
      question: 'What is the MLM commission structure?',
      answer: 'Our MLM system offers 7.5% direct referral commission, booster programs with up to 100% bonus, and a 12-tier rank system with matching bonuses from 5% to 16%. Commissions are credited to your locked balance and unlock after 12 hours.'
    },
    {
      question: 'How does the rank system work?',
      answer: 'The rank system has 12 levels from Explorer to Supreme Leader, based on team volume requirements. Higher ranks unlock better matching percentages, more levels of income, and higher earning caps. Ranks are updated automatically based on your team performance.'
    },
    {
      question: 'Is PradaFund audited and secure?',
      answer: 'Yes, PradaFund has undergone comprehensive security audits by leading blockchain security firms. Our smart contracts are verified and published on the blockchain for full transparency. We follow industry best practices for security and fund protection.'
    },
    {
      question: 'What blockchain networks are supported?',
      answer: 'Currently, PradaFund operates on the Binance Smart Chain (BEP-20). We are planning to expand to other networks including Ethereum, Polygon, and Avalanche in future phases of our roadmap.'
    },
    {
      question: 'How can I track my earnings and referrals?',
      answer: 'Once you create an account and connect your wallet, you will have access to a comprehensive dashboard showing your investment details, ROI earnings, referral commissions, team structure, and rank progress in real-time.'
    }
  ];

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
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Find answers to common questions about PradaFund, our token sale, and MLM system
          </p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="glass-effect rounded-2xl border border-gold/30 overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border-b border-gray-700 last:border-b-0"
                >
                  <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-white/5 transition-colors">
                    <span className="text-lg font-semibold text-gold pr-4">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <p className="text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="glass-effect p-6 rounded-2xl border border-purple/30 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-3 gradient-text-purple">Still have questions?</h3>
            <p className="text-gray-300 mb-4">
              Our support team is available 24/7 to help you with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@pradafund.com"
                className="text-gold hover:text-gold/80 transition-colors"
              >
                support@pradafund.com
              </a>
              <a 
                href="#"
                className="text-purple hover:text-purple/80 transition-colors"
              >
                Telegram @pradafundofficial
              </a>
              <a 
                href="#"
                className="text-gold hover:text-gold/80 transition-colors"
              >
                Twitter @pradafund
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
