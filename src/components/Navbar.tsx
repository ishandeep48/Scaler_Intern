'use client';

import { Zap, Trophy, Brain, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar({ score, streak, difficulty }: any) {
    const { user, logout } = useAuth();

    // Fallback to props or user context, but props are likely real-time from game
    const displayScore = score ?? user?.score ?? 0;
    const displayStreak = streak ?? user?.streak ?? 0;
    const displayDifficulty = difficulty ?? user?.difficulty ?? 1;

    return (
        <nav className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-6 flex items-center justify-between z-50 shrink-0 sticky top-0">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xl">
                <Zap className="fill-current w-5 h-5" /> BrainBolt
            </div>

            {user && (
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex gap-2 md:gap-4 text-xs md:text-sm font-medium">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 text-orange-400 rounded-full border border-orange-500/20">
                            <Zap size={14} className="fill-current" /> <span className="hidden sm:inline">Streak:</span> {displayStreak}
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full border border-yellow-500/20">
                            <Trophy size={14} className="fill-current" /> <span className="hidden sm:inline">Score:</span> {displayScore}
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20">
                            <Brain size={14} /> <span className="hidden sm:inline">Diff:</span> {displayDifficulty}
                        </div>
                    </div>

                    <div className="h-6 w-px bg-slate-700 mx-2 hidden md:block"></div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-300 hidden sm:block">
                            {user.username}
                        </span>
                        <button
                            onClick={logout}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
