import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Building2 } from 'lucide-react';

const Hero = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-6 shadow-sm"
      >
        <TrendingUp className="w-8 h-8 text-blue-600" />
      </motion.div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
        5-Year Real Estate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Price Forecasting</span>
      </h1>
      
      <p className="text-lg text-slate-600 max-w-2xl mx-auto">
        Advanced Machine Learning algorithms to predict future property value trends based on historical data.
      </p>
    </motion.div>
  );
};

export default Hero;