/**
 * Structured Storage Engine for Conversations and Second Brain State
 */

const STORAGE_KEY = 'mindsync_conversations_v1';

export function getStoredConversations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load conversations from storage:', e);
    return [];
  }
}

export function saveConversations(conversations) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch (e) {
    console.error('Failed to save conversations to storage:', e);
  }
}

export function saveConversation(conversation) {
  const current = getStoredConversations();
  const index = current.findIndex(c => c.id === conversation.id);
  
  let updated;
  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...conversation, updatedAt: new Date().toISOString() };
  } else {
    updated = [
      { ...conversation, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ...current
    ];
  }

  saveConversations(updated);
  return updated;
}

export function deleteConversation(conversationId) {
  const current = getStoredConversations();
  const updated = current.filter(c => c.id !== conversationId);
  saveConversations(updated);
  return updated;
}

export function exportConversationsJson() {
  const data = getStoredConversations();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mindsync-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
