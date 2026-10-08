import React, { useState } from 'react';
import { Cloud, Sparkles, BookOpen, MessageSquare, ExternalLink, RefreshCw, Hash } from 'lucide-react';
import { streamChatResponse } from '../services/llm.js';

export default function TopicsView({
  topics = [],
  conversations = [],
  onSelectConversation,
  currentModel,
  settings
}) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [synthesisSummary, setSynthesisSummary] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const activeTopicData = topics.find(t => t.text === selectedTopic);
  const matchingConversations = activeTopicData 
    ? conversations.filter(c => activeTopicData.chatIds.includes(c.id))
    : [];

  const handleTopicClick = (topicText) => {
    setSelectedTopic(topicText);
    setSynthesisSummary('');
  };

  const handleGenerateSynthesis = async () => {
    if (!selectedTopic || matchingConversations.length === 0 || isSynthesizing) return;

    setIsSynthesizing(true);
    setSynthesisSummary('');

    // Prepare context from matching conversations
    const conversationExcerpts = matchingConversations.map(c => {
      const messagesText = (c.messages || []).map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
      return `--- CONVERSATION TITLE: ${c.title} (Date: ${new Date(c.createdAt).toLocaleDateString()}) ---\n${messagesText}`;
    }).join('\n\n');

    const promptMessages = [
      {
        role: 'user',
        content: `Synthesize a concise, structured second-brain summary of our discussions regarding the topic "${selectedTopic}". Highlight the core decisions, key takeaways, and recurring themes across these conversations:\n\n${conversationExcerpts}`
      }
    ];

    try {
      let fullText = '';
      const stream = streamChatResponse({
        messages: promptMessages,
        model: currentModel || 'gpt-4o',
        settings: settings
      });

      for await (const chunk of stream) {
        fullText += chunk;
        setSynthesisSummary(fullText);
      }
    } catch (err) {
      console.error('Synthesis error:', err);
      setSynthesisSummary(`Error generating synthesis: ${err.message}`);
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="view-container">
      <div className="surface-header">
        <h1 className="surface-title">
          <Cloud size={24} style={{ color: 'var(--accent-cyan)' }} />
          Topics & Second Brain Insights
        </h1>
        <p className="surface-desc">
          Interactive topic word cloud extracted from your conversations, with instant cross-chat synthesis.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.25rem' }}>
        {/* Interactive Word Cloud Surface */}
        <div className="panel" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-sky)' }}>
              <Cloud size={18} />
              Topic Word Cloud
            </h3>
            {topics.length > 0 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {topics.length} topics extracted
              </span>
            )}
          </div>

          {topics.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
              <Cloud size={40} style={{ color: 'var(--accent-cyan)', marginBottom: '0.75rem', opacity: 0.4 }} />
              <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600 }}>Word Cloud is currently empty</p>
              <p style={{ fontSize: '0.85rem', maxWidth: '320px', marginTop: '0.25rem' }}>
                As you chat about different topics (e.g. system design, recipes, code), frequent keywords will dynamically form your second brain cloud here.
              </p>
            </div>
          ) : (
            <div 
              style={{ 
                flex: 1, 
                display: 'flex', 
                flexWrap: 'wrap', 
                alignContent: 'center', 
                justifyContent: 'center', 
                gap: '0.85rem 1.25rem',
                padding: '1.5rem',
                background: 'rgba(11, 15, 25, 0.4)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(255, 255, 255, 0.04)'
              }}
            >
              {topics.map((topic) => {
                const isSelected = selectedTopic === topic.text;
                return (
                  <button
                    key={topic.text}
                    onClick={() => handleTopicClick(topic.text)}
                    style={{
                      background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                      border: isSelected ? '1px solid var(--accent-sky)' : '1px solid transparent',
                      borderRadius: 'var(--radius-md)',
                      color: topic.color,
                      fontSize: `${topic.fontSize}px`,
                      fontWeight: topic.fontSize > 24 ? 700 : 500,
                      cursor: 'pointer',
                      padding: '0.2rem 0.6rem',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <span>{topic.text}</span>
                    <span style={{ fontSize: '0.65rem', opacity: 0.6, verticalAlign: 'super' }}>({topic.count})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Multi-Chat Topic Summary & Detail Surface */}
        <div className="panel" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-purple)' }}>
              <Sparkles size={18} />
              Cross-Chat Topic Synthesis
            </h3>

            {selectedTopic && (
              <button 
                className="btn btn-primary"
                onClick={handleGenerateSynthesis}
                disabled={isSynthesizing}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              >
                {isSynthesizing ? <RefreshCw size={14} className="spin" /> : <Sparkles size={14} />}
                <span>{isSynthesizing ? 'Synthesizing...' : 'Synthesize Topic'}</span>
              </button>
            )}
          </div>

          {!selectedTopic ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
              <BookOpen size={40} style={{ color: 'var(--accent-purple)', marginBottom: '0.75rem', opacity: 0.4 }} />
              <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600 }}>Select a topic to explore</p>
              <p style={{ fontSize: '0.85rem', maxWidth: '320px', marginTop: '0.25rem' }}>
                Click any word in the cloud to view related conversations and generate an aggregated synthesis summary.
              </p>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Selected Topic:</span>
                <span style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.25rem',
                  fontSize: '0.95rem', 
                  fontWeight: 700, 
                  color: 'var(--accent-cyan)',
                  background: 'rgba(6, 182, 212, 0.15)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  <Hash size={14} />
                  {selectedTopic}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  ({matchingConversations.length} {matchingConversations.length === 1 ? 'chat' : 'chats'})
                </span>
              </div>

              {/* Generated Synthesis Card */}
              {synthesisSummary ? (
                <div 
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    color: 'var(--text-primary)',
                    whiteSpace: 'pre-wrap',
                    maxHeight: '260px',
                    overflowY: 'auto'
                  }}
                >
                  {synthesisSummary}
                </div>
              ) : (
                <div 
                  style={{
                    background: 'rgba(15, 23, 42, 0.4)',
                    border: '1px dashed rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem'
                  }}
                >
                  Click "Synthesize Topic" above to generate an aggregated AI summary combining insights across all {matchingConversations.length} chats.
                </div>
              )}

              {/* Related Conversations List */}
              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Referenced Conversations:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '140px', overflowY: 'auto' }}>
                  {matchingConversations.map(conv => (
                    <div 
                      key={conv.id}
                      onClick={() => onSelectConversation(conv.id)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.5rem 0.75rem',
                        background: 'rgba(11, 15, 25, 0.6)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{conv.title}</span>
                      <span style={{ color: 'var(--accent-sky)', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem' }}>
                        <span>Open</span>
                        <ExternalLink size={12} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
