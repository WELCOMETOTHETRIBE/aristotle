'use client';

import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { integrityEvents, type IntegrityEvent } from '@/lib/widget-integrity';

interface IntegrityDashboardProps {
  isVisible: boolean;
  onClose: () => void;
}

interface EventStats {
  total: number;
  byType: Record<string, number>;
  byFramework: Record<string, number>;
  byWidgetKind: Record<string, number>;
  recentEvents: IntegrityEvent[];
}

export default function IntegrityDashboard({ isVisible, onClose }: IntegrityDashboardProps) {
  const [stats, setStats] = useState<EventStats>({
    total: 0,
    byType: {},
    byFramework: {},
    byWidgetKind: {},
    recentEvents: []
  });

  useEffect(() => {
    if (isVisible) {
      calculateStats();
    }
  }, [isVisible, integrityEvents]);

  const calculateStats = () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    const recentEvents = integrityEvents.filter(event => event.timestamp > oneHourAgo);
    
    const byType: Record<string, number> = {};
    const byFramework: Record<string, number> = {};
    const byWidgetKind: Record<string, number> = {};
    
    integrityEvents.forEach(event => {
      // Count by type
      byType[event.type] = (byType[event.type] || 0) + 1;
      
      // Count by framework
      if (event.frameworkSlug) {
        byFramework[event.frameworkSlug] = (byFramework[event.frameworkSlug] || 0) + 1;
      }
      
      // Count by widget kind
      byWidgetKind[event.widgetKind] = (byWidgetKind[event.widgetKind] || 0) + 1;
    });
    
    setStats({
      total: integrityEvents.length,
      byType,
      byFramework,
      byWidgetKind,
      recentEvents
    });
  };

  const getQuarantineRate = () => {
    const quarantined = stats.byType['widget_quarantined'] || 0;
    const validated = stats.byType['widget_validated'] || 0;
    const total = quarantined + validated;
    return total > 0 ? (quarantined / total) * 100 : 0;
  };

  const getKpiComplianceRate = () => {
    const checkins = stats.byType['checkin_posted'] || 0;
    const missingKpis = stats.byType['kpi_missing'] || 0;
    const total = checkins + missingKpis;
    return total > 0 ? ((checkins - missingKpis) / total) * 100 : 100;
  };

  const getVirtueComplianceRate = () => {
    const checkins = stats.byType['checkin_posted'] || 0;
    const missingVirtues = stats.byType['virtue_missing'] || 0;
    const total = checkins + missingVirtues;
    return total > 0 ? ((checkins - missingVirtues) / total) * 100 : 100;
  };

  const quarantineRate = getQuarantineRate();
  const kpiComplianceRate = getKpiComplianceRate();
  const virtueComplianceRate = getVirtueComplianceRate();

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Widget Integrity Dashboard
              </CardTitle>
              <CardDescription>
                Real-time telemetry and health monitoring
              </CardDescription>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ✕
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Quarantine Rate</p>
                    <p className="text-2xl font-bold text-red-600">
                      {quarantineRate.toFixed(1)}%
                    </p>
                  </div>
                  <div className={`p-2 rounded-full ${
                    quarantineRate > 2 ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    {quarantineRate > 2 ? (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {quarantineRate > 2 ? 'Above threshold' : 'Healthy'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">KPI Compliance</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {kpiComplianceRate.toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-2 rounded-full bg-blue-100">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Check-ins with KPIs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Virtue Compliance</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {virtueComplianceRate.toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-2 rounded-full bg-purple-100">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Check-ins with virtues
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Events</p>
                    <p className="text-2xl font-bold text-gray-600">
                      {stats.total}
                    </p>
                  </div>
                  <div className="p-2 rounded-full bg-gray-100">
                    <Activity className="h-5 w-5 text-gray-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Last hour: {stats.recentEvents.length}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Event Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Event Types */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(stats.byType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Framework Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Framework Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(stats.byFramework)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([framework, count]) => (
                      <div key={framework} className="flex items-center justify-between">
                        <span className="font-medium capitalize">{framework}</span>
                        <span className="text-gray-600">{count}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Events (Last Hour)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-auto">
                {stats.recentEvents.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No recent events</p>
                ) : (
                  stats.recentEvents.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          {event.type}
                        </Badge>
                        <span className="text-sm font-medium">{event.frameworkSlug}</span>
                        <span className="text-sm text-gray-600">{event.widgetId}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {event.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          {(quarantineRate > 2 || kpiComplianceRate < 95 || virtueComplianceRate < 95) && (
            <Card className="mt-6 border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Integrity Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quarantineRate > 2 && (
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Quarantine rate ({quarantineRate.toFixed(1)}%) exceeds 2% threshold</span>
                    </div>
                  )}
                  {kpiComplianceRate < 95 && (
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertTriangle className="h-4 w-4" />
                      <span>KPI compliance ({kpiComplianceRate.toFixed(1)}%) below 95% target</span>
                    </div>
                  )}
                  {virtueComplianceRate < 95 && (
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Virtue compliance ({virtueComplianceRate.toFixed(1)}%) below 95% target</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </div>
    </div>
  );
} 