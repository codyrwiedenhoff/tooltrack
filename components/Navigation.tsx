'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export function Navigation() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center font-bold text-xl">
              🔧 ToolTrack
            </Link>
            <div className="hidden md:flex space-x-4 ml-8">
              <Link href="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded">
                Dashboard
              </Link>
              <Link href="/tools" className="hover:bg-blue-700 px-3 py-2 rounded">
                Tools
              </Link>
              <Link href="/locations" className="hover:bg-blue-700 px-3 py-2 rounded">
                Locations
              </Link>
              {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
                <Link href="/users" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Users
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">{user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
