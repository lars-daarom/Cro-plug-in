import React, { useState } from 'react';
import { ExperimentStatus, ExperimentType, TargetingRule } from '../types';
import { TARGETING_CATEGORIES, OPERATORS } from '../constants';
import { Layout, Globe, Plus, Trash2, Code, BarChart2 } from 'lucide-react';
import { NewExperimentInput } from '../services/experimentsService';

interface ExperimentBuilderProps {
    onClose: () => void;
    onSave: (data: NewExperimentInput) => void;
}

const ExperimentBuilder: React.FC<ExperimentBuilderProps> = ({ onClose, onSave }) => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [type, setType] = useState<ExperimentType>(ExperimentType.AB);
    const [url, setUrl] = useState('https://');
    const [variants, setVariants] = useState([
        { name: 'Control', isControl: true, weight: 50, visitors: 0, conversions: 0 },
        { name: 'Variant B', isControl: false, weight: 50, visitors: 0, conversions: 0 }
    ]);
    const [targeting, setTargeting] = useState<TargetingRule[]>([]);
    const [error, setError] = useState<string | null>(null);

    const updateVariant = (index: number, key: string, value: any) => {
        const updated = [...variants];
        (updated[index] as any)[key] = value;
        setVariants(updated);
    };

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

    const validateBasics = () => {
        if (!name.trim() || !url.trim()) {
            setError('Vul minimaal een naam en een geldige URL in.');
            return false;
        }
        if (variants.length === 0) {
            setError('Voeg minstens één variant toe.');
            return false;
        }
        return true;
    };

    const handleContinue = () => {
        if (step === 1 && !validateBasics()) {
            return;
        }
        setError(null);
        setStep(step + 1);
    };

    const handleLaunch = () => {
        if (!validateBasics()) return;

        const preparedVariants = variants.map((variant, idx) => ({
            name: variant.name.trim() || `Variant ${idx + 1}`,
            isControl: idx === 0 ? true : variant.isControl,
            weight: Math.max(0, Number(variant.weight) || 0),
            visitors: Math.max(0, Number(variant.visitors) || 0),
            conversions: Math.max(0, Number(variant.conversions) || 0),
        }));

        onSave({
            name: name.trim(),
            type,
            url: url.trim(),
            status: ExperimentStatus.DRAFT,
            variants: preparedVariants,
            targeting,
            startDate: new Date().toISOString().slice(0, 10),
        });
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
                <h3 className="text-lg font-medium text-gray-900">Varianten & metingen</h3>
                <button
                    onClick={() => setVariants([...variants, { name: `Variant ${variants.length + 1}`, isControl: false, weight: 100/(variants.length+1), visitors: 0, conversions: 0 }])}
                    className="flex items-center gap-1 text-sm bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 font-medium"
                >
                    <Plus className="w-4 h-4" /> Variant toevoegen
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
                                    onChange={(e) => updateVariant(idx, 'name', e.target.value)}
                                    className="font-medium text-gray-900 border-none focus:ring-0 p-0 hover:bg-gray-50 rounded px-2"
                                 />
                                 {variant.isControl && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Origineel</span>}
                             </div>
                             <div className="flex items-center gap-3">
                                 <div className="flex items-center gap-1 text-xs text-gray-500">
                                     <span>Traffic:</span>
                                     <input
                                        type="number"
                                        className="w-16 border rounded p-1 text-center"
                                        value={Math.round(variant.weight)}
                                        onChange={(e) => updateVariant(idx, 'weight', Number(e.target.value))}
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

                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className="flex flex-col text-sm text-gray-600">
                                Bezoekers
                                <input
                                    type="number"
                                    min={0}
                                    value={variant.visitors}
                                    onChange={(e) => updateVariant(idx, 'visitors', Number(e.target.value))}
                                    className="mt-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </label>
                            <label className="flex flex-col text-sm text-gray-600">
                                Conversies
                                <input
                                    type="number"
                                    min={0}
                                    value={variant.conversions}
                                    onChange={(e) => updateVariant(idx, 'conversions', Number(e.target.value))}
                                    className="mt-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </label>
                            <label className="flex flex-col text-sm text-gray-600">
                                Opmerking
                                <div className="mt-1 border border-dashed border-gray-300 rounded-lg p-3 text-gray-500 bg-gray-50/80 flex items-center gap-2">
                                    <BarChart2 className="w-4 h-4 text-indigo-500" />
                                    Vul je eigen statistieken of notities in je CMS in; deze plugin bewaart de cijfers.
                                </div>
                            </label>
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
                        <h2 className="text-xl font-bold text-gray-800">Nieuw experiment aanmaken</h2>
                        <p className="text-sm text-gray-500">Stap {step} van 3: {step === 1 ? 'Details' : step === 2 ? 'Targeting' : 'Varianten'}</p>
                    </div>
                    <div className="flex gap-2">
                        {step > 1 && (
                            <button onClick={() => { setError(null); setStep(step - 1); }} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                                Back
                            </button>
                        )}
                        {step < 3 ? (
                            <button onClick={handleContinue} className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm">
                                Volgende
                            </button>
                        ) : (
                            <button onClick={handleLaunch} className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm">
                                Opslaan in WordPress
                            </button>
                        )}
                        <button onClick={onClose} className="ml-2 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                             ✕
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-3 text-sm">{error}</div>
                )}

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