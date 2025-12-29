import React, { useEffect, useRef, useState } from "react";
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
  loggedInUserId: string;
  conversationId: number;
}
export default function ChatWindowMessages({
  conversationId,
  loggedInUserId,
}: Props) {
  //
  const getMessageData = useSelector(
    (w) => w.messages.getMessageData,
    shallowEqual
  );
  // console.log({ getMessageData });
  const dispatch = useDispatch();
  // console.log("ChatWindowMessages");

  const enteredRightSidebarText = useSelector(
    (w) => w.messages.enteredRightSidebarText
  );
  // console.log({ enteredRightSidebarText });

  const messages = useSelector((w) => w.messages.individualMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  // const messageRefs = useRef({});

  const scrollToMessageId = useSelector((w) => w.messages.scrollToMessageId);

  // const scrollToMessageId = 32;

  // Scroll to bottom when messages change
  useEffect(() => {
    if (!scrollToMessageId) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [messages, scrollToMessageId]);

  //
  // Small delay to ensure DOM is ready
  useEffect(() => {
    // console.log({ messageRefs });
    // Add a small delay to ensure refs are populated after render
    const timer = setTimeout(() => {
      if (scrollToMessageId && messageRefs.current[scrollToMessageId]) {
        //
        const messageElement = messageRefs.current[scrollToMessageId];
        // console.log({ messageElement });

        if (messageElement) {
          messageElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          messageElement.classList.add("highlight-message");

          setTimeout(() => {
            messageElement?.classList.remove("highlight-message");
          }, 2000);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [scrollToMessageId, messages]); // Added messages to trigger when messages load

  //
  async function removeSingleMessage(messageId: number) {
    if (!messageId) return;
    try {
      const responseData = await dispatch(
        deleteMessage({ messageId })
      ).unwrap();
      // console.log({ responseData });
      if (responseData) {
        //
        //
        if (conversationId)
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

  const [hoverMessageId, setHoverMessageId] = useState(null);
  const [clickedMessageAction, setClickedMessageAction] = useState(null);
  // console.log({ clickedMessageAction });
  //
  function showMessagesFormat(
    positionMessage: string,
    item: any,
    isLastOfGroup = false,
    clickedMessageAction,
    setClickedMessageAction
  ) {
    //
    // const [showMenu, setShowMenu] = useState(false);

    // console.log({ clickedMessageAction });
    //
    //
    const messageAction = (
      <MessageActionsMenu
        // showMenu={showMenu}
        // setShowMenu={setShowMenu}
        isSender={item.sender_id === loggedInUserId}
        onReplyClick={() => {
          dispatch(setGetMessageData(item));
        }}
        onEditClick={() => {
          dispatch(setGetMessageData(item));
          dispatch(setTextMessageIsEditing(true));
          // console.log("click v2");
        }}
        onRemoveClick={async () => {
          //
          if (window.confirm("Are you sure you want to remove this?")) {
            await removeSingleMessage(item.id);
          }
        }}
        onEllipsisClick={() => {
          setClickedMessageAction(item?.id);
        }}
      />
    );
    const isSender = item.sender_id === loggedInUserId;

    const hasReplyMessage = item.reply_to_message_id !== null;
    const replyMessage = item.reply_message_content;
    //
    // Left side of Chat Messages.

    // if (hoverMessageId === item?.id) console.log({ hoverMessageId });

    // const showMessageAction = hoverMessageId === item?.id && messageAction;
    //
    const showMessageAction =
      (clickedMessageAction !== item?.id &&
        hoverMessageId === item?.id &&
        messageAction) ||
      (clickedMessageAction === item?.id && messageAction);

    //
    //
    function escapeRegExp(text) {
      return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    }
    function highlightText(text: string, searchText: string) {
      // if (!searchText) return truncateText(text);

      // const truncated = truncateText(text, 35);

      // Split search text into words
      const words = searchText
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(escapeRegExp);

      if (words.length === 0) return text;

      // Create regex like: (Hello|lady|beautiful|rosa)
      const regex = new RegExp(`(${words.join("|")})`, "gi");

      return text.split(regex).map((part: string, index: number) =>
        regex.test(part) ? (
          <span key={index} className="highlightText">
            {part}
          </span>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        )
      );
    }
    //
    //
    if (positionMessage === "left") {
      return (
        <>
          <div className="topImageDiv">
            {isLastOfGroup && <img src={janeDoeImage} />}
          </div>
          {replyMessage ? (
            <>
              <div
                className={`relative flex w-full justify-start items-end flex-col `}
              >
                <div className="flex w-full justify-start">
                  <ReplyMessageTextDiv>{replyMessage}</ReplyMessageTextDiv>
                </div>

                <div className="flex w-full justify-start items-center-safe">
                  <MessageTextDiv
                    style={{ marginRight: "5px" }}
                    isSender={isSender}
                    ref={(el) => {
                      // Adding key value, please console log fo more reference.
                      messageRefs.current[item?.id] = el;
                    }}
                  >
                    {/* {item.content} */}
                    {highlightText(item?.content, enteredRightSidebarText)}
                  </MessageTextDiv>
                  {/* {messageAction} */}
                  {showMessageAction}
                </div>
              </div>
            </>
          ) : (
            <>
              <MessageTextDiv
                style={{ marginRight: "5px" }}
                isSender={isSender}
                ref={(el) => {
                  // Adding key value, please console log fo more reference.
                  messageRefs.current[item?.id] = el;
                }}
              >
                {/* {item.content} */}
                {highlightText(item?.content, enteredRightSidebarText)}
              </MessageTextDiv>
              {showMessageAction}
              {/* {messageAction} */}
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
                className={`relative flex w-full justify-end items-end flex-col `}
              >
                <div>
                  <ReplyMessageTextDiv>{replyMessage}</ReplyMessageTextDiv>
                </div>
                <div className="flex w-full justify-end items-center-safe">
                  {/* {showMessageAction} */}
                  {messageAction}

                  <MessageTextDiv
                    isSender={isSender}
                    ref={(el) => {
                      // Adding key value, please console log fo more reference.
                      messageRefs.current[item?.id] = el;
                    }}
                  >
                    {/* {item.content} */}
                    {highlightText(item?.content, enteredRightSidebarText)}
                  </MessageTextDiv>
                </div>
              </div>
            </>
          ) : (
            <>
              {messageAction}
              {/* {showMessageAction} */}

              <MessageTextDiv
                isSender={isSender}
                ref={(el) => {
                  // Adding key value, please console log fo more reference.
                  messageRefs.current[item?.id] = el;
                }}
              >
                {/* {item.content} */}
                {highlightText(item?.content, enteredRightSidebarText)}
              </MessageTextDiv>
            </>
          )}
        </>
      );
    }
  }

  //
  //
  return (
    <MessengerContentStyled
      isSender={true}
      hasReplyDiv={getMessageData !== null}
    >
      <div className="messageContainer">
        {messages.length > 0 &&
          messages.map((item, index) => {
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

            return (
              <React.Fragment key={item?.id}>
                {isOther ? (
                  <div
                    onMouseEnter={() => {
                      setHoverMessageId(item?.id);
                    }}
                    onMouseLeave={() => {
                      setHoverMessageId(null);
                    }}
                    className="messegeTextContainer message-item w-full flex justify-start"
                  >
                    {showMessagesFormat(
                      "left",
                      item,
                      isLastOfGroup,
                      clickedMessageAction,
                      setClickedMessageAction
                    )}
                  </div>
                ) : (
                  <div
                    onMouseEnter={() => {
                      setHoverMessageId(item?.id);
                    }}
                    onMouseLeave={() => {
                      setHoverMessageId(null);
                    }}
                    className="messegeTextContainer message-item flex w-full justify-end"
                  >
                    {showMessagesFormat(
                      "right",
                      item,
                      clickedMessageAction,
                      setClickedMessageAction
                    )}
                  </div>
                )}
              </React.Fragment>
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

  /**/
  /*

  .message-item-item {
    transition: background-color 0.3s ease;
    padding: 10px;
    margin: 5px 0;
  }

  .highlight-message {
    background-color: #ffeb3b !important;
    animation: highlight-fade 2s ease-in-out !important;
  }

  @keyframes highlight-fade {
    0% {
      background-color: #ffeb3b !important;
    }
    100% {
      background-color: transparent !important;
    }
  }
  */
  /**/
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
  &.highlight-message {
    border: 5px solid green !important;
    animation: highlight-bounce 2s ease-in-out !important;
  }

  .highlightText {
    color: #fff !important;
    font-weight: 600 !important;
  }

  @keyframes highlight-bounce {
    0% {
      transform: scale(1);
    }
    10% {
      transform: scale(1.4);
    }
    50% {
      transform: scale(1);
    }
    100% {
      transform: scale(1);
    }
  }

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
