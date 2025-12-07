import React, { useEffect, useRef, useState } from "react";
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
import styled from "styled-components";
import {
  addMessage,
  getIndividualMessages,
  setGetMessageData,
  setIsUserReplying,
  setTextMessageInput,
  updateMessage,
} from "../../app/slices/messagesSlice";

interface Props {
  conversationObject: any;
  //   conversation_id: number;
}
export default function ChatWindowMessageInput({
  conversationObject,
}: // isUserReplying,
Props) {
  //
  const dispatch = useDispatch();
  //
  const conversationId = conversationObject.conversation_id as number;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textMessageInput = useSelector((w) => w.messages.textMessageInput);
  const getMessageData = useSelector((w) => w.messages.getMessageData);
  const textMessageIsEditing = useSelector(
    (w) => w.messages.textMessageIsEditing
  );
  const messageContent = getMessageData?.content || "";
  const message_id = getMessageData?.id || null;
  //
  // const [textInput, setTextInput] = useState<string>();

  useEffect(() => {
    // Auto focus textarea
    textareaRef.current?.focus();
  }, [conversationId, messageContent]);

  useEffect(() => {
    if (textMessageIsEditing && getMessageData?.content) {
      dispatch(setTextMessageInput(getMessageData.content));
    }
  }, [textMessageIsEditing, getMessageData?.content]);

  useEffect(() => {
    // Auto resize textarea
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [textMessageInput]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && conversationId) {
      e.preventDefault();

      if (textMessageInput.trim().length > 0) {
        handleSendMessage();
      }
    }
  }
  const handleSendMessage = async () => {
    if (!textMessageInput.trim() || !conversationObject?.chat_user_id) return;

    const trimmedMsg = textMessageInput.trim();

    console.log("Message sent:", textMessageInput);

    try {
      if (!textMessageIsEditing) {
        const data = await dispatch(
          // addConversation({
          addMessage({
            chatUserId: conversationObject.chat_user_id,
            messageContent: trimmedMsg,
            replyToMessageId: message_id,
          })
        ).unwrap();
        if (data?.data && data.data?.id) {
          //
          dispatch(
            getIndividualMessages({
              conversationId,
            })
          );
          dispatch(setGetMessageData(null));
          dispatch(setTextMessageInput(""));
          //
        }
        console.log({ data });
      } else if (textMessageIsEditing && message_id) {
        console.log("hit editing");
        //
        const data = await dispatch(
          // addConversation({
          updateMessage({
            messageId: message_id,
            messageContent: trimmedMsg,
          })
        ).unwrap();
        if (data?.data && data.data?.id) {
          //
          //
          dispatch(setGetMessageData(null));
          dispatch(setTextMessageInput(""));
          dispatch(
            getIndividualMessages({
              conversationId,
            })
          );
          //
        }
        console.log({ data });
        //
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
    // Clear only after successful dispatch
    dispatch(setTextMessageInput(""));
  };

  //
  return (
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
            value={textMessageInput}
            onChange={(e) => {
              if (conversationId) {
                dispatch(setTextMessageInput(e.target.value));
              }
            }}
            placeholder="Aa"
            rows={1}
            className="flex-1 resize-none bg-transparent text-white outline-none max-h-10 overflow-y-auto"
          />
          <FaRegSmile className="emoji" />
        </div>

        <div className="rightIconsContainer">
          {textMessageInput ? (
            <FaPaperPlane
              onClick={() => {
                handleSendMessage();
              }}
            />
          ) : (
            <FaHeart />
          )}
        </div>
      </InputContainerStyledDiv>
    </>
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
