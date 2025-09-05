'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  BookOpen,
  Heart,
  Brain,
  Zap,
  Shield,
  Users,
  Star,
  Award,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Target as TargetIcon,
  CheckSquare,
  Square,
  Plus,
  Minus,
  Edit,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Timer,
  Wind,
  Sun,
  Moon,
  Sparkles,
  Flame,
  Droplets,
  Mountain,
  TreePine,
  Waves,
  Leaf,
  Flower2,
  Bird,
  Fish,
  Bug,
  Butterfly,
  Rainbow,
  Cloud,
  CloudRain,
  Snowflake,
  Thermometer,
  Eye,
  Ear,
  Nose,
  Hand,
  Footprints,
  Heart as HeartIcon,
  Brain as BrainIcon,
  Zap as ZapIcon,
  Shield as ShieldIcon,
  Users as UsersIcon,
  Star as StarIcon,
  Award as AwardIcon,
  Activity as ActivityIcon,
  BarChart3 as BarChart3Icon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Target as TargetIcon2,
  CheckSquare as CheckSquareIcon,
  Square as SquareIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  Edit as EditIcon,
  Trash2 as Trash2Icon,
  Play as PlayIcon,
  Pause as PauseIcon,
  RotateCcw as RotateCcwIcon,
  Timer as TimerIcon,
  Wind as WindIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  Sparkles as SparklesIcon,
  Flame as FlameIcon,
  Droplets as DropletsIcon,
  Mountain as MountainIcon,
  TreePine as TreePineIcon,
  Waves as WavesIcon,
  Leaf as LeafIcon,
  Flower2 as Flower2Icon,
  Bird as BirdIcon,
  Fish as FishIcon,
  Bug as BugIcon,
  Butterfly as ButterflyIcon,
  Rainbow as RainbowIcon,
  Cloud as CloudIcon,
  CloudRain as CloudRainIcon,
  Snowflake as SnowflakeIcon,
  Thermometer as ThermometerIcon,
  Eye as EyeIcon,
  Ear as EarIcon,
  Nose as NoseIcon,
  Hand as HandIcon,
  Footprints as FootprintsIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// Virtue Progress Widget
function VirtueProgressWidget() {
  const [virtues, setVirtues] = useState([
    { name: 'Wisdom', progress: 75, color: 'bg-blue-500' },
    { name: 'Courage', progress: 60, color: 'bg-red-500' },
    { name: 'Justice', progress: 80, color: 'bg-green-500' },
    { name: 'Temperance', progress: 70, color: 'bg-purple-500' }
  ]);

  return (
    <Card className="bg-surface border border-border">
      <CardHeader>
        <CardTitle className="text-text flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Virtue Progress
        </CardTitle>
        <CardDescription className="text-muted">
          Your journey toward excellence
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {virtues.map((virtue, index) => (
          <div key={virtue.name} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-text">{virtue.name}</span>
              <span className="text-sm text-muted">{virtue.progress}%</span>
            </div>
            <Progress value={virtue.progress} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Wisdom Spotlight Widget
function WisdomSpotlightWidget() {
  const [wisdom, setWisdom] = useState({
    quote: "The unexamined life is not worth living.",
    author: "Socrates",
    framework: "Stoic"
  });

  return (
    <Card className="bg-surface border border-border">
      <CardHeader>
        <CardTitle className="text-text flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Daily Wisdom
        </CardTitle>
        <CardDescription className="text-muted">
          Ancient wisdom for modern life
        </CardDescription>
      </CardHeader>
      <CardContent>
        <blockquote className="text-lg italic text-text mb-4">
          "{wisdom.quote}"
        </blockquote>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted">— {wisdom.author}</span>
          <Badge variant="secondary" className="text-xs">
            {wisdom.framework}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

// Habit Manager Widget
function HabitManagerWidget() {
  const [habits, setHabits] = useState([
    { id: 1, name: 'Morning Meditation', completed: true, streak: 7 },
    { id: 2, name: 'Daily Reading', completed: false, streak: 3 },
    { id: 3, name: 'Exercise', completed: true, streak: 12 },
    { id: 4, name: 'Journaling', completed: false, streak: 5 }
  ]);

  const toggleHabit = (id: number) => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
  };

  return (
    <Card className="bg-surface border border-border">
      <CardHeader>
        <CardTitle className="text-text flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          Daily Habits
        </CardTitle>
        <CardDescription className="text-muted">
          Build consistency, one day at a time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {habits.map((habit) => (
          <div key={habit.id} className="flex items-center gap-3 p-3 bg-surface-2 rounded-lg">
            <button
              onClick={() => toggleHabit(habit.id)}
              className="flex-shrink-0"
            >
              {habit.completed ? (
                <CheckCircle className="w-5 h-5 text-success" />
              ) : (
                <Circle className="w-5 h-5 text-muted hover:text-primary transition-colors" />
              )}
            </button>
            <div className="flex-1">
              <h4 className="font-medium text-sm text-text">{habit.name}</h4>
              <p className="text-xs text-muted">Streak: {habit.streak} days</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Task Manager Widget
function TaskManagerWidget() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (response.ok) {
        const data = await response.json();
        // Handle both old format (array) and new format (object with tasks array)
        if (Array.isArray(data)) {
          setTasks(data || []);
        } else {
          setTasks(data.tasks || []);
        }
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskComplete = async (taskId: string, completed: boolean) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, completed }),
      });

      if (response.ok) {
        fetchTasks(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const dueTasks = tasks.filter(task => !task.completedAt && task.dueDate);
  const completedTasks = tasks.filter(task => task.completedAt);

  if (loading) {
    return <div className="text-center py-4">Loading tasks...</div>;
  }

  // Separate onboarding tasks from regular tasks
  const onboardingTasks = dueTasks.filter(task => task.tag === 'onboarding');
  const regularTasks = dueTasks.filter(task => task.tag !== 'onboarding');

  return (
    <Card className="bg-surface border border-border">
      <CardHeader>
        <CardTitle className="text-text flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-primary" />
          Tasks
        </CardTitle>
        <CardDescription className="text-muted">
          {dueTasks.length} pending, {completedTasks.length} completed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Show onboarding tasks first */}
        {onboardingTasks.map((task) => (
          <div key={task.id} className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTaskComplete(task.id, true)}
              className="h-6 w-6 p-0"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h4 className="font-medium text-sm text-text">{task.title}</h4>
              {task.description && (
                <p className="text-xs text-muted mt-1">
                  {task.description}
                </p>
              )}
              <div className="flex gap-2 mt-2">
                {task.tag && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                    {task.tag}
                  </span>
                )}
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                  {task.priority}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Show regular tasks */}
        {regularTasks.map((task) => (
          <div key={task.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTaskComplete(task.id, true)}
              className="h-6 w-6 p-0"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h4 className="font-medium text-sm">{task.title}</h4>
              {task.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {task.description}
                </p>
              )}
              <div className="flex gap-2 mt-2">
                {task.tag && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {task.tag}
                  </span>
                )}
                <span className="text-xs bg-secondary px-2 py-1 rounded">
                  {task.priority}
                </span>
              </div>
            </div>
          </div>
        ))}

        {dueTasks.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            No tasks due today. Great job staying on top of things!
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Goal Tracker Widget
function GoalTrackerWidget() {
  const [goals, setGoals] = useState([
    { id: 1, title: 'Read 12 books this year', progress: 75, target: 12, current: 9 },
    { id: 2, title: 'Complete 100 meditation sessions', progress: 60, target: 100, current: 60 },
    { id: 3, title: 'Run 500 miles', progress: 40, target: 500, current: 200 }
  ]);

  return (
    <Card className="bg-surface border border-border">
      <CardHeader>
        <CardTitle className="text-text flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Goals
        </CardTitle>
        <CardDescription className="text-muted">
          Track your progress toward excellence
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-text">{goal.title}</span>
              <span className="text-sm text-muted">{goal.current}/{goal.target}</span>
            </div>
            <Progress value={goal.progress} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Main Widget Renderer
export function WidgetRenderer({ widgetType, ...props }: { widgetType: string; [key: string]: any }) {
  switch (widgetType) {
    case 'virtue-progress':
      return <VirtueProgressWidget {...props} />;
    case 'wisdom-spotlight':
      return <WisdomSpotlightWidget {...props} />;
    case 'habit-manager':
      return <HabitManagerWidget {...props} />;
    case 'task-manager':
      return <TaskManagerWidget {...props} />;
    case 'goal-tracker':
      return <GoalTrackerWidget {...props} />;
    default:
      return <div className="text-center py-4 text-muted">Unknown widget type: {widgetType}</div>;
  }
}
