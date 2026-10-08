import React, { useState, useMemo } from 'react';
import { History, Search, ArrowUpDown, Filter, MessageSquare, Trash2, Calendar, Tag, ExternalLink } from 'lucide-react';

export default function HistoryView({
  conversations = [],
  onSelectConversation,
  onDeleteConversation
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [filterModel, setFilterModel] = useState('all');

  const filteredAndSortedConversations = useMemo(() => {
    return conversations
      .filter((conv) => {
        // Model filter
        if (filterModel !== 'all' && conv.model !== filterModel) {
          return false;
        }

        // Search query (checks title, topics, and message text)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const titleMatch = (conv.title || '').toLowerCase().includes(q);
          const topicsMatch = (conv.topics || []).some(t => t.toLowerCase().includes(q));
          const messageMatch = (conv.messages || []).some(m => (m.content || '').toLowerCase().includes(q));
          return titleMatch || topicsMatch || messageMatch;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOrder === 'newest') {
          return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
        }
        if (sortOrder === 'oldest') {
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        }
        if (sortOrder === 'messages') {
          return (b.messages?.length || 0) - (a.messages?.length || 0);
        }
        return 0;
      });
  }, [conversations, searchQuery, sortOrder, filterModel]);

  return (
    <div className="view-container">
      <div className="surface-header">
        <h1 className="surface-title">
          <History size={24} style={{ color: 'var(--accent-purple)' }} />
          Conversation History
        </h1>
        <p className="surface-desc">
          Browse, search, sort, and filter through all your stored second-brain discussions.
        </p>
      </div>

      {/* Filter and Sort Toolbar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="input" 
            placeholder="Search conversations by keyword, title, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <ArrowUpDown size={15} style={{ color: 'var(--text-muted)' }} />
          <select className="select" style={{ width: 'auto' }} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="messages">Message Count</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Filter size={15} style={{ color: 'var(--text-muted)' }} />
          <select className="select" style={{ width: 'auto' }} value={filterModel} onChange={(e) => setFilterModel(e.target.value)}>
            <option value="all">All Models</option>
            <option value="gpt-4o">GPT-4o</option>
            <option value="claude-3-5-sonnet">Claude 3.5</option>
            <option value="gemini-1.5-pro">Gemini Pro</option>
            <option value="ollama-llama3">Ollama</option>
          </select>
        </div>
      </div>

      {/* Conversations Count & Cards */}
      {filteredAndSortedConversations.length === 0 ? (
        <div className="panel" style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
          <MessageSquare size={36} style={{ color: 'var(--accent-purple)', marginBottom: '1rem', opacity: 0.5 }} />
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            {conversations.length === 0 ? 'No conversations recorded yet' : 'No matching conversations found'}
          </h3>
          <p style={{ fontSize: '0.9rem' }}>
            {conversations.length === 0 
              ? 'Start chatting in the Chat workspace to automatically populate your second brain.' 
              : 'Try clearing your search query or adjusting the filters above.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
            Showing {filteredAndSortedConversations.length} {filteredAndSortedConversations.length === 1 ? 'conversation' : 'conversations'}
          </div>

          {filteredAndSortedConversations.map((conv) => {
            const messageCount = conv.messages?.length || 0;
            const lastMsg = conv.messages?.[conv.messages.length - 1]?.content || '';
            const previewText = lastMsg.length > 120 ? lastMsg.slice(0, 120) + '...' : lastMsg;

            return (
              <div 
                key={conv.id}
                className="panel"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 1.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: '1px solid var(--border-subtle)'
                }}
                onClick={() => onSelectConversation(conv.id)}
              >
                <div style={{ flex: 1, minWidth: 0, paddingRight: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {conv.title || 'Untitled Conversation'}
                    </h3>
                    <span 
                      style={{
                        fontSize: '0.72rem',
                        padding: '0.15rem 0.45rem',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(56, 189, 248, 0.1)',
                        color: 'var(--accent-sky)',
                        border: '1px solid rgba(56, 189, 248, 0.2)'
                      }}
                    >
                      {conv.model || 'gpt-4o'}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {previewText || 'Empty conversation'}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={12} />
                      {new Date(conv.updatedAt || conv.createdAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>{messageCount} {messageCount === 1 ? 'message' : 'messages'}</span>

                    {conv.topics && conv.topics.length > 0 && (
                      <>
                        <span>•</span>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {conv.topics.slice(0, 3).map((t, idx) => (
                            <span 
                              key={idx}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.2rem',
                                color: 'var(--accent-cyan)',
                                background: 'rgba(6, 182, 212, 0.1)',
                                padding: '0.1rem 0.4rem',
                                borderRadius: 'var(--radius-sm)'
                              }}
                            >
                              <Tag size={10} />
                              {t}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectConversation(conv.id);
                    }}
                    title="Open Conversation"
                    style={{ padding: '0.4rem', color: 'var(--accent-sky)' }}
                  >
                    <ExternalLink size={16} />
                  </button>
                  <button 
                    className="btn btn-ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Delete "${conv.title}"?`)) {
                        onDeleteConversation(conv.id);
                      }
                    }}
                    title="Delete Conversation"
                    style={{ padding: '0.4rem', color: 'var(--text-muted)' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
