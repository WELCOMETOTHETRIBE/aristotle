'use client';

import React, { useState, useEffect } from 'react';
import { useLyceum } from '@/lib/lyceum-context';
import { LyceumDailyCheckin } from '@prisma/client';

interface DailyCheckinData {
  telos: string;
  reflection: string;
  gratitude: string;
  challenges: string;
  insights: string;
  mood: number;
  energy: number;
  focus: number;
}

export default function LyceumDailyCheckin() {
  const { userProgress } = useLyceum();
  const [checkin, setCheckin] = useState<LyceumDailyCheckin | null>(null);
  const [streak, setStreak] = useState(0);
  const [recentCheckins, setRecentCheckins] = useState<LyceumDailyCheckin[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<DailyCheckinData>({
    telos: '',
    reflection: '',
    gratitude: '',
    challenges: '',
    insights: '',
    mood: 3,
    energy: 3,
    focus: 3
  });

  useEffect(() => {
    loadCheckin();
  }, []);

  const loadCheckin = async () => {
    try {
      const response = await fetch('/api/lyceum/daily-checkin');
      const data = await response.json();
      
      if (data.success) {
        setCheckin(data.checkin);
        setStreak(data.streak);
        setRecentCheckins(data.recentCheckins);
        
        if (data.checkin) {
          setFormData({
            telos: data.checkin.telos || '',
            reflection: data.checkin.reflection || '',
            gratitude: data.checkin.gratitude || '',
            challenges: data.checkin.challenges || '',
            insights: data.checkin.insights || '',
            mood: data.checkin.mood || 3,
            energy: data.checkin.energy || 3,
            focus: data.checkin.focus || 3
          });
        }
      }
    } catch (error) {
      console.error('Error loading check-in:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = checkin ? 'PUT' : 'POST';
      const url = checkin ? '/api/lyceum/daily-checkin' : '/api/lyceum/daily-checkin';
      const body = checkin ? { id: checkin.id, ...formData } : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      
      if (data.success) {
        setCheckin(data.checkin);
        await loadCheckin(); // Reload to get updated streak
      }
    } catch (error) {
      console.error('Error saving check-in:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof DailyCheckinData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getMoodEmoji = (mood: number) => {
    const emojis = ['😞', '😐', '🙂', '😊', '😄'];
    return emojis[mood - 1] || '😐';
  };

  const getEnergyEmoji = (energy: number) => {
    const emojis = ['🔋', '🔋', '🔋', '🔋', '🔋'];
    return emojis[energy - 1] || '🔋';
  };

  const getFocusEmoji = (focus: number) => {
    const emojis = ['🎯', '🎯', '🎯', '🎯', '🎯'];
    return emojis[focus - 1] || '🎯';
  };

  const getMoodLabel = (mood: number) => {
    const labels = ['Very Low', 'Low', 'Neutral', 'Good', 'Excellent'];
    return labels[mood - 1] || 'Neutral';
  };

  const getEnergyLabel = (energy: number) => {
    const labels = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
    return labels[energy - 1] || 'Medium';
  };

  const getFocusLabel = (focus: number) => {
    const labels = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
    return labels[focus - 1] || 'Medium';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          Loading your daily check-in...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Check-in</h1>
        <p className="text-gray-600">
          Reflect on your day and track your progress toward your telos
        </p>
      </div>

      {/* Streak Display */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Current Streak</h2>
            <p className="text-3xl font-bold text-blue-600">{streak} days</p>
          </div>
          <div className="text-4xl">🔥</div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Keep your daily reflection habit going!
        </p>
      </div>

      {/* Recent Check-ins */}
      {recentCheckins.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Check-ins</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentCheckins.map((recentCheckin, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(recentCheckin.date).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-1">
                    <span title={`Mood: ${getMoodLabel(recentCheckin.mood)}`}>
                      {getMoodEmoji(recentCheckin.mood)}
                    </span>
                    <span title={`Energy: ${getEnergyLabel(recentCheckin.energy)}`}>
                      {getEnergyEmoji(recentCheckin.energy)}
                    </span>
                    <span title={`Focus: ${getFocusLabel(recentCheckin.focus)}`}>
                      {getFocusEmoji(recentCheckin.focus)}
                    </span>
                  </div>
                </div>
                {recentCheckin.telos && (
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Telos:</span> {recentCheckin.telos}
                  </p>
                )}
                {recentCheckin.reflection && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {recentCheckin.reflection}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Check-in Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {checkin ? 'Update Today\'s Check-in' : 'Today\'s Check-in'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Telos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What is your telos (purpose/goal) for today?
            </label>
            <input
              type="text"
              value={formData.telos}
              onChange={(e) => handleInputChange('telos', e.target.value)}
              placeholder="e.g., Practice patience with my family"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Mood, Energy, Focus */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mood
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.mood}
                  onChange={(e) => handleInputChange('mood', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-2xl">{getMoodEmoji(formData.mood)}</span>
                <span className="text-sm text-gray-600 w-20">
                  {getMoodLabel(formData.mood)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Energy
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.energy}
                  onChange={(e) => handleInputChange('energy', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-2xl">{getEnergyEmoji(formData.energy)}</span>
                <span className="text-sm text-gray-600 w-20">
                  {getEnergyLabel(formData.energy)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Focus
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.focus}
                  onChange={(e) => handleInputChange('focus', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-2xl">{getFocusEmoji(formData.focus)}</span>
                <span className="text-sm text-gray-600 w-20">
                  {getFocusLabel(formData.focus)}
                </span>
              </div>
            </div>
          </div>

          {/* Reflection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How did your day go? What did you learn?
            </label>
            <textarea
              value={formData.reflection}
              onChange={(e) => handleInputChange('reflection', e.target.value)}
              placeholder="Reflect on your day, what went well, what could be improved..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Gratitude */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What are you grateful for today?
            </label>
            <textarea
              value={formData.gratitude}
              onChange={(e) => handleInputChange('gratitude', e.target.value)}
              placeholder="List three things you're grateful for..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Challenges */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What challenges did you face today?
            </label>
            <textarea
              value={formData.challenges}
              onChange={(e) => handleInputChange('challenges', e.target.value)}
              placeholder="Describe any challenges and how you handled them..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Insights */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What insights did you gain today?
            </label>
            <textarea
              value={formData.insights}
              onChange={(e) => handleInputChange('insights', e.target.value)}
              placeholder="Any new realizations or wisdom gained..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : (checkin ? 'Update Check-in' : 'Save Check-in')}
            </button>
          </div>
        </form>
      </div>

      {/* AI Coaching */}
      {checkin && checkin.aiCoaching && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">AI Coaching</h3>
          <p className="text-blue-800 whitespace-pre-wrap">{checkin.aiCoaching}</p>
        </div>
      )}

      {/* AI Insights */}
      {checkin && checkin.aiInsights && (
        <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-3">AI Insights</h3>
          <p className="text-purple-800 whitespace-pre-wrap">{checkin.aiInsights}</p>
        </div>
      )}
    </div>
  );
}