import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import ChatView from './components/ChatView.jsx';
import HistoryView from './components/HistoryView.jsx';
import TopicsView from './components/TopicsView.jsx';
import SettingsView from './components/SettingsView.jsx';
import { streamChatResponse } from './services/llm.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [currentModel, setCurrentModel] = useState('gpt-4o');
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [activeMessages, setActiveMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [topics, setTopics] = useState([]);
  const [settings, setSettings] = useState({
    openaiKey: '',
    geminiKey: '',
    anthropicKey: '',
    openrouterKey: '',
    ollamaUrl: 'http://localhost:11434',
    defaultProvider: 'openai'
  });

  // Load initial settings
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mindsync_settings');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load settings', e);
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

  const handleSendMessage = async (text) => {
    const userMsg = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...activeMessages, userMsg];
    setActiveMessages(updatedMessages);
    setIsStreaming(true);

    const assistantMsgId = `msg_${Date.now()}_assistant`;
    const initialAssistantMsg = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      recalledSnippets: []
    };

    setActiveMessages([...updatedMessages, initialAssistantMsg]);

    try {
      let fullContent = '';
      const tokenStream = streamChatResponse({
        messages: updatedMessages,
        model: currentModel,
        settings: settings
      });

      for await (const token of tokenStream) {
        fullContent += token;
        setActiveMessages(prev => 
          prev.map(m => m.id === assistantMsgId ? { ...m, content: fullContent } : m)
        );
      }
    } catch (err) {
      console.error('Streaming error:', err);
      setActiveMessages(prev => 
        prev.map(m => m.id === assistantMsgId ? { ...m, content: `Error generating response: ${err.message}` } : m)
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleClearChat = () => {
    setActiveMessages([]);
    setActiveConversationId(null);
  };

  const handleJumpToConversation = (convId) => {
    const conv = conversations.find(c => c.id === convId);
    if (conv) {
      setActiveConversationId(conv.id);
      setActiveMessages(conv.messages || []);
      setActiveTab('chat');
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
            messages={activeMessages}
            onSendMessage={handleSendMessage}
            onClearChat={handleClearChat}
            isStreaming={isStreaming}
            onJumpToConversation={handleJumpToConversation}
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
