import { useEffect, useState } from "react";
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
import { closeChat } from "../../../redux/chat/Chatslice.js";
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

export default function ChatPage() {
  const dispatch = useDispatch();
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
              onClick={() => dispatch(closeChat())}
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

        <div className="px-4 pb-6 p-8 pt-1 shrink-0">
          <div className="flex items-center gap-3 bg-[#383a40] rounded-lg px-4 py-2.5 focus-within:ring-1 focus-within:ring-[#4a4d55] transition-all duration-200">
            <InputIcon label="Add attachment"><Plus size={20} /></InputIcon>
            <input
              type="text"
              value={draft}
              onChange={handleTyping}
              onKeyDown={handleKeyDown}
              placeholder={`Message @${contact.name}`}
              className="flex-1 bg-transparent outline-none text-cyan-50 text-[15px] placeholder-[#6d6f78]"
            />
            <div className="flex items-center gap-3.5">
              <InputIcon label="Send a gift"><Gift size={20} /></InputIcon>
              <InputIcon label="Open GIF picker"><ImageIcon size={20} /></InputIcon>
              <InputIcon label="Open sticker picker"><Grid3x3 size={20} /></InputIcon>
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
    </div>
  );
}
