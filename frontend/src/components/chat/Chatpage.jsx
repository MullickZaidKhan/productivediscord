import React, { useEffect, useState } from "react";
import {
  Phone,
  ChevronLeft,
  Video,
  Pin,
  Users,
  Gift,
  Smile,
  Grid3x3,
  Image as ImageIcon,
  Plus,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { openChat, closeChat } from "../../redux/chat/Chatslice.js";
// ---- Mock data, matching the screenshot exactly ----
const CONTACT = { name: "Sawan Kumar", color: "#c07a3e" }; // warm avatar tone

const ROLE_STYLES = {
  CODE: { dot: "#5865f2", text: "#8ea1ff" },
  Path: { dot: "#3ba55d", text: "#7fd99a" },
};

const MESSAGES = [
  {
    id: "m1",
    author: "Zaid",
    role: "CODE",
    time: "7:14 AM",
    type: "link",
    content:
      "https://www.instagram.com/reel/DbhPl79IVQo/?igsh=MW05aHhtNGptb2pheA==",
  },
  {
    id: "m2",
    author: "Sawan Kumar",
    role: "Path",
    time: "7:15 AM",
    type: "text",
    content: "Bahut hi jyada complicated hai",
  },
  {
    id: "m3",
    author: "Zaid",
    role: "CODE",
    time: "7:16 AM",
    type: "text",
    content: "Yes bro per maja aaega",
  },
  {
    id: "m4",
    author: "Sawan Kumar",
    role: "Path",
    time: "7:16 AM",
    type: "text",
    content: "Tum hi khelo mere baski na",
  },
  {
    id: "m5",
    author: "Zaid",
    role: "CODE",
    time: "7:17 AM",
    type: "emoji",
    content: "😂😭",
  },
  {
    id: "m6",
    author: "Sawan Kumar",
    role: "Path",
    time: "7:18 AM",
    type: "emoji",
    content: "😌",
  },
];

// Deterministic color per name, used only as an avatar fallback background
const AVATAR_PALETTE = [
  "#5865f2",
  "#3ba55d",
  "#c07a3e",
  "#eb459e",
  "#faa61a",
  "#ed4245",
  "#9b59b6",
];
function avatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function Avatar({ name, size = 40 }) {
  const letter = name.trim().charAt(0).toUpperCase();
  return (
    <div
      style={{ width: size, height: size, backgroundColor: avatarColor(name) }}
      className="rounded-full flex items-center justify-center font-semibold text-white shrink-0 select-none"
    >
      <span style={{ fontSize: size * 0.42 }}>{letter}</span>
    </div>
  );
}

function RoleBadge({ role }) {
  const style = ROLE_STYLES[role] ?? { dot: "#949ba4", text: "#949ba4" };
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium ml-1.5 align-middle">
      <span
        className="w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: style.dot }}
      />
      <span style={{ color: style.text }}>{role}</span>
    </span>
  );
}

function MessageRow({ message, index, visible }) {
  const isEmojiOnly = message.type === "emoji";
  return (
    <div
      className="group flex gap-4 px-4 md:px-6 py-0.5 hover:bg-white/[0.03] rounded transition-all duration-300 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(8px)",
        transitionDelay: `${index * 70}ms`,
      }}
    >
      <div className="pt-0.5">
        <Avatar name={message.author} />
      </div>
      <div className="min-w-0">
        <div className="flex items-baseline">
          <span className="text-[15px] font-medium text-white hover:underline cursor-pointer">
            {message.author}
          </span>
          <RoleBadge role={message.role} />
          <span className="text-[11px] text-[#949ba4] ml-2">
            {message.time}
          </span>
        </div>

        {message.type === "link" && (
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-[15px] text-[#00a8fc] hover:underline break-all"
          >
            {message.content}
          </a>
        )}

        {message.type === "text" && (
          <p className="text-[15px] text-[#dbdee1] leading-[1.375rem]">
            {message.content}
          </p>
        )}

        {isEmojiOnly && (
          <p className="text-[28px] leading-[1.6] -mt-0.5">{message.content}</p>
        )}
      </div>
    </div>
  );
}

function InputIcon({ children, label }) {
  return (
    <button
      aria-label={label}
      className="text-[#b5bac1] hover:text-[#dbdee1] transition-colors duration-150 hover:scale-110 active:scale-95"
    >
      {children}
    </button>
  );
}

export default function ChatPage() {
  const dispatch = useDispatch();
  const [visibleCount, setVisibleCount] = useState(0);
  const [headerIn, setHeaderIn] = useState(false);

  useEffect(() => {
    const headerTimer = setTimeout(() => setHeaderIn(true), 30);
    const timers = MESSAGES.map((_, i) =>
      setTimeout(
        () => setVisibleCount((c) => Math.max(c, i + 1)),
        120 + i * 90,
      ),
    );
    return () => {
      clearTimeout(headerTimer);
      timers.forEach(clearTimeout);
    };
  }, []);

  const contact = useSelector((state) => state.chat.userinfo ?? CONTACT);

  return (
    <div className="flex-1 min-w-0 min-h-0 h-full bg-[#0000008e] flex flex-col">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 h-12 border-b border-[#26282c] shadow-sm shrink-0 transition-all duration-300 ease-out  py-2"
        style={{
          opacity: headerIn ? 1 : 0,
          transform: headerIn ? "translateY(0px)" : "translateY(-6px)",
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => {dispatch(closeChat())}}
            className="rounded-full p-1 hover:bg-white/10 transition-colors"
            aria-label="Close chat"
          >
            <ChevronLeft className="text-white" />
          </button>
          <Avatar name={contact.name} size={30} />
          <span className="font-semibold text-[15px] text-white truncate">
            {contact.name}
          </span>
        </div>
        <div className="flex items-center gap-4 text-[#b5bac1]">
          <InputIcon label="Call">
            <Phone size={20} />
          </InputIcon>
          <InputIcon label="Video call">
            <Video size={20} />
          </InputIcon>
          <InputIcon label="Pinned messages">
            <Pin size={20} />
          </InputIcon>
          <InputIcon label="Add friend">
            <Users size={20} />
          </InputIcon>
        </div>
      </div>

      {/* Faded preview of earlier scrolled content */}
      <div className="px-6 pt-3 pb-2 shrink-0">
        <p className="text-[13px] text-[#5c5e66] truncate select-none">
          Build with Visual Studio Code, anywhere, anytime, already in your
          browser.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pb-2">
        <div className="flex items-center gap-3 px-6 my-3 select-none">
          <div className="h-px bg-[#3f4147] flex-1" />
          <span className="text-[12px] text-[#949ba4] font-medium">
            August 3, 2026
          </span>
          <div className="h-px bg-[#3f4147] flex-1" />
        </div>

        <div className="flex flex-col gap-2.5">
          {MESSAGES.map((message, i) => (
            <MessageRow
              key={message.id}
              message={message}
              index={i}
              visible={i < visibleCount}
            />
          ))}
        </div>
      </div>

      {/* Message input */}
      <div className="px-4 pb-6 p-8 pt-1 shrink-0">
        <div className="flex items-center gap-3 bg-[#383a40] rounded-lg px-4 py-2.5 focus-within:ring-1 focus-within:ring-[#4a4d55] transition-all duration-200">
          <InputIcon label="Add attachment">
            <Plus size={20} />
          </InputIcon>
          <input
            type="text"
            placeholder={`Message @${contact.name}`}
            className="flex-1 bg-transparent outline-none text-[15px] placeholder-[#6d6f78]"
          />
          <div className="flex items-center gap-3.5">
            <InputIcon label="Send a gift">
              <Gift size={20} />
            </InputIcon>
            <InputIcon label="Open GIF picker">
              <ImageIcon size={20} />
            </InputIcon>
            <InputIcon label="Open sticker picker">
              <Grid3x3 size={20} />
            </InputIcon>
            <InputIcon label="Open emoji picker">
              <Smile size={20} />
            </InputIcon>
          </div>
        </div>
      </div>
    </div>
  );
}
