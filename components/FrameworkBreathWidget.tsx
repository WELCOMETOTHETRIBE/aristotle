// components/FrameworkBreathWidget.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FRAMEWORK_BREATH_MAP, type BreathPhase, type BreathPattern } from "../data/frameworkBreath";

type Props = {
  frameworkId: keyof typeof FRAMEWORK_BREATH_MAP;
  autoStart?: boolean;
};

function ms(n: number) { return n * 1000; }

export default function FrameworkBreathWidget({ frameworkId, autoStart = false }: Props) {
  const pattern: BreathPattern | undefined = FRAMEWORK_BREATH_MAP[frameworkId];
  const [running, setRunning] = useState(autoStart);
  const [round, setRound] = useState(1);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [rep, setRep] = useState(1);
  const [countdown, setCountdown] = useState(0); // seconds left in current sub-step
  const [stepLabel, setStepLabel] = useState<"Inhale"|"Hold"|"Exhale"|"Hold Out"|"Done">("Inhale");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currPhase = useMemo<BreathPhase | null>(() => pattern ? pattern.phases[phaseIdx] ?? null : null, [pattern, phaseIdx]);
  const totalRepeats = currPhase?.repeats ?? 1;
  const showRounds = Boolean(pattern?.rounds && pattern.rounds > 1);

  // Reset when framework changes
  useEffect(() => {
    setRunning(autoStart);
    setRound(1);
    setPhaseIdx(0);
    setRep(1);
    setCountdown(0);
    setStepLabel("Inhale");
    stopTimer();
  }, [frameworkId]);

  function stopTimer() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }

  function startStep(durationSec: number, label: typeof stepLabel) {
    stopTimer();
    setStepLabel(label);
    setCountdown(durationSec);
    if (durationSec <= 0) {
      // Immediately advance
      advance();
      return;
    }
    const started = Date.now();
    const tick = () => {
      const elapsed = (Date.now() - started) / 1000;
      const left = Math.max(0, durationSec - elapsed);
      setCountdown(left);
      if (left <= 0.05) {
        advance();
        return;
      }
      timerRef.current = setTimeout(tick, 50);
    };
    timerRef.current = setTimeout(tick, 50);
  }

  function advance() {
    if (!pattern || !currPhase) { setStepLabel("Done"); setRunning(false); return; }

    const { inhaleSec, holdInSec = 0, exhaleSec, holdOutSec = 0 } = currPhase;

    // Figure out where we are inside the 4-step micro-cycle
    if (stepLabel === "Inhale") {
      if (holdInSec > 0) return startStep(holdInSec, "Hold");
      return startStep(exhaleSec, "Exhale");
    }
    if (stepLabel === "Hold") {
      return startStep(exhaleSec, "Exhale");
    }
    if (stepLabel === "Exhale") {
      if (holdOutSec > 0) return startStep(holdOutSec, "Hold Out");
      // finish 1 micro-cycle
      return finishMicroCycle();
    }
    if (stepLabel === "Hold Out") {
      // finish 1 micro-cycle
      return finishMicroCycle();
    }

    // default (starting state)
    return startStep(inhaleSec, "Inhale");
  }

  function finishMicroCycle() {
    if (!pattern || !currPhase) return;
    const { inhaleSec } = currPhase;

    // Next repetition inside this phase
    if (rep < (currPhase.repeats ?? 1)) {
      setRep(rep + 1);
      return startStep(inhaleSec, "Inhale");
    }

    // Move to next phase
    const nextPhase = phaseIdx + 1;
    if (nextPhase < pattern.phases.length) {
      setPhaseIdx(nextPhase);
      setRep(1);
      const first = pattern.phases[nextPhase];
      return startStep(first.inhaleSec, "Inhale");
    }

    // Next round (if any)
    const totalRounds = pattern.rounds ?? 1;
    if (round < totalRounds) {
      setRound(round + 1);
      setPhaseIdx(0);
      setRep(1);
      const first = pattern.phases[0];
      return startStep(first.inhaleSec, "Inhale");
    }

    // All done
    setStepLabel("Done");
    setRunning(false);
    stopTimer();
  }

  function handleStart() {
    if (!pattern) return;
    const first = pattern.phases[0];
    setRunning(true);
    setRound(1); setPhaseIdx(0); setRep(1);
    startStep(first.inhaleSec, "Inhale");
  }

  function handlePause() {
    setRunning(false);
    stopTimer();
  }

  function handleReset() {
    setRunning(false);
    setRound(1); setPhaseIdx(0); setRep(1);
    setCountdown(0); setStepLabel("Inhale");
    stopTimer();
  }

  const percent = useMemo(() => {
    // simple visual: countdown within current micro-step
    const dur =
      stepLabel === "Inhale" ? (currPhase?.inhaleSec ?? 1)
      : stepLabel === "Hold" ? (currPhase?.holdInSec ?? 1)
      : stepLabel === "Exhale" ? (currPhase?.exhaleSec ?? 1)
      : stepLabel === "Hold Out" ? (currPhase?.holdOutSec ?? 1)
      : 1;
    const left = Math.max(0, Math.min(dur, countdown));
    const done = dur > 0 ? (1 - left / dur) : 1;
    return Math.round(done * 100);
  }, [countdown, stepLabel, currPhase]);

  if (!pattern) {
    return <div className="rounded-2xl p-4 bg-white/5 border border-white/10">Unknown framework: {frameworkId}</div>;
  }

  return (
    <div className="rounded-2xl p-5 bg-white/5 border border-white/10 space-y-4">
      <header className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm opacity-70">Breath of the Path</div>
          <div className="text-xl font-semibold">{pattern.title}</div>
          <div className="text-xs opacity-70">{pattern.subtitle}</div>
        </div>
        <div className="text-right">
          <div className="text-xs opacity-70">Virtue</div>
          <div className="text-sm">{pattern.primaryVirtue}</div>
        </div>
      </header>

      <div className="rounded-xl p-4 bg-black/30 border border-white/10">
        <div className="flex items-center justify-between text-sm">
          <div className="font-medium">{currPhase?.name ?? "Complete"}</div>
          {showRounds && <div className="opacity-80">Round {round}/{pattern.rounds}</div>}
        </div>
        <div className="mt-2 text-sm">
          Step: <span className="font-medium">{stepLabel}</span>
          {currPhase?.repeats && <span className="ml-2 opacity-80">Rep {rep}/{currPhase.repeats}</span>}
        </div>

        {/* Progress bar for current micro-step */}
        <div className="mt-3 h-2 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-400 transition-[width] duration-50"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Countdown */}
        <div className="mt-2 text-xs opacity-80">
          {countdown > 0 ? `${Math.ceil(countdown)}s remaining` : running ? "Advancing…" : "Ready"}
        </div>

        {/* Controls */}
        <div className="mt-3 flex items-center gap-2">
          {!running ? (
            <button onClick={handleStart} className="px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-sm">Start</button>
          ) : (
            <button onClick={handlePause} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm">Pause</button>
          )}
          <button onClick={handleReset} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm">Reset</button>
          {pattern.bpmApprox && (
            <div className="ml-auto text-xs opacity-70">~{pattern.bpmApprox} bpm</div>
          )}
        </div>
      </div>

      {/* Notes & Safety */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-xl p-3 bg-black/30 border border-white/10">
          <div className="text-sm font-medium mb-1">Notes</div>
          <ul className="text-sm list-disc pl-5 space-y-1 opacity-90">
            {(pattern.notes ?? []).map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        </div>
        <div className="rounded-xl p-3 bg-black/30 border border-white/10">
          <div className="text-sm font-medium mb-1">Safety</div>
          <ul className="text-sm list-disc pl-5 space-y-1 opacity-90">
            {(pattern.contraindications ?? ["Breathe comfortably; stop if unwell."]).map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
} 