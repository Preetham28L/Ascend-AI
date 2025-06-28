// frontend/app/(pages)/dashboard/page.js
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// This is a client component because it uses hooks and is interactive.

export default function DashboardPage() {
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { token, user } = useAuth();
    const router = useRouter();

    // Fetch data on component mount
    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/quiz/history', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    throw new Error('Could not load your progress. Please try again later.');
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

    // Process the raw attempt data into useful stats using useMemo for efficiency.
    // This calculation only re-runs when the 'attempts' array changes.
    const dashboardData = useMemo(() => {
        if (attempts.length === 0) {
            return {
                totalQuizzes: 0,
                overallAverage: 0,
                performanceByTopic: [],
                recentAttempts: [],
            };
        }

        const topicStats = {};
        let totalScoreSum = 0;

        attempts.forEach(attempt => {
            if (!topicStats[attempt.topic]) {
                topicStats[attempt.topic] = { totalScore: 0, count: 0, topic: attempt.topic };
            }
            topicStats[attempt.topic].totalScore += attempt.score;
            topicStats[attempt.topic].count++;
            totalScoreSum += attempt.score;
        });

        const performanceByTopic = Object.values(topicStats).map(stat => ({
            ...stat,
            averageScore: Math.round(stat.totalScore / stat.count),
        }));

        return {
            totalQuizzes: attempts.length,
            overallAverage: Math.round(totalScoreSum / attempts.length),
            performanceByTopic,
            recentAttempts: attempts.slice(0, 5), // Get the 5 most recent attempts
        };
    }, [attempts]);

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 50) return 'text-yellow-400';
        return 'text-red-400';
    };

    // --- Render Logic ---

    if (loading) {
        return <div className="text-center p-10"><LoadingSpinner /></div>;
    }

    if (error) {
        return <p className="text-red-400 mt-4 text-center">{error}</p>;
    }
    
    if (!user) {
        return <div className="text-center p-10">Please log in to see your dashboard.</div>;
    }

    if (attempts.length === 0) {
        return (
            <div className="bg-slate-800 p-8 rounded-xl shadow-2xl text-center">
                <h2 className="text-2xl font-bold mb-4">Welcome to Your Dashboard!</h2>
                <p className="text-slate-400">You haven't taken any quizzes yet. Complete a quiz to see your progress here!</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-medium text-slate-400">Overall Average Score</h3>
                    <p className={`text-5xl font-bold mt-2 ${getScoreColor(dashboardData.overallAverage)}`}>
                        {dashboardData.overallAverage}%
                    </p>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-medium text-slate-400">Total Quizzes Taken</h3>
                    <p className="text-5xl font-bold mt-2 text-blue-400">
                        {dashboardData.totalQuizzes}
                    </p>
                </div>
            </div>

            {/* Performance by Topic Chart */}
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-6">Performance by Topic</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={dashboardData.performanceByTopic} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="topic" tick={{ fill: '#9ca3af' }} />
                            <YAxis domain={[0, 100]} tick={{ fill: '#9ca3af' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                                labelStyle={{ color: '#cbd5e1' }}
                            />
                            <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                            <Bar dataKey="averageScore" name="Average Score (%)" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Activity List */}
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    {dashboardData.recentAttempts.map((attempt, index) => (
                        <div key={index} className="bg-slate-700 p-4 rounded-lg flex justify-between items-center transition hover:bg-slate-600">
                            <div>
                                <p className="font-bold text-lg capitalize">{attempt.topic}</p>
                                <p className="text-sm text-slate-400">
                                    {new Date(attempt.completedAt).toLocaleString()}
                                </p>
                            </div>
                            <div className={`text-2xl font-bold ${getScoreColor(attempt.score)}`}>
                                {attempt.score}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}