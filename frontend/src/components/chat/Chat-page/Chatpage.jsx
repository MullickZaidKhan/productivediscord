import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Phone,
  ChevronLeft,
  Video,
  Pin,
  Users,
  UsersRound,
  Gift,
  Smile,
  Grid3x3,
  Image as ImageIcon,
  Plus,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { openChat, closeChat } from "../../../redux/chat/Chatslice.js";
import {
  useSendDirectMessage,
  usegetDirectMessages,
} from "../../../hooks/chat/directMessage.hook.js";
import { createSocket } from "../../../socket.io-client/socket.io-client.js";
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
function TypingIndicator({ name }) {
  return (
    <div className="flex items-center gap-2 px-4 md:px-6 h-8 text-[13px] text-[#949ba4] select-none">
      <div className="flex items-end gap-0.5 h-3">
        <span className="typing-dot" style={{ animationDelay: "0ms" }} />
        <span className="typing-dot" style={{ animationDelay: "150ms" }} />
        <span className="typing-dot" style={{ animationDelay: "300ms" }} />
      </div>
      <span>
        <span className="font-semibold text-[#dbdee1]">{name}</span> is typing...
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
// Formats an ISO createdAt string into "7:14 AM" style local time
function Avatar({ name, size = 40, profileimg, initials, color }) {
  const letter = (name || "?").trim().charAt(0).toUpperCase();
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full overflow-hidden shrink-0 select-none"
    >
      {profileimg ? (
        <img
          src={profileimg}
          alt={name || "User"}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className="w-full h-full rounded-full flex items-center justify-center font-semibold text-white"
          style={{ backgroundColor: color || avatarColor(name || "?") }}
        >
          {initials ? (
            initials
          ) : name ? (
            name.slice(0, 2).toUpperCase()
          ) : (
            <UsersRound size={size * 0.4} className="text-white" />
          )}
        </div>
      )}
    </div>
  );
}

function formatTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

// Groups raw API messages by the day they were sent, for the date dividers
function groupMessagesByDay(messages) {
  const groups = [];
  if (!Array.isArray(messages)) return groups;

  let currentKey = null;
  let currentGroup = null;

  messages.forEach((message) => {
    const date = new Date(message.createdAt);
    const key = date.toDateString();
    const label = date.toLocaleDateString([], {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    if (key !== currentKey) {
      currentKey = key;
      currentGroup = { label, messages: [] };
      groups.push(currentGroup);
    }
    currentGroup.messages.push(message);
  });

  return groups;
}

function MessageRow({ message, author }) {
  const hasImage = Boolean(message.image);
  const hasText = Boolean(message.text);
  // console.log(author);
  return (
    <div className="msg-row-in group flex gap-4 px-4 md:px-6 py-0.5 hover:bg-white/[0.03] rounded">
      <div className="pt-0.5 shrink-0">
        <Avatar
          name={author.name}
          profileimg={author.profileimg}
          initials={author.initials}
          color={author.color}
        />
      </div>
      <div className="min-w-0">
        <div className="flex items-baseline">
          <span className="text-[15px] font-medium text-white hover:underline cursor-pointer">
            {author.name}
          </span>
          <span className="text-[11px] text-[#949ba4] ml-2">
            {formatTime(message.createdAt)}
          </span>
          {message.edited && (
            <span className="text-[10px] text-[#6d6f78] ml-1.5">(edited)</span>
          )}
        </div>

        {hasImage && (
          <img
            src={message.image}
            alt="attachment"
            className="mt-1 max-w-xs rounded-lg border border-[#26282c]"
          />
        )}

        {hasText && (
          <p className="text-[15px] text-[#dbdee1] leading-[1.375rem] whitespace-pre-wrap break-words">
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}

function InputIcon({ children, label, onClick, disabled }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="text-[#b5bac1] hover:text-[#dbdee1] transition-colors duration-150 hover:scale-110 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
    >
      {children}
    </button>
  );
}

export default function ChatPage() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isContactTyping, setIsContactTyping] = useState(true);
const typingTimeoutRef = useRef(null);
  const [headerIn, setHeaderIn] = useState(false);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef(null);
  const contact = useSelector((state) => state.chat.userinfo);
  const socket = useMemo(() => createSocket(), []);
  useEffect(() => {
    const handleMessageReceive = (messageData) => {
      queryClient.setQueryData(
        ["directMessages", contact?._id],
        (previousDataofchat) => {
          console.log("🗃️ PREVIOUS CACHE:");
          if (Array.isArray(previousDataofchat.data?.data)) {
            console.log("Array.isArray(previousDataofchat.data?.data");
            return {
              ...previousDataofchat,
              data: {
                ...previousDataofchat.data,
                data: [...previousDataofchat.data.data, messageData],
              },
            };
          }
          return previousDataofchat;
        },
      );
      console.log("📩 MESSAGE RECEIVED:", messageData);
      console.log("🕐 createdAt:", messageData?.createdAt);
    };

    socket.on("message:receive", handleMessageReceive);

    return () => {
      socket.off("message:receive", handleMessageReceive);
    };
  }, [socket, queryClient, contact?._id]);

  // Adjust this selector to match wherever the logged-in user is stored in your auth slice.
  // useEffect(() => {
  //   if (!contact?._id) return;

  //   const handleMessageReceive = (messageData) => {
  //     console.log("📩 MESSAGE RECEIVED:", messageData);

  //     queryClient.setQueryData(
  //       ["directMessages", contact._id],
  //       (previousData) => {
  //         console.log("🗃️ PREVIOUS CACHE:", previousData);

  //         // No cache exists yet
  //         if (!previousData) {
  //           return {
  //             message: "Messages fetched successfully",
  //             data: [messageData],
  //           };
  //         }

  //         // API cache = { message, data: [...] }
  //         // if (Array.isArray(previousData.data)) {
  //         //     console.log("Array.isArray(previousData.data)")
  //         //   return {
  //         //     ...previousData,
  //         //     data: [...previousData.data, messageData],
  //         //   };
  //         // }

  //         // Axios cache = { data: { message, data: [...] }, ... }
  //         if (Array.isArray(previousData.data?.data)) {
  //           console.log("Array.isArray(previousData.data?.data")
  //           return {
  //             ...previousData,
  //             data: {
  //               ...previousData.data,
  //               data: [...previousData.data.data, messageData],
  //             },
  //           };
  //         }

  //         console.warn("⚠️ Unknown cache structure:", previousData);

  //         return previousData;
  //       }
  //     );
  //   };

  //   socket.on("message:receive", handleMessageReceive);

  //   return () => {
  //     socket.off("message:receive", handleMessageReceive);
  //   };
  // }, [socket, queryClient, contact?._id]);
  const currentUser = useSelector((state) => state.authinfoSlice.userinfo);

  const {
    data: messagesResponse,
    isLoading: messagesLoading,
    isError: messagesError,
  } = usegetDirectMessages(contact?._id);
  const onlineFriends = useSelector(
    (state) => state.onlineFriendsslice?.ONLINE_USERS || [],
  );
  const findtheuserisonline = onlineFriends.some(
    (person) => String(person.id) === String(contact?._id),
  );

  const { mutate: sendDirectMessage, isPending: isSending } =
    useSendDirectMessage();

  const messages = useMemo(() => {
    // Handles either { data: [...] } or an axios-wrapped { data: { data: [...] } }
    if (Array.isArray(messagesResponse)) return messagesResponse;
    if (Array.isArray(messagesResponse?.data)) return messagesResponse.data;
    if (Array.isArray(messagesResponse?.data?.data))
      return messagesResponse.data.data;
    return [];
  }, [messagesResponse]);

  const sortedMessages = useMemo(
    () =>
      [...messages].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      ),
    [messages],
  );

  const groupedMessages = useMemo(
    () => groupMessagesByDay(sortedMessages),
    [sortedMessages],
  );

  // Header fade-in
  useEffect(() => {
    const headerTimer = setTimeout(() => setHeaderIn(true), 30);
    return () => clearTimeout(headerTimer);
  }, []);

  // Keep the view scrolled to the newest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  if (!contact) {
    return (
      <div className="flex-1 min-w-0 min-h-0 h-full bg-[#0000008e] flex items-center justify-center text-[#949ba4] text-sm">
        Select a conversation to start chatting
      </div>
    );
  }

  const handleSend = () => {
    const text = draft.trim();
    if (!text || isSending) return;

    sendDirectMessage(
      { receiver: contact._id, text },
      {
        onSuccess: () => {
          setDraft("");
          queryClient.invalidateQueries({
            queryKey: ["directMessages", contact._id],
          });
        },
      },
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 min-w-0 min-h-0 h-full bg-[#0000008e] flex flex-col">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 h-12 border-b border-[#26282c] shadow-sm shrink-0 transition-all duration-300 ease-out py-2"
        style={{
          opacity: headerIn ? 1 : 0,
          transform: headerIn ? "translateY(0px)" : "translateY(-6px)",
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => dispatch(closeChat())}
            className="rounded-full p-1 hover:bg-white/10 transition-colors"
            aria-label="Close chat"
          >
            <ChevronLeft className="text-white" />
          </button>

          <div className="relative shrink-0">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-white text-xs font-medium">
              {contact.profileimg ? (
                <img
                  src={contact.profileimg}
                  alt={contact.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: contact.color || "#6b7280",
                  }}
                >
                  {contact.initials ? (
                    contact.initials
                  ) : contact.name ? (
                    contact.name.slice(0, 2).toUpperCase()
                  ) : (
                    <UsersRound size={16} className="text-white" />
                  )}
                </div>
              )}
            </div>

            {/* Online / Offline status */}
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-[3px] border-[#313338] ${
                findtheuserisonline ? "bg-[#23a559]" : "bg-[#80848e]"
              }`}
            />
          </div>

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

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto pb-2">
        {messagesLoading && (
          <p className="text-center text-[13px] text-[#6d6f78] mt-6">
            Loading messages…
          </p>
        )}

        {messagesError && (
          <p className="text-center text-[13px] text-[#ed4245] mt-6">
            Couldn't load messages. Please try again.
          </p>
        )}

        {!messagesLoading && !messagesError && messages.length === 0 && (
          <p className="text-center text-[13px] text-[#6d6f78] mt-6">
            No messages yet. Say hello 👋
          </p>
        )}

        {groupedMessages.map((group) => (
          <div key={group.label}>
            <div className="flex items-center gap-3 px-6 my-3 select-none">
              <div className="h-px bg-[#3f4147] flex-1" />
              <span className="text-[12px] text-[#949ba4] font-medium">
                {group.label}
              </span>
              <div className="h-px bg-[#3f4147] flex-1" />
            </div>

            <div className="flex flex-col gap-2.5">
              {group.messages.map((message) => {
                const isOwn = message.sender === currentUser?.id;
                const author = isOwn
                  ? {
                      name: currentUser?.name || "You",
                      profileimg: currentUser?.profileimg,
                    }
                  : { name: contact.name, profileimg: contact?.profileimg };
                return (
                  <MessageRow
                    key={message._id}
                    message={message}
                    author={author}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
  {isContactTyping && <TypingIndicator name={contact.name} />}
      {/* Message input */}
      <div className="px-4 pb-6 p-8 pt-1 shrink-0">
        <div className="flex items-center gap-3 bg-[#383a40] rounded-lg px-4 py-2.5 focus-within:ring-1 focus-within:ring-[#4a4d55] transition-all duration-200">
          <InputIcon label="Add attachment">
            <Plus size={20} />
          </InputIcon>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message @${contact.name}`}
            className="flex-1 bg-transparent outline-none text-cyan-50 text-[15px] placeholder-[#6d6f78]"
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
            <InputIcon
              label="Send message"
              onClick={handleSend}
              disabled={isSending || !draft.trim()}
            >
              <Smile size={20} />
            </InputIcon>
          </div>
        </div>
      </div>
    </div>
  );
}
