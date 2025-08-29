'use client';

import { useState } from 'react';
import { AlertTriangle, Settings, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { QuarantineCard as QuarantineCardType, WidgetConfig } from '@/lib/widget-integrity';

interface QuarantineCardProps {
  quarantineData: QuarantineCardType;
  onUseSafeDefaults: (widget: WidgetConfig) => void;
  onRetry: () => void;
}

export default function QuarantineCard({ quarantineData, onUseSafeDefaults, onRetry }: QuarantineCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card className="border-2 border-red-200 bg-red-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-red-800">{quarantineData.title}</CardTitle>
              <CardDescription className="text-red-600">
                Widget configuration issue detected
              </CardDescription>
            </div>
          </div>
          <Badge variant="destructive">QUARANTINED</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Error Message */}
        <div className="p-3 bg-red-100 rounded-lg border border-red-200">
          <div className="flex items-start gap-2">
            <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-red-800 mb-1">Configuration Error</div>
              <div className="text-sm text-red-700">{quarantineData.error}</div>
            </div>
          </div>
        </div>

        {/* Suggested Fixes */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-4 w-4 text-gray-600" />
            <h4 className="font-medium text-gray-800">Suggested Fixes</h4>
          </div>
          <ul className="space-y-1">
            {quarantineData.suggestedFixes.map((fix, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                {fix}
              </li>
            ))}
          </ul>
        </div>

        {/* Safe Defaults Preview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-800">Safe Default Configuration</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
          </div>
          
          {showDetails && (
            <div className="p-3 bg-gray-100 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-700 mb-1">Widget Info</div>
                  <div className="space-y-1 text-gray-600">
                    <div>Type: <Badge variant="outline" className="text-xs">{quarantineData.safeDefaults.kind}</Badge></div>
                    <div>Title: {quarantineData.safeDefaults.title}</div>
                    <div>Teaching: {quarantineData.safeDefaults.teaching}</div>
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-700 mb-1">Capabilities</div>
                  <div className="space-y-1 text-gray-600">
                    <div>KPIs: {quarantineData.safeDefaults.kpis?.join(', ')}</div>
                    <div>Virtues: {Object.entries(quarantineData.safeDefaults.virtueGrantPerCompletion)
                      .map(([virtue, amount]) => `${virtue} +${amount}`).join(', ')}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={() => onUseSafeDefaults(quarantineData.safeDefaults)}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Use Safe Defaults
          </Button>
          <Button
            variant="outline"
            onClick={onRetry}
            className="flex-1"
          >
            <Settings className="h-4 w-4 mr-2" />
            Retry Validation
          </Button>
        </div>

        {/* Warning */}
        <div className="text-xs text-gray-500 text-center">
          This widget has been quarantined due to configuration issues. 
          Using safe defaults will allow you to continue your practice.
        </div>
      </CardContent>
    </Card>
  );
} 