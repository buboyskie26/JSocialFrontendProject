import React, { useState, useRef, useEffect } from "react";
import { FaRegSmile, FaReply } from "react-icons/fa";
import { FaEllipsis } from "react-icons/fa6";
import styled from "styled-components";

export default function MessageActionsMenu({
  isSender,
  onReplyClick,
  onEditClick,
  onRemoveClick,
}: any) {
  //
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function showActions(isLeftPosition) {
    const ellipsisAction = (
      <div
        className="cursor-pointer ellipsisContainer"
        title="More"
        onClick={() => setShowMenu((prev) => !prev)}
      >
        <FaEllipsis className="ellipsis" />
      </div>
    );
    const replyAction = (
      <div onClick={onReplyClick} className="ellipsisContainer">
        <FaReply className="emoji" />
      </div>
    );
    const smileAction = (
      <div onClick={onEditClick} className="ellipsisContainer">
        <FaRegSmile className="emoji" />
      </div>
    );

    if (isLeftPosition) {
      return (
        <>
          {ellipsisAction}
          {replyAction}
          {smileAction}
        </>
      );
    } else {
      return (
        <>
          {smileAction}
          {replyAction}
          {ellipsisAction}
        </>
      );
    }
    //
  }

  return (
    <div className="relative flex items-center gap-2 mr-3">
      {/* Ellipsis */}

      {showActions(isSender)}
      {/* Menu */}
      {showMenu && (
        <MenuContainer ref={menuRef}>
          <MenuItem
            onClick={() => {
              setShowMenu(false);
              onRemoveClick();
            }}
          >
            Remove
          </MenuItem>
          <MenuItem>Forward</MenuItem>
          <MenuItem>Pin</MenuItem>
          <MenuItem>Report</MenuItem>
          <MenuArrow />
        </MenuContainer>
      )}
    </div>
  );
}

const MenuContainer = styled.div`
  position: absolute;
  top: -5px;
  right: 30px;
  background-color: #2f2f2f;
  color: white;
  padding: 8px 0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  width: 120px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  z-index: 100;
`;

const MenuItem = styled.div`
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background-color: #3e3e3e;
  }
`;

const MenuArrow = styled.div`
  position: absolute;
  bottom: -6px;
  right: 35px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #2f2f2f;
`;
