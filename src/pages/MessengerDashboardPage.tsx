import Sidebar from "../components/layout/Sidebar";
import ChatWindow from "../components/layout/ChatWindow";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import RightSidebar from "./RightSidebar";

export default function MessengerDashboardPage() {
  //
  const selectedConversation = useSelector(
    (w) => w.conversation.selectedConversation
  );
  const isRightSideBarOpen = useSelector((w) => w.shared.isRightSideBarOpen);

  console.log({ isRightSideBarOpen });
  useEffect(() => {
    // console.log({ selectedConversation });
  }, [selectedConversation]);
  //

  // if (loadingUserMessages) return <div>loadingUserMessages...</div>;
  // const isRightSidebarOpen = true;

  return (
    <div className="w-full">
      <div className="flex h-screen  text-white">
        {/* Sidebar for conversations */}
        <div
          className="w-1/4 border-r border-gray-700"
          // style={{ width: "30%" }}
          style={{ width: isRightSideBarOpen ? "30%" : "40%" }}
        >
          <Sidebar conversationId={selectedConversation?.conversation_id} />
        </div>

        {/* Main chat window */}
        <div
          className="flex-1 flex flex-col"
          // style={{ width: "70%" }}
          // style={{ width: "40%" }}
          style={{ width: isRightSideBarOpen ? "40%" : "60%" }}
        >
          <ChatWindow conversationObject={selectedConversation} />
        </div>

        {/*  */}
        {isRightSideBarOpen && (
          <RightSidebar
            isRightSidebarOpen={isRightSideBarOpen}
            selectedConversation={selectedConversation}
          />
        )}
      </div>
    </div>
  );
  // return <div></div>;
}

//  <div className="flex h-screen  text-white">
//       {/* Sidebar for conversations */}
//       <div className="w-1/4 border-r border-gray-700" style={{ width: "30%" }}>
//         <Sidebar />
//       </div>

//       {/* Main chat window */}
//       <div className="flex-1 flex flex-col" style={{ width: "70%" }}>
//         <ChatWindow
//           conversationId={selectedConversation?.conversation_id}
//           conversationObject={selectedConversation}
//         />
//       </div>
//     </div>
