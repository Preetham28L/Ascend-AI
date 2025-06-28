'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './QuizDisplay.module.css';

export default function QuizDisplay({ quizData, topic }) {
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const { token } = useAuth();

  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    return <p className={styles.noData}>No quiz data available.</p>;
  }

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    if (submitted) return;
    setUserAnswers({ ...userAnswers, [questionIndex]: optionIndex });
  };

  const handleSubmit = async () => {
    let currentScore = 0;
    quizData.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswerIndex) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setSubmitted(true);

    if (!token) {
      console.error('No token found, cannot submit quiz.');
      return;
    }

    try {
      await fetch('http://localhost:8000/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic,
          score: currentScore,
          totalQuestions: quizData.questions.length,
        }),
      });
    } catch (error) {
      console.error('Failed to submit quiz results:', error);
    }
  };

  const getOptionClass = (qIdx, optIdx) => {
    const isSelected = userAnswers[qIdx] === optIdx;
    const isCorrect = submitted && quizData.questions[qIdx].correctAnswerIndex === optIdx;
    const isIncorrect = submitted && isSelected && !isCorrect;

    return [
      styles.optionButton,
      isCorrect
        ? styles.correct
        : isIncorrect
        ? styles.incorrect
        : isSelected
        ? styles.selected
        : '',
    ].join(' ');
  };

  return (
    <div className={styles.quizContainer}>
      <h2 className={styles.quizTitle}>
        Quiz on: <span className={styles.topic}>{topic}</span>
      </h2>

      <ul className={styles.questionList}>
        {quizData.questions.map((q, qIdx) => (
          <li key={qIdx} className={styles.questionCard}>
            <p className={styles.questionText}>
              {qIdx + 1}. {q.questionText}
            </p>
            <div className={styles.optionsGrid}>
              {q.options.map((opt, optIdx) => (
                <button
                  key={optIdx}
                  onClick={() => handleAnswerSelect(qIdx, optIdx)}
                  disabled={submitted}
                  className={getOptionClass(qIdx, optIdx)}
                >
                  {String.fromCharCode(65 + optIdx)}. {opt}
                </button>
              ))}
            </div>
            {submitted && (
              <p className={styles.explanation}>
                Explanation: {q.explanation}
              </p>
            )}
          </li>
        ))}
      </ul>

      {!submitted && (
        <button onClick={handleSubmit} className={styles.submitButton}>
          Submit Quiz
        </button>
      )}

      {submitted && (
        <p className={styles.scoreText}>
          🎉 You scored <span className={styles.bold}>{score}</span> out of{' '}
          {quizData.questions.length}
        </p>
      )}
    </div>
  );
}
