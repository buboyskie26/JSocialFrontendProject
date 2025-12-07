import styled from "styled-components";

export default function SkeletonMessages() {
  return (
    <SkeletonContainer>
      <div className="headerRow">
        <div className="skeleton box small" />
        <div className="skeleton circle" />
        <div className="skeleton circle" />
      </div>

      <div className="skeleton bar xl" />

      {Array.from({ length: 6 }).map((_, i) => (
        <div className="messageRow" key={i}>
          <div className="skeleton avatar" />
          <div className="textGroup">
            <div className="skeleton bar sm" />
            <div className="skeleton bar md" />
          </div>
        </div>
      ))}
    </SkeletonContainer>
  );
}

const SkeletonContainer = styled.div`
  padding: 1.2rem;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* ---------------- SKELETON SHIMMER ---------------- */
  .skeleton {
    position: relative;
    overflow: hidden;
    background: #3a3a3a;
    border-radius: 8px;
  }

  .skeleton::after {
    content: "";
    position: absolute;
    top: 0;
    left: -150px;
    width: 150px;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.25),
      transparent
    );
    animation: shimmer 1.3s infinite;
  }

  @keyframes shimmer {
    0% {
      left: -150px;
    }
    100% {
      left: 100%;
    }
  }

  /* ---------- TOP ITEMS ---------- */
  .headerRow {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .box.small {
    width: 80px;
    height: 35px;
    border-radius: 10px;
  }

  .circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .bar.xl {
    width: 90%;
    height: 35px;
    border-radius: 20px;
    margin-bottom: 25px;
  }

  /* ---------- CHAT ITEM SKELETON ---------- */
  .messageRow {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 18px;
  }

  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  .textGroup {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
  }

  .bar.sm {
    width: 40%;
    height: 16px;
    border-radius: 8px;
  }

  .bar.md {
    width: 70%;
    height: 16px;
    border-radius: 8px;
  }
`;
