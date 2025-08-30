'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { analyzeHedonicPatterns, HEDONIC_SIGNALS } from '../lib/hedonic';

interface HedonicAwarenessWidgetProps {
  frameworkTone?: string;
}

export function HedonicAwarenessWidget({ frameworkTone = "stoic" }: HedonicAwarenessWidgetProps) {
  const [hedonicScore, setHedonicScore] = useState(50);
  const [userInput, setUserInput] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [showTriggers, setShowTriggers] = useState(false);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [dailyLog, setDailyLog] = useState<Array<{date: string, score: number, triggers: string[]}>>([]);

  useEffect(() => {
    // Load saved data from localStorage
    const savedLog = localStorage.getItem('hedonicDailyLog');
    if (savedLog) {
      setDailyLog(JSON.parse(savedLog));
    }
  }, []);

  const analyzeInput = () => {
    if (!userInput.trim()) return;
    
    const result = analyzeHedonicPatterns(userInput);
    setAnalysis(result);
    setHedonicScore(result.score);
    setSelectedTriggers(result.triggers);
  };

  const logDailyEntry = () => {
    if (!analysis) return;
    
    const today = new Date().toISOString().split('T')[0];
    const newEntry = {
      date: today,
      score: analysis.score,
      triggers: analysis.triggers
    };
    
    const updatedLog = [...dailyLog.filter(entry => entry.date !== today), newEntry];
    setDailyLog(updatedLog);
    localStorage.setItem('hedonicDailyLog', JSON.stringify(updatedLog));
    
    // Clear input
    setUserInput('');
    setAnalysis(null);
  };

  const getHedonicColor = (score: number) => {
    if (score <= 30) return 'text-green-400';
    if (score <= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getHedonicLabel = (score: number) => {
    if (score <= 30) return 'Low Risk';
    if (score <= 70) return 'Moderate Risk';
    return 'High Risk';
  };

  const getHedonicBgColor = (score: number) => {
    if (score <= 30) return 'bg-green-500';
    if (score <= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getWeeklyTrend = () => {
    if (dailyLog.length < 2) return 'neutral';
    const recent = dailyLog.slice(-7);
    const avg = recent.reduce((sum, entry) => sum + entry.score, 0) / recent.length;
    const current = hedonicScore;
    if (current < avg - 10) return 'improving';
    if (current > avg + 10) return 'worsening';
    return 'stable';
  };

  const trend = getWeeklyTrend();

  return (
    <motion.div 
      className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div 
            className="p-3 rounded-xl bg-purple-500/20"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className="w-6 h-6 text-purple-400" />
          </motion.div>
          <div>
            <h3 className="font-bold text-white text-lg">Hedonic Awareness</h3>
            <p className="text-sm text-gray-400">Monitor patterns & triggers</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getHedonicColor(hedonicScore)}`}>{hedonicScore}</div>
          <div className="text-xs text-gray-400">Risk Score</div>
        </div>
      </div>

      {/* Current Score Display */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>Current Risk Level</span>
          <div className="flex items-center gap-2">
            {trend === 'improving' && <TrendingDown className="w-3 h-3 text-green-400" />}
            {trend === 'worsening' && <TrendingUp className="w-3 h-3 text-red-400" />}
            {trend === 'stable' && <Activity className="w-3 h-3 text-gray-400" />}
            <span>{getHedonicLabel(hedonicScore)}</span>
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <motion.div 
            className={`h-3 rounded-full ${getHedonicBgColor(hedonicScore)}`}
            initial={{ width: 0 }}
            animate={{ width: `${hedonicScore}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>

      {/* Interactive Input */}
      <div className="mb-6">
        <div className="text-sm text-white mb-3">Analyze your thoughts or activities:</div>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Describe what you've been thinking about or doing today..."
          className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 resize-none"
          rows={3}
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={analyzeInput}
            disabled={!userInput.trim()}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 text-white rounded-lg transition-colors text-sm"
          >
            Analyze
          </button>
          <button
            onClick={() => setUserInput('')}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <motion.div 
          className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-3">
            {analysis.riskLevel === 'high' ? (
              <AlertTriangle className="w-5 h-5 text-red-400" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-400" />
            )}
            <span className="text-white font-medium">
              {analysis.riskLevel === 'high' ? 'High Risk Detected' : 'Low Risk'}
            </span>
          </div>
          
          {analysis.triggers.length > 0 && (
            <div className="mb-3">
              <div className="text-sm text-gray-400 mb-2">Detected Triggers:</div>
              <div className="flex flex-wrap gap-2">
                {analysis.triggers.map((trigger: string) => (
                  <span key={trigger} className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded">
                    {trigger}
                  </span>
                ))}
              </div>
            </div>
          )}

          {analysis.counterMoves.length > 0 && (
            <div className="mb-3">
              <div className="text-sm text-gray-400 mb-2">Suggested Counter-Moves:</div>
              <div className="flex flex-wrap gap-2">
                {analysis.counterMoves.map((move: string) => (
                  <span key={move} className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
                    {move}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={logDailyEntry}
            className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm"
          >
            Log Today's Entry
          </button>
        </motion.div>
      )}

      {/* Trigger Selection */}
      <div className="mb-6">
        <button
          onClick={() => setShowTriggers(!showTriggers)}
          className="text-sm text-purple-300 hover:text-purple-200 underline"
        >
          {showTriggers ? 'Hide' : 'Show'} Common Triggers
        </button>
        
        {showTriggers && (
          <motion.div 
            className="mt-3 p-3 bg-white/5 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <div className="text-xs text-gray-400 mb-2">Select triggers you're experiencing:</div>
            <div className="grid grid-cols-2 gap-2">
              {HEDONIC_SIGNALS.negative.map((trigger) => (
                <button
                  key={trigger}
                  onClick={() => {
                    if (selectedTriggers.includes(trigger)) {
                      setSelectedTriggers(selectedTriggers.filter(t => t !== trigger));
                    } else {
                      setSelectedTriggers([...selectedTriggers, trigger]);
                    }
                  }}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    selectedTriggers.includes(trigger)
                      ? 'bg-red-500/30 text-red-300 border border-red-500/50'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {trigger}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Weekly Trend */}
      {dailyLog.length > 0 && (
        <div className="p-3 bg-white/5 rounded-lg">
          <div className="text-sm text-gray-400 mb-2">Weekly Trend</div>
          <div className="flex items-center gap-2">
            {trend === 'improving' && (
              <>
                <TrendingDown className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm">Improving</span>
              </>
            )}
            {trend === 'worsening' && (
              <>
                <TrendingUp className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-sm">Needs Attention</span>
              </>
            )}
            {trend === 'stable' && (
              <>
                <Activity className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm">Stable</span>
              </>
            )}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {dailyLog.length} day{dailyLog.length !== 1 ? 's' : ''} tracked
          </div>
        </div>
      )}
    </motion.div>
  );
} 