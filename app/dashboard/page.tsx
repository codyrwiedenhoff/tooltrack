'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { OverviewCards } from '@/components/Dashboard/OverviewCards';
import { useFetch } from '@/hooks/useFetch';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { data: tools } = useFetch('/api/tools', { skip: !user });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  const availableTools = tools?.filter((t: any) => t.status === 'AVAILABLE').length || 0;
  const checkedOutTools = tools?.filter((t: any) => t.status === 'CHECKED_OUT').length || 0;

  const cards = [
    { title: 'Total Tools', value: tools?.length || 0, color: 'bg-blue-500', icon: '🔧' },
    { title: 'Available', value: availableTools, color: 'bg-green-500', icon: '✅' },
    { title: 'Checked Out', value: checkedOutTools, color: 'bg-orange-500', icon: '📤' },
    { title: 'In Maintenance', value: tools?.filter((t: any) => t.status === 'MAINTENANCE').length || 0, color: 'bg-red-500', icon: '🔨' },
  ];

  return (
    <>
      <Navigation />
      <main className="max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        <OverviewCards cards={cards} />
      </main>
    </>
  );
}
