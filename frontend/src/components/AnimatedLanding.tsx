'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import CreateEvent from './CreateEvent';
import EventList from './EventList';

export default function AnimatedLanding() {
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();
  
  // Transform values for animations
  const logoOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const logoScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
  const contentOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.2, 0.5], [100, 0]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section with Logo */}
      <motion.div 
        className="fixed inset-0 flex items-center justify-center z-10"
        style={{ opacity: logoOpacity, scale: logoScale }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center"
        >
          <motion.h1 
            className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            DEXTIK
          </motion.h1>
          <motion.p 
            className="text-2xl md:text-3xl text-white/80 font-light tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Decentralized Event Ticketing
          </motion.p>
          <motion.div 
            className="mt-8 text-white/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <p className="text-lg">Scroll to explore</p>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-4"
            >
              ↓
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Spacer for scroll */}
      <div className="h-screen"></div>

      {/* Create Event Section */}
      <motion.div 
        className="relative z-20 bg-gray-900/90 backdrop-blur-md"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-white mb-6">
              Create Your Event
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Launch your decentralized event with NFT tickets, anti-scalping protection, 
              and secondary market royalties.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <CreateEvent />
          </motion.div>
        </div>
      </motion.div>

      {/* Event List Section */}
      <motion.div 
        className="relative z-20 bg-gray-800/90 backdrop-blur-md"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-white mb-6">
              Live Events
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Discover and purchase tickets for upcoming events on the blockchain.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <EventList />
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer 
        className="relative z-20 bg-gray-900 text-white py-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-4">DEXTIK</h3>
            <p className="text-white/60 mb-6">
              Revolutionizing event ticketing with blockchain technology
            </p>
            <div className="flex justify-center space-x-6 text-white/40">
              <span>Powered by Solana</span>
              <span>•</span>
              <span>Built with Anchor</span>
              <span>•</span>
              <span>Secured by Blockchain</span>
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}
