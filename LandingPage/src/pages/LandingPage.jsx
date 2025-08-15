// src/pages/LandingPage.jsx
import React from 'react';
import { Helmet } from 'react-helmet';

import Header                    from '../components/Header';
import Hero                      from '../components/Hero';
import LiveStats                 from '../components/LiveStats';
import AddToWallet               from '../components/AddToWallet';
import Tokenomics                from '../components/Tokenomics';
import ROIPlans                  from '../components/ROIPlans';
import StakingAndCommunityPlan   from '../components/StakingAndCommunityPlan';
import Roadmap                   from '../components/Roadmap';
import FAQ                       from '../components/FAQ';
import ClaimInfo                 from '../components/ClaimInfo';
import Footer                    from '../components/Footer';


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>PradaFund - The Future of DeFi and Staking</title>
        <meta
          name="description"
          content="Join PradaFund's revolutionary ecosystem..."
        />
      </Helmet>

      <Header />

      <main>
        <Hero />
        <LiveStats />
        <AddToWallet />
        <Tokenomics />
      </main>

      <Footer />

    </div>
  );
}
