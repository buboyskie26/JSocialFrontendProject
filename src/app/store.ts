import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import sharedReducer from "./slices/sharedSlice";
import messagesReducer from "./slices/messagesSlice";
import conversationReducer from "./slices/conversationSlice";
import recentSearchesReducer from "./slices/recentSearchesSlice";
// import chatReducer from "../features/chat/chatSlice";

export const store = configureStore({
  reducer: {
    shared: sharedReducer,
    auth: authReducer,
    messages: messagesReducer,
    conversation: conversationReducer,
    recentSearches: recentSearchesReducer,
    // chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
