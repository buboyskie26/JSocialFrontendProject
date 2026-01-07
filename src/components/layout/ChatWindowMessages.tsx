import React, { useCallback, useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import MessageActionsMenu from "../shared/MessageActionsMenu";
import styled from "styled-components";
import janeDoeImage from "../../assets/jane_doe_sample.png";

import {
  deleteMessage,
  getConversationMessages,
  getIndividualMessages,
  loadInitialMessages,
  loadMessagesAfter,
  loadMessagesAround,
  loadMessagesBefore,
  setGetMessageData,
  setIsClickedMessageUponSearch,
  setIsUserReplying,
  setMessagesLoading,
  setScrollToMessageId,
  setTextMessageIsEditing,
} from "../../app/slices/messagesSlice";

interface Props {
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

  // Pouplate the previous messages
  const messagesPrev = useSelector((w) => w.messages.individualMessages);

  // Populates the messages array of getConversationMessages function.
  const messagesDataArray = useSelector((w) => w.messages.messagesDataArray);
  useEffect(() => {
    console.log({ messagesDataArray });
  }, [messagesDataArray]);
  const messagesLoading = useSelector((w) => w.messages.messagesLoading);

  const bottomRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  // const messageRefs = useRef({});

  // const [isClickedMessageUponSearch, setIsClickedMessageUponSearch] =
  //   useState(false);

  const isClickedMessageUponSearch = useSelector(
    (w) => w.messages.isClickedMessageUponSearch
  );
  // useEffect(() => {
  //   console.log({ isClickedMessageUponSearch });
  // }, [isClickedMessageUponSearch]);
  // Value of clicked message from search data list (Right div search).
  const scrollToMessageId = useSelector((w) => w.messages.scrollToMessageId);

  // Loads the Conversation Messages
  // useEffect(() => {
  //   if (conversationId) {
  //     dispatch(getIndividualMessages({ conversationId }));
  //   }
  // }, [dispatch, conversationId]);

  //// ##
  // Scroll to bottom when messages change
  useEffect(() => {
    // console.log({ scrollToMessageId });
    // if (scrollToMessageId === null) {

    const messageCurrent = messageRefs.current;
    // console.log({ messageCurrent });
    //

    // Applicable only if the scrollToMessageId is not null (Has clicked upon searched.)
    // if (scrollToMessageId === null && !messageCurrent) {

    if (!isClickedMessageUponSearch) {
      // This is working at the scroll top only.
      // if (scrollToMessageId === null && !isClickedMessageUponSearch) {
      console.log("DEFAULT SCROLL BOTTOM");
      bottomRef?.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [messagesDataArray, scrollToMessageId, isClickedMessageUponSearch]);

  //
  // Small delay to ensure DOM is ready
  useEffect(() => {
    // console.log({ messageRefs });
    // Add a small delay to ensure refs are populated after render
    // if (!scrollToMessageId) return;

    const timer = setTimeout(() => {
      if (scrollToMessageId && messageRefs.current[scrollToMessageId]) {
        //
        const messageElement = messageRefs.current[scrollToMessageId];
        // console.log({ messageElement });

        if (messageElement) {
          // console.log("SCROLLED TO CLICKED MESSAGE");
          messageElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          messageElement.classList.add("highlight-message");
          //
          // reset
          // messageRefs.current = {};
          // To prevent moving again to the clicked message.
          dispatch(setScrollToMessageId(null));
          // dispatch(setIsClickedMessageUponSearch(false));

          setTimeout(() => {
            messageElement?.classList.remove("highlight-message");
          }, 2000);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [dispatch, scrollToMessageId, messagesDataArray]); // Added messages to trigger when messages load

  const topRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const hasMoreBefore = useSelector((w) => w.messages.hasMoreBefore);
  const hasMoreAfter = useSelector((w) => w.messages.hasMoreAfter);

  /**
   * Load more messages when scrolling up
   */
  const handleLoadMoreBefore = useCallback(async () => {
    if (messagesLoading || !hasMoreBefore || messagesDataArray.length === 0) {
      return;
    }

    const firstMessageId = messagesDataArray[0].id;
    const container = messageContainerRef.current;

    if (!container) return;

    // Save scroll position before loading
    const scrollHeightBefore = container.scrollHeight;
    const scrollTopBefore = container.scrollTop;

    try {
      await dispatch(
        loadMessagesBefore({
          conversationId,
          beforeMessageId: firstMessageId,
          limit: 2,
        })
      ).unwrap();

      // Restore scroll position after messages are loaded
      requestAnimationFrame(() => {
        if (container) {
          const scrollHeightAfter = container.scrollHeight;
          container.scrollTop =
            scrollTopBefore + (scrollHeightAfter - scrollHeightBefore);
        }
      });
    } catch (error) {
      console.error("Failed to load older messages:", error);
    }
  }, [
    messagesLoading,
    hasMoreBefore,
    messagesDataArray,
    conversationId,
    dispatch,
  ]);

  const loadMoreTriggerRef = useRef<HTMLDivElement>(null); // NEW: Trigger for loading more at bottom

  // Todo. How can I scroll to bottom which will trigger this
  // after API triggered, it should have spaces for scrolling to bottom.
  const handleLoadMoreAfterv2 = useCallback(async () => {
    //
    if (messagesLoading || !hasMoreAfter || messagesDataArray.length === 0) {
      return;
    }

    const lastMessageId = messagesDataArray[messagesDataArray.length - 1].id;
    const container = messageContainerRef.current;
    if (!container) return;

    // Save scroll position before loading
    const scrollHeightBefore = container.scrollHeight;
    const scrollTopBefore = container.scrollTop;
    // Calculate distance from bottom
    const distanceFromBottom =
      scrollHeightBefore - scrollTopBefore - container.clientHeight;

    try {
      const fetchMessagesAfter = await dispatch(
        loadMessagesAfter({
          conversationId,
          afterMessageId: lastMessageId,
        })
      ).unwrap();

      // console.log({ fetchMessagesAfter });

      // Restore scroll position after messages are loaded
      requestAnimationFrame(() => {
        if (container) {
          const scrollHeightAfter = container.scrollHeight;
          // Keep the same distance from bottom
          container.scrollTop =
            scrollHeightAfter - container.clientHeight - distanceFromBottom;
        }
      });
    } catch (error) {
      console.error("Failed to load newer messages:", error);
    }
  }, [
    messagesLoading,
    hasMoreAfter,
    messagesDataArray,
    conversationId,
    dispatch,
  ]);

  //

  const handleLoadMoreAfter = useCallback(async () => {
    if (messagesLoading || !hasMoreAfter || messagesDataArray.length === 0) {
      return;
    }

    const lastMessageId = messagesDataArray[messagesDataArray.length - 1].id;
    const container = messageContainerRef.current;
    if (!container) return;

    // Save scroll position before loading
    const scrollHeightBefore = container.scrollHeight;
    const scrollTopBefore = container.scrollTop;
    // Calculate distance from bottom
    const distanceFromBottom =
      scrollHeightBefore - scrollTopBefore - container.clientHeight;

    try {
      const fetchMessagesAfter = await dispatch(
        loadMessagesAfter({
          conversationId,
          afterMessageId: lastMessageId,
        })
      ).unwrap();
      // console.log({ fetchMessagesAfter });

      // Restore scroll position after messages are loaded
      requestAnimationFrame(() => {
        if (container) {
          const scrollHeightAfter = container.scrollHeight;
          // Keep the same distance from bottom
          // container.scrollTop =
          //   scrollHeightAfter - container.clientHeight - distanceFromBottom;
        }
      });
    } catch (error) {
      console.error("Failed to load newer messages:", error);
    }
  }, [
    messagesLoading,
    hasMoreAfter,
    messagesDataArray,
    conversationId,
    dispatch,
  ]);
  //
  // IntersectionObserver effect
  useEffect(() => {
    const topElement = topRef.current;
    const bottomElement = bottomRef.current;
    const loadMoreTrigger = loadMoreTriggerRef.current; // NEW
    const container = messageContainerRef.current;

    // console.log({ loadMoreTrigger });
    // console.log({ bottomElement });
    if (!topElement || !loadMoreTrigger || !container) return;

    const observerOptions = {
      root: container,
      rootMargin: "0px",
      threshold: 0.1,
    };
    const timeoutRefs = new Map<Element, NodeJS.Timeout>(); // Store timeouts
    // console.log({ timeoutRefs });
    //
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      //
      entries.forEach((entry) => {
        if (entry.target === topElement) {
          // if (entry.isIntersecting) {
          console.log("User scrolled to TOP");
          //
          const existingTimeout = timeoutRefs.get(entry.target);
          //
          if (existingTimeout) {
            clearTimeout(existingTimeout);
          }
          //
          if (entry.isIntersecting && hasMoreBefore) {
            console.log("User scrolled to TOP - Loading more messages");
            const timeoutId = setTimeout(() => {
              handleLoadMoreBefore();
              timeoutRefs.delete(entry.target); // Clean up after execution
            }, 500);

            timeoutRefs.set(entry.target, timeoutId);
          }
          // }
        }
        if (entry.target === loadMoreTrigger) {
          // Clear existing timeout for this element
          const existingTimeout = timeoutRefs.get(entry.target);
          if (existingTimeout) {
            clearTimeout(existingTimeout);
          }

          if (entry.isIntersecting && hasMoreAfter) {
            console.log("User scrolled to BOTTOM - Loading more messages");

            const timeoutId = setTimeout(() => {
              handleLoadMoreAfter();
              timeoutRefs.delete(entry.target); // Clean up after execution
            }, 500);

            timeoutRefs.set(entry.target, timeoutId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    observer.observe(topElement);
    observer.observe(loadMoreTrigger); // NEW: Observe the trigger

    return () => {
      observer.disconnect();
    };
  }, [
    messagesDataArray,
    handleLoadMoreBefore,
    handleLoadMoreAfter,
    //
    isClickedMessageUponSearch,

    hasMoreAfter,
    hasMoreBefore,
  ]);

  // Initial loads
  useEffect(() => {
    if (conversationId && scrollToMessageId) {
      // console.log({ scrollToMessageId });

      const fetchLoadMessages = async () => {
        try {
          const loadMessagesData = await dispatch(
            loadMessagesAround({
              conversationId,
              messageId: scrollToMessageId,
            })
          ).unwrap();

          // You can use loadMessagesData here if needed
          console.log({ loadMessagesData });
        } catch (error) {
          console.error(error);
        }
      };

      fetchLoadMessages();
    }
  }, [conversationId, scrollToMessageId, dispatch]);

  /**
   * Load more messages when scrolling up
   */
  const handleLoadMessagesAround = useCallback(async () => {
    if (
      messagesLoading ||
      // || !hasMoreAfter
      messagesDataArray.length === 0
    ) {
      return;
    }

    const lastMessageId = messagesDataArray[messagesDataArray.length - 1].id;
    const container = messageContainerRef.current;
    if (!container) return;

    // Save scroll position before loading
    const scrollHeightBefore = container.scrollHeight;
    const scrollTopBefore = container.scrollTop;
    // Calculate distance from bottom
    const distanceFromBottom =
      scrollHeightBefore - scrollTopBefore - container.clientHeight;

    try {
      await dispatch(
        loadMessagesAround({
          conversationId,
          // messageId: lastMessageId,
          messageId: scrollToMessageId,
        })
      ).unwrap();

      // await dispatch(
      //   loadMessagesAround({
      //     conversationId,
      //     messageId: scrollToMessageId,
      //   })
      // ).unwrap();

      // Restore scroll position after messages are loaded
      requestAnimationFrame(() => {
        if (container) {
          const scrollHeightAfter = container.scrollHeight;
          // Keep the same distance from bottom
          container.scrollTop =
            scrollHeightAfter - container.clientHeight - distanceFromBottom;
        }
      });
    } catch (error) {
      console.error("Failed to load newer messages:", error);
    }
  }, [
    messagesLoading,
    // hasMoreBefore,
    messagesDataArray,
    conversationId,
    scrollToMessageId,
    dispatch,
  ]);

  //

  // const loadInitialMessages = useCallback(async () => {
  //   try {
  //     setMessagesLoading(true);
  //     const response = await dispatch(
  //       getConversationMessages({
  //         params: { limit: 10 },
  //         conversationId: conversationId,
  //       })
  //     ).unwrap();
  //     console.log({ response });

  //     console.log("📱 Loaded initial messages:", response?.pagination?.count);
  //   } catch (error) {
  //     console.error("Error loading initial messages:", error);
  //   } finally {
  //     setMessagesLoading(false);
  //   }
  //   //
  // }, [dispatch, conversationId]);

  /**
   * Load initial messages when conversation changes
   */
  useEffect(() => {
    if (conversationId) {
      dispatch(
        loadInitialMessages({
          conversationId: conversationId as number,
        })
      );
    }
  }, [dispatch, conversationId]);

  ///

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

    if (item?.deleted === true) return;

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
          //

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

    const replyMessage = item.reply_message_content;
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

    const showMessageAction =
      (clickedMessageAction !== item?.id &&
        hoverMessageId === item?.id &&
        messageAction) ||
      (clickedMessageAction === item?.id && messageAction);

    //
    // if (hoverMessageId === item?.id) console.log({ hoverMessageId });
    // console.log({ clickedMessageAction });

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
                  {/* {messageAction} */}
                  {showMessageAction}

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
              {/* {messageAction} */}
              {showMessageAction}

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
      <div className="messageContainer" ref={messageContainerRef}>
        {/* Top sentinel div */}
        <div
          className="flex justify-center items-center"
          ref={topRef}
          style={{ height: "1px" }}
        >
          {hasMoreBefore && <span>Loading messages...</span>}
        </div>
        {/* <div ref={topRef} style={{ height: "1px", background: "red" }} /> */}
        {messagesDataArray.length > 0 &&
          messagesDataArray.map((item, index) => {
            const nextMessage = messagesDataArray[index + 1];
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
                      isLastOfGroup,
                      clickedMessageAction,
                      setClickedMessageAction
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        <div ref={bottomRef} />

        {/* NEW: Load more trigger - placed AFTER bottomRef */}
        {/* {hasMoreAfter && ( */}
        <div
          ref={loadMoreTriggerRef}
          style={{
            height: "100px", // Space to scroll into
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#999",
            padding: "0",
            margin: "0",
          }}
        >
          {hasMoreAfter && (
            <>
              <span>
                {messagesLoading
                  ? "Loading more messages..."
                  : "Scroll for more"}
              </span>
            </>
          )}
        </div>
        {/* )} */}
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
