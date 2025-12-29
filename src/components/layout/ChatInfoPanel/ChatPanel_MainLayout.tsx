import React, { useState } from "react";
import styled from "styled-components";
import janeDoeImage from "../../../assets/jane_doe_sample.png";

interface Props {
  // This is a function no parameters
  handleSearchClick: () => void;
  selectedConversation: any;
}
export default function MainLayout({
  selectedConversation,
  handleSearchClick,
}: Props) {
  //
  console.log({ selectedConversation });
  //
  const [openMedia, setOpenMedia] = useState(false);

  function Action({ handleSearchClick, icon, label }: any) {
    return (
      <div onClick={handleSearchClick} className="action cursor-pointer">
        <span>{icon}</span>
        <small>{label}</small>
      </div>
    );
  }

  function Section({ title, children }) {
    return (
      <div className="section">
        <div className="section-header">
          <span>{title}</span>
          <span>›</span>
        </div>
        {children}
      </div>
    );
  }

  function Option({ icon, label }) {
    return (
      <div className="option">
        {icon && <span className="icon">{icon}</span>}
        <span>{label}</span>
      </div>
    );
  }
  //
  return (
    <StyledDiv>
      <aside className="chat-info">
        {/* USER HEADER */}
        <div className="user-header">
          <img src={janeDoeImage} alt="avatar" className="avatar" />
          <h3>{selectedConversation?.chat_display_name}</h3>
          <p className="username">{selectedConversation?.chat_username}</p>
          <span className="encrypted">🔒 End-to-end encrypted</span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="actions">
          <Action icon="👤" label="Profile" />
          <Action icon="🔕" label="Mute" />
          <Action
            handleSearchClick={handleSearchClick}
            icon="🔍"
            label="Search"
          />
        </div>

        {/* SECTIONS */}
        <Section title="Chat info" />
        <Section title="Customize chat">
          <Option icon="🎨" label="Change theme" />
          <Option icon="💚" label="Change emoji" />
          <Option icon="Aa" label="Edit nicknames" />
        </Section>

        {/* MEDIA & FILES */}
        <div className="accordion">
          <button onClick={() => setOpenMedia(!openMedia)}>
            Media & files
            <span>{openMedia ? "▲" : "▼"}</span>
          </button>

          {openMedia && (
            <div className="accordion-content">
              <Option label="Media" />
              <Option label="Files" />
            </div>
          )}
        </div>
      </aside>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  /* START */
  .chat-info {
    width: 300px;
    background: #1c1c1c;
    color: white;
    padding: 16px;
    height: 100vh;
    overflow-y: auto;
  }

  .user-header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-top: 12px;
    gap: 8px;
  }

  .user-header .avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
  }

  .username {
    font-size: 12px;
    color: #aaa;
  }

  .encrypted {
    display: inline-block;
    background: #2c2c2c;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    margin-top: 8px;
  }

  .actions {
    display: flex;
    justify-content: space-around;
    margin: 20px 0;
  }

  .action {
    text-align: center;
    font-size: 14px;
  }

  .section {
    margin-top: 16px;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    padding: 10px 0;
  }

  .option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 0;
    cursor: pointer;
  }

  .accordion button {
    width: 100%;
    background: none;
    border: none;
    color: white;
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
  }

  .accordion-content {
    padding-left: 10px;
  }

  /* END */
`;
