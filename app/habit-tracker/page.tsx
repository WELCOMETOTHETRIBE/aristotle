'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Plus, CheckCircle, Calendar, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Habit {
  id: string;
  name: string;
  frequency: string;
  streak: number;
  lastCheckIn: string | null;
  createdAt: string;
}

export default function HabitTrackerPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState({ name: '', frequency: 'daily' });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  const saveHabits = (newHabits: Habit[]) => {
    setHabits(newHabits);
    localStorage.setItem('habits', JSON.stringify(newHabits));
  };

  const addHabit = () => {
    if (!newHabit.name.trim()) return;
    
    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.name,
      frequency: newHabit.frequency,
      streak: 0,
      lastCheckIn: null,
      createdAt: new Date().toISOString(),
    };
    
    saveHabits([...habits, habit]);
    setNewHabit({ name: '', frequency: 'daily' });
    setShowAddForm(false);
  };

  const checkInHabit = (id: string) => {
    const today = new Date().toDateString();
    const updatedHabits = habits.map(habit => {
      if (habit.id === id) {
        const lastCheckInDate = habit.lastCheckIn ? new Date(habit.lastCheckIn).toDateString() : null;
        const isConsecutive = lastCheckInDate === new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
        
        return {
          ...habit,
          streak: isConsecutive ? habit.streak + 1 : 1,
          lastCheckIn: new Date().toISOString(),
        };
      }
      return habit;
    });
    saveHabits(updatedHabits);
  };

  const deleteHabit = (id: string) => {
    saveHabits(habits.filter(habit => habit.id !== id));
  };

  const totalStreak = habits.reduce((sum, habit) => sum + habit.streak, 0);
  const activeHabits = habits.filter(habit => habit.lastCheckIn);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl font-bold text-white mb-4 font-display">
                Habit Tracker
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Build consistency and track your daily habits
              </p>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">{habits.length}</div>
                <div className="text-gray-300">Total Habits</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">{activeHabits.length}</div>
                <div className="text-gray-300">Active Today</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">{totalStreak}</div>
                <div className="text-gray-300">Total Streak</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {habits.length > 0 ? Math.round((activeHabits.length / habits.length) * 100) : 0}%
                </div>
                <div className="text-gray-300">Completion Rate</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Add Habit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Habit
            </Button>
          </motion.div>

          {/* Add Habit Form */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Add New Habit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <input
                    type="text"
                    placeholder="Habit name"
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  />
                  <select
                    value={newHabit.frequency}
                    onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <div className="flex gap-2">
                    <Button onClick={addHabit} className="bg-green-600 hover:bg-green-700">
                      Add Habit
                    </Button>
                    <Button
                      onClick={() => setShowAddForm(false)}
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Habits Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {habits.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 col-span-full">
                <CardContent className="p-12 text-center">
                  <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No habits yet</h3>
                  <p className="text-gray-400">Start building positive habits by adding your first one</p>
                </CardContent>
              </Card>
            ) : (
              habits.map((habit) => {
                const today = new Date().toDateString();
                const lastCheckInDate = habit.lastCheckIn ? new Date(habit.lastCheckIn).toDateString() : null;
                const isCheckedInToday = lastCheckInDate === today;

                return (
                  <Card key={habit.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">{habit.name}</CardTitle>
                        <button
                          onClick={() => deleteHabit(habit.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      </div>
                      <div className="text-sm text-gray-400">{habit.frequency}</div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Current Streak</span>
                          <span className="text-2xl font-bold text-white">{habit.streak}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Status</span>
                          <div className="flex items-center gap-2">
                            {isCheckedInToday ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : (
                              <div className="w-5 h-5 border-2 border-gray-400 rounded-full" />
                            )}
                            <span className={isCheckedInToday ? 'text-green-400' : 'text-gray-400'}>
                              {isCheckedInToday ? 'Done' : 'Pending'}
                            </span>
                          </div>
                        </div>

                        {!isCheckedInToday && (
                          <Button
                            onClick={() => checkInHabit(habit.id)}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Check In
                          </Button>
                        )}

                        {habit.lastCheckIn && (
                          <div className="text-xs text-gray-400">
                            Last check-in: {new Date(habit.lastCheckIn).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
} 