'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from './context/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';
import QuizDisplay from './components/QuizDisplay';

export default function HomePage() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('High School');
  const [numQuestions, setNumQuestions] = useState(5);
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user } = useAuth();

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setQuizData(null);

    try {
      const response = await fetch('http://localhost:8000/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, numQuestions, difficulty }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to fetch quiz');
      }

      const data = await response.json();
      setQuizData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f4f4f4',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        width: '100%'
      }}>
        {!quizData ? (
          <>
            <h1 style={{ textAlign: 'center' }}>🧠 Generate a Quiz</h1>
            <p style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              Create a personalized quiz based on any topic you like!
            </p>

            <form onSubmit={handleGenerateQuiz}>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="topic" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Topic
                </label>
                <input
                  id="topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., React, Photosynthesis"
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="numQuestions" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Number of Questions
                </label>
                <select
                  id="numQuestions"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '5px' }}
                >
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="difficulty" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '5px' }}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="High School">High School</option>
                  <option value="University">University</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#4f46e5',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {loading ? 'Generating...' : 'Generate Quiz'}
              </button>
            </form>

            {!user && (
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <p><strong>Tip:</strong> <Link href="/login">Log in</Link> to save your progress and view results later.</p>
              </div>
            )}

            {loading && (
              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <LoadingSpinner />
              </div>
            )}

            {error && (
              <p style={{ color: '#f87171', textAlign: 'center', marginTop: '1rem' }}>{error}</p>
            )}
          </>
        ) : (
          <>
            <QuizDisplay quizData={quizData} topic={topic} />
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button
                onClick={() => setQuizData(null)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  marginRight: '1rem',
                  cursor: 'pointer'
                }}
              >
                Take Another Quiz
              </button>
              {user && (
                <Link href="/dashboard">
                  <span style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#3b82f6',
                    color: '#fff',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    textDecoration: 'none'
                  }}>
                    View My Dashboard
                  </span>
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
