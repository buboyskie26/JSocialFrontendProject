import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { BsGift } from "react-icons/bs";
import {
  FaGift,
  FaHeart,
  FaImage,
  FaMicrophone,
  FaPaperPlane,
  FaRegSmile,
  FaTimesCircle,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import MessageActionsMenu from "../shared/MessageActionsMenu";
import {
  getIndividualMessages,
  setIsUserReplying,
} from "../../app/slices/messagesSlice";
import { addConversation } from "../../app/slices/conversationSlice";
import ChatWindowTop from "./ChatWindowTop";
import ChatWindowMessageInput from "./ChatWindowMessageInput";
import ChatWindowMessages from "./ChatWindowMessages";
import ChatWindowReply from "./ChatWindowReply";
import SkeletonMessagesv2 from "./SkeletonMessagesv2";

type MessageType = {
  id: number;
  sender_id: string;
  content: string;
  message_type: string;
  created_at: string;
};

interface Props {
  // conversationId: number | null;
  conversationObject: any | null;
}

export default function ChatWindow({
  // conversationId,
  conversationObject,
}: Props) {
  //
  if (!conversationObject) return;
  const dispatch = useDispatch();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const user = useSelector((w) => w.auth.user);
  // console.log({ user });

  // useEffect(() => {
  //   console.log("User changed:", user);
  // }, [user]);

  const conversationId = conversationObject?.conversation_id || null;

  const messages = useSelector((w) => w.messages.individualMessages);
  const loadingIndivMessages = useSelector(
    (w) => w.messages.loadingIndivMessages
  );

  // console.log({ messages });
  //

  useEffect(() => {
    if (conversationId) {
      dispatch(getIndividualMessages({ conversationId }));
    }
  }, [conversationId]);

  const [messagesx, setMessages] = useState<MessageType[]>([
    {
      id: 1,
      sender_id: "1",
      content: "Pinaulanan mo ata ng tres pre 😆",
      message_type: "text",
      created_at: "10-31-2025",
    },
    {
      id: 2,
      sender_id: "1",
      content: "puro drive lang 😆",
      message_type: "text",
      created_at: "10-31-2025",
    },
    {
      id: 3,
      sender_id: "1",
      content: "Solid din kakampi pre, malalakas rume-bound 😆",
      message_type: "text",
      created_at: "10-31-2025",
    },
    {
      id: 4,
      sender_id: "9",
      content: "Para sa pangarap, Go!",
      message_type: "text",
      created_at: "10-31-2025",
    },
    {
      id: 5,
      sender_id: "1",
      content: "Solid din kakampi pre, malalakas rume-bound 😆",
      message_type: "text",
      created_at: "10-31-2025",
    },
    {
      id: 6,
      sender_id: "9",
      content: "Solid din kakampi pre, malalakas rume-bound 😆",
      message_type: "text",
      created_at: "10-31-2025",
    },
    {
      id: 7,
      sender_id: "1",
      content: "Solid din kakampi pre, malalakas rume-bound 😆",
      message_type: "text",
      created_at: "10-31-2025",
    },
    {
      id: 8,
      sender_id: "9",
      content: "Solid din kakampi pre, malalakas rume-bound 😆",
      message_type: "text",
      created_at: "10-31-2025",
    },
    {
      id: 9,
      sender_id: "1",
      content: "Solid din kakampi pre, malalakas rume-bound 😆",
      message_type: "text",
      created_at: "10-31-2025",
    },
    {
      id: 10,
      sender_id: "1",
      content: "Solid din kakampi pre, malalakas rume-bound 😆",
      message_type: "text",
      created_at: "10-31-2025",
    },
  ]);
  //
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Adding/Updating of Message

  const loggedInUserId = user?.id;
  //
  //
  function showMessagesFormat(positionMessage, item) {
    const messageAction = (
      <MessageActionsMenu
        isSender={item.sender_id === loggedInUserId}
        onReplyClick={() => {
          setIsUserReplying(true);
        }}
      />
    );
    const isSender = item.sender_id === loggedInUserId;

    if (positionMessage === "left") {
      // console.log({ isSender });
      return (
        <>
          <MessageTextDiv style={{ marginRight: "5px" }} isSender={isSender}>
            {item.content}
          </MessageTextDiv>
          {messageAction}
        </>
      );
    } else if (positionMessage === "right") {
      // console.log({ isSender });
      return (
        <>
          {messageAction}
          <MessageTextDiv isSender={isSender}>{item.content}</MessageTextDiv>
        </>
      );
    }
  }
  //
  return (
    <StyledDiv>
      {/* Header */}
      <ChatWindowTop conversationObject={conversationObject} />

      {/* Message Content Design */}
      <ChatWindowMessages
        // isUserReplying={isUserReplying}
        loggedInUserId={loggedInUserId}
        conversationId={conversationId}
      />

      {/*  */}
      {/*  */}
      <ChatWindowReply
        chat_display_name={conversationObject?.chat_display_name}
      />
      {/* Bottom*/}
      <ChatWindowMessageInput conversationObject={conversationObject} />
    </StyledDiv>
  );
}
const StyledDiv = styled.div`
  box-sizing: border-box;
  min-height: 100vh;
  overflow: hidden;
  .topContentContainer {
    width: 100%;
    border-bottom: 1px solid #3a3b3c;
  }
  .topContentContainer {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .topLeft {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .topImageDiv {
    width: 40px;
    height: 40px;
    flex-shrink: 0; /* prevents shrinking */
  }
  .topImageDiv img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
  .topContentUser .activeStatus {
    font-size: 14px;
    color: darkgray;
  }
`;
const MessageTextDiv = styled.div`
  max-width: 60%;
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 15px;
  line-height: 1.4;
  color: white;

  background-color: ${({ isSender }) => (isSender ? "#0084ff" : "#3a3b3c")};
  border-top-left-radius: ${({ isSender }) => (isSender ? "12px" : "24px")};
  border-top-right-radius: ${({ isSender }) => (isSender ? "24px" : "12px")};
  border-bottom-left-radius: ${({ isSender }) => (isSender ? "12px" : "0px")};
  border-bottom-right-radius: ${({ isSender }) => (isSender ? "0px" : "12px")};
`;
