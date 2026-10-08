---
doc: spec
status: approved
---

# MindSync — Technical Specification

A technical blueprint for MindSync, an AI second brain and multi-LLM workspace built for rapid prototyping, cross-device conversation sync, interactive topic exploration, and natural snippet-cited memory recall.

## How This Works, In Plain Language
MindSync runs as a modern, reactive single-page application with a lightweight backend proxy. When you chat with an AI (using OpenAI, Gemini, Anthropic, or local Ollama), MindSync streams the assistant's reply in real-time. Once the turn completes, the conversation is automatically saved to the storage store and parsed by the in-browser indexing engine.

The indexing engine extracts key topics (powering the dynamic Word Cloud) and tokenizes message turns into searchable semantic memory snippets. When you ask a recall question (*"What did we discuss earlier about X?"*), MindSync queries the memory index, injects the relevant context snippet into the prompt, and attaches an interactive citation tag to the assistant's response so you can review the exact source snippet and jump directly to that past conversation.

## The Core Journey Through the System
1. **User enters API Key or connects Ollama:** Saved locally in browser `localStorage` and verified against the model provider endpoint.
2. **User sends a chat message:** `ChatView` sends the message history to `llm.js`. The engine queries `indexer.js` for relevant past conversation snippets. If relevant snippets are found, they are injected into the system prompt context.
3. **Streaming Response & Citation Tag:** As the LLM streams the answer, any referenced past conversation is marked with a citation badge. Clicking it reveals the snippet and offers a "Jump to Conversation" button.
4. **Auto-Sync & Indexing:** `storage.js` writes the updated conversation document. `indexer.js` updates topic frequencies and index chunks.
5. **Browsing Topics & Synthesis:** `TopicsView` renders an interactive SVG Word Cloud. Clicking a word queries all conversations containing that topic and calls the LLM to generate an aggregated cross-chat synthesis.
6. **Browsing History:** `HistoryView` loads all conversations from `storage.js`, providing live search, sorting (date, message count), and filtering (by topic or model).

*Implements:* `prd.md > The Core Journey`.

## Stack
- **Frontend Framework:** React 18 + Vite (Fast development, instant HMR, rapid prototyping).
- **Styling:** Vanilla CSS design system (Dark obsidian theme, zero Tailwind/framework bloat).
- **Backend / Proxy:** Node.js Express (for Ollama CORS proxying and optional cloud storage endpoint).
- **Vector & Memory Indexing:** Client-side hybrid TF-IDF & Cosine Similarity vector indexer.
- **Visualizations:** Custom SVG/Canvas dynamic Word Cloud with force-directed cluster layout.

## Where It Runs and How Someone Tries It
- **Local Runtime:** Node.js (v18+).
- **Start Command:** `npm run dev`
- **Access URL:** `http://localhost:5173`
- **Submission Demo:** 1-minute screen recording demonstrating:
  1. Setting up model provider / Ollama.
  2. Having 2 chats across different topics.
  3. Viewing the dynamic Word Cloud & generating a multi-chat topic synthesis.
  4. Asking a memory recall question and clicking the snippet citation badge to jump to the original conversation.

## Look and Feel
- **Theme:** Minimalist Obsidian Dark (`#090d16` background, `#131b2e` secondary, `#1e293b` borders).
- **Typography:** Crisp sans-serif font stack (`Inter`, system-ui).
- **Accents:** Electric Cyan (`#06b6d4`), Royal Blue (`#3b82f6`), Emerald (`#10b981`).
- **Pacing & Density:** Clean, uncluttered layout with generous spacing and instant navigation transitions.

## Components

### `App.jsx`
Main application container and view router.
*Implements:* `prd.md > Screens and Layout`.

### `ChatView.jsx`
Interactive conversation workspace. Features model selector dropdown, streaming message bubble list, memory citation badges, and prompt input.
*Implements:* `prd.md > Multi-LLM Chatting & Switching` and `prd.md > Natural Conversational Memory Recall`.

### `HistoryView.jsx`
Standalone surface for browsing, searching, sorting (date/count), and filtering past conversations.
*Implements:* `prd.md > Separate Sortable & Filterable History View`.

### `TopicsView.jsx`
Dynamic Word Cloud visualization and multi-chat topic synthesis panel.
*Implements:* `prd.md > Dynamic Word Cloud & Topic Synthesis`.

### `SettingsView.jsx`
Configuration panel for API keys (OpenAI, Gemini, Anthropic, OpenRouter) and Ollama host URL.
*Implements:* `prd.md > Screens and Layout`.

### `services/llm.js`
Unified multi-provider LLM client supporting streaming from OpenAI, Google Gemini, Anthropic, and local Ollama.

### `services/indexer.js`
Client-side memory retrieval and topic extractor. Builds an in-memory inverted index + vector embeddings for instant semantic search.

### `services/storage.js`
Storage layer providing structured JSON conversation persistence and cloud sync capabilities.

## Data Model

### `Conversation`
```json
{
  "id": "conv_1728364000_abc",
  "title": "React Architecture Discussion",
  "model": "gpt-4o",
  "provider": "openai",
  "createdAt": "2026-10-08T17:30:00.000Z",
  "updatedAt": "2026-10-08T17:35:00.000Z",
  "topics": ["react", "state-management", "vite"],
  "messages": [
    {
      "id": "msg_1",
      "role": "user",
      "content": "How should we organize state in Vite?",
      "timestamp": "2026-10-08T17:30:00.000Z"
    },
    {
      "id": "msg_2",
      "role": "assistant",
      "content": "You can use React Context with custom hooks...",
      "timestamp": "2026-10-08T17:30:05.000Z",
      "recalledSnippets": []
    }
  ]
}
```

### `MemoryIndexChunk`
```json
{
  "id": "chunk_conv_123_msg_2",
  "conversationId": "conv_1728364000_abc",
  "conversationTitle": "React Architecture Discussion",
  "role": "assistant",
  "text": "You can use React Context with custom hooks...",
  "topics": ["react", "state-management"],
  "timestamp": "2026-10-08T17:30:05.000Z"
}
```

## File Structure

```
AI_Interface/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── ChatView.jsx
│   │   ├── HistoryView.jsx
│   │   ├── TopicsView.jsx
│   │   ├── SettingsView.jsx
│   │   └── CitationBadge.jsx
│   ├── services/
│   │   ├── llm.js
│   │   ├── indexer.js
│   │   └── storage.js
│   └── utils/
│       └── wordcloud.js
├── devpost/
│   ├── learner-profile.md
│   ├── scope.md
│   ├── prd.md
│   └── spec.md
└── .gitignore
```

## External Services and Dependencies
- **OpenAI API / OpenRouter / Anthropic / Gemini:** Standard Chat Completions HTTP streaming endpoints.
- **Ollama:** Local HTTP endpoint (`http://localhost:11434/api/chat`).
- **Dependencies:** `react`, `react-dom`, `lucide-react` (clean icons), `vite`.

## Important Failure Modes
- **Invalid API Key or Offline Ollama:** Displays clear in-app notification with a direct link to Settings.
- **No Matching Memory Snippets:** The LLM proceeds with normal conversation without hallucinating fake citations.
- **Empty Chat History:** Topics and History surfaces render clean, elegant empty state placeholders.

## What Was Simplified and Why
- **In-Browser TF-IDF & Vector Indexer** instead of an external vector DB server: Zero infrastructure overhead, private, and runs completely client-side in milliseconds for hundreds of chats.
- **Local + Cloud JSON Storage** instead of a full relational database: Keeps the proof-of-concept lightweight, fully portable, and easily synced.

## Decisions and Open Issues
- **Learner Choice:** Master rapid prototyping with coding agents by keeping the stack lean, modular, and instantly verifiable.
- **Clarified Uncertainty:** Addressed cross-device continuity and local Ollama CORS proxying via a lightweight adapter layer.
