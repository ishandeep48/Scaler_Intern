
import React, { useState } from 'react';
import useSWR from 'swr';
import { cn } from '@/lib/utils';
import { Trophy, Flame, Loader2, Medal } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface LeaderboardData {
    scores: { username: string; value: number }[];
    streaks: { username: string; value: number }[];
}

export function LeaderboardWidget() {
    const { data, error, isLoading } = useSWR<LeaderboardData>('/api/leaderboard', fetcher, {
        refreshInterval: 5000,
    });
    const [activeTab, setActiveTab] = useState<'scores' | 'streaks'>('scores');
    const currentUsername = typeof window !== 'undefined' ? localStorage.getItem('brainbolt_username') : null;

    if (error) return <div className="p-4 text-rose-400 text-sm bg-rose-500/10 rounded-lg border border-rose-500/20">Failed to load leaderboard</div>;

    return (
        <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {/* Header Tabs */}
            <div className="flex border-b border-slate-800">
                <button
                    onClick={() => setActiveTab('scores')}
                    className={cn(
                        "flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200",
                        activeTab === 'scores'
                            ? "bg-slate-800/50 text-yellow-400 border-b-2 border-yellow-400"
                            : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30"
                    )}
                >
                    <Trophy className="w-4 h-4" /> Top Scores
                </button>
                <button
                    onClick={() => setActiveTab('streaks')}
                    className={cn(
                        "flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200",
                        activeTab === 'streaks'
                            ? "bg-slate-800/50 text-orange-400 border-b-2 border-orange-400"
                            : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30"
                    )}
                >
                    <Flame className="w-4 h-4" /> Top Streaks
                </button>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {isLoading ? (
                    <div className="flex h-40 items-center justify-center text-slate-500">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    </div>
                ) : (data?.[activeTab]?.length === 0) ? (
                    <div className="p-8 text-center text-slate-500 text-sm">No records yet. Be the first!</div>
                ) : (
                    (data?.[activeTab] || []).map((entry, index) => {
                        const isCurrentUser = entry.username === currentUsername;
                        let rankColor = "bg-slate-800 text-slate-400";
                        if (index === 0) rankColor = "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
                        if (index === 1) rankColor = "bg-slate-300/20 text-slate-300 border border-slate-300/30";
                        if (index === 2) rankColor = "bg-amber-700/20 text-amber-500 border border-amber-700/30";

                        return (
                            <div
                                key={`${entry.username}-${index}`}
                                className={cn(
                                    "flex items-center justify-between p-3 rounded-xl transition-all duration-200 group hover:bg-slate-800 border border-transparent",
                                    isCurrentUser ? "bg-indigo-500/10 border-indigo-500/30 hover:bg-indigo-500/20" : "bg-transparent"
                                )}
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className={cn("w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold shrink-0", rankColor)}>
                                        {index + 1}
                                    </div>

                                    <div className="flex flex-col min-w-0">
                                        <span className={cn(
                                            "text-sm font-medium truncate",
                                            isCurrentUser ? "text-indigo-300" : "text-slate-300 group-hover:text-white"
                                        )}>
                                            {entry.username}
                                        </span>
                                        {isCurrentUser && <span className="text-[10px] text-indigo-400/60 font-semibold uppercase tracking-wide">You</span>}
                                    </div>
                                </div>

                                <span className={cn(
                                    "font-mono text-sm font-bold bg-slate-950/50 px-2 py-1 rounded-md",
                                    activeTab === 'scores' ? "text-yellow-400" : "text-orange-400"
                                )}>
                                    {entry.value.toLocaleString()}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
