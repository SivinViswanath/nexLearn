'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-toastify';

export default function TestLayout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully!');
    router.push('/login');
  };

  return (
    <div
      className="min-h-screen bg-[#F5F5F5]"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 flex justify-between sm:justify-center items-center relative">
          <div className="flex-shrink-0">
            <Image
              src="/logo_2.svg"
              alt="NextLearn"
              width={120}
              height={37}
              className="w-[120px] h-auto sm:w-[160px] md:w-[192px]"
              priority
            />
          </div>
          <button
            onClick={handleLogout}
            className="sm:absolute sm:right-4 text-white px-4 sm:px-6 py-2 rounded-md font-medium transition-colors text-sm sm:text-base flex-shrink-0"
            style={{
              backgroundColor: '#177A9C',
              fontFamily: 'Inter, sans-serif',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#125F7D')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#177A9C')}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
