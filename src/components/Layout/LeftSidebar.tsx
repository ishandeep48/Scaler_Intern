
import { Zap, Trophy, Brain } from 'lucide-react';

export default function LeftSidebar({ stats }: { stats: { score: number; streak: number; difficulty: number } }) {
    return (
        <div className="h-full flex flex-col gap-4">
            <StatCard
                icon={<Zap className="w-6 h-6 text-orange-400 fill-orange-400/20" />}
                label="Current Streak"
                value={stats.streak}
                color="bg-orange-500/10 border-orange-500/20"
            />
            <StatCard
                icon={<Trophy className="w-6 h-6 text-yellow-400 fill-yellow-400/20" />}
                label="Total Score"
                value={stats.score}
                color="bg-yellow-500/10 border-yellow-500/20"
            />
            <StatCard
                icon={<Brain className="w-6 h-6 text-purple-400 fill-purple-400/20" />}
                label="Difficulty Level"
                value={stats.difficulty}
                color="bg-purple-500/10 border-purple-500/20"
                subtext="Adaptive"
            />
        </div>
    );
}

function StatCard({ icon, label, value, color, subtext }: any) {
    return (
        <div className={`p-6 rounded-[2rem] border backdrop-blur-md transition-all hover:scale-[1.02] ${color}`}>
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/5 rounded-2xl">
                    {icon}
                </div>
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-white/40">{label}</p>
                    {subtext && <p className="text-[10px] text-white/30">{subtext}</p>}
                </div>
            </div>
            <p className="text-4xl font-bold text-white tracking-tight">{value.toLocaleString()}</p>
        </div>
    );
}
