'use client';

import { useState } from 'react';
import { Settings, Activity, BarChart3, TestTube, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ConformanceMatrix from './ConformanceMatrix';
import IntegrityDashboard from './IntegrityDashboard';

export default function DeveloperToolbar() {
  const [showConformanceMatrix, setShowConformanceMatrix] = useState(false);
  const [showIntegrityDashboard, setShowIntegrityDashboard] = useState(false);

  // No environment check needed - controlled by DeveloperAuth component

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40">
        <div className="bg-white rounded-lg shadow-lg border p-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              DEV
            </Badge>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConformanceMatrix(true)}
              className="flex items-center gap-1"
            >
              <TestTube className="h-3 w-3" />
              Test
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowIntegrityDashboard(true)}
              className="flex items-center gap-1"
            >
              <Activity className="h-3 w-3" />
              Monitor
            </Button>
            

            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Run quick self-test
                fetch('/api/debug/widget-integrity?format=pretty')
                  .then(response => response.text())
                  .then(result => {
                    console.log('Widget Integrity Test Results:');
                    console.log(result);
                  })
                  .catch(error => {
                    console.error('Error running integrity test:', error);
                  });
              }}
              className="flex items-center gap-1"
            >
              <Bug className="h-3 w-3" />
              Quick
            </Button>
          </div>
        </div>
      </div>

      <ConformanceMatrix
        isVisible={showConformanceMatrix}
        onClose={() => setShowConformanceMatrix(false)}
      />

      <IntegrityDashboard
        isVisible={showIntegrityDashboard}
        onClose={() => setShowIntegrityDashboard(false)}
      />


    </>
  );
} 