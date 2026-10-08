import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar.jsx';
import ChatView from './components/ChatView.jsx';
import HistoryView from './components/HistoryView.jsx';
import TopicsView from './components/TopicsView.jsx';
import SettingsView from './components/SettingsView.jsx';
import { streamChatResponse } from './services/llm.js';
import { getStoredConversations, saveConversation, deleteConversation } from './services/storage.js';
import { extractTopicsFromConversations } from './utils/wordcloud.js';
import { MemoryIndexer } from './services/indexer.js';

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

  const indexerRef = useRef(new MemoryIndexer([]));

  // Load initial settings and conversations
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('mindsync_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (e) {
      console.warn('Failed to load settings', e);
    }

    const storedConvs = getStoredConversations();
    setConversations(storedConvs);
    setTopics(extractTopicsFromConversations(storedConvs));
    indexerRef.current = new MemoryIndexer(storedConvs);
  }, []);

  // Recalculate topics & index whenever conversations update
  useEffect(() => {
    setTopics(extractTopicsFromConversations(conversations));
    indexerRef.current = new MemoryIndexer(conversations);
  }, [conversations]);

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

    // Create or determine conversation ID
    const convId = activeConversationId || `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    if (!activeConversationId) {
      setActiveConversationId(convId);
    }

    // 1. Search semantic memory for relevant past snippets
    const recalledSnippets = indexerRef.current.search(text, activeConversationId, 3);
    
    // 2. Build system prompt context if snippets were recalled
    let memorySystemPrompt = '';
    if (recalledSnippets.length > 0) {
      const contextBlocks = recalledSnippets.map((s, idx) => 
        `[Memory Reference #${idx + 1} from chat "${s.conversationTitle}"]: "${s.text}"`
      ).join('\n\n');

      memorySystemPrompt = `You are MindSync, an intelligent second brain assistant. The user is asking you a question, and your indexing engine retrieved these relevant excerpts from their past conversations:\n\n${contextBlocks}\n\nUse this recalled context naturally and conversationally to answer the user's inquiry accurately and remind them of what was discussed.`;
    }

    const assistantMsgId = `msg_${Date.now()}_assistant`;
    const initialAssistantMsg = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      recalledSnippets: recalledSnippets
    };

    const streamingMessagesList = [...updatedMessages, initialAssistantMsg];
    setActiveMessages(streamingMessagesList);

    try {
      let fullContent = '';
      const tokenStream = streamChatResponse({
        messages: updatedMessages,
        model: currentModel,
        settings: settings,
        systemPromptContext: memorySystemPrompt
      });

      for await (const token of tokenStream) {
        fullContent += token;
        setActiveMessages(prev => 
          prev.map(m => m.id === assistantMsgId ? { ...m, content: fullContent } : m)
        );
      }

      // Persist completed turn to storage
      const finalAssistantMsg = { ...initialAssistantMsg, content: fullContent };
      const finalMessageHistory = [...updatedMessages, finalAssistantMsg];

      // Generate a title if new conversation
      const conversationTitle = activeMessages.length === 0 
        ? (text.length > 35 ? text.slice(0, 35) + '...' : text)
        : (conversations.find(c => c.id === convId)?.title || text.slice(0, 35));

      const conversationDoc = {
        id: convId,
        title: conversationTitle,
        model: currentModel,
        messages: finalMessageHistory,
        topics: text.toLowerCase().match(/\b[a-zA-Z]{4,15}\b/g)?.slice(0, 3) || ['general']
      };

      const updatedConvs = saveConversation(conversationDoc);
      setConversations(updatedConvs);
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

  const handleSelectConversation = (convId) => {
    const conv = conversations.find(c => c.id === convId);
    if (conv) {
      setActiveConversationId(conv.id);
      setActiveMessages(conv.messages || []);
      setCurrentModel(conv.model || 'gpt-4o');
      setActiveTab('chat');
    }
  };

  const handleDeleteConversation = (convId) => {
    const updated = deleteConversation(convId);
    setConversations(updated);
    if (activeConversationId === convId) {
      handleClearChat();
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
            onJumpToConversation={handleSelectConversation}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView 
            conversations={conversations} 
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={handleDeleteConversation}
          />
        )}

        {activeTab === 'topics' && (
          <TopicsView 
            topics={topics} 
            conversations={conversations}
            onSelectConversation={handleSelectConversation}
            currentModel={currentModel}
            settings={settings}
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
