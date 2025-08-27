import { describe, it, expect } from 'vitest';
import { GET } from '@/app/api/__health/route';
import { mockJson } from '../helpers/mockRequest';
import { Out_Health_GET } from '@/lib/api/schemas';

describe('Health API', () => {
  it('should return health status', async () => {
    const request = mockJson('GET', '/api/__health');
    const response = await GET(request);
    const data = await response.json();
    
    // Validate response schema
    const validated = Out_Health_GET.parse(data);
    
    expect(validated.ok).toBe(true);
    expect(validated.service).toBe('Aristotle - AI Life Coach');
    expect(validated.timestamp).toBeDefined();
    expect(validated.environment).toBeDefined();
    expect(validated.database).toBeDefined();
    expect(validated.audio).toBeDefined();
    expect(validated.tts).toBeDefined();
  });
});
