// import React from "react";
// import { useDispatch } from "react-redux";
// import { logoutUser } from "../app/slices/authSlice";
// import { useNavigate } from "react-router-dom";

// export default function MessengerDashboardPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   return (
//     <div className="w-full min-h-screen">
//       <div className="w-full text-center">
//         <span className="">MessengerDashboardPage</span>
//       </div>

//       <button
//         onClick={async () => {
//           const data = await dispatch(logoutUser()).unwrap();
//           if (data) {
//             navigate("/login");
//           }
//           console.log({ data });
//         }}
//       >
//         Logout
//       </button>
//     </div>
//   );
// }
import Sidebar from "../components/layout/Sidebar";
import ChatWindow from "../components/layout/ChatWindow";
import { useSelector } from "react-redux";
import SkeletonMessagesv2 from "../components/layout/SkeletonMessagesv2";

export default function MessengerDashboardPage() {
  //
  const selectedConversation = useSelector(
    (w) => w.conversation.selectedConversation
  );

  //
  // if (loadingUserMessages) return <div>loadingUserMessages...</div>;

  return (
    <div className="flex h-screen  text-white">
      {/* Sidebar for conversations */}
      <div className="w-1/4 border-r border-gray-700" style={{ width: "30%" }}>
        <Sidebar />
      </div>

      {/* Main chat window */}
      <div className="flex-1 flex flex-col" style={{ width: "70%" }}>
        <ChatWindow
          conversationId={selectedConversation?.conversation_id}
          conversationObject={selectedConversation}
        />
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
