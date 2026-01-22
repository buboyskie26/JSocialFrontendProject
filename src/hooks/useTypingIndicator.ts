import { useCallback, useEffect, useRef } from "react";
import { getSocket } from "../app/socket/socket";

//
export const useTypingIndicator = (
  conversationId: number | undefined,
): {
  startTyping: () => void;
  stopTyping: () => void;
} => {
  //
  const socket = getSocket();
  // This is a timeout
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  // ✅ Start typing
  const startTyping = useCallback(() => {
    //
    if (!socket || !conversationId) return;

    // console.log("start typing..");
    // Only emit if not already typing
    if (!isTypingRef.current) {
      socket.emit("typing:start", { conversationId });
      isTypingRef.current = true;
    }

    // If we are starting to type again but in within the timeout span then,
    // Clear the existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Auto-stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
    //
  }, [socket, conversationId]);

  //
  // ✅ Stop typing
  const stopTyping = useCallback(() => {
    if (!socket || !conversationId) return;
    // console.log("stop typing..");

    if (isTypingRef.current) {
      socket.emit("typing:stop", { conversationId });
      isTypingRef.current = false;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    //
    console.log("STOP TYPING..");
  }, [socket, conversationId]);

  // ✅ Cleanup on unmount or conversation change
  useEffect(() => {
    return () => {
      stopTyping();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [conversationId, stopTyping]);

  return { startTyping, stopTyping };
};
