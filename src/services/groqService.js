// src/services/groqService.js
// Groq AI integration for the CS Academic Portal chatbot with multi-modal features.
// Free tier: 30 req/min. Models: Llama 3.3, Mixtral, etc.

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
];

const SYSTEM_PROMPT = `You are the CS Academic Portal Smart AI Assistant.
You are an intelligent, friendly, and helpful AI designed for students, faculty, and visitors of the Computer Science Department.

## Core Capabilities:
1. **General Knowledge & Computer Science Expertise**:
   - You can answer ANY question about Programming (Python, C++, Java, JavaScript, React, SQL, PHP, ASP.NET, etc.), Data Structures, Algorithms, Operating Systems, Database Systems, Web Tech, Artificial Intelligence, Machine Learning, Computer Networks, and General Knowledge.
   - Provide clear explanations, code examples, bullet points, and practical advice.

2. **Portal Navigation & Features**:
   - E-Content / Video Lectures (/e-content or /student/videos)
   - Lecture Notes (/notes or /student/notes)
   - Question Papers & CIA Papers (/question-papers, /cia-question-papers)
   - Placements (/placements or /student/placements)
   - Assignments (/student/assignments or /faculty/assignments)
   - Interview Experiences (/interview-experiences)
   - Faculty details & Department Info (/about)

3. **Document Summarization**:
   - When a user uploads or pastes a document, provide a clean breakdown of key concepts, main takeaways, and bulleted summary points.

4. **Tone & Style**:
   - Encouraging, concise, articulate, and informative.
   - Use clear formatting with bold text and code snippets when helpful.`;

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
    return "Hello! 👋 I'm your CS Academic Portal AI Assistant. I can help with general computer science topics, navigation, document summarization, and more! What would you like to explore today?";
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
