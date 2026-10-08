import React, { useState } from 'react';
import { Settings, Key, Server, Save, CheckCircle2, Shield } from 'lucide-react';

export default function SettingsView({ settings, onSaveSettings }) {
  const [formData, setFormData] = useState(settings || {
    openaiKey: '',
    geminiKey: '',
    anthropicKey: '',
    openrouterKey: '',
    ollamaUrl: 'http://localhost:11434',
    defaultProvider: 'openai'
  });
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="view-container" style={{ maxWidth: '800px' }}>
      <div className="surface-header">
        <h1 className="surface-title">
          <Settings size={24} style={{ color: 'var(--accent-sky)' }} />
          App & LLM Settings
        </h1>
        <p className="surface-desc">Configure your API keys, local Ollama connection, and default preferences.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Security Notice */}
        <div className="panel" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: 'rgba(56, 189, 248, 0.05)', borderColor: 'rgba(56, 189, 248, 0.2)' }}>
          <Shield size={20} style={{ color: 'var(--accent-sky)', flexShrink: 0 }} />
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Your API keys are stored locally in your browser's secure storage. They are never sent to external third-party servers.
          </p>
        </div>

        {/* API Keys Panel */}
        <div className="panel">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-sky)' }}>
            <Key size={18} />
            Cloud LLM API Keys
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                OpenAI API Key
              </label>
              <input
                type="password"
                className="input"
                placeholder="sk-..."
                value={formData.openaiKey}
                onChange={(e) => setFormData({ ...formData, openaiKey: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                Google Gemini API Key
              </label>
              <input
                type="password"
                className="input"
                placeholder="AIzaSy..."
                value={formData.geminiKey}
                onChange={(e) => setFormData({ ...formData, geminiKey: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                Anthropic API Key
              </label>
              <input
                type="password"
                className="input"
                placeholder="sk-ant-..."
                value={formData.anthropicKey}
                onChange={(e) => setFormData({ ...formData, anthropicKey: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Local Ollama Panel */}
        <div className="panel">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-purple)' }}>
            <Server size={18} />
            Local Ollama Endpoint
          </h3>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
              Ollama Server URL
            </label>
            <input
              type="text"
              className="input"
              placeholder="http://localhost:11434"
              value={formData.ollamaUrl}
              onChange={(e) => setFormData({ ...formData, ollamaUrl: e.target.value })}
            />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Ensure Ollama is running on your machine (e.g. <code>ollama serve</code>).
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
          {savedMessage && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-emerald)', fontSize: '0.9rem', fontWeight: 600 }}>
              <CheckCircle2 size={16} />
              Settings saved successfully!
            </span>
          )}
          <button type="submit" className="btn btn-primary">
            <Save size={16} />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
