// src/components/layout/Sidebar.tsx

import styled from "styled-components";
import johnDoeImage from "../../assets/john_doe_sample.jpg";
import SearchUser from "../shared/SearchUser";
import { useDispatch, useSelector } from "react-redux";
import { formatMessengerTime } from "../../utils/timeFormatter";
import { FaTimes } from "react-icons/fa";
import FocusContainer from "../shared/FocusContainer";
import { setSearchInputFocused } from "../../app/slices/sharedSlice";
import { use, useEffect, useMemo, useRef, useState } from "react";
import {
  getUserMessages,
  setEnteredRightSidebarText,
  setGetMessageData,
  setIndividualMessages,
  setIsSearchClicked,
  setTextMessageInput,
  setTextMessageIsEditing,
} from "../../app/slices/messagesSlice";
import {
  checkRecentSearchHasConvo,
  setSelectedConversation,
} from "../../app/slices/conversationSlice";
import SkeletonMessages from "./SkeletonMessages";
import SkeletonChatThread from "./SkeletonChatThread";
import {
  addUpdateRecentSearches,
  deletedRecentSearches,
  getUserRecentSearches,
} from "../../app/slices/recentSearchesSlice";
import SidebarSearchResult from "./SidebarSearchResult";
import { getAllUsersBySearch, logoutUser } from "../../app/slices/authSlice";
// import janeDoeImage from "../../assets/jane_doe_sample.jpg";

//
type ConversationType = "individual" | "group";

interface ConversationItem {
  conversation_id: number;
  // type: "individual" | "group"; // restrict to only valid values
  type: ConversationType;
  group_name: string | null;
  last_message_id: number;
  last_message: string;
  last_message_time: string; // ISO date string
  chat_user_id: number;
  chat_username: string;
  chat_display_name: string;
  chat_profile_image: string | null;
}
interface Props {
  conversationId: any;
}
export default function Sidebar({ conversationId }: Props) {
  const chats = [
    { id: 1, name: "Ian Louie San Pedro", message: "Okay pedro..." },
    { id: 2, name: "ASE", message: "anu po Job ID..." },
  ];
  const searchInputFocused = useSelector((w) => w.shared.searchInputFocused);
  const getUserRecentSearchesArray = useSelector(
    (w) => w.recentSearches.getUserRecentSearchesArray
  );
  // console.log({ getUserRecentSearchesArray });
  const loadingSearches = useSelector((w) => w.recentSearches.loadingSearches);

  // const conversations2: ConversationItem[] = [
  //   {
  //     conversation_id: 14,
  //     type: "individual",
  //     group_name: null,
  //     last_message_id: 16,
  //     last_message: "Nice meeting you v2!",
  //     last_message_time: "2025-11-06T07:16:53.022Z",
  //     chat_user_id: 1,
  //     chat_username: "Samp",
  //     chat_display_name: "Samp Sire",
  //     chat_profile_image: null,
  //   },
  // ];
  const dispatch = useDispatch();
  //
  const inputRef = useRef<HTMLInputElement | null>(null);
  const focusContainerRef = useRef<HTMLDivElement | null>(null);
  const conversations = useSelector((w) => w.messages.userMessagesList);

  const [sideBarSearchText, setSideBarSearchText] = useState("");

  const loadingUserMessages = useSelector(
    (w) => w.messages.loadingUserMessages
  );
  // const [loadingUserMessages, setLoadingUserMessages] = useState(true);

  // console.log({ getUserRecentSearchesArray });

  //
  useEffect(() => {
    dispatch(getUserMessages());
  }, [dispatch]);

  useEffect(() => {
    if (searchInputFocused) {
      dispatch(getUserRecentSearches());
      // console.log("Hit getUserRecentSearches.");
    }
  }, [dispatch, searchInputFocused]);

  // console.log({ loadingUserMessages });
  //
  if (loadingUserMessages) return <SkeletonMessages />;
  // if (!loadingUserMessages) return <SkeletonChatThread />;
  // useEffect(() => {
  //   if (loadingUserMessages) {
  //     setLoadingUserMessages(false);
  //   }
  // }, [loadingUserMessages]);

  function handleClickConvoNoMessageState(item) {
    // Part of reset. (wrap to function)
    dispatch(
      setSelectedConversation({
        // Null as default.
        conversation_id: null,
        // default
        type: "individual",
        group_name: null,
        last_message_id: null,
        last_message: "",
        last_message_time: "",
        chat_user_id: item?.id,
        chat_username: item?.username,
        chat_display_name: item?.username,
        chat_profile_image: null,
      })
    );

    dispatch(setTextMessageInput(""));
    dispatch(setIndividualMessages([]));
  }
  //

  return (
    <StyledSidebar>
      {/* LEFT FIXED ICON COLUMN */}
      <div className="leftColumn">
        <div
          onClick={() => {
            if (window.confirm("Are you sure you want to open the profile?")) {
              // Logout

              const data = dispatch(logoutUser()).unwrap();
              console.log({ data });
              //
            }
          }}
          className="icon profile"
          title="Profile"
        >
          <img src={johnDoeImage} alt="Profile" />
        </div>

        <div className="icon" />
        <div className="icon" />
        <div className="icon" />
      </div>

      {/* RIGHT CHAT LIST SECTION */}
      <div className="rightColumn">
        <h2 className="title">Chats</h2>

        <SearchUser
          inputRef={inputRef}
          focusContainerRef={focusContainerRef}
          sideBarSearchText={sideBarSearchText}
          handleChange={(e) => {
            setSideBarSearchText(e.target.value);
          }}
          handleBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            //
            if (focusContainerRef.current?.contains(e.relatedTarget as Node)) {
              return;
            }
            // Otherwise, unfocus
            console.log("blur");
            dispatch(setSearchInputFocused(false));
            //
          }}
          handleClear={() => {
            console.log("click");
            dispatch(
              getAllUsersBySearch({
                searchQuery: "",
              })
            );
            setSideBarSearchText("");
          }}
        />

        {/* {true ? ( */}
        {searchInputFocused && sideBarSearchText.length === 0 ? (
          <>
            <div
              className="container"
              style={{ border: "1px solid #eee" }}
              {...(searchInputFocused
                ? {
                    ref: focusContainerRef,
                    tabIndex: -1,
                    onMouseDown: (e) => e.preventDefault(),
                  }
                : {})}
            >
              <div className="focusContainer">
                <div className="recentSearchesContainer">
                  {/*  */}
                  {loadingSearches ? (
                    <>
                      <SkeletonMessages />
                    </>
                  ) : (
                    <>
                      {getUserRecentSearchesArray.length > 0 && (
                        <h4 className="">Recent searches</h4>
                      )}

                      {getUserRecentSearchesArray.length > 0 ? (
                        getUserRecentSearchesArray.map((item, index) => (
                          <FocusContainer
                            key={index}
                            displayName={item.display_name}
                            imageSrc={johnDoeImage}
                            hasRemoveIcon={true}
                            onRemove={() => {
                              // console.log("clicked");

                              const id = item.id;
                              console.log({ id: item.id });
                              if (!id) return;

                              const deleteUserSearch = async () => {
                                try {
                                  const responseData = await dispatch(
                                    deletedRecentSearches({
                                      searchedUserId: id,
                                    })
                                  ).unwrap();
                                  console.log({ responseData });
                                  if (responseData) {
                                    // Refresh.
                                    dispatch(getUserRecentSearches());
                                  }
                                } catch (error) {
                                  console.log(error);
                                }
                              };
                              deleteUserSearch();
                              dispatch(setSearchInputFocused(true));
                              //
                            }}
                            inputRef={inputRef}
                            focusContainerRef={focusContainerRef}
                            addRecentSearch={async () => {
                              //
                              handleClickConvoNoMessageState(item);
                              // ENd of reset top.

                              // Reset
                              // return;
                              if (!item.id) return;
                              //
                              const addData = async () => {
                                try {
                                  const responseData = await dispatch(
                                    addUpdateRecentSearches({
                                      searchedUserId: item.id,
                                    })
                                  ).unwrap();
                                  // console.log({ responseData });
                                  if (responseData) {
                                    // Refresh.
                                    dispatch(getUserRecentSearches());
                                    // dispatch(
                                    //   getIndividualMessages({
                                    //     conversationId: "20",
                                    //   })
                                    // );
                                  }
                                } catch (error) {
                                  console.log(error);
                                }
                              };

                              addData();
                            }}
                          />
                        ))
                      ) : (
                        <></>
                      )}

                      {/* <FocusContainer
                        displayName={"Marianne Kateq"}
                        imageSrc={johnDoeImage}
                        hasRemoveIcon={true}
                        onRemove={() => {
                          // console.log("clicked");
                          dispatch(setSearchInputFocused(true));
                        }}
                        inputRef={inputRef}
                        focusContainerRef={focusContainerRef}
                      />
                      <FocusContainer
                        displayName={"Marianne Kate"}
                        imageSrc={johnDoeImage}
                        hasRemoveIcon={true}
                        onRemove={() => {}}
                      />
                      <FocusContainer
                        displayName={"Marianne Kate"}
                        imageSrc={johnDoeImage}
                        hasRemoveIcon={true}
                        onRemove={() => {}}
                      />
                      <FocusContainer
                        displayName={"Marianne Kate"}
                        imageSrc={johnDoeImage}
                        hasRemoveIcon={true}
                        onRemove={() => {}}
                      /> */}
                    </>
                  )}
                </div>

                {!loadingSearches && (
                  <>
                    <div
                      className="recentSearchesContainer"
                      style={{ marginTop: "1rem" }}
                    >
                      {/*  */}
                      <h4 className="">Your contacts</h4>

                      <FocusContainer
                        displayName={"Jana Sirios"}
                        imageSrc={johnDoeImage}
                      />

                      <FocusContainer
                        displayName={"Sam pussy cat"}
                        imageSrc={johnDoeImage}
                      />
                      <FocusContainer
                        displayName={"Jana Sirios"}
                        imageSrc={johnDoeImage}
                      />

                      <FocusContainer
                        displayName={"Sam pussy cat"}
                        imageSrc={johnDoeImage}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Shows the result of typed Search Messenger */}
            {searchInputFocused && sideBarSearchText.length > 0 && (
              <>
                <SidebarSearchResult
                  sideBarSearchText={sideBarSearchText}
                  focusContainerRef={focusContainerRef}
                  removeSearchText={() => {
                    setSideBarSearchText("");
                  }}
                  conversationId={conversationId}
                />
              </>
            )}
          </>
        )}

        {!searchInputFocused && sideBarSearchText.length === 0 && (
          <>
            <div className="chatList">
              {conversations.map((item, idx) => {
                //

                const selectedConversation =
                  conversationId === item?.conversation_id;

                // console.log({ selectedConversation });
                //
                return (
                  <div
                    className={`chatItem ${
                      selectedConversation ? "activeConversation" : ""
                    }`}
                    key={idx}
                    onClick={() => {
                      dispatch(setSelectedConversation(item));
                      dispatch(setGetMessageData(null));
                      dispatch(setTextMessageIsEditing(false));
                      // Reset the text message in the Chat window message input
                      dispatch(setTextMessageInput(""));
                      // Reset the Right Sidebar state

                      dispatch(setEnteredRightSidebarText(""));
                      dispatch(setIsSearchClicked(false));
                      // console.log();
                      // dispatch(setIndividualMessages([]));
                    }}
                  >
                    <img src={item.chat_profile_image || johnDoeImage} />

                    <div className="text">
                      <span className="name">{item.chat_display_name}</span>
                      <span className="message">{item.last_message}</span>
                    </div>

                    <div className="meta">
                      <span>{formatMessengerTime(item.last_message_time)}</span>
                      <span className="status">🟢</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </StyledSidebar>
  );
}

const StyledSidebar = styled.div`
  display: flex;
  height: 100vh;
  background: #111;

  .focusContainer {
    padding: 4px 1rem;
    padding-right: 0px;
  }
  .recentSearchesContainer h4 {
    font-weight: bold;
    color: #ccc;
    font-size: 18px;
  }

  .recentSearchesItemContainer {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
    width: 100%;
    border: 1px solid #eee;
    cursor: pointer;
    border-radius: 8px;
  }
  .recentSearchesContentDiv {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .recentSearchesItemImageDiv {
    width: 45px;
    height: 45px;
    flex-shrink: 0; /* prevents shrinking */
  }
  .recentSearchesItemImageDiv img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  /* Optional: make scrollbar look cleaner */
  .container::-webkit-scrollbar {
    width: 8px;
  }
  .container::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 6px;
  }

  /*  */

  /* -------- LEFT COLUMN -------- */
  .leftColumn {
    width: 80px;
    background: #1c1c1c;
    padding: 1rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
    border-right: 1px solid #2e2e2e;
  }

  .leftColumn .icon {
    width: 48px;
    height: 48px;
    background: #2f2f2f;
    border-radius: 50%;
  }

  .leftColumn .profile img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
  }

  /* -------- RIGHT COLUMN -------- */
  .rightColumn {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
    background: #181818;
  }

  .title {
    font-size: 26px;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  /* -------- CHAT LIST CONTAINER -------- */
  .chatList {
    margin-top: 1rem;
    border-radius: 12px;
    overflow-y: auto;
  }

  /* Single chat item */
  .chatItem {
    display: flex;
    align-items: center;
    padding: 12px;
    border-radius: 10px;
    background: #242424;
    margin-bottom: 8px;
    transition: 0.2s;
    cursor: pointer;
  }

  .chatItem:hover {
    background: #333;
  }

  .chatItem.activeConversation {
    background: #333 !important;
  }

  .chatItem img {
    width: 55px;
    height: 55px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 12px;
  }

  /* Text content */
  .text {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .text .name {
    font-weight: 600;
    font-size: 16px;
  }

  .text .message {
    font-size: 14px;
    color: #c5c5c5;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Metadata (time + dot) */
  .meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-size: 12px;
    color: #aaa;
    gap: 4px;
  }

  .status {
    font-size: 10px;
  }
`;
