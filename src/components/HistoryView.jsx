import React, { useState } from 'react';
import { History, Search, ArrowUpDown, Filter, MessageCircle } from 'lucide-react';

export default function HistoryView({ conversations = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [filterModel, setFilterModel] = useState('all');

  return (
    <div className="view-container">
      <div className="surface-header">
        <h1 className="surface-title">
          <History size={24} style={{ color: 'var(--accent-purple)' }} />
          Conversation History
        </h1>
        <p className="surface-desc">Browse, search, sort, and filter your indexed second-brain conversations.</p>
      </div>

      {/* Filter and Sort Toolbar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="input" 
            placeholder="Search conversations by keyword or topic..."
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

      {/* Conversations list / empty state */}
      {conversations.length === 0 ? (
        <div className="panel" style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
          <MessageCircle size={36} style={{ color: 'var(--accent-purple)', marginBottom: '1rem', opacity: 0.5 }} />
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>No conversations yet</h3>
          <p style={{ fontSize: '0.9rem' }}>Chats you have in the Chat tab will automatically sync and organize here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Items will render here in Slice 3 */}
        </div>
      )}
    </div>
  );
}
