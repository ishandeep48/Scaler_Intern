
'use client';
import useSWR from 'swr';
import { Crown, Trophy, Medal, Loader2 } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function RightSidebar() {
    const { data, isLoading } = useSWR('/api/leaderboard', fetcher, { refreshInterval: 5000 });

    return (
        <div className="h-full bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-6 px-2">
                <h3 className="text-lg font-bold text-white">Top Commanders</h3>
                <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-white/50 uppercase tracking-wide">
                    Live
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {isLoading ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-white/20" /></div>
                ) : (data?.scores || []).map((user: any, i: number) => (
                    <div
                        key={i}
                        className="group flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-950 font-bold text-sm relative">
                                {i === 0 && <Crown className="w-5 h-5 text-yellow-400 absolute -top-2 -right-2 rotate-12 fill-yellow-400/20" />}
                                {i === 1 && <Trophy className="w-4 h-4 text-slate-300 absolute -top-2 -right-2 rotate-12" />}
                                {i === 2 && <Medal className="w-4 h-4 text-orange-400 absolute -top-2 -right-2 rotate-12" />}
                                <span className={i < 3 ? "text-white" : "text-slate-500"}>#{i + 1}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{user.username}</span>
                                <span className="text-[10px] text-slate-500 font-mono">Rank {i + 1}</span>
                            </div>
                        </div>
                        <span className="text-sm font-bold text-primary tabular-nums">{user.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
