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
  useEffect(() => {
    dispatch(getIndividualMessages({ conversationId }));
  }, [conversationId]);

  const [messages1, setMessages] = useState<MessageType[]>([
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
  // const isUserReplying = useSelector(
  //   (w) => w.messages.isUserReplying
  // ) as boolean;
  //
  if (loadingIndivMessages) return <SkeletonMessagesv2 />;
  //
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

      {/* Reply Section. */}
      {false && isUserReplying && (
        <>
          <ReplyingDiv>
            <div className="replyingContainer">
              <div className="topContainer flex items-center justify-between">
                <div className="textContainer">
                  <h2>Replying to Pablo Jaime</h2>
                </div>
                <div onClick={() => {}} className="iconCloseContainer">
                  <FaTimesCircle />
                </div>
              </div>

              <div className="replyMessageDiv">
                <p>
                  Boy pasabi kay papa umaga na me uuwi. Dito ako marikina na mag
                  Boy pasabi kay papa umaga na me uuwi. Dito ako marikina na mag
                  Boy pasabi kay papa umaga na me uuwi. Dito ako marikina na mag
                </p>
              </div>
            </div>
          </ReplyingDiv>
        </>
      )}

      <ChatWindowReply
        chat_display_name={conversationObject?.chat_display_name}
      />

      {/* Bottom*/}
      <ChatWindowMessageInput
        // isUserReplying={isUserReplying}
        conversationObject={conversationObject}
      />
      {false && (
        <>
          <InputContainerStyledDiv>
            <div className="leftIconsContainer">
              <FaMicrophone />
              <FaImage />
              <FaGift />
              <BsGift />
            </div>

            <div className="messageBoxContainer">
              {/* <input
            value={textInput}
            onChange={(e) => {
              setTextInput(e.target.value);
            }}
            type="text"
            placeholder="Aa"
          /> */}
              <textarea
                onKeyDown={handleKeyDown}
                ref={textareaRef}
                value={textInput}
                onChange={(e) => {
                  if (conversationId) {
                    setTextInput(e.target.value);
                  }
                }}
                placeholder="Aa"
                rows={1}
                className="flex-1 resize-none bg-transparent text-white outline-none max-h-10 overflow-y-auto"
              />
              <FaRegSmile className="emoji" />
            </div>

            <div className="rightIconsContainer">
              {textInput ? <FaPaperPlane /> : <FaHeart />}
            </div>
          </InputContainerStyledDiv>
        </>
      )}
    </StyledDiv>
  );
}

const ReplyingDiv = styled.div`
  height: 10vh;
  max-height: 10vh;
  width: 100%;
  .replyingContainer {
    padding: 6px 15px;
  }
  .textContainer h2 {
    font-weight: bold;
  }
  .topContainer {
    margin-bottom: 6px;
  }

  .replyMessageDiv {
    overflow: hidden;
    width: 70%;
  }
  .replyMessageDiv p {
    height: 26px;
  }
`;
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

const MessengerContentStyled = styled.div`
  box-sizing: border-box;
  /*height: 80vh;*/
  height: ${({ hasReplyDiv }) => (hasReplyDiv ? "70vh" : "80vh")};

  .ellipsisContainer {
    border-radius: 50%;
    background: #535050;
    height: 25px;
    width: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .messageContainer {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 15px;
    height: 100%;
    overflow-y: auto;
    background-color: #0e0e10; /* Messenger dark background */
  }

  .messageText {
    max-width: 60%;
    padding: 10px 14px;
    border-radius: 18px;
    font-size: 15px;
    line-height: 1.4;
    color: white;
    background-color: ${({ theme, isSender }) =>
      isSender ? "#0084ff" : "#3a3b3c"};
    background-color: ${({ isSender }) => (isSender ? "#0084ff" : "#3a3b3c")};

    border-top-left-radius: ${({ isSender }) => (isSender ? "18px" : "24px")};
    border-top-right-radius: ${({ isSender }) => (isSender ? "4px" : "18px")};
    border-bottom-left-radius: ${({ isSender }) => (isSender ? "4px" : "0px")};
    border-bottom-right-radius: ${({ isSender }) =>
      isSender ? "4px" : "18px"};
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

const InputContainerStyledDiv = styled.div`
  box-sizing: border-box;
  height: 10vh;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  background-color: #242526;
  border-top: 1px solid #3a3b3c;
  position: sticky;
  bottom: 0;
  z-index: 10;

  .leftIconsContainer {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #00a884;
    font-size: 18px;
  }

  .messageBoxContainer {
    flex: 1;
    display: flex;
    align-items: center;
    background-color: #3a3b3c;
    border-radius: 50px;
    padding: 8px 14px;

    input,
    textarea {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: #e4e6eb;
      font-size: 15px;
    }

    .emoji {
      color: #00a884;
      font-size: 18px;
      margin-left: 8px;
      cursor: pointer;
    }
  }

  .rightIconsContainer {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #00a884;
    font-size: 22px;
    cursor: pointer;
  }
`;

const LeftIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #00a884;
  font-size: 18px;
`;

const MessageBox = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #3a3b3c;
  border-radius: 50px;
  padding: 8px 14px;

  input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #e4e6eb;
    font-size: 15px;
  }

  .emoji {
    color: #00a884;
    font-size: 18px;
    margin-left: 8px;
    cursor: pointer;
  }
`;

const RightIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00a884;
  font-size: 22px;
  cursor: pointer;
`;
