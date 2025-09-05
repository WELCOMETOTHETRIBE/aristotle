export class BreathworkAudioManager {
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private isLoaded: boolean = false;
  private volume: number = 0.7;
  private isMuted: boolean = false;
  private currentAudio: HTMLAudioElement | null = null;

  constructor() {
    this.preloadAudio();
  }

  private async preloadAudio(): Promise<void> {
    const audioFiles = [
      // Core breathing instructions
      { key: 'inhale', url: '/audio/breathwork/inhale.mp3' },
      { key: 'hold', url: '/audio/breathwork/hold.mp3' },
      { key: 'exhale', url: '/audio/breathwork/exhale.mp3' },
      { key: 'hold2', url: '/audio/breathwork/hold-empty.mp3' },
      
      // Session audio
      { key: 'session-start', url: '/audio/breathwork/session-start.mp3' },
      { key: 'session-complete', url: '/audio/breathwork/session-complete.mp3' },
      
      // Counting audio (1-15)
      ...Array.from({ length: 15 }, (_, i) => ({
        key: `count-${i + 1}`,
        url: `/audio/breathwork/count-${i + 1}.mp3`
      }))
    ];

    try {
      const loadPromises = audioFiles.map(async ({ key, url }) => {
        const audio = new Audio(url);
        audio.preload = 'auto';
        
        return new Promise<{ key: string; audio: HTMLAudioElement }>((resolve, reject) => {
          audio.addEventListener('canplaythrough', () => resolve({ key, audio }), { once: true });
          audio.addEventListener('error', reject, { once: true });
          audio.load();
        });
      });

      const results = await Promise.all(loadPromises);
      
      results.forEach(({ key, audio }) => {
        this.audioCache.set(key, audio);
      });

      this.isLoaded = true;
      console.log('✅ All breathwork audio files preloaded successfully');
    } catch (error) {
      console.warn('⚠️ Some audio files failed to preload:', error);
      this.isLoaded = false;
    }
  }

  public isAudioLoaded(): boolean {
    return this.isLoaded;
  }

  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.audioCache.forEach(audio => {
      audio.volume = this.volume;
    });
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  public async playPhaseCue(phase: 'inhale' | 'hold' | 'exhale' | 'hold2'): Promise<void> {
    if (this.isMuted || !this.isLoaded) return;

    try {
      // Stop any currently playing audio
      this.stopCurrentAudio();

      const key = phase === 'hold2' ? 'hold2' : phase;
      const audio = this.audioCache.get(key);
      
      if (audio) {
        audio.currentTime = 0;
        audio.volume = this.volume;
        this.currentAudio = audio;
        await audio.play();
      }
    } catch (error) {
      console.warn('Failed to play phase cue:', error);
    }
  }

  public async playCountdown(count: number): Promise<void> {
    if (this.isMuted || !this.isLoaded || count < 1 || count > 15) return;

    try {
      // Stop any currently playing audio
      this.stopCurrentAudio();

      const key = `count-${count}`;
      const audio = this.audioCache.get(key);
      
      if (audio) {
        audio.currentTime = 0;
        audio.volume = this.volume * 0.7; // Lower volume for counting
        this.currentAudio = audio;
        await audio.play();
      }
    } catch (error) {
      console.warn('Failed to play countdown:', error);
    }
  }

  public async playSessionStart(): Promise<void> {
    if (this.isMuted || !this.isLoaded) return;

    try {
      this.stopCurrentAudio();

      const audio = this.audioCache.get('session-start');
      if (audio) {
        audio.currentTime = 0;
        audio.volume = this.volume;
        this.currentAudio = audio;
        await audio.play();
      }
    } catch (error) {
      console.warn('Failed to play session start:', error);
    }
  }

  public async playSessionComplete(): Promise<void> {
    if (this.isMuted || !this.isLoaded) return;

    try {
      this.stopCurrentAudio();

      const audio = this.audioCache.get('session-complete');
      if (audio) {
        audio.currentTime = 0;
        audio.volume = this.volume;
        this.currentAudio = audio;
        await audio.play();
      }
    } catch (error) {
      console.warn('Failed to play session complete:', error);
    }
  }

  private stopCurrentAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  public cleanup(): void {
    this.stopCurrentAudio();
    this.audioCache.clear();
  }
}

// Singleton instance
export const breathworkAudioManager = new BreathworkAudioManager(); 