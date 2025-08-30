'use client';

import { useState, useEffect } from 'react';
import { TestTube, CheckCircle, XCircle, AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

interface TestResult {
  framework: string;
  status: 'pass' | 'fail' | 'warning';
  widgets: Array<{
    id: string;
    status: 'pass' | 'fail' | 'warning';
    issues: string[];
    fixes: string[];
  }>;
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  };
}

export default function ConformanceMatrixPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const runTest = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/widget-integrity?format=json');
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
        setLastUpdated(new Date().toLocaleString());
      }
    } catch (error) {
      console.error('Error running conformance test:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runTest();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'fail': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-green-400';
      case 'fail': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-500/10 border-green-500/30';
      case 'fail': return 'bg-red-500/10 border-red-500/30';
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/30';
      default: return 'bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <PageLayout title="Widget Conformance Matrix" description="Test and validate widget configurations across all frameworks">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Widget Conformance Matrix</h1>
            <p className="text-gray-300">
              Validating widget configurations and integrity across all frameworks
            </p>
            {lastUpdated && (
              <p className="text-sm text-gray-400 mt-1">
                Last updated: {lastUpdated}
              </p>
            )}
          </div>
          
          <button
            onClick={runTest}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Running Test...
              </>
            ) : (
              <>
                <TestTube className="w-4 h-4" />
                Run Test
              </>
            )}
          </button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">Running conformance tests...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <TestTube className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No test results available</p>
            </div>
          ) : (
            results.map((result) => (
              <div
                key={result.framework}
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
              >
                {/* Framework Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <h3 className="text-xl font-semibold text-white">{result.framework}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBg(result.status)} ${getStatusColor(result.status)}`}>
                      {result.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-400">
                    {result.summary.passed}/{result.summary.total} widgets passed
                  </div>
                </div>

                {/* Widget Details */}
                <div className="space-y-3">
                  {result.widgets.map((widget) => (
                    <div
                      key={widget.id}
                      className={`p-4 rounded-lg border ${getStatusBg(widget.status)}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(widget.status)}
                          <span className="font-medium text-white">{widget.id}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(widget.status)}`}>
                          {widget.status.toUpperCase()}
                        </span>
                      </div>
                      
                      {widget.issues.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-red-300 mb-1">Issues:</h4>
                          <ul className="text-sm text-red-200 space-y-1">
                            {widget.issues.map((issue, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-red-400 mt-1">•</span>
                                <span>{issue}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {widget.fixes.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-green-300 mb-1">Fixes Applied:</h4>
                          <ul className="text-sm text-green-200 space-y-1">
                            {widget.fixes.map((fix, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">•</span>
                                <span>{fix}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">{result.summary.passed} passed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <XCircle className="w-4 h-4 text-red-400" />
                      <span className="text-red-400">{result.summary.failed} failed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400">{result.summary.warnings} warnings</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Overall Summary */}
        {results.length > 0 && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Overall Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {results.filter(r => r.status === 'pass').length}
                </div>
                <div className="text-sm text-gray-400">Frameworks Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">
                  {results.filter(r => r.status === 'fail').length}
                </div>
                <div className="text-sm text-gray-400">Frameworks Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {results.filter(r => r.status === 'warning').length}
                </div>
                <div className="text-sm text-gray-400">Frameworks with Warnings</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
} 