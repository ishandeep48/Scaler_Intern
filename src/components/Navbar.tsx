
import { Zap, Trophy, Brain } from 'lucide-react';

export default function Navbar({ score, streak, difficulty }: any) {
    return (
        <nav className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-6 flex items-center justify-between z-50 shrink-0 sticky top-0">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xl">
                <Zap className="fill-current w-5 h-5" /> BrainBolt
            </div>
            <div className="flex gap-2 md:gap-4 text-xs md:text-sm font-medium">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 text-orange-400 rounded-full border border-orange-500/20">
                    <Zap size={14} className="fill-current" /> <span className="hidden sm:inline">Streak:</span> {streak}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full border border-yellow-500/20">
                    <Trophy size={14} className="fill-current" /> <span className="hidden sm:inline">Score:</span> {score}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20">
                    <Brain size={14} /> <span className="hidden sm:inline">Diff:</span> {difficulty}
                </div>
            </div>
        </nav>
    );
}
