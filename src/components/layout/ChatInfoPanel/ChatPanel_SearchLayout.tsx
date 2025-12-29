import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  getSearchUserMessages,
  setEnteredRightSidebarText,
  setScrollToMessageId,
} from "../../../app/slices/messagesSlice";

export default function SearchLayout({
  isRightSidebarOpen,
  conversationId,
  handleSearchClick,
}: any) {
  //
  const dispatch = useDispatch();

  const loadingSearchUserMessagesArray = useSelector(
    (w) => w.messages.loadingSearchUserMessagesArray
  );
  const [rightSidebarText, setRightSidebarText] = useState("");

  // Holds the returned array of getSearchUserMessages.
  const searchUserMessagesArray = useSelector(
    (w) => w.messages.searchUserMessagesArray
  );

  console.log({ searchUserMessagesArray });
  //

  //
  function highlightTextv2(text, searchText) {
    if (!searchText) return text;

    const escapedText = searchText.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

    const regex = new RegExp(`(${escapedText})`, "gi");

    return text.split(regex).map((part, index) =>
      part.toLowerCase() === searchText.toLowerCase() ? (
        <span key={index} className="highlight">
          {part}
        </span>
      ) : (
        <React.Fragment>{part}</React.Fragment>
      )
    );
  }

  function truncateText(text, maxLength = 15) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  }

  function highlightTextv1(text, searchText) {
    if (!searchText) return truncateText(text);

    const truncated = truncateText(text, 35); // Truncate first
    const escapedText = searchText.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`(${escapedText})`, "gi");

    return truncated.split(regex).map((part, index) =>
      part.toLowerCase() === searchText.toLowerCase() ? (
        <span key={index} className="highlight">
          {part}
        </span>
      ) : (
        <React.Fragment key={index}>{part}</React.Fragment>
      )
    );
  }

  function escapeRegExp(text) {
    return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  }

  function highlightText(text: string, searchText: string) {
    if (!searchText) return truncateText(text);

    const truncated = truncateText(text, 35);

    // Split search text into words
    const words = searchText
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(escapeRegExp);

    if (words.length === 0) return truncated;

    // Create regex like: (Hello|lady|beautiful|rosa)
    const regex = new RegExp(`(${words.join("|")})`, "gi");

    return truncated.split(regex).map((part: string, index: number) =>
      regex.test(part) ? (
        <span key={index} className="highlight">
          {part}
        </span>
      ) : (
        <React.Fragment key={index}>{part}</React.Fragment>
      )
    );
  }

  const [isEntered, setIsEntered] = useState(false);
  //
  //
  function handleEnteredSearch(e) {
    //
    const messageText = e.target.value;
    dispatch(setEnteredRightSidebarText(messageText));
    //
    if (e.key === "Enter" && messageText) {
      setIsEntered(true);
      console.log("enter");
      console.log({ messageText });

      const fetchUserMessages = async () => {
        try {
          const data = await dispatch(
            getSearchUserMessages({
              conversationId: conversationId,
              messageText: messageText,
            })
          ).unwrap();
          console.log({ data });
          if (data && data.length > 0) {
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchUserMessages();
    }
  }
  //
  return (
    <StyledDiv $isRightSidebarOpen={isRightSidebarOpen}>
      <div className="rightSidebarContainer">
        {/* Header */}
        <div className="rightSidebarHeader">
          <span className="rightSidebarTitle">Search</span>
          <button onClick={handleSearchClick} className="closeBtn">
            ✕
          </button>
        </div>

        {/* Search Input */}
        <div className="searchInputWrapper">
          <span className="searchIcon">🔍</span>

          <input
            className="searchInput"
            placeholder="Search in conversation"
            value={rightSidebarText}
            onChange={(e) => {
              setIsEntered(false);
              setRightSidebarText(e.target.value);
            }}
            onKeyDown={handleEnteredSearch}
          />

          {searchUserMessagesArray.length > 0 && (
            <span className="resultCount">
              {searchUserMessagesArray.length} results
            </span>
          )}

          <button
            onClick={() => {
              dispatch(getSearchUserMessages({ messageText: "" }));
            }}
            className="clearBtn"
          >
            ✕
          </button>
        </div>

        {/* Results */}
        <div className="searchResults">
          <div className="w-full text-center">
            {!isEntered && rightSidebarText && (
              <span
                className="font-sans"
                style={{ fontSize: "14px", color: "rgb(177 164 164)" }}
              >
                Please "Enter" to search
              </span>
            )}
          </div>

          {isEntered &&
          searchUserMessagesArray &&
          searchUserMessagesArray.length > 0
            ? searchUserMessagesArray.map((item, index) => (
                <div
                  className="searchItem"
                  key={index}
                  onClick={() => {
                    dispatch(setScrollToMessageId(item?.id));
                  }}
                >
                  <img
                    src="https://via.placeholder.com/40"
                    className="avatar"
                  />
                  <div className="messageContent">
                    <div className="name">Justine Sirios</div>
                    <div className="snippet">
                      {/* item.content is the actual text */}
                      {highlightText(item.content, rightSidebarText)}
                    </div>
                  </div>
                  <div className="time">34w</div>
                </div>
              ))
            : null}

          {isEntered &&
            rightSidebarText &&
            searchUserMessagesArray.length === 0 && (
              <div className="w-full text-center" style={{ marginTop: "1rem" }}>
                <span
                  className="font-sans"
                  style={{ fontSize: "18px", color: "#ffffff" }}
                >
                  No results found{" "}
                </span>
              </div>
            )}

          {false && (
            <>
              <div className="searchItem">
                <img src="https://via.placeholder.com/40" className="avatar" />
                <div className="messageContent">
                  <div className="name">Justine Sirios</div>
                  <div className="snippet">
                    ...pi account ko, <span className="highlight">psa</span>{" "}
                    lang need dalin, dahil...
                  </div>
                </div>
                <div className="time">34w</div>
              </div>

              <div className="searchItem">
                <img src="https://via.placeholder.com/40" className="avatar" />
                <div className="messageContent">
                  <div className="name">Facebook user</div>
                  <div className="snippet">
                    Hindi mo pa ba nahanap yung{" "}
                    <span className="highlight">psa</span> ni mama?
                  </div>
                </div>
                <div className="time">47w</div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Restore */}
        <div className="restoreBanner">
          Messages are missing.
          <span className="restoreLink">Restore now</span>
        </div>
      </div>
    </StyledDiv>
  );
}
const StyledDiv = styled.div`
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  width: 100%;
  display: ${({ $isRightSidebarOpen }) =>
    $isRightSidebarOpen ? "" : "none"} !important;

  .rightSidebarContainer {
    width: 300px;
    height: 100vh;
    background: #1f1f1f;
    border-radius: 16px 0 0 16px;
    padding: 16px;
    display: flex;
    flex-direction: column;
  }

  /* Header */
  .rightSidebarHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .rightSidebarTitle {
    color: #fff;
    font-size: 18px;
    font-weight: 600;
  }

  .closeBtn {
    background: none;
    border: none;
    color: #bbb;
    font-size: 18px;
    cursor: pointer;
  }

  /* Search Input */
  .searchInputWrapper {
    display: flex;
    align-items: center;
    background: #3a3b3c;
    border-radius: 24px;
    padding: 8px 12px;
    margin: 16px 0;
  }

  .searchIcon {
    color: #b0b3b8;
    margin-right: 8px;
  }

  .searchInput {
    flex: 1;
    background: transparent;
    border: none;
    color: #fff;
    font-size: 14px;
    outline: none;
  }

  .resultCount {
    font-size: 12px;
    color: #b0b3b8;
    margin-right: 8px;
  }

  .clearBtn {
    background: #555;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    color: #fff;
    cursor: pointer;
  }

  /* Results */
  .searchResults {
    flex: 1;
    overflow-y: auto;
  }

  .searchItem {
    display: flex;
    align-items: flex-start;
    padding: 10px 0;
    gap: 10px;
    cursor: pointer;
  }

  .searchItem .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .messageContent {
    flex: 1;
  }

  .name {
    color: #fff;
    font-size: 14px;
    font-weight: 600;
  }

  .snippet {
    color: #b0b3b8;
    font-size: 13px;
  }

  .snippet {
    color: #b0b3b8;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%; /* adjust width so that 15 characters fit */
  }

  .highlight {
    color: #fff;
    font-weight: 600;
  }

  .time {
    font-size: 12px;
    color: #b0b3b8;
  }

  /* Restore Banner */
  .restoreBanner {
    background: #2d2e30;
    padding: 12px;
    text-align: center;
    border-radius: 12px;
    font-size: 13px;
    color: #b0b3b8;
  }

  .restoreLink {
    color: #4599ff;
    margin-left: 6px;
    cursor: pointer;
  }
`;
