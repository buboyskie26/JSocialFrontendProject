import React, { useEffect } from "react";
import { getSocket } from "../app/socket/socket";
import {
  userStartedTyping,
  userStoppedTyping,
} from "../app/slices/typingSlice";
import { useDispatch } from "react-redux";

export default function TypingSocketListener() {
  //

  const socket = getSocket();
  const dispatch = useDispatch();

  //
  useEffect(() => {
    if (!socket) return;

    // ✅ Listen for typing start
    const handleTypingStart = (data) => {
      //   console.log({ data });
      //   console.log("HandleTypingStart");
      dispatch(
        userStartedTyping({
          userId: data.userId,
          display_name: data.display_name,
          email: data.email,
          username: data.username,
          conversationId: data.conversationId,
        }),
      );
    };

    // ✅ Listen for typing stop
    const handleTypingStop = ({ userId, conversationId }) => {
      dispatch(userStoppedTyping({ conversationId, userId }));
    };

    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);

    //
    return () => {
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
    };
    //
    // socket.on("typing:start", ({ userId, conversationId }) => {
    //   dispatch(userStartedTyping({ userId, conversationId }));
    // });
    //
    // socket.on("typing:stop", ({ userId, conversationId }) => {
    //   dispatch(userStoppedTyping({ userId, conversationId }));
    // });
    //
    //
    // return () => {
    //   socket.off("typing:start");
    //   socket.off("typing:stop");
    // };

    //
    //
  }, [socket, dispatch]);
  //
  //
  return null; // This is just a listener component
}
