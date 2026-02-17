
'use client';
import { useAuth } from '@/context/AuthContext';
import useSWR from 'swr';
import { cn } from '@/lib/utils';
import { Loader2, Crown, Trophy, Medal } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function RightSidebar() {
    const { user: currentUser } = useAuth();
    const { data, isLoading } = useSWR('/api/leaderboard', fetcher, {
        refreshInterval: 1000,
        revalidateOnFocus: true,
        revalidateOnMount: true,
        dedupingInterval: 0
    });

    return (
        <div className="h-full bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-6 px-2">
                <h3 className="text-lg font-bold text-white">Top Commanders</h3>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-white/50 uppercase tracking-wide">
                        Live
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {isLoading ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-white/20" /></div>
                ) : (data?.scores || []).map((user: any, i: number) => {
                    const isMe = currentUser?.username === user.username;
                    return (
                        <div
                            key={i}
                            className={cn(
                                "group flex items-center justify-between p-3 rounded-2xl transition-all border",
                                isMe
                                    ? "bg-indigo-500/20 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                                    : "hover:bg-white/5 border-transparent hover:border-white/5"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm relative transition-colors",
                                    isMe ? "bg-indigo-500 text-white" : "bg-slate-950"
                                )}>
                                    {i === 0 && <Crown className="w-5 h-5 text-yellow-400 absolute -top-2 -right-2 rotate-12 fill-yellow-400/20" />}
                                    {i === 1 && <Trophy className="w-4 h-4 text-slate-300 absolute -top-2 -right-2 rotate-12" />}
                                    {i === 2 && <Medal className="w-4 h-4 text-orange-400 absolute -top-2 -right-2 rotate-12" />}
                                    <span className={i < 3 && !isMe ? "text-white" : isMe ? "text-white" : "text-slate-500"}>#{i + 1}</span>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "text-sm font-semibold transition-colors",
                                            isMe ? "text-indigo-200" : "text-slate-200 group-hover:text-white"
                                        )}>{user.username} {isMe && '(You)'}</span>
                                        {/* Streak Badge */}
                                        {user.streak > 0 && (
                                            <div className="flex items-center gap-1 bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full text-[10px] border border-orange-500/20">
                                                <span role="img" aria-label="streak">🔥</span>
                                                <span>{user.streak}</span>
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-mono">Rank {i + 1}</span>
                                </div>
                            </div>
                            <span className={cn(
                                "text-sm font-bold tabular-nums",
                                isMe ? "text-indigo-300" : "text-primary"
                            )}>{user.value}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
