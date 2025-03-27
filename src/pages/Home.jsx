import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Benefits from '../components/Benefits';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';

function Home() {
  const { user } = useUser();

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="dark:text-gray-100">
        <Hero />
        <Benefits />
        <HowItWorks />
        <Testimonials />
        <Contact />
      </main>
    </div>
  );
}

export default Home;
