import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import PredictionForm from './components/PredictionForm';
import ResultSection from './components/ResultSection';
import ModelInfo from './components/ModelInfo';
import { api } from './services/api';
import { AlertCircle, LineChart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [localities, setLocalities] = useState([]);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocalities = async () => {
      try {
        const data = await api.getLocalities();
        setLocalities(data);
      } catch (err) {
        console.error("Failed to load localities", err);
        setError("Could not connect to the forecasting engine. Please ensure backend is running.");
      }
    };
    fetchLocalities();
  }, []);

  const handlePredict = async (formData) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    
    try {
      // The API returns { linear: {...}, polynomial: {...} }
      // We pass this entire object to ResultSection which handles the visualization
      const predictionResults = await api.predict(formData);
      setResults(predictionResults);
    } catch (err) {
      setError("Forecasting failed. Please verify the input parameters and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-7xl mx-auto">
        <Hero />

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 shadow-sm"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input */}
          <div className="lg:col-span-4 w-full">
            <PredictionForm 
              localities={localities} 
              onPredict={handlePredict} 
              isLoading={isLoading} 
            />
          </div>

          {/* Right Column: Visualization */}
          <div className="lg:col-span-8 w-full">
            <AnimatePresence mode="wait">
              {results ? (
                <ResultSection key="results" results={results} />
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[500px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-white/30 backdrop-blur-sm"
                >
                  <div className="p-6 rounded-full bg-slate-50 mb-4 shadow-inner">
                    <LineChart className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-500 mb-1">No Forecast Generated</h3>
                  <p className="text-sm">Select a locality and base year to visualize future trends.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <ModelInfo />
      </div>
    </div>
  );
}

export default App;
