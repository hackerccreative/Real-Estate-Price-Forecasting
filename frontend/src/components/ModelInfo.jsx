import React from 'react';
import { Database, GitBranch, History } from 'lucide-react';

const ModelInfo = () => {
  const infoItems = [
    {
      icon: <GitBranch className="w-5 h-5 text-indigo-500" />,
      title: "Regression Models",
      desc: "Uses both Linear (conservative) and Polynomial (complex) regression to map price curves."
    },
    {
      icon: <History className="w-5 h-5 text-blue-500" />,
      title: "Historical Data",
      desc: "Trained on verified past transaction data specific to each locality in Lucknow."
    },
    {
      icon: <Database className="w-5 h-5 text-emerald-500" />,
      title: "5-Year Horizon",
      desc: "Generates forward-looking price estimates for the next 5 years based on selected base year."
    }
  ];

  return (
    <div className="mt-12 border-t border-slate-200 pt-8">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Model Intelligence</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {infoItems.map((item, idx) => (
            <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white/50 border border-white/60 shadow-sm">
            <div className="flex-shrink-0 mt-1">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                    {item.icon}
                </div>
            </div>
            <div>
                <h5 className="font-semibold text-slate-800 mb-1">{item.title}</h5>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
            </div>
        ))}
        </div>
    </div>
  );
};

export default ModelInfo;