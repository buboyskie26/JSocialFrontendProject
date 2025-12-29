import React, { useEffect } from "react";
import FocusContainer from "../shared/FocusContainer";
import { useDispatch, useSelector } from "react-redux";
import johnDoeImage from "../../assets/john_doe_sample.jpg";
import { getAllUsersBySearch } from "../../app/slices/authSlice";
import styled from "styled-components";
import {
  addUpdateRecentSearches,
  getUserRecentSearches,
} from "../../app/slices/recentSearchesSlice";
import { setSearchInputFocused } from "../../app/slices/sharedSlice";
import {
  getIndividualMessages,
  setIndividualMessages,
  setTextMessageInput,
} from "../../app/slices/messagesSlice";
import { setSelectedConversation } from "../../app/slices/conversationSlice";

interface SidebarSearchResultProps {
  sideBarSearchText: string;
  focusContainerRef: any;
  removeSearchText: any;
  conversationId: number;
}

export default function SidebarSearchResult({
  sideBarSearchText,
  focusContainerRef,
  removeSearchText,
  conversationId,
}: SidebarSearchResultProps) {
  //
  const getAllUserArray = useSelector((w) => w.auth.getAllUserArray);
  const showRecentSearch = useSelector((w) => w.auth.showRecentSearch);
  //

  // console.log({ getAllUserArray });
  const dispatch = useDispatch();

  // Only search after the debounce.
  useEffect(() => {
    console.log("hitt");
    dispatch(
      getAllUsersBySearch({
        searchQuery: sideBarSearchText,
      })
    );
  }, [dispatch, sideBarSearchText]);

  const showRecentSearchResult =
    getAllUserArray &&
    // showRecentSearch &&
    getAllUserArray.length > 0;

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
    <StyledDiv
      {...(true
        ? {
            ref: focusContainerRef,
            tabIndex: -1,
            onMouseDown: (e) => e.preventDefault(),
          }
        : {})}
    >
      <h3>Search messages for {sideBarSearchText}</h3>

      {showRecentSearchResult && <h4 className="h4Text">More people</h4>}

      {showRecentSearchResult ? (
        getAllUserArray.map((item, index) => (
          <div className="container" key={index}>
            {/* Example Result */}
            <FocusContainer
              displayName={item.display_name}
              imageSrc={johnDoeImage}
              addRecentSearch={async () => {
                if (!item.id) return;

                handleClickConvoNoMessageState(item);

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
                      dispatch(setSearchInputFocused(false));
                      //
                      removeSearchText();
                      //
                    }
                  } catch (error) {
                    console.log(error);
                  }
                };
                addData();
              }}
            />
          </div>
        ))
      ) : (
        <>
          <div className="w-full flex items-center justify-center text-center">
            <span className="text-center">No results</span>
          </div>
        </>
      )}
    </StyledDiv>
  );
}
//
//
const StyledDiv = styled.div`
  .h4Text {
    font-weight: bold;
    color: #ccc;
    font-size: 18px;
    margin-top: 2rem;
  }
`;
