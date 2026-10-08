import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import ChatView from './components/ChatView.jsx';
import HistoryView from './components/HistoryView.jsx';
import TopicsView from './components/TopicsView.jsx';
import SettingsView from './components/SettingsView.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [currentModel, setCurrentModel] = useState('gpt-4o');
  const [conversations, setConversations] = useState([]);
  const [topics, setTopics] = useState([]);
  const [settings, setSettings] = useState({
    openaiKey: '',
    geminiKey: '',
    anthropicKey: '',
    openrouterKey: '',
    ollamaUrl: 'http://localhost:11434',
    defaultProvider: 'openai'
  });

  // Load initial settings from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mindsync_settings');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load settings from storage', e);
    }
  }, []);

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('mindsync_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  };

  return (
    <div className="app-container">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentModel={currentModel} 
      />

      <main className="main-surface">
        {activeTab === 'chat' && (
          <ChatView 
            currentModel={currentModel} 
            onSelectModel={setCurrentModel} 
          />
        )}

        {activeTab === 'history' && (
          <HistoryView 
            conversations={conversations} 
          />
        )}

        {activeTab === 'topics' && (
          <TopicsView 
            topics={topics} 
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView 
            settings={settings} 
            onSaveSettings={handleSaveSettings} 
          />
        )}
      </main>
    </div>
  );
}
