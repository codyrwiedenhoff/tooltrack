'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface UseFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  skip?: boolean;
}

export function useFetch<T>(url: string, options: UseFetchOptions = {}) {
  const { token } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (options.skip || !token) return;

    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          method: options.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: options.body ? JSON.stringify(options.body) : undefined,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch');
        }

        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, token, options.method, options.skip]);

  return { data, loading, error };
}
