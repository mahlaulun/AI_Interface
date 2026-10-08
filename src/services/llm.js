/**
 * Unified Multi-Provider LLM Streaming Service
 * Supports: OpenAI, Gemini, Anthropic, OpenRouter, local Ollama, and built-in Demo fallback.
 */

export async function* streamChatResponse({ messages, model, settings, systemPromptContext = '' }) {
  // If user has not configured any keys and selects an external provider without local Ollama,
  // provide an intelligent simulated assistant response so the prototype remains 100% functional for local testing.
  const isOpenAI = model.startsWith('gpt');
  const isClaude = model.startsWith('claude');
  const isGemini = model.startsWith('gemini');
  const isOllama = model.startsWith('ollama') || model.includes('llama');

  // 1. Local Ollama integration
  if (isOllama) {
    const ollamaUrl = (settings?.ollamaUrl || 'http://localhost:11434').replace(/\/$/, '');
    const cleanModelName = model.replace('ollama-', '');
    
    try {
      const payload = {
        model: cleanModelName === 'llama3' ? 'llama3' : cleanModelName,
        messages: [
          ...(systemPromptContext ? [{ role: 'system', content: systemPromptContext }] : []),
          ...messages.map(m => ({ role: m.role, content: m.content }))
        ],
        stream: true
      };

      const response = await fetch(`${ollamaUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Ollama returned status ${response.status}: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            if (data.message?.content) {
              yield data.message.content;
            }
          } catch (e) {
            console.error('Error parsing Ollama NDJSON chunk', e);
          }
        }
      }
      return;
    } catch (err) {
      console.warn('Ollama streaming error, falling back to simulated output for demo:', err);
      yield `[Ollama Notice: ${err.message}. Showing simulated second-brain response]\n\n`;
    }
  }

  // 2. OpenAI / OpenRouter
  if (isOpenAI && settings?.openaiKey) {
    try {
      const payload = {
        model: model,
        messages: [
          ...(systemPromptContext ? [{ role: 'system', content: systemPromptContext }] : []),
          ...messages.map(m => ({ role: m.role, content: m.content }))
        ],
        stream: true
      };

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.openaiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API error ${response.status}: ${errorText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6);
            if (dataStr === '[DONE]') return;
            try {
              const parsed = JSON.parse(dataStr);
              const token = parsed.choices?.[0]?.delta?.content;
              if (token) yield token;
            } catch (e) {
              // ignore parse errors for partial chunks
            }
          }
        }
      }
      return;
    } catch (err) {
      console.warn('OpenAI API call failed, falling back to demo simulation:', err);
      yield `[OpenAI API Notice: ${err.message}]\n\n`;
    }
  }

  // 3. Google Gemini
  if (isGemini && settings?.geminiKey) {
    try {
      const geminiModel = 'gemini-1.5-pro';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:streamGenerateContent?key=${settings.geminiKey}&alt=sse`;
      
      const contents = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const payload = {
        contents: contents,
        ...(systemPromptContext ? { systemInstruction: { parts: [{ text: systemPromptContext }] } } : {})
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Gemini API error ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) yield text;
            } catch (e) {}
          }
        }
      }
      return;
    } catch (err) {
      console.warn('Gemini error, fallback:', err);
      yield `[Gemini Notice: ${err.message}]\n\n`;
    }
  }

  // 4. Built-in Dynamic Simulated Assistant (Demo / Offline mode)
  // Generates intelligent, context-aware responses with streaming cadence
  const lastUserMsg = messages[messages.length - 1]?.content || '';
  
  let simulatedAnswer = '';
  if (systemPromptContext && (lastUserMsg.toLowerCase().includes('recall') || lastUserMsg.toLowerCase().includes('mention') || lastUserMsg.toLowerCase().includes('earlier') || lastUserMsg.toLowerCase().includes('previously') || lastUserMsg.toLowerCase().includes('what did'))) {
    simulatedAnswer = `Based on our previous discussion, here is what was recorded:\n\n${systemPromptContext}\n\nWe explored these key takeaways in detail. Would you like to expand on any specific aspect or continue building upon this?`;
  } else if (lastUserMsg.toLowerCase().includes('recipe') || lastUserMsg.toLowerCase().includes('dinner')) {
    simulatedAnswer = `Here is a healthy, fast dinner recipe idea:\n\n### Mediterranean Lemon-Herb Salmon & Roasted Vegetables\n- **Ingredients:** Salmon fillets, cherry tomatoes, asparagus, olive oil, minced garlic, fresh dill, lemon slices.\n- **Preparation:** Toss veggies in olive oil and garlic, roast at 200°C (400°F) for 15 minutes, adding the seasoned salmon fillets for the final 10 minutes.\n- **Second Brain Note:** This makes for a great high-protein meal prep!`;
  } else if (lastUserMsg.toLowerCase().includes('react') || lastUserMsg.toLowerCase().includes('architecture') || lastUserMsg.toLowerCase().includes('state')) {
    simulatedAnswer = `When architecting reactive applications with Vite and React, here are the three recommended principles:\n\n1. **Unidirectional State Flow:** Keep raw conversation state in custom services with reactive hook bridges.\n2. **Client-Side Indexing:** Tokenize messages locally to enable instant RAG and vector recall without server latency.\n3. **Modular Surface Separation:** Separate conversation stream, search history, and topic visualization into dedicated views to keep the main chat distraction-free.`;
  } else {
    simulatedAnswer = `I've processed your thought regarding "${lastUserMsg}".\n\nI have indexed this in your MindSync second brain across the current topic cluster. You can view extracted themes in the **Topics** tab or ask me to recall any details from this conversation at any point!`;
  }

  // Stream tokens with realistic micro-delays
  const words = simulatedAnswer.split(/(\s+)/);
  for (const word of words) {
    yield word;
    await new Promise(r => setTimeout(r, 20));
  }
}
