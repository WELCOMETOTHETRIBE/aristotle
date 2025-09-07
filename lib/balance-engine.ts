'use client';

export interface MotionData {
  pitch: number; // radians
  roll: number;  // radians
  isStable: boolean;
  stableSeconds: number;
}

export interface BalanceConfig {
  alpha: number;      // EMA smoothing factor (0.10-0.25)
  deadZone: number;   // stability threshold in radians (~3.4°)
  goalSeconds: number; // target time (60 seconds)
  maxScore: number;   // maximum score achievable (100 points)
}

export class BalanceEngine {
  private motionManager: any = null;
  private isRunning = false;
  private isCalibrated = false;
  private calibrationStartTime = 0;
  private calibrationDuration = 500; // 0.5s calibration
  
  // Raw motion data
  private rawPitch = 0;
  private rawRoll = 0;
  
  // Calibrated (zeroed) data
  private zeroPitch = 0;
  private zeroRoll = 0;
  
  // Smoothed data
  private smoothedPitch = 0;
  private smoothedRoll = 0;
  
  // State tracking
  private stableSeconds = 0;
  private lastUpdateTime = 0;
  private sessionStartTime = 0;
  
  // Configuration
  private config: BalanceConfig = {
    alpha: 0.08, // More aggressive smoothing to reduce jitter
    deadZone: 0.08, // Slightly larger dead zone for stability
    goalSeconds: 60,
    maxScore: 100
  };
  
  // Callbacks
  private onMotionUpdate?: (data: MotionData) => void;
  private onStateChange?: (state: 'idle' | 'calibrating' | 'running' | 'completed') => void;
  
  constructor(config?: Partial<BalanceConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }
  
  // Public API
  get currentState(): 'idle' | 'calibrating' | 'running' | 'completed' {
    if (!this.isRunning) return 'idle';
    if (!this.isCalibrated) return 'calibrating';
    if (this.stableSeconds >= this.config.goalSeconds) return 'completed';
    return 'running';
  }
  
  get motionData(): MotionData {
    return {
      pitch: this.smoothedPitch,
      roll: this.smoothedRoll,
      isStable: this.isStable(),
      stableSeconds: this.stableSeconds
    };
  }
  
  get progress(): number {
    return Math.min(1, this.stableSeconds / this.config.goalSeconds);
  }
  
  get remainingTime(): number {
    return Math.max(0, this.config.goalSeconds - this.sessionTime);
  }
  
  get currentScore(): number {
    // Score based on stable time as percentage of goal
    const baseScore = (this.stableSeconds / this.config.goalSeconds) * this.config.maxScore;
    
    // Apply bonus for current stability (small bonus for being stable right now)
    const stabilityBonus = this.isStable() ? 1.0 : 0.95;
    
    return Math.min(this.config.maxScore, baseScore * stabilityBonus);
  }
  
  get sessionTime(): number {
    return this.isRunning ? (Date.now() - this.sessionStartTime) / 1000 : 0;
  }
  
  // Event handlers
  onMotionUpdateCallback(callback: (data: MotionData) => void) {
    this.onMotionUpdate = callback;
  }
  
  onStateChangeCallback(callback: (state: 'idle' | 'calibrating' | 'running' | 'completed') => void) {
    this.onStateChange = callback;
  }
  
  // Core methods
  async start(): Promise<boolean> {
    if (this.isRunning) return false;
    
    try {
      // Request motion permission
      const hasPermission = await this.requestMotionPermission();
      if (!hasPermission) {
        console.warn('Motion permission denied');
        return false;
      }
      
      this.isRunning = true;
      this.isCalibrated = false;
      this.calibrationStartTime = Date.now();
      this.sessionStartTime = Date.now();
      this.stableSeconds = 0;
      this.lastUpdateTime = Date.now();
      
      this.onStateChange?.('calibrating');
      
      // Start motion detection
      this.startMotionDetection();
      
      return true;
    } catch (error) {
      console.error('Failed to start balance engine:', error);
      this.isRunning = false;
      return false;
    }
  }
  
  stop() {
    this.isRunning = false;
    this.isCalibrated = false;
    this.stopMotionDetection();
    this.onStateChange?.('idle');
  }
  
  reset() {
    this.stop();
    this.zeroPitch = 0;
    this.zeroRoll = 0;
    this.smoothedPitch = 0;
    this.smoothedRoll = 0;
    this.stableSeconds = 0;
  }
  
  // Private methods
  private async requestMotionPermission(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    
    if (!('DeviceMotionEvent' in window)) {
      console.warn('DeviceMotionEvent not supported');
      return false;
    }
    
    // Check if permission is required (iOS 13+)
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('Error requesting motion permission:', error);
        return false;
      }
    }
    
    // Permission not required (Android, older iOS, desktop)
    return true;
  }
  
  private startMotionDetection() {
    if (typeof window === 'undefined') return;
    
    const handleMotion = (event: DeviceMotionEvent) => {
      if (!this.isRunning) return;
      
      const { rotationRate } = event;
      if (!rotationRate) return;
      
      // Use rotation rate for more stable balance detection
      // Convert to radians and apply smoothing
      this.rawPitch = (rotationRate.beta || 0) * Math.PI / 180;
      this.rawRoll = (rotationRate.gamma || 0) * Math.PI / 180;
      
      this.updateMotion();
    };
    
    window.addEventListener('devicemotion', handleMotion);
    
    // Store reference for cleanup
    (this as any).motionHandler = handleMotion;
  }
  
  private stopMotionDetection() {
    if (typeof window === 'undefined') return;
    
    const handler = (this as any).motionHandler;
    if (handler) {
      window.removeEventListener('devicemotion', handler);
      (this as any).motionHandler = null;
    }
  }
  
  private updateMotion() {
    const now = Date.now();
    const deltaTime = (now - this.lastUpdateTime) / 1000; // Convert to seconds
    this.lastUpdateTime = now;
    
    // Handle calibration phase
    if (!this.isCalibrated) {
      const calibrationElapsed = now - this.calibrationStartTime;
      if (calibrationElapsed >= this.calibrationDuration) {
        // Calibration complete - zero the readings
        this.zeroPitch = this.rawPitch;
        this.zeroRoll = this.rawRoll;
        this.smoothedPitch = 0;
        this.smoothedRoll = 0;
        this.isCalibrated = true;
        this.onStateChange?.('running');
        console.log('✅ Calibration complete');
      }
      return;
    }
    
    // Apply zero offset
    const zeroedPitch = this.rawPitch - this.zeroPitch;
    const zeroedRoll = this.rawRoll - this.zeroRoll;
    
    // Apply EMA smoothing
    this.smoothedPitch = this.applyEMA(this.smoothedPitch, zeroedPitch, this.config.alpha);
    this.smoothedRoll = this.applyEMA(this.smoothedRoll, zeroedRoll, this.config.alpha);
    
    // Update stable time
    this.updateStableTime(deltaTime);
    
    // Notify listeners
    this.onMotionUpdate?.(this.motionData);
    
    // Check for completion (60 seconds elapsed)
    if (this.sessionTime >= this.config.goalSeconds) {
      this.onStateChange?.('completed');
    }
  }
  
  private applyEMA(current: number, newValue: number, alpha: number): number {
    return alpha * newValue + (1 - alpha) * current;
  }
  
  private isStable(): boolean {
    return Math.abs(this.smoothedPitch) < this.config.deadZone && 
           Math.abs(this.smoothedRoll) < this.config.deadZone;
  }
  
  private updateStableTime(deltaTime: number) {
    if (this.isStable()) {
      // Add time when stable
      this.stableSeconds += deltaTime;
    } else {
      // Decay time when unstable (0.5x speed)
      this.stableSeconds = Math.max(0, this.stableSeconds - deltaTime * 0.5);
    }
  }
  
  // Utility methods
  mapToScreenCoordinates(containerWidth: number, containerHeight: number): { x: number; y: number } {
    const radius = Math.min(containerWidth, containerHeight) * 0.36; // Safe zone radius
    
    // Map roll to x, -pitch to y (inverted for intuitive control)
    const x = this.smoothedRoll * radius;
    const y = -this.smoothedPitch * radius;
    
    // Clamp to safe zone
    const clampedX = Math.max(-radius, Math.min(radius, x));
    const clampedY = Math.max(-radius, Math.min(radius, y));
    
    return { x: clampedX, y: clampedY };
  }
  
  getBalanceState(): 'stable' | 'borderline' | 'out' {
    const pitchAbs = Math.abs(this.smoothedPitch);
    const rollAbs = Math.abs(this.smoothedRoll);
    const maxDeviation = Math.max(pitchAbs, rollAbs);
    
    // Use more generous thresholds to prevent flickering
    if (maxDeviation < this.config.deadZone * 0.8) {
      return 'stable';
    } else if (maxDeviation < this.config.deadZone * 2.0) {
      return 'borderline';
    } else {
      return 'out';
    }
  }
}
