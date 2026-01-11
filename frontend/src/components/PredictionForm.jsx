import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Loader2 } from 'lucide-react';

const PredictionForm = ({ localities, onPredict, isLoading }) => {
  const [locality, setLocality] = useState('');
  const [baseYear, setBaseYear] = useState(new Date().getFullYear());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (locality && baseYear) {
      onPredict({ locality, base_year: parseInt(baseYear) });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-8 h-full"
    >
      <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
        <Search className="w-5 h-5 text-blue-500" />
        Forecast Parameters
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Target Locality
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className="input-field pl-10 appearance-none"
              required
            >
              <option value="">Select Location</option>
              {localities.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Base Year (Start of Forecast)
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="number"
              value={baseYear}
              onChange={(e) => setBaseYear(e.target.value)}
              placeholder="e.g. 2024"
              className="input-field pl-10"
              required
              min="2000"
              max="2100"
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">Prediction will cover 5 years starting from this year.</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Forecast...
            </>
          ) : (
            'Generate 5-Year Forecast'
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default PredictionForm;