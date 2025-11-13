'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Loading } from '@/components/ui/Loading';
import {
  setQuestions,
  setCurrentQuestion,
  setAnswer,
  setTimeRemaining,
  submitTest,
  markForReview,
  setResult,
} from '@/store/slices/mcqSlice';
import { mcqApi } from '@/lib/api/mcqApi';
import { formatTime } from '@/lib/utils';
import TestLayout from '@/components/layout/TestLayout';

export default function MCQPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const {
    questions,
    currentQuestionIndex,
    answers,
    timeRemaining,
    markedForReview,
  } = useSelector((state) => state.mcq);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showComprehensionModal, setShowComprehensionModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchQuestions = async () => {
      try {
        const data = await mcqApi.getQuestions();

        if (data.success && data.questions) {
          // Transform API response to match our format
          const transformedQuestions = data.questions.map((q) => ({
            id: q.question_id,
            question: q.question,
            options: q.options.map((opt) => opt.option),
            optionIds: q.options.map((opt) => opt.id),
            comprehension: q.comprehension || null,
            image: q.image || null,
          }));

          dispatch(setQuestions(transformedQuestions));

          // Set timer from API response (total_time is in seconds)
          if (data.total_time) {
            dispatch(setTimeRemaining(data.total_time));
          }
        }
      } catch (error) {
        console.error('Failed to fetch questions:', error);
        const errorMessage =
          error.message || 'Failed to load questions. Please try again.';
        toast.error(errorMessage);
        setLoading(false);
        // Don't redirect immediately, let user see the error
        setTimeout(() => {
          router.push('/instructions');
        }, 2000);
        return;
      }
      setLoading(false);
    };

    fetchQuestions();
  }, [isAuthenticated, router, dispatch]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      dispatch(setTimeRemaining(timeRemaining - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, dispatch]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeRemaining === 0 && !submitting && questions.length > 0) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (optionIndex) => {
    const optionId = currentQuestion.optionIds[optionIndex];
    dispatch(
      setAnswer({
        questionId: currentQuestion.id,
        answer: optionIndex,
        optionId: optionId,
      }),
    );
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      dispatch(setCurrentQuestion(currentQuestionIndex + 1));
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      dispatch(setCurrentQuestion(currentQuestionIndex - 1));
    }
  };

  const handleQuestionNavigate = (index) => {
    dispatch(setCurrentQuestion(index));
  };

  const handleMarkForReview = () => {
    dispatch(markForReview(currentQuestion.id));
  };

  const handleSubmitClick = () => {
    if (timeRemaining > 0) {
      setShowSubmitModal(true);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;

    setShowSubmitModal(false);
    setSubmitting(true);
    try {
      // Transform answers to API format
      const formattedAnswers = questions.map((q) => ({
        question_id: q.id,
        selected_option_id: answers[q.id]?.optionId || null,
      }));

      const result = await mcqApi.submitAnswers(formattedAnswers);

      if (result.success) {
        // Store result in Redux
        dispatch(
          setResult({
            total: result.correct + result.wrong + result.not_attended,
            correct: result.correct,
            incorrect: result.wrong,
            unanswered: result.not_attended,
            score: result.score,
            details: result.details,
            examHistoryId: result.exam_history_id,
            submittedAt: result.submitted_at,
          }),
        );
        dispatch(submitTest());
        router.push('/result');
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Failed to submit answers:', error);
      const errorMessage =
        error.message || 'Failed to submit answers. Please try again.';
      toast.error(errorMessage);
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <p className="text-gray-600">No questions available</p>
            <Button
              onClick={() => router.push('/instructions')}
              className="mt-4"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;
  const markedCount = markedForReview
    ? Object.keys(markedForReview).filter((id) => markedForReview[id]).length
    : 0;
  const answeredAndMarkedCount = questions.filter(
    (q) => answers[q.id] !== undefined && markedForReview?.[q.id],
  ).length;

  return (
    <TestLayout>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm mb-3 sm:mb-4">
              <div className="p-3 sm:p-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <h2 className="text-sm sm:text-base font-medium text-gray-700">
                    Ancient Indian History MCQ
                  </h2>
                  <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                    <span>
                      {String(answeredCount).padStart(2, '0')}/
                      {String(questions.length).padStart(3, '0')}
                    </span>
                    <span className="hidden sm:inline">
                      Question No. Sheet:
                    </span>
                  </div>
                </div>
              </div>

              {currentQuestion.comprehension && (
                <div className="p-3 sm:p-4 border-b border-gray-200">
                  <button
                    onClick={() => setShowComprehensionModal(true)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 text-white rounded-lg transition-colors text-xs sm:text-sm w-full sm:w-auto justify-center"
                    style={{ backgroundColor: '#177A9C' }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = '#125F7D')
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = '#177A9C')
                    }
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="hidden xs:inline">
                      Read Comprehensive Paragraph
                    </span>
                    <span className="xs:hidden">
                      Read Comprehensive Paragraph
                    </span>
                  </button>
                </div>
              )}

              <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-900 mb-3 sm:mb-4">
                    {currentQuestionIndex + 1}. {currentQuestion.question}
                  </p>

                  {currentQuestion.image && (
                    <img
                      src={currentQuestion.image}
                      alt="Question"
                      className="max-w-full sm:max-w-xs rounded-lg mb-4"
                    />
                  )}
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-2 sm:mb-3">
                    Choose the answer:
                  </p>

                  <div className="space-y-2">
                    {currentQuestion.options.map((option, index) => {
                      const optionLabels = ['A', 'B', 'C', 'D'];
                      return (
                        <label
                          key={index}
                          className={`flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border cursor-pointer transition-all ${
                            answers[currentQuestion.id]?.answer === index
                              ? 'bg-teal-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                          style={{
                            borderColor:
                              answers[currentQuestion.id]?.answer === index
                                ? '#177A9C'
                                : undefined,
                          }}
                        >
                          <input
                            type="radio"
                            name={`question-${currentQuestion.id}`}
                            checked={
                              answers[currentQuestion.id]?.answer === index
                            }
                            onChange={() => handleAnswerSelect(index)}
                            className="mt-0.5 sm:mt-1 w-4 h-4 flex-shrink-0 focus:ring-2"
                            style={{
                              accentColor: '#177A9C',
                            }}
                          />
                          <span className="text-xs sm:text-sm text-gray-800">
                            <span className="font-medium">
                              {optionLabels[index]}.
                            </span>{' '}
                            {option}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-3 sm:pt-4 border-t border-gray-200">
                  <button
                    onClick={handleMarkForReview}
                    className="px-4 sm:px-6 py-2 text-white rounded-lg transition-colors text-xs sm:text-sm font-medium order-2 sm:order-1"
                    style={{ backgroundColor: '#800080' }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = '#660066')
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = '#800080')
                    }
                  >
                    Mark for review
                  </button>

                  <div className="flex gap-2 sm:gap-3 order-1 sm:order-2">
                    <button
                      onClick={handlePrevious}
                      disabled={currentQuestionIndex === 0}
                      className="flex-1 sm:flex-none px-4 sm:px-6 py-2 text-gray-700 rounded-lg transition-colors text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#CECECE' }}
                      onMouseEnter={(e) =>
                        !e.target.disabled &&
                        (e.target.style.backgroundColor = '#B8B8B8')
                      }
                      onMouseLeave={(e) =>
                        !e.target.disabled &&
                        (e.target.style.backgroundColor = '#CECECE')
                      }
                    >
                      Previous
                    </button>
                    {currentQuestionIndex === questions.length - 1 ? (
                      <button
                        onClick={handleSubmitClick}
                        disabled={submitting}
                        className="flex-1 sm:flex-none px-4 sm:px-6 py-2 text-white rounded-lg transition-colors text-xs sm:text-sm font-medium disabled:opacity-50"
                        style={{ backgroundColor: '#1C3141' }}
                        onMouseEnter={(e) =>
                          !e.target.disabled &&
                          (e.target.style.backgroundColor = '#0F1F2D')
                        }
                        onMouseLeave={(e) =>
                          !e.target.disabled &&
                          (e.target.style.backgroundColor = '#1C3141')
                        }
                      >
                        {submitting ? 'Submitting...' : 'Submit Test'}
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        className="flex-1 sm:flex-none px-4 sm:px-6 py-2 text-white rounded-lg transition-colors text-xs sm:text-sm font-medium"
                        style={{ backgroundColor: '#1C3141' }}
                        onMouseEnter={(e) =>
                          (e.target.style.backgroundColor = '#0F1F2D')
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.backgroundColor = '#1C3141')
                        }
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Question Navigator */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm lg:sticky lg:top-6">
              <div className="p-3 sm:p-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-600">
                  {String(answeredCount).padStart(2, '0')}/
                  {String(questions.length).padStart(3, '0')}
                </span>
                <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">
                  Question No. Sheet:
                </span>
                <div
                  className="flex items-center gap-2 px-2 sm:px-3 py-1 text-white rounded-lg text-xs sm:text-sm"
                  style={{ backgroundColor: '#1C3141' }}
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {formatTime(timeRemaining)}
                </div>
              </div>

              <div className="p-3 sm:p-4">
                <p className="text-xs text-gray-500 mb-2 sm:mb-3">
                  Remaining Time:
                </p>
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                  {questions.map((q, index) => {
                    const isAnswered = answers[q.id] !== undefined;
                    const isMarked = markedForReview?.[q.id] === true;
                    const isCurrent = index === currentQuestionIndex;

                    let bgColor = '';
                    let textColor = 'text-white';
                    let borderStyle = '';

                    // Priority order: Answered > Marked > Not Attended > Unattended
                    if (isAnswered) {
                      // Answered - green (regardless of marked status)
                      bgColor = '#4CAF50';
                      textColor = 'text-white';
                    } else if (isMarked) {
                      // Marked for review (not answered) - purple
                      bgColor = '#800080';
                      textColor = 'text-white';
                    } else if (index < currentQuestionIndex) {
                      // Not attended (visited but not answered) - red
                      bgColor = '#EE3535';
                      textColor = 'text-white';
                    } else {
                      // Unattended (not visited yet) - white with border
                      bgColor = '#FFFFFF';
                      textColor = 'text-gray-800';
                      borderStyle = '2px solid #CECECE';
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => handleQuestionNavigate(index)}
                        className={`aspect-square rounded text-[10px] sm:text-xs font-medium transition-all hover:opacity-80 ${textColor} min-h-[32px] sm:min-h-[36px]`}
                        style={{
                          backgroundColor: bgColor,
                          border: borderStyle || 'none',
                        }}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-2 text-[9px] sm:text-[10px]">
                  <div className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 sm:w-3 sm:h-3 rounded flex-shrink-0"
                      style={{ backgroundColor: '#4CAF50' }}
                    ></div>
                    <span className="text-gray-600">Attended</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 sm:w-3 sm:h-3 rounded flex-shrink-0"
                      style={{ backgroundColor: '#EE3535' }}
                    ></div>
                    <span className="text-gray-600">Not Attended</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 sm:w-3 sm:h-3 rounded flex-shrink-0"
                      style={{ backgroundColor: '#800080' }}
                    ></div>
                    <span className="text-gray-600">Marked</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 sm:w-3 sm:h-3 rounded flex-shrink-0"
                      style={{ backgroundColor: '#4CAF50' }}
                    ></div>
                    <span className="text-gray-600">Ans & Marked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comprehension Modal */}
        {showComprehensionModal && currentQuestion.comprehension && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[85vh] sm:max-h-[80vh] flex flex-col">
              <div className="p-3 sm:p-4 border-b border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Comprehensive Paragraph
                </h3>
              </div>
              <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                <div className="text-gray-700 leading-relaxed text-xs sm:text-sm whitespace-pre-wrap">
                  {currentQuestion.comprehension}
                </div>
              </div>
              <div className="p-3 sm:p-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowComprehensionModal(false)}
                  className="px-4 sm:px-6 py-2 text-white rounded-lg transition-colors text-xs sm:text-sm font-medium"
                  style={{ backgroundColor: '#1C3141' }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = '#0F1F2D')
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = '#1C3141')
                  }
                >
                  Minimize
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submit Confirmation Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                  Are you sure you want to submit the test?
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600">
                        Remaining Time:
                      </p>
                      <p className="text-sm sm:text-lg font-semibold text-gray-900">
                        {formatTime(timeRemaining)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-yellow-50 rounded-lg">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600">Total Questions:</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {questions.length}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">
                        Questions Answered:
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {String(answeredCount).padStart(3, '0')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">
                        Marked for review:
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {String(markedCount).padStart(3, '0')}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full mt-6 px-6 py-3 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                  style={{ backgroundColor: '#1C3141' }}
                  onMouseEnter={(e) =>
                    !e.target.disabled &&
                    (e.target.style.backgroundColor = '#0F1F2D')
                  }
                  onMouseLeave={(e) =>
                    !e.target.disabled &&
                    (e.target.style.backgroundColor = '#1C3141')
                  }
                >
                  {submitting ? 'Submitting...' : 'Submit Test'}
                </button>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="w-full mt-2 px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TestLayout>
  );
}
