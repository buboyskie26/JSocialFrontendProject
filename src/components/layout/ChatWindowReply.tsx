import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setGetMessageData,
  setTextMessageInput,
  setTextMessageIsEditing,
} from "../../app/slices/messagesSlice";
import { FaTimesCircle } from "react-icons/fa";
import styled from "styled-components";

interface Props {
  chat_display_name: string;
}
export default function ChatWindowReply({ chat_display_name }: Props) {
  //
  const dispatch = useDispatch();
  const getMessageData = useSelector((w) => w.messages.getMessageData);
  const textMessageIsEditing = useSelector(
    (w) => w.messages.textMessageIsEditing
  );
  console.log({ getMessageData });

  //   useEffect(() => {
  //     console.log({ getMessageData });
  //   }, [getMessageData]);
  //

  return (
    <>
      {getMessageData && (
        <>
          <ReplyingDiv>
            <div className="replyingContainer">
              <div className="topContainer flex items-center justify-between">
                <div className="textContainer">
                  <h2>
                    {textMessageIsEditing
                      ? "Edit message"
                      : `Replying to ${chat_display_name}`}
                  </h2>
                </div>
                <div
                  onClick={() => {
                    dispatch(setGetMessageData(null));
                    dispatch(setTextMessageInput(""));
                    dispatch(setTextMessageIsEditing(false));
                    // console.log("click");
                  }}
                  className="iconCloseContainer"
                >
                  <FaTimesCircle />
                </div>
              </div>

              {/* If editing message */}
              {!textMessageIsEditing && (
                <div className="replyMessageDiv">
                  <p>
                    {getMessageData?.content}
                    {/* Boy pasabi kay papa umaga na me uuwi. Dito ako marikina na mag
                  Boy pasabi kay papa umaga na me uuwi. Dito ako marikina na mag
                  Boy pasabi kay papa umaga na me uuwi. Dito ako marikina na mag */}
                  </p>
                </div>
              )}
            </div>
          </ReplyingDiv>
        </>
      )}
    </>
  );
}

const ReplyingDiv = styled.div`
  height: 10vh;
  max-height: 10vh;
  width: 100%;
  .replyingContainer {
    padding: 6px 15px;
  }
  .textContainer h2 {
    font-weight: bold;
  }
  .topContainer {
    margin-bottom: 6px;
  }

  .replyMessageDiv {
    overflow: hidden;
    width: 70%;
  }
  .replyMessageDiv p {
    height: 26px;
  }
`;
