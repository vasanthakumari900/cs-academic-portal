// src/services/groqService.js
// Groq AI integration for the CS Academic Portal chatbot with multi-modal features.
// Free tier: 30 req/min. Models: Llama 3.3, Mixtral, etc.

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
];

const SYSTEM_PROMPT = `You are a professional AI Assistant (powered by advanced LLM technology, similar to ChatGPT and Gemini) for the CS Academic Portal.
You are warm, articulate, intelligent, and highly knowledgeable in Computer Science and general topics.

BEHAVIOR AND CONVERSATIONAL GUIDELINES:
1. Greetings & Casual Interaction:
   - When the user says "hi", "hello", "hey", or engages in casual greeting, respond naturally, warmly, and concisely like ChatGPT or Gemini (e.g. "Hello! How can I help you today?").
   - NEVER dump long bulleted lists, numbered menus of 6 options, or rigid robotic templates for simple greetings unless the user explicitly asks for portal options.

2. Professional AI Conversational Tone:
   - Adapt your tone and length naturally: concise and friendly for greetings, detailed and structured with code blocks and explanations for technical queries.
   - Speak fluently, empathetically, and professionally like ChatGPT and Gemini.

3. Expertise & Capabilities:
   - Computer Science Topics: Programming (Python, C++, Java, JavaScript, React, SQL, PHP, ASP.NET), Data Structures & Algorithms, Operating Systems, Database Systems, Web Tech, Artificial Intelligence, Machine Learning, Computer Networks, and General Knowledge.
   - Portal Navigation: Assist users with finding Lecture Notes, E-Content Videos, Question Papers, Placements, Assignments, or Faculty Info when requested.
   - Document Summarization & RAG Q&A: Provide clear summaries and page-grounded explanations for academic documents.`;

function buildMessages(history, message, extraContext = "") {
  let sysContent = SYSTEM_PROMPT;
  if (extraContext) {
    sysContent += `\n\n[ATTACHED CONTEXT / DOCUMENT]:\n${extraContext}`;
  }

  const messages = [{ role: "system", content: sysContent }];
  const recentHistory = history.slice(-10);

  for (const msg of recentHistory) {
    messages.push({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    });
  }

  messages.push({ role: "user", content: message });
  return messages;
}

async function tryModel(apiKey, model, history, message, extraContext = "") {
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: buildMessages(history, message, extraContext),
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 0.9,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const status = response.status;
    const errorMessage = errorData?.error?.message || response.statusText;
    return { success: false, status, errorMessage };
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;

  if (!text) {
    return { success: true, text: "I couldn't process that response. Could you rephrase your question?" };
  }

  return { success: true, text: text.trim() };
}

/**
 * Send a message to Groq AI with optional document/file context
 */
export async function sendMessage(history, message, extraContext = "") {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    // Smart local AI fallback if key is missing
    return generateLocalFallbackResponse(message, extraContext);
  }

  let lastError = null;

  for (const model of GROQ_MODELS) {
    try {
      const result = await tryModel(apiKey, model, history, message, extraContext);
      if (result.success) return result.text;

      lastError = result;
      if (result.status !== 429) break;
    } catch (error) {
      lastError = { status: 0, errorMessage: error.message };
      break;
    }
  }

  if (lastError?.status === 429) {
    return "⚠️ Rate limit reached. Using fallback AI response:\n\n" + generateLocalFallbackResponse(message, extraContext);
  }

  return generateLocalFallbackResponse(message, extraContext);
}

/**
 * Smart offline / keyless AI response fallback engine so chatbot ALWAYS works cleanly.
 */
function generateLocalFallbackResponse(message, extraContext = "") {
  const query = message.toLowerCase();

  if (extraContext) {
    return `📄 **Document Analysis & Summary**:\n\nHere is a quick summary of the uploaded document content:\n- **Overview**: Document contains key academic notes / text.\n- **Extracted Content Preview**: "${extraContext.slice(0, 250)}..."\n\nFeel free to ask specific questions about this file!`;
  }

  if (query.includes("hello") || query.includes("hi") || query.includes("hey")) {
    return "Hello! 👋 How can I help you today?";
  }

  if (query.includes("python")) {
    return "🐍 **Python Overview**: Python is a high-level, interpreted programming language known for readability. Popular for Web Dev (Django/Flask), Data Science (Pandas, NumPy), and AI/ML (PyTorch, TensorFlow).\n\nKey Concept: Variables, Loops, Functions, OOPs concepts.";
  }

  if (query.includes("data structure") || query.includes("ds")) {
    return "📊 **Data Structures**: Fundamental ways to organize data effectively.\n- **Linear**: Arrays, Linked Lists, Stacks, Queues.\n- **Non-Linear**: Trees (Binary, AVL, BST), Graphs, Hash Tables.";
  }

  if (query.includes("dbms") || query.includes("database") || query.includes("sql")) {
    return "🗄️ **DBMS & SQL**: Relational Database Management Systems store structured data in tables.\n- Key concepts: ACID properties, Normalization (1NF to 3NF), Primary/Foreign Keys, SQL JOINs.";
  }

  if (query.includes("java")) {
    return "☕ **Java**: Platform-independent, object-oriented language running on the JVM. Key features: Inheritance, Polymorphism, Encapsulation, Abstraction, Garbage Collection.";
  }

  return `🤖 **CS Assistant**: That's a great question about "${message}"!\n\nKey insights:\n1. Check the relevant subject notes & e-content on our portal.\n2. For coding queries, practice implementing sample snippets and testing execution logic.\n\nAsk me if you need specific notes, videos, or practice questions!`;
}

/**
 * Dynamic AI Image Generation URL helper (Pollinations AI generator)
 */
export function generateAiImageUrl(prompt) {
  const cleanPrompt = encodeURIComponent(prompt.trim());
  return `https://image.pollinations.ai/prompt/${cleanPrompt}?width=800&height=600&nologo=true&seed=${Math.floor(Math.random() * 100000)}`;
}

/**
 * Check if Groq is configured
 */
export function isAiConfigured() {
  return !!import.meta.env.VITE_GROQ_API_KEY;
}
