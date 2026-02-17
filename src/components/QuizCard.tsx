
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function QuizCard({ question, onAnswer }: any) {
    const [selected, setSelected] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

    // Reset state when question changes
    useEffect(() => {
        setSelected(null);
        setStatus('idle');
    }, [question?._id]);

    const handleSelect = async (choice: string) => {
        if (status !== 'idle') return;
        setSelected(choice);

        // Optimistic UI handled by parent, but local visual feedback here
        const result = await onAnswer(choice);
        setStatus(result.correct ? 'correct' : 'wrong');

        // Reset handled by useEffect when question prop changes
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={question?._id || 'loading'} // Force re-render animation on question change
            className="w-full max-w-2xl bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden"
        >
            {/* Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />

            {/* Difficulty Badge */}
            <span className="absolute top-4 right-4 text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-800 px-2 py-1 rounded">
                Level {question.difficulty}
            </span>

            <h2 className="text-xl md:text-3xl font-bold text-white mb-8 leading-tight relative z-10">
                {question.prompt}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {question.choices.map((choice: string, i: number) => {
                    let btnColor = "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white";
                    if (selected === choice) {
                        if (status === 'correct') btnColor = "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
                        else if (status === 'wrong') btnColor = "bg-rose-500/20 border-rose-500 text-rose-400";
                        else btnColor = "bg-indigo-600 border-indigo-500 text-white";
                    } else if (status !== 'idle') {
                        btnColor = "bg-slate-800/50 border-slate-800 text-slate-500 opacity-50";
                    }

                    return (
                        <button
                            key={i}
                            onClick={() => handleSelect(choice)}
                            disabled={status !== 'idle'}
                            className={`p-6 text-left text-lg font-medium rounded-xl border transition-all duration-200 outline-none ${btnColor}`}
                        >
                            <div className="flex justify-between items-center">
                                <span>{choice}</span>
                                {selected === choice && status === 'idle' && <Loader2 className="w-5 h-5 animate-spin opacity-70" />}
                            </div>
                        </button>
                    );
                })}
            </div>
        </motion.div>
    );
}
