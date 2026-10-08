import React from 'react';
import { MessageSquare, Sparkles, Send } from 'lucide-react';

export default function ChatView({ currentModel, onSelectModel }) {
  return (
    <div className="view-container" style={{ paddingBottom: '2rem' }}>
      <div className="surface-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="surface-title">
            <MessageSquare size={24} style={{ color: 'var(--accent-sky)' }} />
            Chat Workspace
          </h1>
          <p className="surface-desc">Converse with your AI model and query past memory automatically.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Model:</label>
          <select 
            className="select" 
            style={{ width: 'auto', minWidth: '160px' }}
            value={currentModel}
            onChange={(e) => onSelectModel(e.target.value)}
          >
            <option value="gpt-4o">OpenAI (GPT-4o)</option>
            <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            <option value="ollama-llama3">Ollama (Llama 3)</option>
          </select>
        </div>
      </div>

      {/* Message list area */}
      <div className="panel" style={{ flex: 1, minHeight: '380px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
        <Sparkles size={36} style={{ color: 'var(--accent-sky)', marginBottom: '1rem', opacity: 0.6 }} />
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Start a fresh conversation</h3>
        <p style={{ fontSize: '0.9rem', maxWidth: '400px', textAlign: 'center' }}>
          Ask a question, brainstorm an idea, or recall past discussions. MindSync automatically indexes your chats.
        </p>
      </div>

      {/* Input area */}
      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
        <input 
          type="text" 
          className="input" 
          placeholder="Ask anything or recall previous topics ('What did we discuss earlier regarding...')"
          style={{ flex: 1 }}
        />
        <button className="btn btn-primary">
          <Send size={16} />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
}
