import React, { useEffect, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import MessageActionsMenu from "../shared/MessageActionsMenu";
import styled from "styled-components";
import janeDoeImage from "../../assets/jane_doe_sample.png";

import {
  deleteMessage,
  getIndividualMessages,
  setGetMessageData,
  setIsUserReplying,
  setTextMessageIsEditing,
} from "../../app/slices/messagesSlice";

interface Props {
  // isUserReplying: any;
  loggedInUserId: any;
  conversationId: number;
}
export default function ChatWindowMessages({
  // isUserReplying,
  conversationId,
  loggedInUserId,
}: Props) {
  //
  const getMessageData = useSelector(
    (w) => w.messages.getMessageData,
    shallowEqual
  );
  console.log({ getMessageData });
  const dispatch = useDispatch();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  console.log("ChatWindowMessages");
  const messages = useSelector((w) => w.messages.individualMessages);
  //
  useEffect(() => {
    console.log({ messages });
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //
  async function removeSingleMessage(messageId: number) {
    if (!messageId) return;
    console.log("hitt");
    try {
      const responseData = await dispatch(
        deleteMessage({ messageId })
      ).unwrap();
      console.log({ responseData });
      if (responseData) {
        //
        //
        dispatch(
          getIndividualMessages({
            conversationId,
          })
        );
      }
    } catch (error) {
      console.error("Error: " + error);
    }
  }
  //
  function showMessagesFormat(
    positionMessage: string,
    item: any,
    isLastOfGroup = false
  ) {
    //
    const messageAction = (
      <MessageActionsMenu
        isSender={item.sender_id === loggedInUserId}
        onReplyClick={() => {
          dispatch(setGetMessageData(item));
          // console.log("click v2");
        }}
        onEditClick={() => {
          dispatch(setGetMessageData(item));
          dispatch(setTextMessageIsEditing(true));

          // console.log("click v2");
        }}
        onRemoveClick={async () => {
          //
          if (window.confirm("Are you sure you want to remove this?")) {
            //
            await removeSingleMessage(item.id);
            //
          }
          // console.log("click v2");
        }}
      />
    );
    const isSender = item.sender_id === loggedInUserId;

    const hasReplyMessage = item.reply_to_message_id !== null;
    const replyMessage = item.reply_message_content;
    //
    // Left side of Chat Messages.
    //
    if (positionMessage === "left") {
      return (
        <>
          <div className="topImageDiv">
            {isLastOfGroup && <img src={janeDoeImage} />}
          </div>

          {/* {hasReplyMessage ? (
            <div className="w-full">
              <span>Has reply</span>
              <MessageTextDiv
                style={{ marginRight: "5px" }}
                isSender={isSender}
              >
                {item.content}
              </MessageTextDiv>
              {messageAction}
            </div>
          ) : (
            <>
              <MessageTextDiv
                style={{ marginRight: "5px" }}
                isSender={isSender}
              >
                {item.content}
              </MessageTextDiv>
              {messageAction}
            </>
          )} */}

          {replyMessage ? (
            <>
              <div
                // style={{ marginBottom: "3rem" }}
                className={`relative flex w-full justify-start items-end flex-col `}
              >
                <div
                  className="flex w-full justify-start"
                  //  style={{ position: "absolute", top: "-36px" }}
                >
                  <ReplyMessageTextDiv>{replyMessage}</ReplyMessageTextDiv>
                </div>

                {/*  */}
                <div className="flex w-full justify-start items-center-safe">
                  <MessageTextDiv
                    style={{ marginRight: "5px" }}
                    isSender={isSender}
                  >
                    {item.content}
                  </MessageTextDiv>
                  {messageAction}
                </div>
              </div>
            </>
          ) : (
            <>
              <MessageTextDiv
                style={{ marginRight: "5px" }}
                isSender={isSender}
              >
                {item.content}
              </MessageTextDiv>
              {messageAction}
            </>
          )}
        </>
      );
    } else if (positionMessage === "right") {
      return (
        <>
          {replyMessage ? (
            <>
              <div
                // style={{ marginBottom: "3rem" }}
                className={`relative flex w-full justify-end items-end flex-col `}
              >
                <div
                //  style={{ position: "absolute", top: "-36px" }}
                >
                  <ReplyMessageTextDiv>{replyMessage}</ReplyMessageTextDiv>
                </div>

                {/*  */}
                <div className="flex w-full justify-end items-center-safe">
                  {messageAction}
                  <MessageTextDiv isSender={isSender}>
                    {item.content}
                  </MessageTextDiv>
                </div>
              </div>
            </>
          ) : (
            <>
              {messageAction}
              <MessageTextDiv isSender={isSender}>
                {item.content}
              </MessageTextDiv>
            </>
          )}
        </>
      );
    }
  }
  //
  return (
    <MessengerContentStyled
      isSender={true}
      hasReplyDiv={getMessageData !== null}
    >
      <div className="messageContainer">
        {messages.length > 0 &&
          messages.map((item, index) => {
            //
            const nextMessage = messages[index + 1];

            // Is from other user?
            const isOther = item.sender_id !== loggedInUserId;

            // Is last message of their cluster?
            const isLastOfGroup =
              !nextMessage || nextMessage.sender_id !== item.sender_id;

            // This is the ID you want:
            const isOtherLastMessageId =
              isOther && isLastOfGroup ? item.id : null;

            // Check if the next has no reply.
            const nextOwnedMessageHasNoReply =
              !nextMessage || nextMessage.sender_id === item.sender_id;

            const test =
              loggedInUserId === item.sender_id &&
              item.reply_message_content &&
              item;
            //
            console.log({ test });

            const replyMessage = item.reply_message_content;

            return (
              <>
                {isOther ? (
                  <div
                    key={item.id}
                    className="messegeTextContainer  w-full flex justify-start"
                  >
                    {showMessagesFormat("left", item, isLastOfGroup)}
                  </div>
                ) : (
                  <div
                    key={item.id}
                    className={`messegeTextContainer flex w-full justify-end`}
                  >
                    {showMessagesFormat("right", item)}
                  </div>
                )}
              </>
            );
          })}
        <div ref={bottomRef} />
      </div>
    </MessengerContentStyled>
  );
}

const MessengerContentStyled = styled.div`
  box-sizing: border-box;
  height: ${({ hasReplyDiv }) => (hasReplyDiv ? "70vh" : "80vh")};

  .messegeTextContainer {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .messegeTextContainer .topImageDiv {
    margin-right: 12px;
    width: 35px;
    height: 35px;
    flex-shrink: 0;
    margin-top: 5px;
  }

  .messegeTextContainer .topImageDiv img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

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
    background-color: #292929;
  }

  .messageText {
    max-width: 60%;
    padding: 10px 14px;
    border-radius: 18px;
    font-size: 15px;
    line-height: 1.4;
    color: white;

    /* keep only one background-color logic */
    background-color: ${({ isSender }) => (isSender ? "#0084ff" : "#3a3b3c")};

    border-top-left-radius: ${({ isSender }) => (isSender ? "18px" : "24px")};
    border-top-right-radius: ${({ isSender }) => (isSender ? "4px" : "18px")};
    border-bottom-left-radius: ${({ isSender }) => (isSender ? "4px" : "0px")};
    border-bottom-right-radius: ${({ isSender }) =>
      isSender ? "4px" : "18px"};
  }
`;

const MessageTextDiv = styled.div`
  z-index: 1;
  max-width: 60%;
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 15px;
  line-height: 1.4;
  color: white;

  background-color: ${({ isSender }) => (isSender ? "#0084ff" : "#48535f")};
  border-top-left-radius: ${({ isSender }) => (isSender ? "12px" : "24px")};
  border-top-right-radius: ${({ isSender }) => (isSender ? "24px" : "12px")};
  border-bottom-left-radius: ${({ isSender }) => (isSender ? "12px" : "0px")};
  border-bottom-right-radius: ${({ isSender }) => (isSender ? "0px" : "12px")};
`;

const ReplyMessageTextDiv = styled.div`
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
