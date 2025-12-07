import React, { useEffect, useRef, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { FaLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { setSearchInputFocused } from "../../app/slices/sharedSlice";

export default function SearchUser({
  inputRef,
  focusContainerRef,
  query,
  handleChange,
  handleBlur,
  handleClear,
}: any) {
  //
  const dispatch = useDispatch();
  const searchInputFocused = useSelector((w) => w.shared.searchInputFocused);

  //
  useEffect(() => {
    console.log({ searchInputFocused });
  }, [searchInputFocused]);
  // const [isInputFocused, setIsInputFocused] = useState(false);
  // const [query, setQuery] = useState("");

  // const handleClear1 = () => {
  //   setQuery("");
  // };
  //
  // const inputRef = useRef<HTMLInputElement | null>(null);
  // const focusContainerRef = useRef<HTMLDivElement | null>(null);

  // const handleBlur1 = (e: React.FocusEvent<HTMLInputElement>) => {
  //   // If the next focused element is inside the focus container, keep focus active
  //   if (focusContainerRef.current?.contains(e.relatedTarget as Node)) {
  //     return;
  //   }

  //   // Otherwise, unfocus
  //   console.log("blur");
  //   dispatch(setSearchInputFocused(false));
  // };
  //
  return (
    <SearchBarContainer isInputFocused={searchInputFocused === true}>
      {searchInputFocused && (
        <div className="leftArrowContainer">
          <FaLeftLong style={{ fontSize: "25px" }} />
        </div>
      )}
      <div className="searchBarContainer">
        <FaSearch className="searchIcon" />
        <input
          ref={inputRef}
          value={query}
          // onChange={(e) => setQuery(e.target.value)}
          onChange={handleChange}
          onFocus={() => {
            console.log("focus");
            dispatch(setSearchInputFocused(true));
          }}
          onBlur={handleBlur}
          type="text"
          placeholder="Search Messenger"
        />
        {query && (
          <div
            className="closeSearchContainer"
            onClick={handleClear}
            ref={focusContainerRef}
            tabIndex={-1} // ✅ makes this div focusable
            onMouseDown={(e) => e.preventDefault()} // ✅ prevent losing input focus when clicking
          >
            <FaTimes onClick={handleClear} />
          </div>
        )}
      </div>
    </SearchBarContainer>
  );
}

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  padding-left: 10px;
  .leftArrowContainer {
    width: 15%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    background: #4b4b4b;
    width: 45px;
  }

  .searchBarContainer {
    width: ${({ isInputFocused }) => (isInputFocused ? "90%" : "100%")};
    border: none;
    outline: none;
    display: flex;
    align-items: center;
    background-color: #3a3b3c;
    border-radius: 999px; /* fully rounded */
    padding: 8px 12px;
    /*max-width: 300px;*/
    gap: 8px;
  }

  .searchIcon {
    color: #b0b3b8;
    font-size: 16px;
  }

  input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #e4e6eb;
    font-size: 14px;
    font-family: "Segoe UI", sans-serif;

    &::placeholder {
      color: #b0b3b8;
      font-size: 18px;
    }
  }

  .closeSearchContainer {
    background-color: #4e4f50;
    border: none;
    outline: none;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    svg {
      color: #b0b3b8;
      font-size: 12px;
    }

    &:hover {
      background-color: #5a5b5c;
    }
  }
`;
