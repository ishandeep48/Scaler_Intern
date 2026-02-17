
import React from 'react';
import { cn } from '@/lib/utils';

interface DifficultyMeterProps {
    difficulty: number;
}

export function DifficultyMeter({ difficulty }: DifficultyMeterProps) {
    return (
        <div className="flex flex-col gap-1 w-full max-w-xs">
            <div className="flex justify-between text-xs text-slate-400 uppercase tracking-wider font-semibold">
                <span>Easy</span>
                <span>Difficulty: {difficulty}/10</span>
                <span>Hard</span>
            </div>
            <div className="flex gap-1 h-3">
                {Array.from({ length: 10 }).map((_, i) => {
                    const isActive = i < difficulty;
                    // Color gradient from green to red
                    const colorClass = i < 3 ? 'bg-emerald-500' :
                        i < 6 ? 'bg-yellow-500' :
                            i < 8 ? 'bg-orange-500' : 'bg-rose-500';

                    return (
                        <div
                            key={i}
                            className={cn(
                                "flex-1 rounded-sm transition-all duration-300 ease-out",
                                isActive ? colorClass : "bg-slate-800",
                                isActive && "shadow-[0_0_8px_rgba(0,0,0,0.5)] scale-y-100",
                                !isActive && "scale-y-75 opacity-50"
                            )}
                        />
                    );
                })}
            </div>
        </div>
    );
}
