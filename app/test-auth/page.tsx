'use client';

import { useState, useEffect } from 'react';

export default function TestAuthPage() {
  const [authStatus, setAuthStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/debug-auth');
        const data = await response.json();
        setAuthStatus(data);
      } catch (error) {
        setAuthStatus({ error: error instanceof Error ? error.message : 'Unknown error' });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(authStatus, null, 2)}
      </pre>
    </div>
  );
} 