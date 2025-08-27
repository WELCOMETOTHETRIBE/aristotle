interface LogEntry {
  timestamp: string;
  requestId?: string;
  route?: string;
  severity: 'info' | 'warn' | 'error';
  message: string;
  error?: any;
  metadata?: Record<string, any>;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Server-side logging
    if (typeof window === 'undefined') {
      const logMethod = entry.severity === 'error' ? console.error : 
                       entry.severity === 'warn' ? console.warn : console.log;
      logMethod(`[${entry.timestamp}] ${entry.severity.toUpperCase()}: ${entry.message}`, entry.error || '');
    } else {
      // Client-side logging to global buffer
      if (!window.__doctorErrors) {
        window.__doctorErrors = [];
      }
      window.__doctorErrors.push({
        timestamp: entry.timestamp,
        type: entry.severity,
        error: entry.message,
        metadata: entry.metadata
      });
    }
  }

  info(message: string, metadata?: Record<string, any>) {
    this.addLog({
      timestamp: new Date().toISOString(),
      severity: 'info',
      message,
      metadata
    });
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.addLog({
      timestamp: new Date().toISOString(),
      severity: 'warn',
      message,
      metadata
    });
  }

  error(message: string, error?: any, metadata?: Record<string, any>) {
    this.addLog({
      timestamp: new Date().toISOString(),
      severity: 'error',
      message,
      error,
      metadata
    });
  }

  getLogs(severity?: 'info' | 'warn' | 'error'): LogEntry[] {
    if (severity) {
      return this.logs.filter(log => log.severity === severity);
    }
    return this.logs;
  }

  clear() {
    this.logs = [];
  }
}

export const logger = new Logger();
