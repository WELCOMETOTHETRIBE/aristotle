'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api/client';
import { Out_Health_GET } from '@/lib/api/schemas';

interface HealthData {
  ok: boolean;
  service: string;
  timestamp: string;
  environment: {
    missing: string[];
    present: string[];
  };
  database: {
    status: 'ok' | 'fail';
    error?: string;
  };
  audio: {
    breathwork: 'ok' | 'missing';
  };
  tts: {
    status: 'ok' | 'fail';
  };
}

export default function DoctorPage() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientErrors, setClientErrors] = useState<any[]>([]);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get('/api/health-doctor', Out_Health_GET);
      setHealthData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const runDoctor = async () => {
    setLoading(true);
    try {
      // This would call the actual doctor script
      const response = await fetch('/api/health-doctor');
      const data = await response.json();
      setHealthData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const runTests = async () => {
    setLoading(true);
    try {
      // This would run the test suite
      console.log('Running tests...');
      // In a real implementation, this would call the test runner
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    
    // Get client-side errors
    if (typeof window !== 'undefined' && (window as any).__doctorErrors) {
      setClientErrors((window as any).__doctorErrors);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏥 Aristotle Project Doctor
          </h1>
          <p className="text-gray-600">
            Health monitoring and diagnostics for your Aristotle app
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Button 
            onClick={fetchHealth} 
            disabled={loading}
            className="w-full"
          >
            🔍 Refresh Health
          </Button>
          
          <Button 
            onClick={runDoctor} 
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            🏥 Run Doctor
          </Button>
          
          <Button 
            onClick={runTests} 
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            🧪 Run Tests
          </Button>
        </div>

        {loading && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Running diagnostics...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-red-800">
                <strong>Error:</strong> {error}
              </div>
            </CardContent>
          </Card>
        )}

        {healthData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Environment Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  🌍 Environment
                  {healthData.environment.missing.length === 0 ? (
                    <span className="ml-2 text-green-600">✅</span>
                  ) : (
                    <span className="ml-2 text-red-600">❌</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <strong>Present:</strong>
                    <ul className="ml-4 text-sm text-gray-600">
                      {healthData.environment.present.map(env => (
                        <li key={env}>✅ {env}</li>
                      ))}
                    </ul>
                  </div>
                  {healthData.environment.missing.length > 0 && (
                    <div>
                      <strong className="text-red-600">Missing:</strong>
                      <ul className="ml-4 text-sm text-red-600">
                        {healthData.environment.missing.map(env => (
                          <li key={env}>❌ {env}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Database Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  🗄️ Database
                  {healthData.database.status === 'ok' ? (
                    <span className="ml-2 text-green-600">✅</span>
                  ) : (
                    <span className="ml-2 text-red-600">❌</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    Status: <span className={healthData.database.status === 'ok' ? 'text-green-600' : 'text-red-600'}>
                      {healthData.database.status.toUpperCase()}
                    </span>
                  </div>
                  {healthData.database.error && (
                    <div className="text-sm text-red-600">
                      Error: {healthData.database.error}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Audio Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  🎵 Audio System
                  {healthData.audio.breathwork === 'ok' ? (
                    <span className="ml-2 text-green-600">✅</span>
                  ) : (
                    <span className="ml-2 text-red-600">❌</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    Breathwork Audio: <span className={healthData.audio.breathwork === 'ok' ? 'text-green-600' : 'text-red-600'}>
                      {healthData.audio.breathwork.toUpperCase()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* TTS Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  🔊 TTS System
                  {healthData.tts.status === 'ok' ? (
                    <span className="ml-2 text-green-600">✅</span>
                  ) : (
                    <span className="ml-2 text-red-600">❌</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    Status: <span className={healthData.tts.status === 'ok' ? 'text-green-600' : 'text-red-600'}>
                      {healthData.tts.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Client Errors */}
        {clientErrors.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                🚨 Client Errors ({clientErrors.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {clientErrors.map((error, index) => (
                  <div key={index} className="p-3 bg-red-50 border border-red-200 rounded">
                    <div className="text-sm text-red-800">
                      <strong>{error.type}</strong> - {error.error}
                    </div>
                    <div className="text-xs text-red-600 mt-1">
                      {error.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          Last updated: {healthData?.timestamp ? new Date(healthData.timestamp).toLocaleString() : 'Never'}
        </div>
      </div>
    </div>
  );
}
