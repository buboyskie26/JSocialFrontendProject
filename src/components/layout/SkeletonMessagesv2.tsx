import styled from "styled-components";

export default function SkeletonMessagesv2() {
  return (
    <SkeletonWrapper>
      {Array.from({ length: 12 }).map((_, i) => {
        const isLeft = i % 2 === 0;
        return (
          <div className={`bubbleRow ${isLeft ? "left" : "right"}`} key={i}>
            <div className="skeleton bubble" />
          </div>
        );
      })}
    </SkeletonWrapper>
  );
}
const SkeletonWrapper = styled.div`
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 16px;

  /* =========================================================
     SKELETON SHIMMER EFFECT
  ========================================================= */
  .skeleton {
    position: relative;
    overflow: hidden;
    background: #3a3a3a; /* base background */
    border-radius: 16px;
  }

  .skeleton::after {
    content: "";
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.23),
      transparent
    );
    animation: shimmer 1.4s infinite;
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }

  /* =========================================================
     ROW ALIGNMENT
  ========================================================= */
  .bubbleRow {
    display: flex;
    width: 100%;
  }

  .bubbleRow.left {
    justify-content: flex-start;
  }

  .bubbleRow.right {
    justify-content: flex-end;
  }

  /* =========================================================
     BUBBLE SIZES (randomized look)
  ========================================================= */
  .bubble {
    height: 22px;
    border-radius: 18px;
    width: 55%;
  }

  /* small variation for realism */
  .bubbleRow:nth-child(3) .bubble {
    width: 45%;
  }
  .bubbleRow:nth-child(5) .bubble {
    width: 60%;
  }
  .bubbleRow:nth-child(7) .bubble {
    width: 45%;
  }

  .bubbleRow:nth-child(9) .bubble {
    width: 45%;
  }
  .bubbleRow:nth-child(11) .bubble {
    width: 45%;
  }
  .bubbleRow:nth-child(12) .bubble {
    width: 60%;
  }
`;
