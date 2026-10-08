import React from 'react';
import { Cloud, Sparkles, BookOpen } from 'lucide-react';

export default function TopicsView({ topics = [] }) {
  return (
    <div className="view-container">
      <div className="surface-header">
        <h1 className="surface-title">
          <Cloud size={24} style={{ color: 'var(--accent-cyan)' }} />
          Topics & Second Brain Insights
        </h1>
        <p className="surface-desc">Dynamic topic word cloud and AI-synthesized cross-chat summaries.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* Word Cloud Surface */}
        <div className="panel" style={{ minHeight: '320px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-sky)' }}>
            <Cloud size={18} />
            Topic Word Cloud
          </h3>

          {topics.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
              <Cloud size={36} style={{ color: 'var(--accent-cyan)', marginBottom: '0.75rem', opacity: 0.4 }} />
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>Word cloud is currently empty</p>
              <p style={{ fontSize: '0.85rem' }}>As you chat across different subjects, frequent topics will dynamically scale here.</p>
            </div>
          ) : (
            <div style={{ flex: 1, position: 'relative' }}>
              {/* Dynamic SVG Word Cloud in Slice 4 */}
            </div>
          )}
        </div>

        {/* Multi-Chat Topic Summary Surface */}
        <div className="panel" style={{ minHeight: '320px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-purple)' }}>
            <Sparkles size={18} />
            Cross-Chat Synthesis
          </h3>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
            <BookOpen size={36} style={{ color: 'var(--accent-purple)', marginBottom: '0.75rem', opacity: 0.4 }} />
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>Select a topic to synthesize</p>
            <p style={{ fontSize: '0.85rem' }}>Click any word in the cloud to extract aggregated insights across all relevant chats.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
