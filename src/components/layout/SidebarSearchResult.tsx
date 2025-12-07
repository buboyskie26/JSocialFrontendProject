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

interface SidebarSearchResultProps {
  sideBarSearchText: string;
  focusContainerRef: any;
  searchInputFocused: any;
}

export default function SidebarSearchResult({
  sideBarSearchText,
  focusContainerRef,
  searchInputFocused,
}: SidebarSearchResultProps) {
  //
  const getAllUserArray = useSelector((w) => w.auth.getAllUserArray);

  console.log({ getAllUserArray });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getAllUsersBySearch({
        searchQuery: sideBarSearchText,
      })
    );
  }, [dispatch, sideBarSearchText]);

  //
  return (
    <StyledDiv
      {...(searchInputFocused
        ? {
            ref: focusContainerRef,
            tabIndex: -1,
            onMouseDown: (e) => e.preventDefault(),
          }
        : {})}
    >
      <h3>Search messages for {sideBarSearchText}</h3>

      {getAllUserArray?.length > 0 && <h4 className="h4Text">More people</h4>}

      {getAllUserArray &&
        getAllUserArray.length > 0 &&
        getAllUserArray.map((item, index) => (
          <div className="container" key={index}>
            {/* Example Result */}
            <FocusContainer
              displayName={item.display_name}
              imageSrc={johnDoeImage}
              addRecentSearch={async () => {
                console.log("Add: " + item.id);
                if (!item.id) return;

                const addData = async () => {
                  try {
                    const responseData = await dispatch(
                      addUpdateRecentSearches({
                        searchedUserId: item.id,
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

                addData();
              }}
            />
          </div>
        ))}
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
