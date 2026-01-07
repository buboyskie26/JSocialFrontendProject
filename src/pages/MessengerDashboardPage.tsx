import Sidebar from "../components/layout/Sidebar";
import ChatWindow from "../components/layout/ChatWindow";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import RightSidebar from "./RightSidebar";
import { replace, useNavigate, useParams } from "react-router-dom";
import { setSelectedConversation } from "../app/slices/conversationSlice";

export default function MessengerDashboardPage() {
  //
  const navigate = useNavigate();

  const { conversationId } = useParams<{ conversationId: string }>();
  const dispatch = useDispatch();
  //
  // console.log({ conversationId });
  //
  //
  const selectedConversation = useSelector(
    (w) => w.conversation.selectedConversation
  );
  const isRightSideBarOpen = useSelector((w) => w.shared.isRightSideBarOpen);

  const user = useSelector((state) => state.auth.user);
  const message_conversation_id = user?.message_conversation_id;

  useEffect(() => {
    if (
      !conversationId &&
      !selectedConversation &&
      user &&
      user?.message_conversation_id
    ) {
      console.log("Messenger no params");

      // dispatch(
      //   setSelectedConversation({
      //     // conversation_id: user?.message_conversation_id,
      //     conversation_id: "44",
      //     type: user?.message_message_type,
      //     group_name: null,
      //     last_message_id: 131,
      //     last_message: user?.message_content,
      //     last_message_time: user?.message_created_at,
      //     chat_user_id: user?.id,
      //     chat_username: user?.username,
      //     chat_display_name: user?.display_Name,
      //     chat_profile_image: null,
      //   })
      // );
      navigate(`/messenger/${message_conversation_id}`, { replace: true });
    }
  }, [navigate, conversationId, user, dispatch]);

  useEffect(() => {
    if (selectedConversation?.conversation_id) {
      //

      //
      const selectedConversationId = selectedConversation?.conversation_id;
      navigate(`/messenger/${selectedConversationId}`, { replace: true });
    }
  }, [selectedConversation?.conversation_id, navigate]);
  console.log({ user });

  // # To populate the ChatWIndow with proper objects.
  // Even after accessing the /messenger dasboard or with /message/conversationId
  useEffect(() => {
    //
    if (
      conversationId &&
      user &&
      message_conversation_id &&
      !selectedConversation
    ) {
      dispatch(
        setSelectedConversation({
          conversation_id: conversationId,
          type: user?.message_message_type,
          group_name: null,
          last_message_id: 131,
          last_message: user?.message_content,
          last_message_time: user?.message_created_at,

          chat_user_id: user?.other_user_id,
          chat_username: user?.other_user_username,
          chat_display_name: user?.other_user_display_name,

          chat_profile_image: null,
        })
      );
    }
  }, [conversationId, dispatch, user]);

  //
  // console.log({ isRightSideBarOpen });
  console.log({ selectedConversation });
  // console.log({ message_conversation_id });
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
          style={{ width: isRightSideBarOpen ? "28%" : "37%" }}
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
