import { useEffect, useRef } from "react";

export default function useChatScroll(messageCount) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messageCount]);

  return scrollRef;
}
