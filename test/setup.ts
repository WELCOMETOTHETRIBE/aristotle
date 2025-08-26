import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock environment variables
process.env.OPENAI_API_KEY = 'test-key';
process.env.DATABASE_URL = 'file:./test.db';
process.env.NEXT_PUBLIC_APP_NAME = 'Aion Test';
process.env.NEXT_PUBLIC_DEFAULT_VOICE = 'alloy';

// Mock fetch globally
global.fetch = vi.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}; 