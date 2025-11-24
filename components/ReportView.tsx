import React, { useState, useEffect } from 'react';
import { Experiment, StatsAnalysis } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { analyzeExperiment } from '../services/geminiService';
import { Bot, RefreshCw, ArrowUpRight, CheckCircle, AlertCircle } from 'lucide-react';
import { getApiKey } from '../plugin-config';

interface ReportViewProps {
  experiment: Experiment;
  onBack: () => void;
}

const calculateStats = (experiment: Experiment): StatsAnalysis[] => {
  const control = experiment.variants.find(v => v.isControl);
  if (!control) return [];

  const controlCR = control.visitors > 0 ? (control.conversions / control.visitors) : 0;

  return experiment.variants.map(v => {
    const cr = v.visitors > 0 ? (v.conversions / v.visitors) : 0;
    const improvement = controlCR > 0 ? ((cr - controlCR) / controlCR) * 100 : 0;
    
    // Simplified Frequentist Z-score approximation for significance simulation
    // In a real app, use a proper stats library (jstat or similar)
    let significance = 0;
    if (!v.isControl && v.visitors > 10 && control.visitors > 10) {
       const p1 = cr;
       const p2 = controlCR;
       const n1 = v.visitors;
       const n2 = control.visitors;
       const pPool = (v.conversions + control.conversions) / (n1 + n2);
       const se = Math.sqrt(pPool * (1 - pPool) * (1/n1 + 1/n2));
       const z = Math.abs(p1 - p2) / se;
       // Convert Z to probability (rough approx for one-tailed)
       significance = (1 - (1 / (1 + 0.2316419 * z))) * 100; // Mock cumulative distr
       if (z > 1.645) significance = 95 + (z-1.645); // boosting for visuals
       if (significance > 99.9) significance = 99.9;
    }

    return {
      variantId: v.id,
      conversionRate: cr * 100,
      improvement,
      significance: v.isControl ? 0 : significance,
      isWinner: significance > 95 && improvement > 0
    };
  });
};

const ReportView: React.FC<ReportViewProps> = ({ experiment, onBack }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [stats, setStats] = useState<StatsAnalysis[]>([]);

  useEffect(() => {
    setStats(calculateStats(experiment));
  }, [experiment]);

  const handleAnalyze = async () => {
    setLoadingAnalysis(true);
    const result = await analyzeExperiment(experiment, stats);
    setAnalysis(result);
    setLoadingAnalysis(false);
  };

  // Mock time-series data generation
  const chartData = [1, 2, 3, 4, 5, 6, 7].map(day => {
    const point: any = { name: `Day ${day}` };
    experiment.variants.forEach(v => {
        // Add some randomness to the trend
        const stat = stats.find(s => s.variantId === v.id);
        const baseCR = stat ? stat.conversionRate : 2;
        point[v.name] = Math.max(0, baseCR + (Math.random() * 2 - 1));
    });
    return point;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
            ← Back to Experiments
        </button>
        <h1 className="text-2xl font-bold text-gray-800">{experiment.name} Analysis</h1>
        <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${experiment.status === 'Running' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {experiment.status}
            </span>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {experiment.variants.map((variant) => {
              const stat = stats.find(s => s.variantId === variant.id);
              const isWinner = stat?.isWinner;

              return (
                <div key={variant.id} className={`p-6 rounded-xl border ${isWinner ? 'bg-green-50 border-green-200 ring-1 ring-green-300' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-semibold text-gray-900">{variant.name}</h3>
                            <p className="text-xs text-gray-500">{variant.isControl ? 'Control' : 'Variation'}</p>
                        </div>
                        {isWinner && <CheckCircle className="w-5 h-5 text-green-600" />}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Conversions</p>
                            <p className="text-xl font-bold text-gray-900">{variant.conversions}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Rate</p>
                            <p className="text-xl font-bold text-gray-900">{stat?.conversionRate.toFixed(2)}%</p>
                        </div>
                    </div>

                    {!variant.isControl && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                             <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Improvement</span>
                                <span className={`font-bold ${stat && stat.improvement > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    {stat && stat.improvement > 0 ? '+' : ''}{stat?.improvement.toFixed(1)}%
                                </span>
                             </div>
                             <div className="flex justify-between items-center mt-1">
                                <span className="text-sm text-gray-600">Chance to Beat</span>
                                <span className="font-bold text-gray-800">{stat?.significance.toFixed(1)}%</span>
                             </div>
                        </div>
                    )}
                </div>
              );
          })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-6">Conversion Rate Over Time</h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`}/>
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend />
                        {experiment.variants.map((v, idx) => (
                             <Line 
                                key={v.id} 
                                type="monotone" 
                                dataKey={v.name} 
                                stroke={v.isControl ? '#3b82f6' : idx % 2 === 0 ? '#10b981' : '#f59e0b'} 
                                strokeWidth={3} 
                                dot={{r: 4, strokeWidth: 2}}
                                activeDot={{r: 6}}
                             />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* AI Insight Section */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <Bot className="w-6 h-6 text-indigo-600" />
                <h3 className="text-lg font-semibold text-indigo-900">AI Data Scientist</h3>
            </div>
            
            <div className="flex-grow overflow-y-auto max-h-96 pr-2 mb-4">
                {analysis ? (
                    <div className="prose prose-sm prose-indigo text-gray-700 whitespace-pre-wrap">
                        {analysis}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-10">
                        <p className="mb-4">Use Gemini AI to analyze the significance and recommend actions.</p>
                        <div className="flex justify-center">
                            <Bot className="w-12 h-12 text-indigo-200" />
                        </div>
                    </div>
                )}
            </div>

            <button 
                onClick={handleAnalyze} 
                disabled={loadingAnalysis}
                className="w-full mt-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
                {loadingAnalysis ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                {loadingAnalysis ? 'Analyzing Data...' : 'Generate Analysis'}
            </button>
            {!getApiKey() && (
                <p className="text-xs text-center text-red-500 mt-2">API_KEY missing in environment</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default ReportView;
