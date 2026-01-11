import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';

const ResultSection = ({ results }) => {
  if (!results) return null;

  // Use Polynomial results as the main "Forecast" for the graph as it usually captures trends better
  // But we can show both if available. 
  // Let's assume we want to show the Polynomial trend as the primary forecast.
  const predictedData = results.polynomial.predicted_data;
  
  // Combine historical data (last few years) with predicted data for a continuous line?
  // Or just show predicted as requested "5-Year Real Estate Price Forecasting".
  // The user asked for "Line graph rendered directly from backend data... X-axis: Year... Y-axis: Predicted Price"
  
  const chartData = predictedData.map(item => ({
    year: item.year,
    price: Math.round(item.price),
    linearPrice: Math.round(results.linear.predicted_data.find(d => d.year === item.year)?.price || 0)
  }));

  const prices = chartData.map(d => d.price);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const growth = ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6 h-full flex flex-col"
    >
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 bg-white rounded-xl shadow-sm border border-slate-100"
            >
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Highest Prediction</span>
                </div>
                <div className="text-2xl font-bold text-slate-800">{formatPrice(maxPrice)}</div>
            </motion.div>

            <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="p-4 bg-white rounded-xl shadow-sm border border-slate-100"
            >
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium">Lowest Prediction</span>
                </div>
                <div className="text-2xl font-bold text-slate-800">{formatPrice(minPrice)}</div>
            </motion.div>

            <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3 }}
                 className="p-4 bg-white rounded-xl shadow-sm border border-slate-100"
            >
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">5-Year Growth</span>
                </div>
                <div className={`text-2xl font-bold ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {growth > 0 ? '+' : ''}{growth.toFixed(2)}%
                </div>
            </motion.div>
        </div>

      {/* Main Chart Card */}
      <div className="glass-card p-6 flex flex-col">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Price Forecast Trend</h3>
        
        <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} padding={{ left: 20, right: 20 }} />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b' }} 
                    tickFormatter={(value) => `₹${(value/100000).toFixed(1)}L`} 
                    domain={['auto', 'auto']}
                />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => formatPrice(value)}
                />
                <Legend />
                <Line 
                    type="monotone" 
                    dataKey="price" 
                    name="Polynomial Forecast (Degree 3)"
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6 }}
                />
                <Line 
                    type="monotone" 
                    dataKey="linearPrice" 
                    name="Linear Trend"
                    stroke="#94a3b8" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                />
            </LineChart>
            </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultSection;