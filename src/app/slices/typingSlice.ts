import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
// import { AuthService } from "./AuthService";
interface UserTyping {
  userId: string;
  display_name: string;
  username: string;
  email: string;
}

interface TypingState {
  typingUsers: {
    [conversationId: string]: UserTyping[];
    // [conversationId: string]: Array<{
    //   userId: string;
    //   display_name: string;
    //   username: string;
    //   email: string;
    // }>;
  };
}

const initialState: TypingState = {
  typingUsers: {},
};

const typingSlice = createSlice({
  name: "typing",
  initialState,
  reducers: {
    //   removeTypingUsers: (state, action: PayloadAction<{conversationId: string}>){
    // delete state.typingUsers[action.payload.conversationId]
    //   },
    removeTypingUsers(
      state,
      action: PayloadAction<{ conversationId: string }>,
    ) {
      delete state.typingUsers[action.payload.conversationId];
    },
    userStartedTyping: (
      state,
      action: PayloadAction<{
        conversationId: string;
        userId: string;
        display_name: string;
        username: string;
        email: string;
      }>,
    ) => {
      const { conversationId, userId, display_name, username, email } =
        action.payload;

      const userObject: UserTyping = { userId, display_name, username, email };

      // Initialize as Array.
      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = [];
      }

      if (
        !state.typingUsers[conversationId].some(
          (user) => user.userId === userId,
        )
      ) {
        state.typingUsers[conversationId].push(userObject);
      }
    },
    userStoppedTyping: (
      state,
      action: PayloadAction<{ conversationId: string; userId: string }>,
    ) => {
      const { conversationId, userId } = action.payload;
      if (state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = state.typingUsers[
          conversationId
        ].filter((user) => user.userId !== userId);

        // Clean up empty arrays
        if (state.typingUsers[conversationId].length === 0) {
          delete state.typingUsers[conversationId];
        }
      }
    },
  },

  extraReducers: (builder) => {},
});

export const { userStartedTyping, userStoppedTyping, removeTypingUsers } =
  typingSlice.actions;
export default typingSlice.reducer;
//
// Selectors
export const selectTypingUsersInConversation = (conversationId) => (state) => {
  return state.typing.typingUsers[conversationId] || [];
};
