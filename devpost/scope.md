---
doc: scope
status: approved
---

# MindSync — AI Second Brain & Chat Hub

A unified, cross-device AI chat workspace that organizes conversations across LLMs, syncs with cloud storage, surfaces frequent topics in an interactive word cloud, and enables cross-chat semantic recall with source snippets.

## The Unique Kernel
Unlike isolated chat windows where past insights disappear into siloed histories, MindSync continuously indexes your conversations across any LLM (BYO API key or Ollama) to a cross-device cloud store. It surfaces your thinking through interactive topic word clouds, multi-chat synthesized summaries, and instant snippet-cited memory recall (*"you mentioned X previously, can you remind me what you said?"*).

## Who It's For
A researcher, developer, or creator who chats with multiple AI models daily across multiple devices and needs a single personal "second brain" that remembers past discussions, extracts overarching themes, and lets them continue conversations anywhere.

## The Core Loop
1. **Chat:** Converse with your LLM of choice (OpenAI, Anthropic, Gemini, OpenRouter, or local Ollama).
2. **Sync & Index:** Chats are automatically synced to cloud storage and semantically indexed.
3. **Explore & Synthesize:** View an interactive word cloud of top discussed topics and trigger instant multi-chat summaries for any topic.
4. **Recall:** Ask recall questions in any chat; MindSync retrieves and displays the exact relevant snippet from past conversations alongside the LLM's response.

## Inspiration & Identity
- Modern, high-craft dark mode interface (clean typography, glassmorphism, fluid micro-interactions).
- Responsive, cross-platform accessible design (desktop and mobile browser friendly).

## Why This Matters to the Learner
To create a high-leverage personal second brain while mastering rapid prototyping using AI coding agents.

## What "Working" Looks Like
1. The user connects their preferred LLM (BYO API key or Ollama endpoint).
2. The user has 2–3 conversations on distinct topics (e.g. system architecture, recipe ideas, book notes).
3. The dashboard displays a vibrant, interactive word cloud reflecting the discussed topics.
4. Clicking a topic word aggregates all relevant chats and generates an AI synthesis summary.
5. In a new chat session, the user asks *"What did we discuss earlier about [topic]?"*—the system retrieves the exact past transcript snippet and answers seamlessly.

## The POC Boundary
- **In Scope (Now):**
  - Multi-LLM provider support (OpenAI / Gemini / Anthropic / OpenRouter / Ollama).
  - Cloud-persisted conversation store for cross-device continuity.
  - Semantic / keyword indexing engine for cross-chat search.
  - Snippet-level memory retrieval and injection with citation cards.
  - Interactive topic word cloud visualization.
  - Multi-chat topic summarization view.
- **Later:**
  - File/PDF attachment indexing.
  - Voice memo input and speech synthesis.
  - Export to Obsidian / Notion.
- **Explicitly Cut:**
  - Multi-user team collaboration & access control (focused solely on a personal second brain).
  - Custom plugin marketplace (unnecessary for the core proof of concept).
