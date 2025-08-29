'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Settings, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { SelfTestResult } from '@/lib/widget-integrity';

interface ConformanceMatrixProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function ConformanceMatrix({ isVisible, onClose }: ConformanceMatrixProps) {
  const [results, setResults] = useState<SelfTestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const loadResults = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/widget-integrity');
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
      }
    } catch (error) {
      console.error('Error loading conformance results:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      loadResults();
    }
  }, [isVisible]);

  const getStatusIcon = (ok: boolean, hasFixes: boolean) => {
    if (ok && !hasFixes) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (ok && hasFixes) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusText = (ok: boolean, hasFixes: boolean) => {
    if (ok && !hasFixes) return 'PASS';
    if (ok && hasFixes) return 'FIXED';
    return 'FAIL';
  };

  const getStatusColor = (ok: boolean, hasFixes: boolean) => {
    if (ok && !hasFixes) return 'bg-green-100 text-green-800';
    if (ok && hasFixes) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const totalFrameworks = results.length;
  const passedFrameworks = results.filter(r => r.ok).length;
  const failedFrameworks = results.filter(r => !r.ok).length;
  const totalWidgets = results.reduce((sum, r) => sum + r.summary.totalWidgets, 0);
  const passedWidgets = results.reduce((sum, r) => sum + r.summary.passedWidgets, 0);
  const failedWidgets = results.reduce((sum, r) => sum + r.summary.failedWidgets, 0);
  const totalFixes = results.reduce((sum, r) => sum + r.summary.totalFixes, 0);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Widget Conformance Matrix
              </CardTitle>
              <CardDescription>
                Framework × Widget integrity status and auto-fixes
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadResults}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalFrameworks}</div>
              <div className="text-sm text-gray-600">Frameworks</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{passedFrameworks}</div>
              <div className="text-sm text-gray-600">Passed</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{failedFrameworks}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{totalFixes}</div>
              <div className="text-sm text-gray-600">Auto-Fixes</div>
            </div>
          </div>

          {/* Framework Matrix */}
          <div className="space-y-4">
            {results.map((result) => (
              <Card key={result.frameworkSlug} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.ok, result.summary.totalFixes > 0)}
                      <div>
                        <h3 className="font-semibold">{result.frameworkName}</h3>
                        <p className="text-sm text-gray-600">{result.frameworkSlug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(result.ok, result.summary.totalFixes > 0)}>
                        {getStatusText(result.ok, result.summary.totalFixes > 0)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFramework(
                          selectedFramework === result.frameworkSlug ? null : result.frameworkSlug
                        )}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {selectedFramework === result.frameworkSlug && (
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Widget Details */}
                      <div>
                        <h4 className="font-medium mb-2">Widgets ({result.summary.totalWidgets})</h4>
                        <div className="space-y-2">
                          {result.widgetResults.map((widget) => (
                            <div
                              key={widget.widgetId}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded"
                            >
                              <div>
                                <div className="font-medium text-sm">{widget.widgetTitle}</div>
                                <div className="text-xs text-gray-600">{widget.widgetKind}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(widget.ok, widget.fixes.length > 0)}
                                <Badge 
                                  variant="outline" 
                                  className={getStatusColor(widget.ok, widget.fixes.length > 0)}
                                >
                                  {getStatusText(widget.ok, widget.fixes.length > 0)}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Fixes and Warnings */}
                      <div>
                        <h4 className="font-medium mb-2">Issues & Fixes</h4>
                        <div className="space-y-2">
                          {result.widgetResults.flatMap(widget => 
                            [...widget.fixes, ...widget.warnings, ...widget.errors].map((issue, index) => (
                              <div key={`${widget.widgetId}-${index}`} className="text-sm p-2 bg-gray-50 rounded">
                                <div className="font-medium text-xs text-gray-600">
                                  {widget.widgetTitle} ({widget.widgetKind})
                                </div>
                                <div className="text-xs">{issue}</div>
                              </div>
                            ))
                          )}
                          {result.widgetResults.every(w => w.fixes.length === 0 && w.warnings.length === 0 && w.errors.length === 0) && (
                            <div className="text-sm text-gray-500 italic">No issues found</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* KPIs and Virtue Grants */}
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium mb-2">Widget Capabilities</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium text-gray-600 mb-1">KPIs Tracked</h5>
                          <div className="flex flex-wrap gap-1">
                            {Array.from(new Set(result.widgetResults.flatMap(w => w.kpis))).map(kpi => (
                              <Badge key={kpi} variant="secondary" className="text-xs">
                                {kpi}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-600 mb-1">Virtue Grants</h5>
                          <div className="flex flex-wrap gap-1">
                            {Array.from(new Set(
                              result.widgetResults.flatMap(w => 
                                Object.keys(w.virtueGrants)
                              )
                            )).map(virtue => (
                              <Badge key={virtue} variant="outline" className="text-xs">
                                {virtue}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Overall Status */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Overall Status</h3>
                <p className="text-sm text-gray-600">
                  {passedWidgets}/{totalWidgets} widgets pass validation
                </p>
              </div>
              <div className="text-right">
                {failedFrameworks === 0 ? (
                  <div className="text-green-600 font-medium">✅ All frameworks pass</div>
                ) : (
                  <div className="text-red-600 font-medium">⚠️ {failedFrameworks} frameworks need attention</div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </div>
  );
} 