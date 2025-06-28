// frontend/app/(pages)/history/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            // If there's no token, redirect to login page.
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/quiz/history', {
                    headers: {
                        'Authorization': `Bearer ${token}` // <-- SEND THE TOKEN!
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch your history.');
                }
                const data = await response.json();
                setAttempts(data.attempts);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, router]);

    // ... (Use the same JSX as your old Dashboard page to display the attempts) ...
    // ... (Just make sure it's wrapped in a check for `user`) ...

    if (!user) return <LoadingSpinner />; // Or a message to log in

    return (
         <div className="bg-slate-800 p-8 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold text-center mb-6">Your Quiz History</h2>
            {/* ... Paste your attempts list rendering logic here ... */}
        </div>
    );
}