import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

/**
 * Generate embeddings for text using OpenAI
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }
  
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: text,
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
}

/**
 * Apply recency boost to similarity scores
 * Half-life of 30 days
 */
export function applyRecencyBoost(similarity: number, createdAt: Date): number {
  const now = new Date();
  const daysDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
  const halfLife = 30; // 30 days
  const boost = Math.exp(-Math.log(2) * daysDiff / halfLife);
  
  // Blend similarity with recency boost (70% similarity, 30% recency)
  return 0.7 * similarity + 0.3 * boost;
}

/**
 * Maximum Marginal Relevance (MMR) for diverse retrieval
 */
export function mmrDiversification(
  queryEmbedding: number[],
  candidates: Array<{ id: string; embedding: number[]; similarity: number; createdAt: Date; content: string }>,
  lambda: number = 0.5,
  topK: number = 8
): Array<{ id: string; embedding: number[]; similarity: number; createdAt: Date; content: string }> {
  const selected: Array<{ id: string; embedding: number[]; similarity: number; createdAt: Date; content: string }> = [];
  const remaining = [...candidates];

  // Start with the most similar item
  if (remaining.length > 0) {
    const best = remaining.reduce((max, current) => 
      current.similarity > max.similarity ? current : max
    );
    selected.push(best);
    remaining.splice(remaining.indexOf(best), 1);
  }

  // Select remaining items using MMR
  while (selected.length < topK && remaining.length > 0) {
    let bestMMR = -Infinity;
    let bestIndex = -1;

    for (let i = 0; i < remaining.length; i++) {
      const candidate = remaining[i];
      
      // Calculate maximum similarity to already selected items
      let maxSimilarityToSelected = 0;
      for (const selectedItem of selected) {
        const similarity = cosineSimilarity(candidate.embedding, selectedItem.embedding);
        maxSimilarityToSelected = Math.max(maxSimilarityToSelected, similarity);
      }

      // MMR score = λ * relevance - (1-λ) * redundancy
      const mmrScore = lambda * candidate.similarity - (1 - lambda) * maxSimilarityToSelected;
      
      if (mmrScore > bestMMR) {
        bestMMR = mmrScore;
        bestIndex = i;
      }
    }

    if (bestIndex >= 0) {
      selected.push(remaining[bestIndex]);
      remaining.splice(bestIndex, 1);
    } else {
      break;
    }
  }

  return selected;
}

/**
 * Retrieve top-k user facts by semantic similarity
 */
export async function retrieveUserFacts(
  query: string,
  userFacts: Array<{ id: string; content: string; embedding: string; createdAt: Date }>,
  topK: number = 8
): Promise<Array<{ id: string; content: string; similarity: number }>> {
  // Generate embedding for query
  const queryEmbedding = await generateEmbedding(query);

  // Calculate similarities with recency boost
  const candidates = userFacts.map(fact => ({
    id: fact.id,
    embedding: JSON.parse(fact.embedding) as number[],
    content: fact.content,
    similarity: applyRecencyBoost(
      cosineSimilarity(queryEmbedding, JSON.parse(fact.embedding) as number[]),
      fact.createdAt
    ),
    createdAt: fact.createdAt,
  }));

  // Sort by similarity
  candidates.sort((a, b) => b.similarity - a.similarity);

  // Apply MMR diversification
  const diversified = mmrDiversification(queryEmbedding, candidates, 0.5, topK);

  return diversified.map(item => ({
    id: item.id,
    content: item.content,
    similarity: item.similarity,
  }));
} 