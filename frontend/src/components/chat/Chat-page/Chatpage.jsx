// import { useEffect, useState } from "react";
// import {
//   Phone,
//   ChevronLeft,
//   Video,
//   Pin,
//   Users,
//   UsersRound,
//   Gift,
//   Smile,
//   Grid3x3,
//   Image as ImageIcon,
//   Plus,
// } from "lucide-react";
// import { useSelector } from "react-redux";
// import TypingIndicator from "./TypingIndicator.jsx";
// import MessageRow from "./MessageRow.jsx";
// import InputIcon from "./InputIcon.jsx";
// import useChatCrypto from "./hooks/useChatCrypto.js";
// import useChatMessages from "./hooks/useChatMessages.js";
// import useChatSocket from "./hooks/useChatSocket.js";
// import useChatTyping from "./hooks/useChatTyping.js";
// import useSendChatMessage from "./hooks/useSendChatMessage.js";
// import useChatScroll from "./hooks/useChatScroll.js";
// import useChatBackground from "./hooks/useChatBackground.js";
// import useContactOnline from "./hooks/useContactOnline.js";
// import EmptyChat from "./EmptyChat.jsx"
// export default function ChatPage({ onCloseChat }) {
//   const [headerIn, setHeaderIn] = useState(false);
//   const contact = useSelector((state) => state.chat.userinfo);
//   const currentUser = useSelector((state) => state.authinfoSlice.userinfo);
//   const { bgimg } = useChatBackground();
//   const {
//     deviceId,
//     sharedKeysRef,
//     senderSharedKeysRef,
//     isSharedKeyReady,
//   } = useChatCrypto({ currentUser, contact });
//   const socket = useChatSocket({
//     contactId: contact?._id,
//     currentUserId: currentUser?.id,
//     deviceId,
//     sharedKeysRef,
//     senderSharedKeysRef,
//   });
//   const {
//     messages,
//     groupedMessages,
//     messagesLoading,
//     messagesError,
//   } = useChatMessages({
//     contactId: contact?._id,
//     currentUserId: currentUser?.id,
//     deviceId,
//     sharedKeysRef,
//     senderSharedKeysRef,
//     isSharedKeyReady,
//   });
//   const { sendMessage, isSending } = useSendChatMessage({
//     contact,
//     currentUser,
//     deviceId,
//     sharedKeysRef,
//     senderSharedKeysRef,
//   });
//   const {
//     draft,
//     isContactTyping,
//     handleTyping,
//     handleKeyDown,
//     handleSend,
//   } = useChatTyping({
//     socket,
//     currentUserId: currentUser?.id,
//     contactId: contact?._id,
//     onSend: sendMessage,
//     isSending,
//   });
//   const scrollRef = useChatScroll(messages.length);
//   const isContactOnline = useContactOnline(contact?._id);

//   useEffect(() => {
//     const headerTimer = setTimeout(() => setHeaderIn(true), 30);
//     return () => clearTimeout(headerTimer);
//   }, []);

//   if (!contact) {
//     return (
//       <div
//         className="fixed inset-0 z-50 flex items-center justify-center text-[#949ba4] text-sm bg-cover bg-center sm:static sm:inset-auto sm:z-auto sm:flex-1 sm:min-w-0 sm:min-h-0 sm:h-full"
//         style={{ backgroundImage: `url(${bgimg})` }}
//       >
//         <span className="relative z-10">
//           Select a conversation to start chatting
//         </span>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex flex-col sm:static sm:inset-auto sm:z-auto sm:flex-1 sm:min-w-0 sm:min-h-0 sm:h-full sm:bg-[#0000008e]">
//       <div
//         className="absolute inset-0 bg-cover bg-center sm:hidden"
//         style={{ backgroundImage: `url(${bgimg})`, filter: "brightness(0.6)" }}
//       />
//       <div className="absolute inset-0 bg-[#000000ab] sm:hidden" />

//       <div className="relative z-10 flex flex-col h-full">
//         <div
//           className="flex items-center justify-between px-4 h-13 border-b bg-[#26282c]/70 border-[#26282c] shadow-sm shrink-0 transition-all duration-300 ease-out py-2"
//           style={{
//             opacity: headerIn ? 1 : 0,
//             transform: headerIn ? "translateY(0px)" : "translateY(-6px)",
//           }}
//         >
//           <div className="flex items-center gap-2.5 min-w-0">
//             <button
//               onClick={onCloseChat}
//               className="rounded-full p-1 hover:bg-white/10 transition-colors"
//               aria-label="Close chat"
              
//             >
//               <ChevronLeft className="text-white" />
//             </button>

//             <div className="relative shrink-0">
//               <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-white text-xs font-medium">
//                 {contact.profileimg ? (
//                   <img
//                     src={contact.profileimg}
//                     alt={contact.name || "User"}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div
//                     className="w-full h-full rounded-full flex items-center justify-center"
//                     style={{ backgroundColor: contact.color || "#6b7280" }}
//                   >
//                     {contact.initials ? (
//                       contact.initials
//                     ) : contact.name ? (
//                       contact.name.slice(0, 2).toUpperCase()
//                     ) : (
//                       <UsersRound size={16} className="text-white" />
//                     )}
//                   </div>
//                 )}
//               </div>
//               <span
//                 className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-[3px] border-[#313338] ${
//                   isContactOnline ? "bg-[#23a559]" : "bg-[#80848e]"
//                 }`}
//               />
//             </div>

//             <span className="font-semibold text-[15px] text-white truncate">
//               {contact.name}
//             </span>
//           </div>

//           <div className="flex items-center gap-4 text-[#b5bac1]">
//             <InputIcon label="Call"><Phone size={20} /></InputIcon>
//             <InputIcon label="Video call"><Video size={20} /></InputIcon>
//             <InputIcon label="Pinned messages"><Pin size={20} /></InputIcon>
//             <InputIcon label="Add friend"><Users size={20} /></InputIcon>
//           </div>
//         </div>

//         <div ref={scrollRef} className="flex-1 overflow-y-auto pb-2 ">
//           {messagesLoading && (
//             <p className="text-center text-[13px] text-[#6d6f78] mt-6">
//               Loading messages…
//             </p>
//           )}
//           {messagesError && (
//             <p className="text-center text-[13px] text-[#ed4245] mt-6">
//               Couldn't load messages. Please try again.
//             </p>
//           )}
//           {!messagesLoading && !messagesError && messages.length === 0 && (
//             // <p className="text-center text-[13px] text-[#6d6f78] mt-6">
//             //   No messages yet. Say hello 👋
//             // </p>
//             <EmptyChat userId={1233} />
//           )}

//           {groupedMessages.map((group) => (
//             <div key={group.label}>
//               <div className="flex items-center gap-3 px-6 my-3 select-none">
//                 <div className="h-px bg-[#3f4147] flex-1" />
//                 <span className="text-[12px] text-[#949ba4] font-medium">
//                   {group.label}
//                 </span>
//                 <div className="h-px bg-[#3f4147] flex-1" />
//               </div>
//               <div className="flex flex-col gap-2.5">
//                 {group.messages.map((message) => {
//                   const isOwn = String(message.sender) === String(currentUser?.id);
//                   const author = isOwn
//                     ? {
//                         name: currentUser?.name + " ( you )" || "You",
//                         profileimg: currentUser?.profileimg,
//                       }
//                     : { name: contact.name, profileimg: contact?.profileimg };
//                   return <MessageRow key={message._id} message={message} author={author} />;
//                 })}
//               </div>
//             </div>
//           ))}
//         </div>

//         {isContactTyping && <TypingIndicator name={contact.name} />}

//         <div className="px-4 pb-6 p-8 pt-1 shrink-0">
//           <div className="flex items-center gap-3 bg-[#383a40] rounded-lg px-4 py-2.5 focus-within:ring-1 focus-within:ring-[#4a4d55] transition-all duration-200">
//             <InputIcon label="Add attachment"><Plus size={20} /></InputIcon>
//             <input
//               type="text"
//               value={draft}
//               onChange={handleTyping}
//               onKeyDown={handleKeyDown}
//               placeholder={`Message @${contact.name}`}
//               className="flex-1 bg-transparent outline-none text-cyan-50 text-[15px] placeholder-[#6d6f78]"
//             />
//             <div className="flex items-center gap-3.5">
//               <InputIcon label="Send a gift"><Gift size={20} /></InputIcon>
//               <InputIcon label="Open GIF picker"><ImageIcon size={20} /></InputIcon>
//               <InputIcon label="Open sticker picker"><Grid3x3 size={20} /></InputIcon>
//               <InputIcon
//                 label="Send message"
//                 onClick={handleSend}
//                 disabled={isSending || !draft.trim()}
//               >
//                 <Smile size={20} />
//               </InputIcon>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState, useRef, useLayoutEffect } from "react";
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
  Send,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useSelector } from "react-redux";
import TypingIndicator from "./TypingIndicator.jsx";
import MessageRow from "./MessageRow.jsx";
import InputIcon from "./InputIcon.jsx";
import useChatCrypto from "./hooks/useChatCrypto.js";
import useChatMessages from "./hooks/useChatMessages.js";
import useChatSocket from "./hooks/useChatSocket.js";
import useChatTyping from "./hooks/useChatTyping.js";
import useSendChatMessage from "./hooks/useSendChatMessage.js";
import useChatScroll from "./hooks/useChatScroll.js";
import useChatBackground from "./hooks/useChatBackground.js";
import useContactOnline from "./hooks/useContactOnline.js";
import EmptyChat from "./EmptyChat.jsx";

const MAX_MESSAGE_LENGTH = 2000;

// UI-only constants
const LINE_HEIGHT = 22; // px, must match leading-[22px] on the textarea
const MAX_COMPOSER_HEIGHT = 200; // px, compact composer max height
const STACK_AFTER_CHARS = 16; // mobile only: past this many chars, textarea gets its own full-width row
const EXPAND_AFTER_LINES = 3; // show the expand button once text passes this many lines

// Hides the scrollbar but keeps the area scrollable
const HIDE_SCROLLBAR =
  "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

export default function ChatPage({ onCloseChat }) {
  const [headerIn, setHeaderIn] = useState(false);
  const contact = useSelector((state) => state.chat.userinfo);
  const currentUser = useSelector((state) => state.authinfoSlice.userinfo);
  const { bgimg } = useChatBackground();
  const {
    deviceId,
    sharedKeysRef,
    senderSharedKeysRef,
    isSharedKeyReady,
  } = useChatCrypto({ currentUser, contact });
  const socket = useChatSocket({
    contactId: contact?._id,
    currentUserId: currentUser?.id,
    deviceId,
    sharedKeysRef,
    senderSharedKeysRef,
  });
  const {
    messages,
    groupedMessages,
    messagesLoading,
    messagesError,
  } = useChatMessages({
    contactId: contact?._id,
    currentUserId: currentUser?.id,
    deviceId,
    sharedKeysRef,
    senderSharedKeysRef,
    isSharedKeyReady,
  });
  const { sendMessage, isSending } = useSendChatMessage({
    contact,
    currentUser,
    deviceId,
    sharedKeysRef,
    senderSharedKeysRef,
  });
  const {
    draft,
    isContactTyping,
    handleTyping,
    handleKeyDown,
    handleSend,
  } = useChatTyping({
    socket,
    currentUserId: currentUser?.id,
    contactId: contact?._id,
    onSend: sendMessage,
    isSending,
  });
  const scrollRef = useChatScroll(messages.length);
  const isContactOnline = useContactOnline(contact?._id);

  // ---------- Composer UI state (UI-only; the draft itself stays in useChatTyping) ----------
  const textareaRef = useRef(null);
  const expandedRef = useRef(null);
  const selectionRef = useRef({ start: null, end: null });
  const wasSendingRef = useRef(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLong, setIsLong] = useState(false);

  const hasText = draft.trim().length > 0;
  const isOverLimit = draft.length > MAX_MESSAGE_LENGTH;
  // Mobile layout only (sm: and up ignores this). Based on text, not measured width, so it can't flicker.
  const isStacked = draft.length > STACK_AFTER_CHARS || draft.includes("\n");
  const overBy = draft.length - MAX_MESSAGE_LENGTH;

  // Block sending when over the limit (button click and Enter key)
  const guardedSend = () => {
    if (isOverLimit) return;
    handleSend();
  };
  const guardedKeyDown = (e) => {
    if (isOverLimit && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      return;
    }
    handleKeyDown(e);
  };

  // Auto-resize the compact textarea and decide whether to offer the expand button
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto"; // reset so it can shrink
    const full = el.scrollHeight;
    el.style.height = `${Math.min(full, MAX_COMPOSER_HEIGHT)}px`;
    setIsLong(full > LINE_HEIGHT * EXPAND_AFTER_LINES + 4);
  }, [draft]);

  // Move focus and caret between the compact and expanded editors (same draft, same caret)
  useEffect(() => {
    const target = isExpanded ? expandedRef.current : textareaRef.current;
    if (!target) return;
    target.focus();
    const { start, end } = selectionRef.current;
    if (start !== null && end !== null) {
      target.setSelectionRange(start, end);
    }
  }, [isExpanded]);

  // After a successful send (draft cleared once sending finishes), close the expanded editor
  useEffect(() => {
    if (wasSendingRef.current && !isSending && !draft.trim()) {
      setIsExpanded(false);
    }
    wasSendingRef.current = isSending;
  }, [isSending, draft]);

  const openExpanded = () => {
    const el = textareaRef.current;
    if (el) {
      selectionRef.current = { start: el.selectionStart, end: el.selectionEnd };
    }
    setIsExpanded(true);
  };

  const closeExpanded = () => {
    const el = expandedRef.current;
    if (el) {
      selectionRef.current = { start: el.selectionStart, end: el.selectionEnd };
    }
    setIsExpanded(false);
  };

  useEffect(() => {
    const headerTimer = setTimeout(() => setHeaderIn(true), 30);
    return () => clearTimeout(headerTimer);
  }, []);

  if (!contact) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center text-[#949ba4] text-sm bg-cover bg-center sm:static sm:inset-auto sm:z-auto sm:flex-1 sm:min-w-0 sm:min-h-0 sm:h-full"
        style={{ backgroundImage: `url(${bgimg})` }}
      >
        <span className="relative z-10">
          Select a conversation to start chatting
        </span>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col sm:static sm:inset-auto sm:z-auto sm:flex-1 sm:min-w-0 sm:min-h-0 sm:h-full sm:bg-[#0000008e]">
      <div
        className="absolute inset-0 bg-cover bg-center sm:hidden"
        style={{ backgroundImage: `url(${bgimg})`, filter: "brightness(0.6)" }}
      />
      <div className="absolute inset-0 bg-[#000000ab] sm:hidden" />

      <div className="relative z-10 flex flex-col h-full">
        <div
          className="flex items-center justify-between px-4 h-13 border-b bg-[#26282c]/70 border-[#26282c] shadow-sm shrink-0 transition-all duration-300 ease-out py-2"
          style={{
            opacity: headerIn ? 1 : 0,
            transform: headerIn ? "translateY(0px)" : "translateY(-6px)",
          }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={onCloseChat}
              className="rounded-full p-1 hover:bg-white/10 transition-colors"
              aria-label="Close chat"
            >
              <ChevronLeft className="text-white" />
            </button>

            <div className="relative shrink-0">
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
                    style={{ backgroundColor: contact.color || "#6b7280" }}
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
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-[3px] border-[#313338] ${
                  isContactOnline ? "bg-[#23a559]" : "bg-[#80848e]"
                }`}
              />
            </div>

            <span className="font-semibold text-[15px] text-white truncate">
              {contact.name}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#b5bac1]">
            <InputIcon label="Call"><Phone size={20} /></InputIcon>
            <InputIcon label="Video call"><Video size={20} /></InputIcon>
            <InputIcon label="Pinned messages"><Pin size={20} /></InputIcon>
            <InputIcon label="Add friend"><Users size={20} /></InputIcon>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto pb-2 ">
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
            <EmptyChat userId={1233} />
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
                  const isOwn = String(message.sender) === String(currentUser?.id);
                  const author = isOwn
                    ? {
                        name: currentUser?.name + " ( you )" || "You",
                        profileimg: currentUser?.profileimg,
                      }
                    : { name: contact.name, profileimg: contact?.profileimg };
                  return <MessageRow key={message._id} message={message} author={author} />;
                })}
              </div>
            </div>
          ))}
        </div>

        {isContactTyping && <TypingIndicator name={contact.name} />}

        {/* ---------- Message composer ---------- */}
        <div className="px-4 pb-6 p-8 pt-1 shrink-0">
          {isOverLimit && (
            <div
              role="alert"
              className="mb-2 rounded-md border border-[#ed4245]/50 bg-[#ed4245]/15 px-3 py-2 text-[13px] text-[#ff8587]"
            >
              Message is too long ({draft.length}/{MAX_MESSAGE_LENGTH}). Remove{" "}
              {overBy} character{overBy === 1 ? "" : "s"} to send.
            </div>
          )}
          <div className="relative">
            {/* Expand button: only when the draft is long enough to benefit */}
            {isLong && !isExpanded && (
              <button
                type="button"
                onClick={openExpanded}
                aria-label="Expand message editor"
                title="Expand"
                className="absolute -top-3 right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#383a40] text-[#b5bac1] shadow ring-1 ring-[#4a4d55] transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
              >
                <Maximize2 size={13} />
              </button>
            )}

            <div className="flex flex-wrap sm:flex-nowrap items-end gap-x-3 gap-y-1.5 w-full box-border bg-[#383a40] rounded-lg px-3 sm:px-4 py-2.5 focus-within:ring-1 focus-within:ring-[#4a4d55] transition-all duration-200">
              <div className="flex h-[26px] shrink-0 items-center">
                <InputIcon label="Add attachment"><Plus size={20} /></InputIcon>
              </div>

              <textarea
                ref={textareaRef}
                rows={1}
                value={draft}
                onChange={handleTyping}
                onKeyDown={guardedKeyDown}
                placeholder={`Message @${contact.name}`}
                aria-label={`Message ${contact.name}`}
                className={`grow shrink min-w-0 w-full ${isStacked ? "basis-full order-first" : "basis-0"} sm:basis-0 sm:order-none bg-transparent outline-none resize-none border-0 text-cyan-50 text-[15px] leading-[22px] py-0.5 placeholder-[#6d6f78] whitespace-pre-wrap break-words overflow-y-auto ${HIDE_SCROLLBAR}`}
                style={{ maxHeight: MAX_COMPOSER_HEIGHT }}
              />

              <div className="ml-auto sm:ml-0 flex h-[26px] shrink-0 items-center gap-3.5">
                <span className="hidden sm:inline-flex"><InputIcon label="Send a gift"><Gift size={20} /></InputIcon></span>
                <InputIcon label="Open GIF picker"><ImageIcon size={20} /></InputIcon>
                <span className="hidden sm:inline-flex"><InputIcon label="Open sticker picker"><Grid3x3 size={20} /></InputIcon></span>
                <InputIcon label="Open emoji picker"><Smile size={20} /></InputIcon>
                {hasText && (
                  <InputIcon
                    label="Send message"
                    onClick={guardedSend}
                    disabled={isSending || isOverLimit}
                  >
                    <Send size={20} />
                  </InputIcon>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Expanded editor (uses the same draft + handlers) ---------- */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 sm:items-center sm:p-6"
          onKeyDown={(e) => {
            if (e.key === "Escape") closeExpanded();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Message editor"
            className="flex h-[88dvh] max-h-full w-full flex-col rounded-t-xl bg-[#313338] shadow-2xl sm:h-[70vh] sm:max-w-3xl sm:rounded-xl"
          >
            <div className="flex items-center justify-between border-b border-[#26282c] px-4 py-3">
              <span className="truncate text-[15px] font-semibold text-white">
                Message @{contact.name}
              </span>
              <button
                type="button"
                onClick={closeExpanded}
                aria-label="Collapse message editor"
                title="Collapse"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#b5bac1] transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
              >
                <Minimize2 size={18} />
              </button>
            </div>

            <textarea
              ref={expandedRef}
              value={draft}
              onChange={handleTyping}
              onKeyDown={guardedKeyDown}
              placeholder={`Message @${contact.name}`}
              aria-label={`Message ${contact.name}`}
              className={`min-h-0 flex-1 w-full resize-none border-0 bg-transparent px-4 py-3 text-cyan-50 text-[15px] leading-[22px] outline-none placeholder-[#6d6f78] whitespace-pre-wrap break-words overflow-y-auto ${HIDE_SCROLLBAR}`}
            />

            {isOverLimit && (
              <div
                role="alert"
                className="mx-4 mb-2 rounded-md border border-[#ed4245]/50 bg-[#ed4245]/15 px-3 py-2 text-[13px] text-[#ff8587]"
              >
                Message is too long ({draft.length}/{MAX_MESSAGE_LENGTH}). Remove{" "}
                {overBy} character{overBy === 1 ? "" : "s"} to send.
              </div>
            )}

            <div className="flex min-h-14 shrink-0 items-center justify-end border-t border-[#26282c] px-4 pb-[env(safe-area-inset-bottom)]">
              {hasText && (
                <InputIcon
                  label="Send message"
                  onClick={guardedSend}
                  disabled={isSending || isOverLimit}
                >
                  <Send size={22} />
                </InputIcon>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}