import { clsx } from 'clsx';

export function cn(...inputs) {
  return clsx(inputs);
}

export function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function calculateScore(answers, questions) {
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;

  questions.forEach((question) => {
    const userAnswer = answers[question.id];

    if (!userAnswer || userAnswer.answer === undefined) {
      unanswered++;
    } else if (userAnswer.answer === question.correctAnswer) {
      correct++;
    } else {
      incorrect++;
    }
  });

  return {
    correct,
    incorrect,
    unanswered,
    total: questions.length,
    percentage: ((correct / questions.length) * 100).toFixed(2),
  };
}
