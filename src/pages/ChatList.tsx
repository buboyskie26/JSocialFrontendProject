import React, { useState } from "react";
import ChatItem from "./ChatItem";

type ChatType = {
  id: number;
  username: string;
};

export default function ChatList() {
  //

  const chats: ChatType[] = [
    { id: 1, username: "First Chat" },
    { id: 2, username: "Second Chat" },
  ];

  const handleSelect = (chatId: number) => {
    console.log("Selected chat:", chatId);
  };

  const [text, setText] = useState<string>("");

  //
  //

  return (
    <div className="">
      <div style={{ border: "1px solid #ccc" }}>
        {chats.map((chat) => (
          <ChatItem key={chat.id} chat={chat} onSelect={handleSelect} />
        ))}
      </div>

      <div className="flex flex-col mt-12">
        <div className="w-full mb-4" style={{ border: "1px solid #ccc" }}>
          <input
            className="w-full py-4"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <button className="p-4 bg-amber-700">Submit</button>
      </div>
    </div>
  );
}
