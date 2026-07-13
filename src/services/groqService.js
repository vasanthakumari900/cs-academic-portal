// src/services/groqService.js
// Groq AI integration for the CS Academic Portal chatbot.
// Free tier: 30 req/min, no billing needed. Models: Llama 3.3, Mixtral, etc.

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Models to try in order — best quality first, fallback if quota hit
const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
];

/**
 * System prompt that defines the chatbot's knowledge about the portal.
 */
const SYSTEM_PROMPT = `You are an AI assistant for the DDGDVC CS Academic Portal — a web platform for the Department of Computer Science at Dwarka Doss Goverdhan Doss Vaishnav College, Chennai.

Your role is to help students, faculty, and visitors navigate the portal and answer questions about its content.

## Portal Structure & Navigation

### Public Pages (accessible to everyone):
- **Home** (/) — Landing page with overview of the portal
- **E-Content** (/e-content) — Video lectures organised by year, semester, and subject
- **Notes** (/notes) — Lecture notes organised by year, semester, and subject with downloadable PDFs
- **Question Papers** (/question-papers) — Previous year semester question papers organised by course (UG/PG), year (1st/2nd/3rd), semester, and subject
- **CIA Papers** (/cia-question-papers) — Continuous Internal Assessment question papers (CIA 1 & CIA 2) organised by year and semester
- **Placements** (/placements) — Placement drive listings, company details, packages, and a mock aptitude test
- **About** (/about) — Department information, faculty list, and lab details
- **Search** (/search) — Global search across all content types

### Student Dashboard Pages (after login):
- Dashboard (/student/dashboard)
- Videos (/student/videos) — same as E-Content
- Notes (/student/notes) — same as public Notes
- Question Papers (/student/question-papers)
- CIA Papers (/student/cia-question-papers)
- Placements (/student/placements)
- Bookmarks (/student/bookmarks)
- Recently Viewed (/student/recently-viewed)
- Profile (/student/profile)

### Available Subjects (UG Programme):

**1st Year — Semester 1:**
- Fundamentals of Python Programming, Digital Electronics, Mathematics Paper - I, Tamil, English

**1st Year — Semester 2:**
- OOP Using C++, Data Structures, Mathematics Paper - II, Tamil, English

**2nd Year — Semester 1:**
- Java Programming, Web Technology, Statistical Methods for CS - I, Tamil, English

**2nd Year — Semester 2:**
- Android App Development, Software Engineering, Statistical Methods for CS - II, AI & Expert Systems, Tamil, English

**3rd Year — Semester 1:**
- Operating System, Data Mining Techniques, ASP.NET, Database Management System

**3rd Year — Semester 2:**
- Programming in PHP, Cloud Computing, Computer Networks, Introduction to Data Science, UML, Digital Image Processing

### Faculty Members:
- M P Sudha — DBMS | R Saranya — ASP.NET | Dr Dharani — OS | V Ponnila — Data Mining

## Rules:
1. Keep answers concise and friendly (2-4 sentences).
2. When asked where to find something, give the exact page path.
3. Don't make things up — guide users to where they can find info on the portal.
4. Use a warm, encouraging tone for college students.
5. Keep responses under 200 words.`;

/**
 * Build messages array for Groq's OpenAI-compatible API.
 */
function buildMessages(history, message) {
  const messages = [{ role: "system", content: SYSTEM_PROMPT }];

  // Add conversation history (last 10 messages)
  const recentHistory = history.slice(-10);
  for (const msg of recentHistory) {
    messages.push({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    });
  }

  // Add current user message
  messages.push({ role: "user", content: message });

  return messages;
}

/**
 * Try sending a message to a specific Groq model.
 */
async function tryModel(apiKey, model, history, message) {
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: buildMessages(history, message),
      temperature: 0.7,
      max_tokens: 500,
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
    return { success: true, text: "I'm sorry, I couldn't generate a response. Could you please rephrase your question?" };
  }

  return { success: true, text: text.trim() };
}

/**
 * Send a message to Groq AI and get a response.
 * Tries models in order (Llama 70B first, falls back to 8B).
 */
export async function sendMessage(history, message) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    return "⚠️ Groq API key is not configured. Please set the VITE_GROQ_API_KEY in your .env file. Get a free key at https://console.groq.com";
  }

  let lastError = null;

  for (const model of GROQ_MODELS) {
    try {
      const result = await tryModel(apiKey, model, history, message);
      if (result.success) return result.text;

      lastError = result;

      // Only try fallback if it's a rate limit (429)
      if (result.status !== 429) break;

      console.warn(`Groq model ${model} rate limited, trying next model...`);
    } catch (error) {
      lastError = { status: 0, errorMessage: error.message };
      break;
    }
  }

  console.error("Groq API error:", lastError);

  if (lastError?.status === 429) {
    return "⚠️ The AI service is temporarily busy (rate limit). Please wait a moment and try again.";
  }

  if (lastError?.status === 401 || lastError?.status === 403) {
    return "⚠️ The Groq API key is invalid. Please check your key at https://console.groq.com";
  }

  return "I'm having trouble connecting right now. Please try again in a moment.";
}

/**
 * Check if Groq is configured.
 */
export function isAiConfigured() {
  return !!import.meta.env.VITE_GROQ_API_KEY;
}
