type ChatType = {
  id: number;
  username: string;
};

type ChatTypeItem = {
  chat: ChatType;
  onSelect: (chatId: number) => void;
};

export default function ChatItem({ chat, onSelect }: ChatTypeItem) {
  console.log("render chat: " + chat?.id);
  return (
    <div onClick={() => onSelect(chat.id)}>
      <p>{chat.username}</p>
    </div>
  );
}
