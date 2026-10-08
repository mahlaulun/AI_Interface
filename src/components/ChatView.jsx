import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Sparkles, Send, Trash2, Bot, User, RefreshCw } from 'lucide-react';
import CitationBadge from './CitationBadge.jsx';

export default function ChatView({
  currentModel,
  onSelectModel,
  messages = [],
  onSendMessage,
  onClearChat,
  isStreaming = false,
  onJumpToConversation
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="view-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingBottom: '1.25rem' }}>
      {/* Header & Model Selector */}
      <div className="surface-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 className="surface-title" style={{ fontSize: '1.4rem' }}>
            <MessageSquare size={22} style={{ color: 'var(--accent-sky)' }} />
            Chat Workspace
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <select 
            className="select" 
            style={{ width: 'auto', minWidth: '170px', fontSize: '0.85rem' }}
            value={currentModel}
            onChange={(e) => onSelectModel(e.target.value)}
          >
            <option value="gpt-4o">OpenAI (GPT-4o)</option>
            <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            <option value="ollama-llama3">Local Ollama (Llama 3)</option>
          </select>

          {messages.length > 0 && (
            <button 
              className="btn btn-ghost" 
              onClick={onClearChat}
              title="Start New Chat"
              style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
            >
              <Trash2 size={16} />
              <span>New Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages Stream Area */}
      <div 
        className="panel" 
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem',
          padding: '1.25rem',
          marginBottom: '1rem',
          minHeight: '350px'
        }}
      >
        {messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)', textAlign: 'center', margin: 'auto' }}>
            <Sparkles size={40} style={{ color: 'var(--accent-sky)', marginBottom: '1rem', opacity: 0.7 }} />
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.35rem', fontSize: '1.15rem' }}>Your Second Brain is Ready</h3>
            <p style={{ fontSize: '0.9rem', maxWidth: '440px', lineHeight: 1.5 }}>
              Ask anything, explore ideas, or recall past discussions (*"What did we discuss earlier about X?"*). MindSync automatically syncs and indexes your conversations.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div 
                key={msg.id || idx} 
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  alignItems: 'flex-start'
                }}
              >
                {!isUser && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, var(--accent-sky), var(--accent-blue))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#07090e',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <Bot size={18} />
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
                  {/* Recalled Citations Card if any */}
                  {msg.recalledSnippets && msg.recalledSnippets.length > 0 && (
                    <CitationBadge 
                      snippets={msg.recalledSnippets}
                      onJumpToConversation={onJumpToConversation}
                    />
                  )}

                  <div 
                    style={{
                      background: isUser ? 'linear-gradient(135deg, #1d4ed8, #2563eb)' : 'rgba(22, 30, 49, 0.85)',
                      color: isUser ? '#ffffff' : 'var(--text-primary)',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: isUser ? 'none' : '1px solid var(--border-subtle)',
                      boxShadow: isUser ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'var(--shadow-sm)',
                      fontSize: '0.92rem',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      lineHeight: 1.6
                    }}
                  >
                    {msg.content || (isStreaming && idx === messages.length - 1 ? '...' : '')}
                  </div>
                </div>

                {isUser && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-sky)',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <User size={18} />
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', position: 'relative' }}>
        <input 
          type="text" 
          className="input" 
          placeholder="Ask a question or recall past topics ('What did we discuss earlier regarding...')"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isStreaming}
          style={{ flex: 1, paddingRight: '2.5rem', fontSize: '0.92rem' }}
        />
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isStreaming || !input.trim()}
          style={{ minWidth: '90px' }}
        >
          {isStreaming ? <RefreshCw size={16} className="spin" /> : <Send size={16} />}
          <span>{isStreaming ? 'AI...' : 'Send'}</span>
        </button>
      </form>
    </div>
  );
}
