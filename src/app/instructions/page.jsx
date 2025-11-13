'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { startTest } from '@/store/slices/mcqSlice';
import { mcqApi } from '@/lib/api/mcqApi';
import TestLayout from '@/components/layout/TestLayout';

export default function InstructionsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [instructions, setInstructions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchInstructions = async () => {
      try {
        const data = await mcqApi.getQuestions();

        if (data.success) {
          const instructionText = data.instruction || '';

          // Strip HTML tags and parse instructions
          const stripHtml = (html) => {
            const tmp = document.createElement('DIV');
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || '';
          };

          // Extract text from <li> tags or split by newlines
          let rules = [];
          if (instructionText.includes('<li>')) {
            const liMatches = instructionText.match(/<li>(.*?)<\/li>/g);
            if (liMatches) {
              rules = liMatches
                .map((li) => stripHtml(li).trim())
                .filter((rule) => rule);
            }
          } else {
            rules = instructionText
              .split('\n')
              .map((rule) => stripHtml(rule).trim())
              .filter((rule) => rule);
          }

          setInstructions({
            title: data.test_name || 'Ancient Indian History MCQ',
            duration: Math.ceil(data.total_time / 60),
            totalQuestions: data.questions_count,
            totalMarks: data.total_marks,
            totalTime: data.total_time,
            rules:
              rules.length > 0
                ? rules
                : [
                    'You have 101 minutes to complete the test.',
                    'Test consists of 100 multiple-choice questions.',
                    'You are allowed 2 retake attempts if you do not pass on the first try.',
                    'Each incorrect answer will incur a negative mark of -1/4.',
                    'Ensure you are in a quiet environment and have a stable internet connection.',
                    'Keep an eye on the timer, and try to answer all questions within the given time.',
                    'Do not use any external resources such as dictionaries, websites, or assistance.',
                    'Complete the test honestly to accurately assess your proficiency level.',
                    'Check answers before submitting.',
                    'Your test results will be displayed immediately after submission, indicating whether you have passed or need to retake the test.',
                  ],
          });
        }
      } catch (error) {
        console.error('Failed to fetch instructions:', error);
        setInstructions({
          title: 'Ancient Indian History MCQ',
          duration: 90,
          totalQuestions: 100,
          totalMarks: 100,
          totalTime: 5400,
          rules: [
            'You have 101 minutes to complete the test.',
            'Test consists of 100 multiple-choice questions.',
            'You are allowed 2 retake attempts if you do not pass on the first try.',
            'Each incorrect answer will incur a negative mark of -1/4.',
            'Ensure you are in a quiet environment and have a stable internet connection.',
            'Keep an eye on the timer, and try to answer all questions within the given time.',
            'Do not use any external resources such as dictionaries, websites, or assistance.',
            'Complete the test honestly to accurately assess your proficiency level.',
            'Check answers before submitting.',
            'Your test results will be displayed immediately after submission, indicating whether you have passed or need to retake the test.',
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInstructions();
  }, [isAuthenticated, router]);

  const handleStartTest = () => {
    dispatch(startTest(instructions.totalTime));
    router.push('/mcq');
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <TestLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Title */}
        <h1
          className="text-xl sm:text-2xl font-semibold text-center text-[#5C5C5C] mb-4 sm:mb-6"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {instructions?.title}
        </h1>

        {/* Stats Section */}
        <div className="bg-[#1C3141] rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 flex flex-col sm:flex-row justify-around items-center gap-4 sm:gap-0">
          <div className="text-center w-full sm:w-auto">
            <p
              className="text-white text-xs sm:text-sm mb-1 sm:mb-2"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Total MCQ's:
            </p>
            <p
              className="text-white text-2xl sm:text-4xl font-bold"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {instructions?.totalQuestions}
            </p>
          </div>
          <div className="text-center w-full sm:w-auto sm:border-l sm:border-r border-t border-b sm:border-t-0 sm:border-b-0 border-gray-600 py-4 sm:py-0 sm:px-12">
            <p
              className="text-white text-xs sm:text-sm mb-1 sm:mb-2"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Total marks:
            </p>
            <p
              className="text-white text-2xl sm:text-4xl font-bold"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {instructions?.totalMarks}
            </p>
          </div>
          <div className="text-center w-full sm:w-auto">
            <p
              className="text-white text-xs sm:text-sm mb-1 sm:mb-2"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Total time:
            </p>
            <p
              className="text-white text-2xl sm:text-4xl font-bold"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {formatTime(instructions?.totalTime || 5400)}
            </p>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8">
          <h2
            className="text-base sm:text-lg font-semibold text-[#5C5C5C] mb-4 sm:mb-6"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Instructions:
          </h2>
          <ol className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
            {instructions?.rules?.map((rule, index) => (
              <li
                key={index}
                className="flex gap-2 sm:gap-3 text-sm sm:text-base text-[#5C5C5C]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <span className="font-medium flex-shrink-0">{index + 1}.</span>
                <span>{rule}</span>
              </li>
            ))}
          </ol>

          {/* Start Test Button */}
          <div className="flex justify-center">
            <button
              onClick={handleStartTest}
              className="text-white w-full sm:w-auto px-8 sm:px-12 py-3 rounded-md font-medium transition-colors text-sm sm:text-base"
              style={{
                backgroundColor: '#1C3141',
                fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#0F1F2D')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#1C3141')}
            >
              Start Test
            </button>
          </div>
        </div>
      </div>
    </TestLayout>
  );
}
