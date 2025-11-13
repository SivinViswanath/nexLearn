'use client';

import { useEffect, useState } from 'react';
import { Loading } from '@/components/ui/Loading';

let globalLoadingCount = 0;
const listeners = new Set();

export const showGlobalLoading = () => {
  globalLoadingCount++;
  listeners.forEach((listener) => listener(globalLoadingCount > 0));
};

export const hideGlobalLoading = () => {
  globalLoadingCount = Math.max(0, globalLoadingCount - 1);
  listeners.forEach((listener) => listener(globalLoadingCount > 0));
};

export default function GlobalLoader() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    listeners.add(setIsLoading);
    return () => listeners.delete(setIsLoading);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-6 shadow-xl">
        <Loading />
      </div>
    </div>
  );
}
