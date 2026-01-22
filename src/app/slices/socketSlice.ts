import { createSlice } from "@reduxjs/toolkit";

//
interface SharedState {
  socket: any;
  isConnected: boolean;
  onlineUsers: any;
  typingUsers: any;
}

const initialState: SharedState = {
  socket: null,
  isConnected: false,
  onlineUsers: [],
  typingUsers: {}, // { conversationId: [userId1, userId2] }
};



const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    addOnlineUser: (state, action) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    removeOnlineUser: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter(
        (userId) => userId !== action.payload
      );
    },
    addTypingUser: (state, action) => {
      const { conversationId, userId } = action.payload;
      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = [];
      }
      if (!state.typingUsers[conversationId].includes(userId)) {
        state.typingUsers[conversationId].push(userId);
      }
    },
    removeTypingUser: (state, action) => {
      const { conversationId, userId } = action.payload;
      if (state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = state.typingUsers[
          conversationId
        ].filter((id) => id !== userId);
      }
    },
    clearTypingUsers: (state, action) => {
      const conversationId = action.payload;
      if (state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = [];
      }
    },
    resetSocket: (state) => {
      state.socket = null;
      state.isConnected = false;
      state.onlineUsers = [];
      state.typingUsers = {};
    },
  },
});



//
//
export const {
  setSocket,
  setConnected,
  addOnlineUser,
  removeOnlineUser,
  addTypingUser,
  removeTypingUser,
  clearTypingUsers,
  resetSocket,
} = socketSlice.actions;

export default socketSlice.reducer;
