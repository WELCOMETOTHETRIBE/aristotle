import { describe, it, expect } from 'vitest';
import { extractJsonFromResponse, parseJsonSafely, extractCoachPlan } from '@/lib/json';

describe('JSON Utilities', () => {
  describe('extractJsonFromResponse', () => {
    it('should extract JSON from response with json tags', () => {
      const response = `
        Here is my response.
        <json>
        {
          "reply": "Hello",
          "actions": []
        }
        </json>
      `;
      
      const result = extractJsonFromResponse(response);
      expect(result).toEqual({
        reply: "Hello",
        actions: []
      });
    });

    it('should handle malformed JSON gracefully', () => {
      const response = `
        <json>
        {
          "reply": "Hello",
          "actions": []
        </json>
      `;
      
      const result = extractJsonFromResponse(response);
      expect(result).toBeNull();
    });
  });

  describe('parseJsonSafely', () => {
    it('should parse valid JSON', () => {
      const jsonString = '{"test": "value"}';
      const result = parseJsonSafely(jsonString);
      expect(result).toEqual({ test: "value" });
    });

    it('should return null for invalid JSON', () => {
      const jsonString = '{"test": "value"';
      const result = parseJsonSafely(jsonString);
      expect(result).toBeNull();
    });
  });

  describe('extractCoachPlan', () => {
    it('should extract valid CoachPlan', () => {
      const response = `
        <json>
        {
          "reply": "Hello",
          "actions": [],
          "habitNudges": [],
          "goalUpdates": [],
          "breathwork": {},
          "reflectionPrompt": "Test",
          "hedonicCheck": {
            "riskLevel": "low",
            "triggers": [],
            "counterMoves": []
          },
          "knowledgeFacts": [],
          "skillInvocations": []
        }
        </json>
      `;
      
      const result = extractCoachPlan(response);
      expect(result).toBeDefined();
      expect(result?.reply).toBe("Hello");
    });
  });
}); 