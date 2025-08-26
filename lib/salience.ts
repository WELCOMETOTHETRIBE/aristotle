import { cosineSimilarity, generateEmbedding } from './embeddings';

/**
 * Check if a fact is stable (not likely to change)
 */
export function isStableFact(content: string): boolean {
  if (!content || typeof content !== 'string') return false;
  
  const lowerContent = content.toLowerCase();
  
  // Stable facts contain concrete, actionable information
  const stableKeywords = [
    'i am', 'i have', 'i work', 'i live', 'i prefer', 'i enjoy', 'i avoid',
    'my goal', 'my habit', 'my routine', 'my preference', 'my value',
    'always', 'never', 'usually', 'typically', 'consistently'
  ];
  
  return stableKeywords.some(keyword => lowerContent.includes(keyword));
}

/**
 * Check if a fact is actionable
 */
export function isActionableFact(content: string): boolean {
  const actionableKeywords = [
    'should', 'need to', 'want to', 'plan to', 'try to', 'avoid',
    'prefer', 'like', 'dislike', 'enjoy', 'struggle with', 'good at'
  ];
  
  const lowerContent = content.toLowerCase();
  return actionableKeywords.some(keyword => lowerContent.includes(keyword));
}

/**
 * Check if a fact is non-duplicate by comparing with existing facts
 */
export async function isNonDuplicate(
  newFact: string,
  existingFacts: Array<{ content: string; embedding: string }>,
  threshold: number = 0.92
): Promise<boolean> {
  if (existingFacts.length === 0) return true;

  const newEmbedding = await generateEmbedding(newFact);
  
  for (const existingFact of existingFacts) {
    const similarity = cosineSimilarity(newEmbedding, JSON.parse(existingFact.embedding) as number[]);
    if (similarity >= threshold) {
      return false; // Too similar, consider it a duplicate
    }
  }
  
  return true;
}

/**
 * Filter knowledge facts based on stability, actionability, and uniqueness
 */
export async function filterKnowledgeFacts(
  candidateFacts: string[],
  existingFacts: Array<{ content: string; embedding: string }>
): Promise<string[]> {
  const filtered: string[] = [];
  
  for (const fact of candidateFacts) {
    // Check if fact meets criteria
    const stable = isStableFact(fact);
    const actionable = isActionableFact(fact);
    const nonDuplicate = await isNonDuplicate(fact, existingFacts);
    
    if (stable && actionable && nonDuplicate) {
      filtered.push(fact);
    }
  }
  
  return filtered;
}

/**
 * Update rolling conversation summary
 */
export function updateRollingSummary(
  currentSummary: string | null,
  newSession: { transcript: string; coachReply: string },
  maxTokens: number = 1000
): string {
  const sessionText = `User: ${newSession.transcript}\nCoach: ${newSession.coachReply}`;
  
  if (!currentSummary) {
    return sessionText.substring(0, maxTokens);
  }
  
  // Simple approach: prepend new session and truncate
  const combined = `${sessionText}\n\n${currentSummary}`;
  
  // Rough token estimation (1 token ≈ 4 characters)
  if (combined.length > maxTokens * 4) {
    return combined.substring(0, maxTokens * 4);
  }
  
  return combined;
} 