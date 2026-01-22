import { useEffect } from "react";
import { getSocket } from "../app/socket/socket";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessagesDataArray,
  deletedMessagesDataArray,
  updateMessagesDataArray,
} from "../app/slices/messagesSlice";
import { removeTypingUsers } from "../app/slices/typingSlice";

export default function RealtimeCRUDSocketLister({
  conversationId,
}: {
  conversationId: string;
}) {
  const socket = getSocket();
  const dispatch = useDispatch();

  //   const conversationId = 47;
  //   const typingUserIds = useSelector((w) => w.typing.typingUsers);
  //   const hasTypingUserIds = typingUserIds[conversationId];

  //
  useEffect(() => {
    if (!socket) return;
    //

    // ✅ Listen for new messages configured in the backend controller add message
    socket.on("message:new", (data) => {
      //
      console.log("📨 New message:", data);
      dispatch(addMessagesDataArray(data?.message));

      //
      dispatch(removeTypingUsers({ conversationId }));
      // Remove
      //
    });

    socket.on("message:update", (data) => {
      console.log("📨 Updated message:", data);
      dispatch(updateMessagesDataArray(data));
      dispatch(removeTypingUsers({ conversationId }));
    });

    socket.on("message:delete", (data) => {
      console.log("📨 Deleted message:", data);
      dispatch(deletedMessagesDataArray(data));
    });

    socket.on("user:online", (data) => {
      console.log("📨 Online User Id:", data);
    });
    //
    return () => {
      socket.off("message:new");
      socket.off("message:update");
      socket.off("message:delete");
      socket.off("user:online");
    };
    //
  }, [socket, dispatch]);
  //
  return null;
}
