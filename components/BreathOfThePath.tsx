"use client";
import { useEffect, useState } from "react";

interface BreathOfThePathProps {
  frameworkId: string;
  frameworkName: string;
  frameworkTone: string;
}

interface PracticeDetail {
  title: string;
  body: string;
  bullets: string[];
  coach_prompts: string[];
  safety_reminders: string[];
  est_time_min: number;
}

export default function BreathOfThePath({ frameworkId, frameworkName, frameworkTone }: BreathOfThePathProps) {
  const [practice, setPractice] = useState<PracticeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBreathwork = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `/api/generate/practice?moduleId=breathwork&level=Beginner&style=${frameworkId}&locale=en`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPractice(data);
      } catch (err) {
        console.error('Error fetching breathwork practice:', err);
        setError(err instanceof Error ? err.message : 'Failed to load breathwork practice');
        // Set a practice instead of leaving it null
        setPractice({
          title: `${frameworkName} Breathwork`,
          body: `A foundational breathwork practice from the ${frameworkName} tradition. Focus on steady, mindful breathing to cultivate presence and clarity.`,
          bullets: [
            "Find a comfortable seated position",
            "Close your eyes and focus on your breath",
            "Breathe naturally and observe the rhythm",
            "Return to breath when mind wanders"
          ],
          coach_prompts: [
            "Notice how your body feels with each breath",
            "Observe any changes in your mental state"
          ],
          safety_reminders: [
            "Stop if you feel dizzy or uncomfortable",
            "Breathe naturally - don't force anything"
          ],
          est_time_min: 5
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBreathwork();
  }, [frameworkId, frameworkName]);

  if (loading) {
    return (
      <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded mb-4"></div>
          <div className="h-4 bg-white/10 rounded mb-2"></div>
          <div className="h-4 bg-white/10 rounded mb-2"></div>
          <div className="h-4 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  if (error && !practice) {
    return (
      <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
        <div className="text-center text-gray-400">
          <p>Unable to load breathwork practice</p>
          <p className="text-sm mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  if (!practice) {
    return null;
  }

  return (
    <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">🫁</span>
        <div>
          <h3 className="text-xl font-semibold text-white">{practice.title}</h3>
          <p className="text-sm text-blue-300">Primary virtue: Temperance</p>
        </div>
      </div>

      <p className="text-gray-300 mb-4">{practice.body}</p>

      {practice.bullets.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-white mb-2">Key Points:</h4>
          <ul className="space-y-1">
            {practice.bullets.map((bullet, index) => (
              <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>⏱️ {practice.est_time_min} minutes</span>
        <span className="text-blue-300">{frameworkName} Style</span>
      </div>
    </div>
  );
} 