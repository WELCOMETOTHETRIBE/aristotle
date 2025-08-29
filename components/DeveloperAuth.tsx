'use client';

import { useState, useEffect } from 'react';
import { Lock, Unlock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeveloperAuthProps {
  children: React.ReactNode;
}

export default function DeveloperAuth({ children }: DeveloperAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuthenticate = () => {
    if (password === '2026') {
      setIsAuthenticated(true);
      setShowPasswordModal(false);
      setPassword('');
      setError('');
      // Store in session storage so it persists during the session
      sessionStorage.setItem('devAuthenticated', 'true');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('devAuthenticated');
  };

  // Check if already authenticated in this session
  useEffect(() => {
    const authenticated = sessionStorage.getItem('devAuthenticated') === 'true';
    if (authenticated) {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <>
        {/* Developer Auth Button */}
        <div className="fixed bottom-4 left-4 z-50">
          <Button
            onClick={() => setShowPasswordModal(true)}
            variant="outline"
            size="sm"
            className="bg-black/20 backdrop-blur border-white/20 text-white hover:bg-black/30"
          >
            <Lock className="h-4 w-4 mr-2" />
            Dev
          </Button>
        </div>

        {/* Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Developer Access</h3>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPassword('');
                    setError('');
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAuthenticate()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter developer password"
                    autoFocus
                  />
                </div>
                
                {error && (
                  <p className="text-red-600 text-sm">{error}</p>
                )}
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleAuthenticate}
                    className="flex-1"
                  >
                    Authenticate
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPassword('');
                      setError('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {/* Developer Logout Button */}
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="bg-green-500/20 backdrop-blur border-green-500/30 text-green-400 hover:bg-green-500/30"
        >
          <Unlock className="h-4 w-4 mr-2" />
          Dev
        </Button>
      </div>

      {/* Developer Tools */}
      {children}
    </>
  );
} 