'use client';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('http://localhost:8000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login failed');
            login(data.user, data.token); // Auth context login
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-md mx-auto mt-10 text-white">
            <h2 className="text-2xl font-bold text-center mb-6">Log In</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 text-sm text-slate-300">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm text-slate-300">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition"
                >
                    Log In
                </button>
            </form>
            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
            <p className="text-center mt-4 text-sm text-slate-400">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-blue-400 hover:underline">
                    Register
                </Link>
            </p>
        </div>
    );
}
