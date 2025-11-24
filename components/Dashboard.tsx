import React, { useState } from 'react';
import { MOCK_EXPERIMENTS } from '../constants';
import { Experiment, ExperimentStatus } from '../types';
import ReportView from './ReportView';
import ExperimentBuilder from './ExperimentBuilder';
import { Plus, Search, MoreHorizontal, TrendingUp, Users, Activity, ExternalLink } from 'lucide-react';

const Dashboard: React.FC = () => {
    const [view, setView] = useState<'list' | 'report'>('list');
    const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [experiments, setExperiments] = useState<Experiment[]>(MOCK_EXPERIMENTS);

    const handleCreateExperiment = (newExpData: any) => {
        const newExp: Experiment = {
            id: `new_${Date.now()}`,
            status: ExperimentStatus.DRAFT,
            ...newExpData
        };
        setExperiments([newExp, ...experiments]);
        setIsCreating(false);
    };

    if (view === 'report' && selectedExperiment) {
        return <ReportView experiment={selectedExperiment} onBack={() => setView('list')} />;
    }

    const totalVisitors = experiments.reduce((acc, curr) => acc + curr.variants.reduce((vAcc, v) => vAcc + v.visitors, 0), 0);
    const avgConversion = experiments.reduce((acc, curr) => {
         const totalConv = curr.variants.reduce((cAcc, v) => cAcc + v.conversions, 0);
         const totalVis = curr.variants.reduce((vAcc, v) => vAcc + v.visitors, 0);
         return acc + (totalVis > 0 ? (totalConv/totalVis) : 0);
    }, 0) / experiments.length * 100;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg shadow-blue-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-blue-100 font-medium mb-1">Total Visitors Tracked</p>
                            <h3 className="text-3xl font-bold">{totalVisitors.toLocaleString()}</h3>
                        </div>
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-sm text-blue-100">
                        <TrendingUp className="w-4 h-4" />
                        <span>+12% vs last month</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 font-medium mb-1">Active Experiments</p>
                            <h3 className="text-3xl font-bold text-gray-800">{experiments.filter(e => e.status === 'Running').length}</h3>
                        </div>
                        <div className="bg-purple-100 p-2 rounded-lg">
                            <Activity className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-sm text-gray-500">
                        <span>Across 3 different funnels</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 font-medium mb-1">Avg. Conversion Rate</p>
                            <h3 className="text-3xl font-bold text-gray-800">{avgConversion.toFixed(2)}%</h3>
                        </div>
                        <div className="bg-green-100 p-2 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-sm text-green-600 font-medium">
                        <span>+2.4% lift overall</span>
                    </div>
                </div>
            </div>

            {/* Actions & Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search experiments..." 
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                </div>
                <button 
                    onClick={() => setIsCreating(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-md transition-colors"
                >
                    <Plus className="w-4 h-4" /> New Experiment
                </button>
            </div>

            {/* Experiments Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Experiment</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Visitors</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Variants</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {experiments.map((exp) => (
                                <tr key={exp.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span 
                                                className="font-semibold text-gray-900 cursor-pointer hover:text-indigo-600"
                                                onClick={() => { setSelectedExperiment(exp); setView('report'); }}
                                            >
                                                {exp.name}
                                            </span>
                                            <a href={exp.url} target="_blank" rel="noreferrer" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 mt-1">
                                                {exp.url} <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            ${exp.status === 'Running' ? 'bg-green-100 text-green-800' : 
                                              exp.status === 'Draft' ? 'bg-gray-100 text-gray-800' : 
                                              exp.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                                exp.status === 'Running' ? 'bg-green-500' : 
                                                exp.status === 'Draft' ? 'bg-gray-500' : 
                                                exp.status === 'Completed' ? 'bg-blue-500' : 'bg-yellow-500'
                                            }`}></span>
                                            {exp.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">{exp.type}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-gray-900">
                                            {exp.variants.reduce((a, b) => a + b.visitors, 0).toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex -space-x-2">
                                            {exp.variants.slice(0, 3).map((v, i) => (
                                                <div key={v.id} className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] text-indigo-700 font-bold" title={v.name}>
                                                    {String.fromCharCode(65 + i)}
                                                </div>
                                            ))}
                                            {exp.variants.length > 3 && (
                                                <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] text-gray-600 font-bold">
                                                    +{exp.variants.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => { setSelectedExperiment(exp); setView('report'); }}
                                            className="text-gray-400 hover:text-indigo-600 p-1 rounded-full hover:bg-indigo-50 transition-all"
                                        >
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isCreating && <ExperimentBuilder onClose={() => setIsCreating(false)} onSave={handleCreateExperiment} />}
        </div>
    );
};

export default Dashboard;