
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

export default function QuizCard({ question, onAnswer }: any) {
    const [selected, setSelected] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

    useEffect(() => {
        setSelected(null);
        setStatus('idle');
    }, [question?._id]);

    const handleSelect = async (choice: string) => {
        if (status !== 'idle') return;
        setSelected(choice);

        // We expect onAnswer to return { correct: boolean }
        const result = await onAnswer(choice);
        setStatus(result.correct ? 'correct' : 'wrong');
    };

    if (!question) return null;

    return (
        <div className="relative w-full max-w-2xl aspect-[4/3] flex flex-col justify-center">
            {/* Ambient Light Behind */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-green-500 blur-3xl opacity-20 rounded-full scale-90 animate-pulse-slow pointer-events-none" />

            <motion.div
                key={question._id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl flex flex-col justify-between h-full"
            >
                <div className="flex justify-between items-start mb-6">
                    <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs font-bold text-slate-400 uppercase tracking-widest backdrop-blur-md">
                        Difficulty {question.difficulty}
                    </span>
                    <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        ))}
                    </div>
                </div>

                <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight text-center mb-8">
                    {question.prompt}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                    {question.choices.map((choice: string, i: number) => {
                        const isSelected = selected === choice;
                        let stateClass = "bg-white/5 border-white/5 hover:bg-white/10 text-slate-200";

                        if (isSelected) {
                            if (status === 'correct') stateClass = "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)]";
                            else if (status === 'wrong') stateClass = "bg-rose-500/20 border-rose-500 text-rose-400";
                            else stateClass = "bg-primary border-primary text-white";
                        } else if (status !== 'idle') {
                            stateClass = "bg-white/5 border-white/5 opacity-30 blur-[1px]";
                        }

                        return (
                            <button
                                key={i}
                                onClick={() => handleSelect(choice)}
                                disabled={status !== 'idle'}
                                className={clsx(
                                    "group relative p-6 rounded-[1.5rem] border text-left text-lg font-medium transition-all duration-300 outline-none flex items-center justify-between overflow-hidden",
                                    stateClass,
                                    status === 'idle' && "hover:scale-[1.02] active:scale-[0.98]"
                                )}
                            >
                                <span className="relative z-10">{choice}</span>
                                {/* Hover Gradient */}
                                {status === 'idle' && !isSelected && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                )}
                                {isSelected && status === 'idle' && <Loader2 className="w-5 h-5 animate-spin" />}
                            </button>
                        )
                    })}
                </div>
            </motion.div>
        </div>
    );
}
