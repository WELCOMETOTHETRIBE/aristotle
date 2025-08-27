import { describe, it, expect } from 'vitest';
import { GET } from '@/app/api/health/route';
import { mockJson } from '../helpers/mockRequest';
import { Out_Health_GET } from '@/lib/api/schemas';

describe('Health API', () => {
  it('should return health status', async () => {
    const response = await GET();
    const data = await response.json();
    
    expect(data.status).toBe('healthy');
    expect(data.service).toBe('Aion - Aristotle-Inspired Life Coach');
    expect(data.timestamp).toBeDefined();
  });
});
