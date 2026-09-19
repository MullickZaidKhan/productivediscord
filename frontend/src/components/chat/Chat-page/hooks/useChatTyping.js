import { useEffect, useRef, useState } from "react";

export default function useChatTyping({
  socket,
  currentUserId,
  contactId,
  onSend,
  isSending,
}) {
  const [draft, setDraft] = useState("");
  const [isContactTyping, setIsContactTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const handleTypingStart = ({ userId }) => {
      if (String(userId) === String(contactId)) setIsContactTyping(true);
    };
    const handleTypingStop = ({ userId }) => {
      if (String(userId) === String(contactId)) setIsContactTyping(false);
    };

    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);
    return () => {
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
    };
  }, [socket, contactId]);

  useEffect(() => () => clearTimeout(typingTimeoutRef.current), []);

  const handleTyping = (event) => {
    const value = event.target.value;
    setDraft(value);
    if (!contactId || !currentUserId) return;

    socket.emit("typing:start", {
      senderId: currentUserId,
      receiverId: contactId,
    });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing:stop", {
        senderId: currentUserId,
        receiverId: contactId,
      });
    }, 1000);
  };

  const handleSend = async () => {
    if (isSending) return;
    const sent = await onSend(draft);
    if (sent) setDraft("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return { draft, setDraft, isContactTyping, handleTyping, handleKeyDown, handleSend };
}
