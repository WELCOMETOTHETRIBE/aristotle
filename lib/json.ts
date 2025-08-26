/**
 * Robustly extracts JSON from LLM responses wrapped in <json> tags
 */
export function extractJsonFromResponse(response: string): string | null {
  // Remove BOM and normalize whitespace
  const cleanResponse = response
    .replace(/^\uFEFF/, '') // Remove BOM
    .replace(/\u00A0/g, ' ') // Replace non-breaking spaces
    .trim();

  // Try to find JSON wrapped in <json> tags
  const jsonMatch = cleanResponse.match(/<json>([\s\S]*?)<\/json>/i);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }

  // Fallback: try to find JSON object in the response
  const objectMatch = cleanResponse.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    return objectMatch[0];
  }

  return null;
}

/**
 * Parses and validates JSON with helpful error messages
 */
export function parseJsonSafely(jsonString: string): any {
  try {
    // Remove any markdown formatting that might have slipped through
    const cleaned = jsonString
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON syntax: ${error.message}\n\nJSON string: ${jsonString.substring(0, 200)}...`);
    }
    throw error;
  }
}

/**
 * Extracts and parses CoachPlan JSON from LLM response
 */
export function extractCoachPlan(response: string): any {
  const jsonString = extractJsonFromResponse(response);
  if (!jsonString) {
    throw new Error('No JSON found in response. Expected <json>...</json> block.');
  }

  return parseJsonSafely(jsonString);
}

/**
 * Sanitizes JSON string for safe parsing
 */
export function sanitizeJsonString(input: string): string {
  return input
    .replace(/^\uFEFF/, '') // Remove BOM
    .replace(/\u00A0/g, ' ') // Replace non-breaking spaces
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width spaces
    .trim();
} 