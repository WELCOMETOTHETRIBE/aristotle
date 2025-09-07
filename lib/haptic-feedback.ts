'use client';

export interface HapticConfig {
  enabled: boolean;
  stableTickInterval: number; // ms between stable ticks
  exitZoneCooldown: number; // ms between exit zone alerts
  volume: number; // 0-1
}

export type HapticEvent = 
  | 'enter_stable'
  | 'exit_zone' 
  | 'stable_tick'
  | 'completion'
  | 'calibration_complete';

export class HapticFeedback {
  private config: HapticConfig = {
    enabled: true,
    stableTickInterval: 2000, // 2 seconds
    exitZoneCooldown: 1000,   // 1 second
    volume: 0.5
  };
  
  private lastStableTick = 0;
  private lastExitZoneAlert = 0;
  private isInStableZone = false;
  
  // Audio context for sound effects
  private audioContext: AudioContext | null = null;
  private audioEnabled = false;
  
  constructor(config?: Partial<HapticConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
    
    this.initializeAudio();
  }
  
  // Public API
  updateConfig(newConfig: Partial<HapticConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
  
  async trigger(event: HapticEvent, force = false) {
    if (!this.config.enabled && !force) return;
    
    const now = Date.now();
    
    switch (event) {
      case 'enter_stable':
        this.triggerHaptic('light');
        this.isInStableZone = true;
        break;
        
      case 'exit_zone':
        if (now - this.lastExitZoneAlert >= this.config.exitZoneCooldown) {
          this.triggerHaptic('medium');
          this.lastExitZoneAlert = now;
          this.isInStableZone = false;
        }
        break;
        
      case 'stable_tick':
        if (this.isInStableZone && now - this.lastStableTick >= this.config.stableTickInterval) {
          this.triggerHaptic('selection');
          this.lastStableTick = now;
        }
        break;
        
      case 'completion':
        this.triggerHaptic('light');
        setTimeout(() => this.triggerHaptic('light'), 100);
        this.playCompletionSound();
        break;
        
      case 'calibration_complete':
        this.triggerHaptic('light');
        break;
    }
  }
  
  // Audio methods
  private async initializeAudio() {
    if (typeof window === 'undefined') return;
    
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.audioEnabled = true;
    } catch (error) {
      console.warn('Audio context not available:', error);
      this.audioEnabled = false;
    }
  }
  
  private playCompletionSound() {
    if (!this.audioEnabled || !this.audioContext) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Soft chime sound
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.config.volume * 0.1, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.5);
    } catch (error) {
      console.warn('Error playing completion sound:', error);
    }
  }
  
  playBreathingReminder() {
    if (!this.audioEnabled || !this.audioContext) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Soft whoosh sound
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.config.volume * 0.05, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn('Error playing breathing reminder:', error);
    }
  }
  
  // Haptic feedback methods
  private triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'selection') {
    if (typeof window === 'undefined') return;
    
    // Check if device supports vibration
    if (!('vibrate' in navigator)) {
      console.warn('Vibration not supported on this device');
      return;
    }
    
    try {
      switch (type) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(20);
          break;
        case 'heavy':
          navigator.vibrate(50);
          break;
        case 'selection':
          navigator.vibrate([10, 5, 10]);
          break;
      }
    } catch (error) {
      console.warn('Error triggering haptic feedback:', error);
    }
  }
  
  // Utility methods
  reset() {
    this.lastStableTick = 0;
    this.lastExitZoneAlert = 0;
    this.isInStableZone = false;
  }
  
  destroy() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Singleton instance
let hapticInstance: HapticFeedback | null = null;

export function getHapticFeedback(): HapticFeedback {
  if (!hapticInstance) {
    hapticInstance = new HapticFeedback();
  }
  return hapticInstance;
}

// Hook for React components
export function useHapticFeedback(config?: Partial<HapticConfig>) {
  const haptic = getHapticFeedback();
  
  React.useEffect(() => {
    if (config) {
      haptic.updateConfig(config);
    }
    
    return () => {
      // Cleanup if needed
    };
  }, [config, haptic]);
  
  return haptic;
}

// Import React for the hook
import React from 'react';
