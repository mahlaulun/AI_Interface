/**
 * Keyword Extraction & Word Cloud Layout Generator
 */

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from',
  'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself',
  'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'll', 'm', 'ma',
  'me', 'might', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'o', 'of', 'off', 'on',
  'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 're', 's', 'same',
  'she', 'should', 'so', 'some', 'such', 't', 'than', 'that', 'the', 'their', 'theirs', 'them',
  'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under',
  'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who',
  'whom', 'why', 'will', 'with', 'won', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves',
  'tell', 'explain', 'show', 'give', 'also', 'want', 'like', 'know', 'make', 'use', 'good', 'need'
]);

export function extractTopicsFromConversations(conversations = []) {
  const wordCounts = {};
  const topicChatsMap = {};

  conversations.forEach((conv) => {
    // Gather all text from title and messages
    const textPieces = [
      conv.title || '',
      ...(conv.topics || []),
      ...(conv.messages || []).map(m => m.content || '')
    ];

    const fullText = textPieces.join(' ').toLowerCase();
    // Split into clean words (alphanumeric 3+ chars)
    const tokens = fullText.match(/\b[a-zA-Z0-9_\-#]{3,20}\b/g) || [];

    const uniqueTokensInConv = new Set();

    tokens.forEach((token) => {
      const clean = token.toLowerCase();
      if (!STOP_WORDS.has(clean) && isNaN(clean)) {
        wordCounts[clean] = (wordCounts[clean] || 0) + 1;
        uniqueTokensInConv.add(clean);
      }
    });

    uniqueTokensInConv.forEach((token) => {
      if (!topicChatsMap[token]) {
        topicChatsMap[token] = [];
      }
      if (!topicChatsMap[token].includes(conv.id)) {
        topicChatsMap[token].push(conv.id);
      }
    });
  });

  const sortedWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30); // Top 30 frequent words

  if (sortedWords.length === 0) return [];

  const maxCount = sortedWords[0][1];
  const minCount = sortedWords[sortedWords.length - 1][1];

  const colors = [
    '#38bdf8', // sky
    '#06b6d4', // cyan
    '#818cf8', // indigo
    '#a78bfa', // purple
    '#c084fc', // violet
    '#34d399', // emerald
    '#fbbf24', // amber
    '#f472b6'  // pink
  ];

  return sortedWords.map(([text, count], index) => {
    // Scale font size from 14px to 38px
    const normalized = maxCount === minCount ? 0.5 : (count - minCount) / (maxCount - minCount);
    const fontSize = Math.round(14 + normalized * 24);
    const color = colors[index % colors.length];

    return {
      text,
      count,
      fontSize,
      color,
      chatIds: topicChatsMap[text] || []
    };
  });
}
