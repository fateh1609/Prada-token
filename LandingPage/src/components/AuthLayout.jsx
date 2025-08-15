
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout = ({ children, title, description, headerLink, headerLinkText }) => {
  return (
    <div className="min-h-screen bg-black text-white hero-pattern flex flex-col">
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold gradient-text">
            PRADA Fund
          </Link>
          <Link to={headerLink}>
            <span className="font-semibold text-gold hover:text-white transition-colors">
              {headerLinkText}
            </span>
          </Link>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="glass-effect p-8 rounded-2xl border-2 border-gold glow-gold">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
              <p className="text-gray-400">{description}</p>
            </div>
            {children}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AuthLayout;
