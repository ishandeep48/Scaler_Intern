'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import LeftSidebar from '@/components/Layout/LeftSidebar';
import RightSidebar from '@/components/Layout/RightSidebar';
import QuizCard from '@/components/Quiz/QuizCard';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Lock } from 'lucide-react';

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
        const error: any = new Error('An error occurred while fetching the data.');
        error.info = await res.json();
        error.status = res.status;
        throw error;
    }
    return res.json();
};


export default function Home() {
    const { user, isLoading: authLoading } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Only fetch if user exists
    const { data, error, isLoading: quizLoading } = useSWR(
        user ? `/api/quiz/next` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            onError: (err) => {
                if (err.status === 401) {
                    // Token expired or invalid
                    setShowAuthModal(true);
                }
            }
        }
    );


    const handleAnswer = async (answer: string) => {
        if (!data?.question || !user) return { correct: false };

        try {
            const res = await fetch('/api/quiz/answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id, // Explicitly send ID as requested, though backend prefers cookie
                    questionId: data.question._id,
                    answer,
                    idempotencyKey: Math.random().toString()
                }),
            });

            const result = await res.json();

            // Optimistic update delays
            setTimeout(() => {
                mutate(`/api/quiz/next`);
            }, 1200);

            return result;
        } catch (err) {
            console.error("Answer submission failed", err);
            return { correct: false };
        }
    };

    const stats = {
        score: user?.score || 0,
        streak: user?.streak || 0,
        difficulty: user?.difficulty || 1
    };

    // If we have data from the quiz API, it might be more up to date for the session?
    // The quiz API returns: { user: { score, streak... }, question: ... }
    // So we can override the AuthContext user stats with the one from the Quiz response for real-time feel

    const displayStats = data?.user ? {
        score: data.user.score,
        streak: data.user.streak,
        difficulty: data.user.difficulty
    } : stats;


    // LOADING STATE
    if (authLoading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-white">
                <Loader2 className="animate-spin w-8 h-8 text-indigo-500" />
            </div>
        );
    }

    // LISTENER FOR AUTH MODAL (Gatekeeper)
    if (!user) {
        return (
            <main className="h-screen w-screen flex flex-col bg-slate-950 text-slate-50 overflow-hidden selection:bg-indigo-500/30 relative">

                {/* Background blurred "Locked" State */}
                <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 blur-sm pointer-events-none">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4 w-full h-full max-w-7xl">
                        <aside className="hidden lg:col-span-3 lg:flex flex-col h-full bg-slate-900/50 rounded-3xl border border-white/5"></aside>
                        <section className="col-span-1 md:col-span-12 lg:col-span-6 bg-slate-900/50 rounded-3xl border border-white/5 flex items-center justify-center">
                            <div className="w-96 h-64 bg-slate-800/50 rounded-2xl"></div>
                        </section>
                        <aside className="hidden lg:col-span-3 lg:flex flex-col h-full bg-slate-900/50 rounded-3xl border border-white/5"></aside>
                    </div>
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center h-full gap-8 px-4">
                    <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                        <Lock className="w-10 h-10 text-indigo-400" />
                    </div>

                    <div className="text-center space-y-2 max-w-lg">
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            Authentication Required
                        </h1>
                        <p className="text-slate-400 text-lg">
                            Access to the neural training grid is restricted to authorized personnel only.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowAuthModal(true)}
                        className="px-8 py-4 bg-white text-black font-bold text-lg rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                        Initialize Session
                    </button>
                </div>

                {showAuthModal && <AuthModal />}
            </main>
        );
    }

    // AUTHENTICATED STATE
    return (
        <main className="h-[calc(100vh-4rem)] w-full flex flex-col bg-slate-950 text-slate-50 overflow-hidden selection:bg-indigo-500/30">
            {/* Navbar is in Layout now */}

            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 p-4 md:p-6 overflow-hidden h-full">

                {/* Left Sidebar */}
                <aside className="hidden lg:col-span-3 lg:flex flex-col h-full overflow-hidden">
                    <LeftSidebar stats={displayStats} />
                </aside>

                {/* Center Quiz Area */}
                <section className="col-span-1 md:col-span-12 lg:col-span-6 flex flex-col items-center justify-center relative">
                    {(quizLoading && !data) ? (
                        <div className="flex flex-col items-center gap-4 animate-pulse">
                            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                            <span className="text-xs font-bold tracking-[0.2em] text-white/50">ESTABLISHING UPLINK</span>
                        </div>
                    ) : error || data?.error ? (
                        <div className="p-8 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-center">
                            <p className="text-rose-400 font-bold mb-2">Signal Lost</p>
                            <p className="text-rose-400/60 text-sm">{error?.message || data?.error}</p>
                            <button
                                onClick={() => mutate('/api/quiz/next')}
                                className="mt-4 px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl text-xs font-bold transition-colors"
                            >
                                RETRY CONNECTION
                            </button>
                        </div>
                    ) : (
                        <QuizCard question={data?.question} onAnswer={handleAnswer} />
                    )}
                </section>

                {/* Right Sidebar */}
                <aside className="hidden lg:col-span-3 lg:flex flex-col h-full overflow-hidden">
                    <RightSidebar />
                </aside>

            </div>
        </main>
    );
}