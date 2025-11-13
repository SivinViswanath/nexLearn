'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { resetTest } from '@/store/slices/mcqSlice';
import { mcqApi } from '@/lib/api/mcqApi';
import { calculateScore } from '@/lib/utils';
import TestLayout from '@/components/layout/TestLayout';

function ResultPageContent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { questions, answers } = useSelector((state) => state.mcq);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Calculate result from local state
    try {
      const calculatedResult = calculateScore(answers, questions);
      setResult(calculatedResult);
    } catch (error) {
      console.error('Failed to calculate result:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, router, answers, questions]);

  const handleRetakeTest = () => {
    dispatch(resetTest());
    router.push('/instructions');
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <p className="text-gray-600">No result data available</p>
            <Button
              onClick={() => router.push('/instructions')}
              className="mt-4"
            >
              Take Test
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TestLayout>
      <div className="min-h-[calc(100vh-88px)] px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Marks Card */}
          <div
            style={{
              background:
                'linear-gradient(307.95deg, #1C3141 2.54%, #177A9C 79.7%)',
            }}
            className=" rounded-lg p-6 text-center mb-6"
          >
            <p className="text-white text-sm mb-2">Marks Obtained:</p>
            <p className="text-white text-5xl font-bold">
              {result.correct} / {result.total}
            </p>
          </div>

          {/* Statistics Card */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="space-y-3">
              {/* Total Questions */}
              <div className="flex items-center justify-between p-3 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#FFA726] rounded flex items-center justify-center">
                    <Image
                      src="/total.svg"
                      alt="Total"
                      width={20}
                      height={20}
                    />
                  </div>
                  <span className="text-[#1C3141] font-medium">
                    Total Questions:
                  </span>
                </div>
                <span className="text-[#1C3141] font-bold text-lg">
                  {result.total}
                </span>
              </div>

              {/* Correct Answers */}
              <div className="flex items-center justify-between p-3 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#4CAF50] rounded flex items-center justify-center">
                    <Image
                      src="/correct.svg"
                      alt="Correct"
                      width={20}
                      height={20}
                    />
                  </div>
                  <span className="text-[#1C3141] font-medium">
                    Correct Answers:
                  </span>
                </div>
                <span className="text-[#1C3141] font-bold text-lg">
                  {result.correct}
                </span>
              </div>

              {/* Incorrect Answers */}
              <div className="flex items-center justify-between p-3 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#EE3535] rounded flex items-center justify-center">
                    <Image
                      src="/incorrect.svg"
                      alt="Incorrect"
                      width={20}
                      height={20}
                    />
                  </div>
                  <span className="text-[#1C3141] font-medium">
                    Incorrect Answers:
                  </span>
                </div>
                <span className="text-[#1C3141] font-bold text-lg">
                  {result.incorrect}
                </span>
              </div>

              {/* Not Attended */}
              <div className="flex items-center justify-between p-3 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#5C5C5C] rounded flex items-center justify-center">
                    <Image
                      src="/not_attended.svg"
                      alt="Not Attended"
                      width={20}
                      height={20}
                    />
                  </div>
                  <span className="text-[#1C3141] font-medium">
                    Not Attended Questions:
                  </span>
                </div>
                <span className="text-[#1C3141] font-bold text-lg">
                  {result.unanswered}
                </span>
              </div>
            </div>

            {/* Done Button */}
            <button
              onClick={handleRetakeTest}
              className="w-full mt-6 py-3 rounded-lg text-white font-semibold text-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#1C3141' }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </TestLayout>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<Loading fullScreen />}>
      <ResultPageContent />
    </Suspense>
  );
}
