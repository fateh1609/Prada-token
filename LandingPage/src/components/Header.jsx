
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, Wallet, Zap, BarChart2, Layers, GitMerge } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { walletAddress, isConnected, connectWallet, truncateAddress } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMobileMenuOpen(false);
      }
    }, 100);
  };

  const navLinks = [
    { id: 'token-sale-section', label: 'Token Sale', icon: <Zap className="w-4 h-4 mr-2" /> },
    { id: 'tokenomics', label: 'Tokenomics', icon: <BarChart2 className="w-4 h-4 mr-2" /> },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-effect glow-gold' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-4">
            <span className="text-3xl font-bold gradient-text">$PRADA TOKEN</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-gray-300 hover:text-gold transition-colors font-medium flex items-center group"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-2 group-hover:translate-x-0">{link.icon}</span>
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
             <Button
                onClick={connectWallet}
                variant="outline"
                className="border-purple text-purple hover:bg-purple hover:text-white px-6 py-2 rounded-full"
              >
                <Wallet className="w-4 h-4 mr-2" />
                {isConnected ? truncateAddress(walletAddress) : 'Connect Wallet'}
              </Button>
            <Link to="https://stake.pradatoken.fun/">
              <Button
                className="bg-gold hover:bg-gold/90 text-black font-semibold px-6 py-2 rounded-full"
              >
                Get Started
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden mt-4 p-4 glass-effect rounded-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col space-y-4">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-white hover:text-gold transition-colors text-left flex items-center"
                >
                  {link.icon} {link.label}
                </button>
              ))}
              <div className="flex flex-col space-y-2 pt-4">
                <Button
                  onClick={connectWallet}
                  variant="outline"
                  className="border-purple text-purple hover:bg-purple hover:text-white"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  {isConnected ? truncateAddress(walletAddress) : 'Connect Wallet'}
                </Button>
                <Link to="/signup">
                  <Button
                    className="bg-gold hover:bg-gold/90 text-black font-semibold w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
