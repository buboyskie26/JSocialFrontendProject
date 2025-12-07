import React from "react";
import styled from "styled-components";

export default function SkeletonChatThread() {
  return (
    <ChatSkeletonContainer>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className={`bubbleRow ${i % 2 === 0 ? "left" : "right"}`}>
          <div className="skeleton bubble shimmer" />
        </div>
      ))}
    </ChatSkeletonContainer>
  );
}

const ChatSkeletonContainer = styled.div`
  padding: 1rem;
  height: 100%;
  overflow-y: auto;

  .bubbleRow {
    display: flex;
    margin-bottom: 14px;
  }

  .bubbleRow.left {
    justify-content: flex-start;
  }

  .bubbleRow.right {
    justify-content: flex-end;
  }

  .bubble {
    width: 60%;
    height: 22px;
    border-radius: 16px;
  }

  /* ---------------- */
  /* BASE SKELETON    */
  /* ---------------- */
  .skeleton {
    position: relative;
    background: #2f2f2f;
    overflow: hidden;
    border-radius: 12px;
  }

  /* ---------------- */
  /* SHIMMER EFFECT   */
  /* ---------------- */

  .shimmer::after {
    content: "";
    position: absolute;
    top: 0;
    left: -150px;
    height: 100%;
    width: 150px;

    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0) 100%
    );

    animation: shimmer 1.25s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-150px);
    }
    100% {
      transform: translateX(300px);
    }
  }
`;
