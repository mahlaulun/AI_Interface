---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast


## Slices

- [ ] **1. Scaffold & 4-Surface Navigation Shell**
  Becomes usable: A running web application with the obsidian dark design system, top navigation switching between Chat, History, Topics, and Settings surfaces, and responsive layout.
  Why now: Establishes the visual shell and component routing so all feature slices have a clean place to integrate.
  PRD ref: `prd.md > Screens and Layout`, `prd.md > Look and Feel`
  Spec ref: `spec.md > Components`, `spec.md > File Structure`, `spec.md > Look and Feel`
  Build: Initialize React + Vite setup, create global `index.css` styling tokens, `Navbar.jsx`, and surface placeholders (`ChatView`, `HistoryView`, `TopicsView`, `SettingsView`).
  Verify (mechanical): Start dev server with `npm run build` & check clean render without runtime errors.
  Learner check: Open the app at `http://localhost:5173`, click through all 4 navigation tabs, and verify the clean obsidian dark UI layout.
  Commit: `Scaffold React app with 4-surface navigation and obsidian theme`

- [ ] **2. Unified Multi-LLM Chatting & Model Switching**
  Becomes usable: Real-time chat workspace where you can switch between models (OpenAI, Gemini, Anthropic, Ollama), enter API keys in Settings, and stream responses.
  Why now: Chatting with your LLM of choice is the primary interaction loop.
  PRD ref: `prd.md > Multi-LLM Chatting & Switching`
  Spec ref: `spec.md > Components > ChatView.jsx`, `spec.md > services/llm.js`
  Build: Implement `services/llm.js` unified streaming adapter, connect `SettingsView` API keys/Ollama URL, and wire up `ChatView.jsx` with message streaming.
  Verify (mechanical): Send a test prompt and observe streaming tokens received from the client adapter.
  Learner check: Configure an API key or local Ollama endpoint in Settings, send a chat message, and verify the streaming response renders smoothly.
  Commit: `Add unified multi-LLM streaming client and chat interface`

- [ ] **3. Persistent Conversation Store & Sortable/Filterable History**
  Becomes usable: Chats automatically persist to structured JSON storage; navigating to History allows searching, sorting (date/count), and filtering (by model or topic) past chats.
  Why now: Persistence ensures conversations survive reloads and sets up the dataset needed for indexing and word clouds.
  PRD ref: `prd.md > Separate Sortable & Filterable History View`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Components > HistoryView.jsx`, `spec.md > services/storage.js`, `spec.md > Data Model`
  Build: Implement `services/storage.js` for JSON conversation management and build `HistoryView.jsx` with search, sorting, and topic filtering.
  Verify (mechanical): Create two distinct conversations, verify they write to storage, and verify sorting/filtering correctly lists both.
  Learner check: Have two conversations, open the History tab, try sorting by date, and click a conversation to load its transcript.
  Commit: `Implement conversation storage engine and sortable history view`

- [ ] **4. Dynamic Word Cloud & Multi-Chat Topic Synthesizer**
  Becomes usable: The Topics view visualizes an interactive SVG Word Cloud reflecting frequent discussion themes; clicking any topic aggregates matching chats and generates an AI summary.
  Why now: Delivers the core visual second-brain synthesis capability across stored conversations.
  PRD ref: `prd.md > Dynamic Word Cloud & Topic Synthesis`
  Spec ref: `spec.md > Components > TopicsView.jsx`, `spec.md > utils/wordcloud.js`
  Build: Implement keyword frequency analysis in `utils/wordcloud.js`, render interactive SVG Word Cloud in `TopicsView.jsx`, and connect click-to-summarize topic AI synthesis.
  Verify (mechanical): Pass mock/stored conversation texts to the topic extractor and verify word weight calculation and synthesis generation.
  Learner check: Open the Topics tab, view the generated Word Cloud, click a word, and observe the filtered chat list and multi-chat synthesis.
  Commit: `Add dynamic SVG word cloud and multi-chat topic synthesis`

- [ ] **5. Natural Conversational Memory Recall with Snippet Citations & Jump-to-Chat**
  Becomes usable: Asking recall questions (*"What did we discuss earlier about X?"*) retrieves relevant past conversation snippets, attaches an expandable citation badge, and allows jumping directly to the source conversation.
  Why now: Completes the unique second brain kernel, tying together indexing, semantic recall, and chat continuity.
  PRD ref: `prd.md > Natural Conversational Memory Recall`
  Spec ref: `spec.md > services/indexer.js`, `spec.md > Components > CitationBadge.jsx`
  Build: Implement `services/indexer.js` for semantic memory retrieval, update `llm.js` system prompt context injection, and create `CitationBadge.jsx` with "Jump to Conversation" action.
  Verify (mechanical): Index two distinct chats, query a specific past fact, and verify retrieval returns the correct chunk with conversation ID.
  Learner check: Ask the assistant *"What did we discuss earlier about [topic]?"*, check the citation badge, and click "Jump to Conversation" to open the referenced chat.
  Commit: `Implement semantic memory recall engine and snippet citation badges`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — Slice 2 (Multi-LLM chat streaming tested)
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: 
Route and stops: 
Edit outcome: 
Reflection: 
Activity mode: 

## Revisions

