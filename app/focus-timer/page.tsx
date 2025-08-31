'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, Play, Pause, RotateCcw, Target, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FocusTimerPage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (!isBreak) {
        setSessions((prev) => prev + 1);
        setTimeLeft(5 * 60); // 5 minute break
        setIsBreak(true);
      } else {
        setTimeLeft(25 * 60); // Back to work
        setIsBreak(false);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
    setIsBreak(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl font-bold text-white mb-4 font-display">
                Focus Timer
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Deep work sessions to build concentration and productivity
              </p>
            </motion.div>
          </div>

          {/* Timer Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-12">
                <div className="text-center">
                  <div className="mb-8">
                    <div className={`text-8xl font-bold mb-4 ${
                      isBreak ? 'text-green-400' : 'text-blue-400'
                    }`}>
                      {formatTime(timeLeft)}
                    </div>
                    <div className="text-xl text-gray-300 mb-6">
                      {isBreak ? 'Break Time' : 'Focus Time'}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-4 mb-8">
                    {!isRunning ? (
                      <Button
                        onClick={startTimer}
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Start
                      </Button>
                    ) : (
                      <Button
                        onClick={pauseTimer}
                        size="lg"
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10 px-8 py-3"
                      >
                        <Pause className="w-5 h-5 mr-2" />
                        Pause
                      </Button>
                    )}
                    <Button
                      onClick={resetTimer}
                      size="lg"
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 px-8 py-3"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Reset
                    </Button>
                  </div>

                  {/* Session Counter */}
                  <div className="flex items-center justify-center gap-2 text-gray-300">
                    <Target className="w-5 h-5" />
                    <span>Sessions completed: {sessions}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Focus Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-300">
                  <li>• Eliminate distractions</li>
                  <li>• Set clear goals for each session</li>
                  <li>• Take breaks to maintain energy</li>
                  <li>• Track your progress</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Break Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-300">
                  <li>• Stretch and move around</li>
                  <li>• Hydrate and snack mindfully</li>
                  <li>• Practice deep breathing</li>
                  <li>• Plan your next session</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 