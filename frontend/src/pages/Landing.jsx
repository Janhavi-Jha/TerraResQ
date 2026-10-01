import React from 'react';
import Hero from '../components/landing/Hero';
import EarthVisualization from '../components/landing/EarthVisualization';
import Features from '../components/landing/Features';

const Landing = () => {
  return (
    <div className="space-y-16 sm:space-y-24 lg:space-y-28 pb-16">
      <Hero />
      <EarthVisualization />
      <Features />
    </div>
  );
};

export default Landing;