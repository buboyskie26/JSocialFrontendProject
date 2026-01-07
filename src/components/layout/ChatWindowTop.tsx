import React from "react";
import { FaEllipsis } from "react-icons/fa6";
import janeDoeImage from "../../assets/jane_doe_sample.png";
import { setIsRightSideBarOpen } from "../../app/slices/sharedSlice";
import { useDispatch, useSelector } from "react-redux";

interface Props {
  conversationObject: any | null;
}
export default function ChatWindowTop({ conversationObject }: Props) {
  //
  const dispatch = useDispatch();
  const isRightSideBarOpen = useSelector((w) => w.shared.isRightSideBarOpen);


  
  // console.log("ChatWindowTop");
  return (
    <div style={{ height: "10vh" }} className="topContentContainer p-4">
      <div className="topLeft">
        <div className="topImageDiv">
          <img src={janeDoeImage} />
        </div>

        <div className="topContentUser flex flex-col">
          <span>{conversationObject.chat_display_name}</span>
          {/* <span>Justine Adrian</span> */}
          <span className="activeStatus">Active 43m ago</span>
        </div>
      </div>

      <div
        className="topRight cursor-pointer" title="Conversation information"
        onClick={() => {
          dispatch(setIsRightSideBarOpen(!isRightSideBarOpen));
        }}
      >
        <FaEllipsis className="ellipsis" />
      </div>
    </div>
  );
}
