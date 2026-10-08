import React, { useState } from 'react';
import { Brain, ChevronDown, ChevronUp, ExternalLink, Clock } from 'lucide-react';

export default function CitationBadge({ snippets = [], onJumpToConversation }) {
  const [expanded, setExpanded] = useState(false);

  if (!snippets || snippets.length === 0) return null;

  return (
    <div 
      style={{
        background: 'rgba(6, 182, 212, 0.1)',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        borderRadius: 'var(--radius-md)',
        padding: '0.5rem 0.75rem',
        maxWidth: '100%',
        marginBottom: '0.25rem'
      }}
    >
      <div 
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          gap: '0.5rem',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)', fontSize: '0.82rem', fontWeight: 600 }}>
          <Brain size={14} />
          <span>Recalled Context: {snippets.length} relevant past {snippets.length === 1 ? 'chat' : 'chats'}</span>
        </div>
        
        <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(6, 182, 212, 0.15)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {snippets.map((snip, i) => (
            <div 
              key={i} 
              style={{
                background: 'rgba(11, 15, 25, 0.6)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.5rem',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent-sky)' }}>
                  {snip.conversationTitle || 'Past Conversation'}
                </span>
                {snip.timestamp && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={10} />
                    {new Date(snip.timestamp).toLocaleDateString()}
                  </span>
                )}
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.4, margin: '0.25rem 0' }}>
                "{snip.text.length > 180 ? snip.text.slice(0, 180) + '...' : snip.text}"
              </p>

              {onJumpToConversation && snip.conversationId && (
                <button
                  className="btn btn-ghost"
                  onClick={() => onJumpToConversation(snip.conversationId)}
                  style={{
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.75rem',
                    color: 'var(--accent-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    marginTop: '0.25rem'
                  }}
                >
                  <ExternalLink size={12} />
                  <span>Jump to Conversation</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
