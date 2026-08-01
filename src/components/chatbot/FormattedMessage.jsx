// src/components/chatbot/FormattedMessage.jsx
import React from "react";

function parseInline(text) {
  if (!text) return text;

  const parts = [];
  // Regex matching **bold**, `inline code`, *italic*, or links [text](url)
  const regex = /(\*\*(.*?)\*\*|`([^`]+)`|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    if (match[2] !== undefined) {
      // Bold: **text**
      parts.push(
        <strong key={match.index} className="font-bold text-slate-900">
          {match[2]}
        </strong>
      );
    } else if (match[3] !== undefined) {
      // Code: `text`
      parts.push(
        <code
          key={match.index}
          className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-[#C50337] font-medium border border-slate-200/80"
        >
          {match[3]}
        </code>
      );
    } else if (match[4] !== undefined) {
      // Italic: *text*
      parts.push(
        <em key={match.index} className="italic text-slate-800">
          {match[4]}
        </em>
      );
    } else if (match[5] !== undefined && match[6] !== undefined) {
      // Link: [text](url)
      parts.push(
        <a
          key={match.index}
          href={match[6]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline font-medium hover:text-blue-800"
        >
          {match[5]}
        </a>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

export default function FormattedMessage({ content }) {
  if (!content) return null;

  // 1. Separate code blocks (```lang ... ```)
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  const blocks = [];
  let lastIdx = 0;
  let codeMatch;

  while ((codeMatch = codeBlockRegex.exec(content)) !== null) {
    if (codeMatch.index > lastIdx) {
      blocks.push({ type: "text", text: content.substring(lastIdx, codeMatch.index) });
    }
    blocks.push({
      type: "code",
      lang: codeMatch[1],
      code: codeMatch[2].trim(),
    });
    lastIdx = codeBlockRegex.lastIndex;
  }

  if (lastIdx < content.length) {
    blocks.push({ type: "text", text: content.substring(lastIdx) });
  }

  return (
    <div className="space-y-2 text-slate-800 leading-relaxed font-sans text-xs sm:text-sm">
      {blocks.map((block, bIdx) => {
        if (block.type === "code") {
          return (
            <div
              key={bIdx}
              className="my-2 overflow-hidden rounded-xl bg-slate-900 border border-slate-800 text-slate-100 shadow-md"
            >
              {block.lang && (
                <div className="bg-slate-800/80 px-3 py-1 text-[10px] font-mono text-slate-400 border-b border-slate-700/50 uppercase tracking-wider">
                  {block.lang}
                </div>
              )}
              <pre className="p-3 overflow-x-auto font-mono text-xs leading-normal text-emerald-400">
                <code>{block.code}</code>
              </pre>
            </div>
          );
        }

        // Process text block lines
        const lines = block.text.split("\n");
        return (
          <div key={bIdx} className="space-y-1">
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (!trimmed) {
                return <div key={lIdx} className="h-1" />;
              }

              // Headings (# , ## , ### )
              const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)$/);
              if (headingMatch) {
                const level = headingMatch[1].length;
                const text = headingMatch[2];
                return (
                  <div
                    key={lIdx}
                    className={`font-bold text-slate-900 ${
                      level === 1
                        ? "text-base mt-2 mb-1 border-b border-slate-200 pb-1"
                        : level === 2
                        ? "text-sm mt-2 mb-1"
                        : "text-xs mt-1 mb-0.5"
                    }`}
                  >
                    {parseInline(text)}
                  </div>
                );
              }

              // List items (- , * , • , 1. , 2. etc)
              const listMatch = trimmed.match(/^([-*•]|\d+\.)\s+(.*)$/);
              if (listMatch) {
                const bullet = listMatch[1];
                const text = listMatch[2];
                const isNumeric = /^\d+\.$/.test(bullet);

                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-1 py-0.5">
                    <span
                      className={`shrink-0 select-none font-semibold ${
                        isNumeric ? "text-[#021C4F] text-xs min-w-[1.2rem]" : "text-[#C50337] text-sm"
                      }`}
                    >
                      {bullet}
                    </span>
                    <span className="flex-1 text-slate-800">{parseInline(text)}</span>
                  </div>
                );
              }

              // Regular paragraph line
              return (
                <p key={lIdx} className="leading-relaxed text-slate-800">
                  {parseInline(line)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
