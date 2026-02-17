'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AuthModal() {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const body = isLogin ? { email, password } : { email, username, password };

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Authentication failed');
            }

            login(data.user);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur - "Glassmorphism" */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xl transition-all duration-300"></div>

            <div className="relative w-full max-w-md bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl overflow-hidden backdrop-blur-md animate-in fade-in zoom-in duration-300">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/30 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/30 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-center text-white mb-2">
                        {isLogin ? 'Welcome Back' : 'Join the Challenge'}
                    </h2>
                    <p className="text-white/60 text-center mb-8 text-sm">
                        {isLogin ? 'Enter your details to continue.' : 'Create an account to track your progress.'}
                    </p>

                    <div className="flex bg-white/5 rounded-xl p-1 mb-6">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isLogin ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${!isLogin ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-xs font-medium text-white/70 mb-1 ml-1">Username</label>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    placeholder="Choose a username"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1 ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="name@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1 ml-1">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="text-red-400 text-xs text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-indigo-500 to-emerald-500 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] transition-all duration-200 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Processing...' : (isLogin ? 'Login to Play' : 'Create Account')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
