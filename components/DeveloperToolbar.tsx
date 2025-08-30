'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Settings, Activity, BarChart3, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import IntegrityDashboard from './IntegrityDashboard';

export default function DeveloperToolbar() {
  const [showIntegrityDashboard, setShowIntegrityDashboard] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);
  const pathname = usePathname();

  // Check if dev mode is active and not on auth page
  useEffect(() => {
    const checkDevMode = () => {
      const authenticated = sessionStorage.getItem('devAuthenticated') === 'true';
      setIsDevMode(authenticated);
    };

    checkDevMode();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      checkDevMode();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Don't show on auth page or if not in dev mode
  if (pathname === '/auth' || !isDevMode) {
    return null;
  }

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

      <IntegrityDashboard
        isVisible={showIntegrityDashboard}
        onClose={() => setShowIntegrityDashboard(false)}
      />


    </>
  );
} 