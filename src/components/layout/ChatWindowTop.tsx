import React from "react";
import { FaEllipsis } from "react-icons/fa6";
import janeDoeImage from "../../assets/jane_doe_sample.png";

interface Props {
  conversationObject: any | null;
}
export default function ChatWindowTop({ conversationObject }: Props) {
  //
  console.log("ChatWindowTop");
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

      <div className="topRight">
        <FaEllipsis className="ellipsis" />
      </div>
    </div>
  );
}
