---
doc: prd
status: approved
---

# MindSync — Product Requirements Document (PRD)

A minimalist, cross-device AI chat workspace and second brain that organizes conversations across LLMs, syncs to cloud storage, provides a sortable/filterable history view, visualizes frequent topics in a dynamic word cloud, and enables natural cross-chat memory recall with verifiable source snippets.

*Source:* `scope.md > The Unique Kernel` and `scope.md > The Core Loop`.

## The Core Journey
1. **Initial Setup & First Arrival:** User opens MindSync. The interface is clean and minimal. On first load, the word cloud and history start blank without clutter. User can enter their API key (OpenAI / Gemini / Anthropic) or connect their local Ollama instance in Settings.
2. **Conversation & Automatic Indexing:** User chats naturally with their chosen model. When the chat completes or pauses, MindSync automatically syncs the conversation to the cloud store and extracts keywords/embeddings into the index.
3. **Exploring Topics (Word Cloud & Synthesis):** User navigates to the **Topics** tab. As conversations accumulate, an interactive Word Cloud displays the most frequent themes. Clicking a topic word shows all related conversations and produces an aggregated summary across those chats.
4. **Browsing History:** User navigates to the separate **History** view. Conversations can be sorted (newest/oldest, message count) and filtered (by topic, keyword, or model).
5. **Conversational Memory Recall:** In any active or new chat session, the user can ask questions like *"You mentioned something about X earlier, what did you say?"*. The LLM replies naturally in the conversation while providing an unobtrusive citation badge showing the exact past chat snippet referenced.

## Screens and Layout
A clean top navigation bar allows switching between 4 focused views:

1. **Chat Workspace (`/chat`):**
   - Header with active Model Switcher dropdown (e.g. `GPT-4o`, `Claude 3.5 Sonnet`, `Gemini 1.5 Pro`, `Ollama / Llama3`).
   - Clean message stream with markdown formatting and code highlighting.
   - Conversational assistant replies with subtle "🧠 Ref: [Chat Date/Topic]" expandable source snippet badges when historical memory is recalled.
   - Minimal bottom input bar with Send and Clear actions.
2. **History View (`/history`):**
   - Dedicated separate full surface.
   - Search bar for instant text matching.
   - Sort controls (Date Newest/Oldest, Title A-Z, Message Count).
   - Filter dropdowns (by LLM Provider, by Topic).
   - Card list of past conversations; clicking a card opens the chat transcript.
3. **Topics & Insights (`/topics`):**
   - Dynamic Word Cloud visualization (blank on startup, dynamically scales word weights based on conversation content).
   - Topic Inspector panel: clicking any word in the cloud highlights related chats and triggers a synthesized multi-chat summary.
4. **Settings (`/settings`):**
   - BYO API keys configuration (OpenAI, Anthropic, Gemini, OpenRouter).
   - Ollama host endpoint configuration (e.g. `http://localhost:11434`).
   - Cloud Sync status indicator and storage export.

## Look and Feel
- **Aesthetic:** Minimalist, high-focus dark mode (obsidian/slate background `#090d16`, subtle border lines, soft contrast `#f1f5f9` text).
- **Typography:** Modern, crisp sans-serif font stack with high readability.
- **Accents:** Subtle cyan and violet indicator accents for memory recall badges and interactive topic nodes.
- **Micro-interactions:** Smooth fade transitions between views, subtle word hover states in the cloud.

## Features and Behavior

### Multi-LLM Chatting & Switching
- User can toggle between cloud LLMs (OpenAI, Gemini, Anthropic) or local Ollama anytime.
- Streaming responses with real-time text generation.
- **Acceptance Criteria:**
  - [ ] User can send a prompt and receive streaming response from selected provider.
  - [ ] Changing provider updates the active model indicator instantly.

### Natural Conversational Memory Recall
- When a user's prompt inquires about prior discussions (*"you mentioned X previously..."* or general semantic queries), the system searches the index.
- The assistant incorporates the retrieved context naturally into its conversational response.
- A subtle, non-intrusive snippet citation tag is attached. Expanding it reveals the exact historical quote, date, and chat origin, with a **"Jump to Conversation"** button to immediately open and view the full source chat transcript.
- **Acceptance Criteria:**
  - [ ] Asking a recall question retrieves relevant past conversation snippets.
  - [ ] Assistant response references the past fact accurately and naturally.
  - [ ] Clicking the citation tag reveals the exact snippet, origin timestamp, and an action to open the full referenced conversation.

### Dynamic Word Cloud & Topic Synthesis
- Extracted keywords from indexed conversations populate the word cloud.
- Word size correlates with frequency/relevance across conversations.
- Clicking a word displays:
  1. A list of matching chats containing that topic.
  2. A generated multi-chat synthesis summary combining insights from those discussions.
- **Acceptance Criteria:**
  - [ ] Word cloud renders dynamically based on indexed chat transcripts (blank on initial startup).
  - [ ] Clicking a word filters related conversations and triggers topic synthesis.

### Separate Sortable & Filterable History View
- Standalone view dedicated to organizing past chats.
- Real-time search by keyword.
- Sorting by date (desc/asc) and filtering by model or extracted tag.
- **Acceptance Criteria:**
  - [ ] User can search, sort, and filter conversation history.
  - [ ] Selecting a past chat loads the full transcript into the conversation view.

## States and Boundaries
- **First Load (Empty State):** Word cloud is blank; history list displays an inviting empty state; chat starts with a clean prompt input.
- **Normal Operation:** Messages stream smoothly; sync updates after each assistant turn.
- **Offline / Local Mode:** If cloud sync or external API is unavailable, local Ollama or cached storage maintains usability.
- **Persistence:** All chats, settings, and indices persist across sessions via the cloud-enabled storage engine.

## Product Decisions
- **Dedicated History View instead of Sidebar:** Keeps the chat surface distraction-free and allows powerful multi-column sorting, filtering, and bulk management.
- **Natural Conversational Recall with Citation Badges:** Keeps chat flow feeling like a human dialogue while ensuring verifiable facts via source snippet inspection.
- **Blank Initial Word Cloud:** Avoids distracting mock data; grows organically as the user builds their second brain.

## What We're Building (POC)
1. Multi-LLM chat client (BYO keys / Ollama).
2. Cloud-persisted conversation store for cross-device access.
3. In-memory / semantic indexer for past conversation search.
4. Natural memory recall in chat with expandable snippet citations.
5. Interactive Word Cloud dashboard with multi-chat topic synthesis.
6. Separate sortable and filterable History view.

## Deferred From the POC
- PDF/File upload & OCR parsing.
- Audio voice recording & speech-to-text.
- Export to Notion/Obsidian markdown vaults.

## Non-Goals
- Multi-user team collaboration / enterprise access control.
- Public marketplace of third-party plugins.

## Open Questions
- None blocking technical specification.
