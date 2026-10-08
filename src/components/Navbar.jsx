import React from 'react';
import { MessageSquare, History, Cloud, Settings, Brain } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, currentModel }) {
  const navItems = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'history', label: 'History', icon: History },
    { id: 'topics', label: 'Topics & Insights', icon: Cloud },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="navbar">
      <div className="brand" onClick={() => setActiveTab('chat')}>
        <div className="brand-icon">
          <Brain size={20} />
        </div>
        <span>MindSync</span>
      </div>

      <nav className="nav-links">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-tab ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="nav-actions">
        <div className="model-pill">
          <span className="status-dot"></span>
          <span>{currentModel || 'gpt-4o'}</span>
        </div>
      </div>
    </header>
  );
}
