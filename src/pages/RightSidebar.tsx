import React, { useState } from "react";
import styled from "styled-components";
import ChatPanel_MainLayout from "../components/layout/ChatInfoPanel/ChatPanel_MainLayout";
import ChatPanel_SearchLayout from "../components/layout/ChatInfoPanel/ChatPanel_SearchLayout";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearchClicked } from "../app/slices/messagesSlice";

export default function RightSidebar({
  isRightSidebarOpen,
  // Holds the clicked conversation (Left Users Convo)
  selectedConversation,
}: any) {
  // console.log({ conversationId });
  //
  const dispatch = useDispatch();
  //
  const isSearchClicked = useSelector((w) => w.messages.isSearchClicked);

  // const [isSearchClicked, setIsSearchClicked] = useState(false);
  //
  //
  return (
    <RightSidebarStyledDiv
      // style={{ width: "25%" }}
      $isRightSidebarOpen={isRightSidebarOpen}
    >
      {selectedConversation && !isSearchClicked && (
        <>
          <ChatPanel_MainLayout
            selectedConversation={selectedConversation}
            handleSearchClick={() => {
              dispatch(setIsSearchClicked(true));
            }}
          />
        </>
      )}

      {selectedConversation && isSearchClicked && (
        <>
          <ChatPanel_SearchLayout
            isRightSidebarOpen={isRightSidebarOpen}
            conversationId={selectedConversation?.conversation_id}
            handleSearchClick={() => {
              dispatch(setIsSearchClicked(false));
            }}
          />
        </>
      )}
    </RightSidebarStyledDiv>
  );
}

const RightSidebarStyledDiv = styled.div``;
