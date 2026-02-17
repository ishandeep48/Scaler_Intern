
'use client';

import { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import Navbar from '@/components/Layout/Navbar';
import LeftSidebar from '@/components/Layout/LeftSidebar';
import RightSidebar from '@/components/Layout/RightSidebar';
import QuizCard from '@/components/Quiz/QuizCard';
import { Loader2 } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
    const [userId, setUserId] = useState<string>('');

    useEffect(() => {
        let stored = localStorage.getItem('brainbolt_user');
        if (!stored) {
            stored = `Guest_${Math.floor(Math.random() * 9000) + 1000}`;
            localStorage.setItem('brainbolt_user', stored);
        }
        setUserId(stored);
    }, []);

    const { data, error, isLoading } = useSWR(
        userId ? `/api/quiz/next?userId=${userId}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false
        }
    );

    const handleAnswer = async (answer: string) => {
        if (!data?.question) return { correct: false };

        try {
            const res = await fetch('/api/quiz/answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    questionId: data.question._id,
                    answer,
                    idempotencyKey: Math.random().toString()
                }),
            });

            const result = await res.json();

            // Optimistic update delays
            setTimeout(() => {
                mutate(userId ? `/api/quiz/next?userId=${userId}` : null);
            }, 1200);

            return result;
        } catch (err) {
            console.error("Answer submission failed", err);
            return { correct: false };
        }
    };

    const stats = {
        score: data?.user?.score || 0,
        streak: data?.user?.streak || 0,
        difficulty: data?.user?.difficulty || 1
    };

    if (!userId) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-white">
                <Loader2 className="animate-spin w-8 h-8 text-primary" />
            </div>
        )
    }

    return (
        <main className="h-screen w-screen flex flex-col bg-slate-950 text-slate-50 overflow-hidden selection:bg-indigo-500/30">
            <Navbar />

            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 p-4 md:p-6 overflow-hidden">

                {/* Left Sidebar */}
                <aside className="hidden lg:col-span-3 lg:flex flex-col h-full overflow-hidden">
                    <LeftSidebar stats={stats} />
                </aside>

                {/* Center Quiz Area */}
                <section className="col-span-1 md:col-span-12 lg:col-span-6 flex flex-col items-center justify-center relative">
                    {(isLoading && !data) ? (
                        <div className="flex flex-col items-center gap-4 animate-pulse">
                            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                            <span className="text-xs font-bold tracking-[0.2em] text-white/50">ESTABLISHING UPLINK</span>
                        </div>
                    ) : error || data?.error ? (
                        <div className="p-8 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-center">
                            <p className="text-rose-400 font-bold mb-2">Signal Lost</p>
                            <p className="text-rose-400/60 text-sm">{error?.message || data?.error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl text-xs font-bold transition-colors"
                            >
                                RECONNECT
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