/**
 * In-Memory Semantic & TF-IDF Retrieval Engine for Cross-Conversation Recall
 */

// Helper to tokenize text into normalized terms
function tokenize(text) {
  if (!text) return [];
  return (text.toLowerCase().match(/\b[a-zA-Z0-9_\-#]{2,25}\b/g) || []);
}

// Compute term frequency vector
function getTermFrequencies(tokens) {
  const tf = {};
  tokens.forEach(t => {
    tf[t] = (tf[t] || 0) + 1;
  });
  return tf;
}

// Cosine similarity between two sparse TF vectors
function cosineSimilarity(tfA, tfB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const k in tfA) {
    normA += tfA[k] * tfA[k];
    if (tfB[k]) {
      dotProduct += tfA[k] * tfB[k];
    }
  }

  for (const k in tfB) {
    normB += tfB[k] * tfB[k];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export class MemoryIndexer {
  constructor(conversations = []) {
    this.chunks = [];
    this.buildIndex(conversations);
  }

  buildIndex(conversations = []) {
    this.chunks = [];

    conversations.forEach((conv) => {
      (conv.messages || []).forEach((msg, idx) => {
        // Index both user prompts and assistant answers (giving high context)
        const text = msg.content || '';
        if (text.length < 5) return;

        const tokens = tokenize(text);
        const tf = getTermFrequencies(tokens);

        this.chunks.push({
          id: `chunk_${conv.id}_${msg.id || idx}`,
          conversationId: conv.id,
          conversationTitle: conv.title || 'Untitled Chat',
          role: msg.role,
          text: text,
          timestamp: msg.timestamp || conv.createdAt,
          tokens: tokens,
          tf: tf
        });
      });
    });
  }

  /**
   * Search memory for relevant snippets matching query
   * @param {string} query 
   * @param {string} currentConversationId - to avoid self-referencing identical current message
   * @param {number} maxResults 
   */
  search(query, currentConversationId = null, maxResults = 3) {
    if (!query || this.chunks.length === 0) return [];

    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) return [];

    const queryTf = getTermFrequencies(queryTokens);

    const scored = this.chunks
      .filter(chunk => chunk.conversationId !== currentConversationId || this.chunks.length === 1)
      .map(chunk => {
        // Calculate similarity score
        const score = cosineSimilarity(queryTf, chunk.tf);
        
        // Exact keyword matching boost
        let exactMatchBoost = 0;
        queryTokens.forEach(t => {
          if (chunk.tf[t]) exactMatchBoost += 0.15;
        });

        return {
          ...chunk,
          score: score + exactMatchBoost
        };
      })
      .filter(chunk => chunk.score > 0.12)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);

    return scored;
  }
}
