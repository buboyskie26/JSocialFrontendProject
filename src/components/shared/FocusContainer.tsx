import React from "react";
import { FaTimes } from "react-icons/fa";
import styled from "styled-components";

interface FocusContainerProps {
  imageSrc: string;
  displayName: string;
  hasRemoveIcon?: boolean;
  onRemove?: () => void;
  inputRef?: any;
  focusContainerRef?: any;
  addRecentSearch: any;
}
export default function FocusContainer({
  imageSrc,
  displayName,
  hasRemoveIcon,
  onRemove,
  inputRef,
  focusContainerRef,
  addRecentSearch,
}: FocusContainerProps) {
  return (
    <StyleDivContainer>
      <div className="recentSearchesItemContainer" onClick={addRecentSearch}>
        <div className="recentSearchesItemImageDiv">
          <img src={imageSrc} alt={displayName} />
        </div>

        <div className="recentSearchesContentDiv">
          <span>{displayName}</span>

          {hasRemoveIcon && (
            <div
              className="closeContainer cursor-pointer flex items-center justify-center"
              onClick={onRemove}
              ref={focusContainerRef}
              tabIndex={-1} // ✅ makes this div focusable
              onMouseDown={(e) => e.preventDefault()} // ✅ prevent losing input focus when clicking
            >
              <FaTimes style={{ fontSize: "12px", objectFit: "cover" }} />
            </div>
          )}
        </div>
      </div>
    </StyleDivContainer>
  );
}

const StyleDivContainer = styled.div`
  .closeContainer {
    background: #524e4e;
    border-radius: 50%;
    width: 11%;
    height: 22px;
    width: 22px;
    flex-shrink: 0;
  }
`;
