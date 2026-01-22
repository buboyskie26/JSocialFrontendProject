import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import sharedReducer from "./slices/sharedSlice";
import messagesReducer from "./slices/messagesSlice";
import conversationReducer from "./slices/conversationSlice";
import recentSearchesReducer from "./slices/recentSearchesSlice";
import socketReducer from "./slices/socketSlice";
import typingSliceReducer from "./slices/typingSlice";
// import chatReducer from "../features/chat/chatSlice";

export const store = configureStore({
  reducer: {
    shared: sharedReducer,
    auth: authReducer,
    messages: messagesReducer,
    conversation: conversationReducer,
    recentSearches: recentSearchesReducer,
    socket: socketReducer,
    typing: typingSliceReducer,

    // chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore socket object in state (not serializable)
        ignoredActions: ["socket/setSocket"],
        ignoredPaths: ["socket.socket"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
