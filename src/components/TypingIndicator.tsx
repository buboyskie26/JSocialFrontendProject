import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { selectTypingUsersInConversation } from "../app/slices/typingSlice";

export default function TypingIndicator({ conversationId }: any) {
  //
  //
  const typingUserIds = useSelector((w) => w.typing.typingUsers);

  const currentUserId = useSelector((w) => w.auth.user?.id);
  // const otherUserIds = typingUserIds.filter((w) => w.id !== currentUserId);
  //
  useEffect(() => {
    console.log({ typingUserIds });
    // console.log(typeof typingUserIds === "object");
  }, [typingUserIds]);

  const hasData = typingUserIds[conversationId];
  //
  function getTypingText() {
    // Only for One to One
    const data = typingUserIds[conversationId];
    if (!data) return;
    // console.log({ data });
    if (data && data?.length === 1) {
      const dataChatUser = data[0];
      // console.log({ dataChatUser: dataChatUser?.userId });
      // console.log({ currentUserId });
      //
      return `${dataChatUser.display_name} is typing...`;
    }
    return "";
  }
  //
  return (
    <StyledComponentDiv>
      {hasData !== undefined && (
        <div className="typing-indicator">
          <span className="typing-text">{getTypingText()}</span>
          {/* <span className="typing-text">Justine is typing...</span> */}
          <span className="typing-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </span>
        </div>
      )}
    </StyledComponentDiv>
  );
}

const StyledComponentDiv = styled.div`
  /* src/styles/TypingIndicator.css */
  .typing-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    font-size: 14px;
    color: #666;
    font-style: italic;
    /*justify-content: ${({ isSender }) => (isSender ? "start" : "end")};*/
    justify-content: start;
  }

  .typing-dots {
    display: flex;
    gap: 4px;
  }

  .typing-dots .dot {
    width: 6px;
    height: 6px;
    background-color: #666;
    border-radius: 50%;
    animation: typing-bounce 1.4s infinite ease-in-out;
  }

  .typing-dots .dot:nth-child(1) {
    animation-delay: -0.32s;
  }

  .typing-dots .dot:nth-child(2) {
    animation-delay: -0.16s;
  }

  @keyframes typing-bounce {
    0%,
    80%,
    100% {
      transform: scale(0);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;
