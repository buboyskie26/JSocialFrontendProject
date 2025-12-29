export type Message = {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  message_type: "text" | "image" | "video" | "file"; // extend as needed
  reply_to_message_id?: number; // optional if not always present
  created_at: string; // ISO 8601 date string
};
