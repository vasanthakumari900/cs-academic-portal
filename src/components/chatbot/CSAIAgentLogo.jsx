// src/components/chatbot/CSAIAgentLogo.jsx
import chatbotAvatar from "../../assets/chatbot-avatar.jpg";

export default function CSAIAgentLogo({ size = 32, className = "" }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center rounded-full bg-slate-900 border-2 border-amber-400/80 shadow-md overflow-hidden shrink-0 ${className}`}
    >
      <img
        src={chatbotAvatar}
        alt="CS AI Chatbot Avatar"
        className="w-full h-full object-cover rounded-full"
      />
    </div>
  );
}

