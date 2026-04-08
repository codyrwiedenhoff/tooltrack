'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { useFetch } from '@/hooks/useFetch';
import Link from 'next/link';

export default function ToolsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const { data: tools, loading } = useFetch('/api/tools', { skip: !user });
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  const filteredTools = tools?.filter((tool: any) =>
    tool.name.toLowerCase().includes(filter.toLowerCase()) ||
    tool.serialNumber.toLowerCase().includes(filter.toLowerCase())
  ) || [];

  const handleCheckout = async (toolId: string) => {
    const locationId = prompt('Enter location ID:');
    if (!locationId) return;

    try {
      const response = await fetch('/api/transactions/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ toolId, locationId }),
      });

      if (response.ok) {
        alert('Tool checked out successfully');
        router.refresh();
      }
    } catch (error) {
      alert('Failed to checkout tool');
    }
  };

  return (
    <>
      <Navigation />
      <main className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Tools</h1>
          {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
            <Link href="/tools/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Add Tool
            </Link>
          )}
        </div>

        <input
          type="text"
          placeholder="Search tools..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-6 focus:ring-2 focus:ring-blue-600"
        />

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-3 text-left">Name</th>
                  <th className="border p-3 text-left">Serial Number</th>
                  <th className="border p-3 text-left">Status</th>
                  <th className="border p-3 text-left">Location</th>
                  <th className="border p-3 text-left">Assigned User</th>
                  <th className="border p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTools.map((tool: any) => (
                  <tr key={tool.id} className="hover:bg-gray-50">
                    <td className="border p-3">{tool.name}</td>
                    <td className="border p-3">{tool.serialNumber}</td>
                    <td className="border p-3">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        tool.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                        tool.status === 'CHECKED_OUT' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {tool.status}
                      </span>
                    </td>
                    <td className="border p-3">{tool.currentLocation?.name}</td>
                    <td className="border p-3">{tool.assignedUser?.name || '-'}</td>
                    <td className="border p-3">
                      {tool.status === 'AVAILABLE' && (
                        <button
                          onClick={() => handleCheckout(tool.id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                        >
                          Checkout
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
