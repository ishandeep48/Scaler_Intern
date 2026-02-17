
'use client';
import { Zap, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    return (
        <nav className="h-20 px-8 flex items-center justify-between z-50 shrink-0">
            {/* Brand */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/20 backdrop-blur-md shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]">
                    <Zap className="fill-current w-5 h-5" />
                </div>
                <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    BrainBolt
                </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors text-slate-400 hover:text-white"
                >
                    {mounted && theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <div className="h-8 w-px bg-white/10 mx-2" />

                <button className="px-6 py-2.5 rounded-2xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                    Log In
                </button>
                <button className="px-6 py-2.5 rounded-2xl text-sm font-bold bg-white text-slate-950 hover:bg-slate-200 transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
                    Sign Up
                </button>
            </div>
        </nav>
    );
}
