import React, { useState } from 'react';
import { ExperimentType, TargetingRule } from '../types';
import { TARGETING_CATEGORIES, OPERATORS } from '../constants';
import { Layout, Smartphone, Globe, ShoppingCart, Plus, Trash2, Code, Eye } from 'lucide-react';

interface ExperimentBuilderProps {
    onClose: () => void;
    onSave: (data: any) => void;
}

const ExperimentBuilder: React.FC<ExperimentBuilderProps> = ({ onClose, onSave }) => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [type, setType] = useState<ExperimentType>(ExperimentType.AB);
    const [url, setUrl] = useState('https://');
    const [variants, setVariants] = useState([{ name: 'Control', isControl: true, weight: 50 }, { name: 'Variant B', isControl: false, weight: 50 }]);
    const [targeting, setTargeting] = useState<TargetingRule[]>([]);

    const addTargetingRule = () => {
        setTargeting([...targeting, { id: Math.random().toString(), category: 'Device', attribute: '', operator: 'equals', value: '' }]);
    };

    const updateRule = (index: number, field: string, value: string) => {
        const newRules = [...targeting];
        (newRules[index] as any)[field] = value;
        setTargeting(newRules);
    };

    const removeRule = (index: number) => {
        setTargeting(targeting.filter((_, i) => i !== index));
    };

    const renderStep1 = () => (
        <div className="space-y-6 animate-fade-in">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experiment Name</label>
                <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="e.g. Checkout Page Headline Test"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experiment Type</label>
                <div className="grid grid-cols-3 gap-4">
                    {Object.values(ExperimentType).map((t) => (
                        <div 
                            key={t}
                            onClick={() => setType(t)}
                            className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-all ${type === t ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600'}`}
                        >
                            {t === ExperimentType.AB && <Layout className="w-6 h-6" />}
                            {t === ExperimentType.SPLIT && <Code className="w-6 h-6" />}
                            {t === ExperimentType.MVT && <Globe className="w-6 h-6" />}
                            <span className="font-medium text-sm">{t}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target URL</label>
                <input 
                    type="url" 
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="https://example.com/shop"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                />
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Audience Targeting</h3>
                <button 
                    onClick={addTargetingRule}
                    className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                    <Plus className="w-4 h-4" /> Add Rule
                </button>
             </div>
             
             {targeting.length === 0 && (
                 <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-xl text-gray-500">
                     No targeting rules configured. The experiment will run for all visitors.
                 </div>
             )}

             <div className="space-y-3">
                 {targeting.map((rule, idx) => (
                     <div key={rule.id} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <select 
                            className="bg-white border border-gray-300 text-sm rounded-md p-2 w-1/4"
                            value={rule.category}
                            onChange={e => updateRule(idx, 'category', e.target.value)}
                        >
                            {TARGETING_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>

                        {rule.category === 'WooCommerce' ? (
                             <select className="bg-white border border-gray-300 text-sm rounded-md p-2 w-1/4" onChange={e => updateRule(idx, 'attribute', e.target.value)}>
                                 <option value="">Select Attribute</option>
                                 <option value="Total Spent">Total Spent</option>
                                 <option value="Product in Cart">Product in Cart</option>
                                 <option value="Is Returning">Is Returning</option>
                             </select>
                        ) : (
                            <input 
                                className="bg-white border border-gray-300 text-sm rounded-md p-2 w-1/4"
                                placeholder="Attribute (e.g. Chrome)"
                                value={rule.attribute}
                                onChange={e => updateRule(idx, 'attribute', e.target.value)}
                            />
                        )}

                        <select 
                             className="bg-white border border-gray-300 text-sm rounded-md p-2 w-1/5"
                             value={rule.operator}
                             onChange={e => updateRule(idx, 'operator', e.target.value)}
                        >
                            {OPERATORS.map(o => <option key={o} value={o}>{o.replace('_', ' ')}</option>)}
                        </select>

                        <input 
                             className="bg-white border border-gray-300 text-sm rounded-md p-2 flex-grow"
                             placeholder="Value"
                             value={rule.value}
                             onChange={e => updateRule(idx, 'value', e.target.value)}
                        />

                        <button onClick={() => removeRule(idx)} className="text-gray-400 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                 ))}
             </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Variations</h3>
                <button 
                    onClick={() => setVariants([...variants, { name: `Variant ${variants.length}`, isControl: false, weight: 100/(variants.length+1) }])}
                    className="flex items-center gap-1 text-sm bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 font-medium"
                >
                    <Plus className="w-4 h-4" /> Add Variant
                </button>
             </div>

             <div className="grid gap-4">
                 {variants.map((variant, idx) => (
                     <div key={idx} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white group">
                         <div className="flex justify-between items-center mb-4">
                             <div className="flex items-center gap-3">
                                 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${variant.isControl ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                     {idx === 0 ? 'A' : String.fromCharCode(65 + idx)}
                                 </div>
                                 <input 
                                    value={variant.name} 
                                    onChange={(e) => {
                                        const newV = [...variants];
                                        newV[idx].name = e.target.value;
                                        setVariants(newV);
                                    }}
                                    className="font-medium text-gray-900 border-none focus:ring-0 p-0 hover:bg-gray-50 rounded px-2"
                                 />
                                 {variant.isControl && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Original</span>}
                             </div>
                             <div className="flex items-center gap-3">
                                 <div className="flex items-center gap-1 text-xs text-gray-500">
                                     <span>Traffic:</span>
                                     <input 
                                        type="number" 
                                        className="w-12 border rounded p-1 text-center"
                                        value={Math.round(variant.weight)}
                                     />
                                     %
                                 </div>
                                 {!variant.isControl && (
                                     <button className="text-gray-400 hover:text-red-500 p-1" onClick={() => setVariants(variants.filter((_, i) => i !== idx))}>
                                         <Trash2 className="w-4 h-4" />
                                     </button>
                                 )}
                             </div>
                         </div>
                         
                         <div className="bg-gray-50 rounded-lg p-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 group-hover:border-indigo-300 transition-colors">
                            {variant.isControl ? (
                                <p className="text-sm text-gray-500">This is the original page content.</p>
                            ) : (
                                <div className="text-center space-y-2">
                                    <p className="text-sm text-gray-500">Modify this variant using the visual editor.</p>
                                    <button className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm">
                                        <Eye className="w-4 h-4" /> Launch Visual Editor
                                    </button>
                                </div>
                            )}
                         </div>
                     </div>
                 ))}
             </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="border-b border-gray-200 px-8 py-5 flex justify-between items-center bg-white z-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Create New Experiment</h2>
                        <p className="text-sm text-gray-500">Step {step} of 3: {step === 1 ? 'Details' : step === 2 ? 'Targeting' : 'Variations'}</p>
                    </div>
                    <div className="flex gap-2">
                        {step > 1 && (
                            <button onClick={() => setStep(step - 1)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                                Back
                            </button>
                        )}
                        {step < 3 ? (
                            <button onClick={() => setStep(step + 1)} className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm">
                                Continue
                            </button>
                        ) : (
                            <button onClick={() => onSave({ name, type, url, variants, targeting })} className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm">
                                Launch Experiment
                            </button>
                        )}
                        <button onClick={onClose} className="ml-2 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                             ✕
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-gray-100 w-full">
                    <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }}></div>
                </div>

                {/* Content */}
                <div className="flex-grow overflow-y-auto p-8 bg-gray-50/50">
                    <div className="max-w-2xl mx-auto">
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && renderStep3()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExperimentBuilder;