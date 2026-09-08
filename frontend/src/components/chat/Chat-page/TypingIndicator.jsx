export default function TypingIndicator({ name }) {
  return (
    <div className="flex items-center gap-2 px-4 md:px-6 h-8 text-[13px] text-[#949ba4] select-none">
      <div className="flex items-end gap-0.5 h-3">
        <span className="typing-dot" style={{ animationDelay: "0ms" }} />
        <span className="typing-dot" style={{ animationDelay: "150ms" }} />
        <span className="typing-dot" style={{ animationDelay: "300ms" }} />
      </div>
      <span>
        <span className="font-semibold text-[#dbdee1]">{name}</span> is
        typing...
      </span>
      <style>{`
        .typing-dot {
          width: 5px;
          height: 5px;
          border-radius: 9999px;
          background-color: #949ba4;
          display: inline-block;
          animation: typing-bounce 1.2s infinite ease-in-out;
        }
        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}