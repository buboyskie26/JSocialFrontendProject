import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig"; //
import type { Message } from "../types/messages";

// Define the state type
// interface MessagesInitialStateType {
//   searchInputFocused: boolean;
// }

interface ChatMessage {
  id: number;
  reply_to_message_id: number | null;
  content: string;
  message_type: string;
  created_at: string; // ISO timestamp string
  updated_at: string | null;
  deleted: boolean;
  sender_id: number;
  sender_username: string;
  sender_display_name: string;
  sender_profile_image: string | null;
  reply_message_content: string | null;
  reply_message_sender_id: number | null;
}

interface PaginationInfo {
  hasMore: boolean;
  hasMoreBefore: boolean;
  hasMoreAfter: boolean;
  count: number;
  limit: number;
}

interface MessagesResponse {
  data: ChatMessage[];
  pagination: PaginationInfo;
}

interface SharedState {
  individualMessages: any;

  // Handles the sidebar user messages list.
  userMessagesList: any;

  loadingIndivMessages: boolean;
  loadingUserMessages: boolean;

  isUserReplying: boolean;

  // Holds the return data of adding message.
  messageData: any | null;
  loadingMessage: boolean;

  // Handles the getting of message (Reply to a message/Edit to a message)
  getMessageData: any | null;

  textMessageInput: string;
  textMessageIsEditing: boolean;

  searchUserMessagesArray: Message[];
  loadingSearchUserMessagesArray: boolean;

  scrollToMessageId: number | null;
  showMenu: boolean;
  enteredRightSidebarText: string;
  isSearchClicked: boolean;

  // Handles the lazy loading messages

  messagesDataArray: ChatMessage[];
  messagesLoading: boolean;
  messagesError: string | null;

  hasMoreBefore: boolean;
  hasMoreAfter: boolean;

  loadMode: "conversation" | "search" | null;
  targetMessageId: number | null;

  isClickedMessageUponSearch: boolean;
}

// Define the initial state

// Define the initial state

const initialState: SharedState = {
  // const initialState = {
  // Handles the individual messages conversatiopn
  individualMessages: [],

  // Handles the sidebar user messages list.
  userMessagesList: [],

  loadingIndivMessages: false,
  loadingUserMessages: false,

  isUserReplying: false,

  // Holds the return data of adding message.
  messageData: null,
  loadingMessage: false,

  // Handles the getting of message (Reply to a message/Edit to a message)
  getMessageData: null,

  textMessageInput: "",
  textMessageIsEditing: false,

  searchUserMessagesArray: [],

  scrollToMessageId: null,
  showMenu: false,
  enteredRightSidebarText: "",

  isSearchClicked: false,

  //
  messagesDataArray: [],
  messagesLoading: false,

  messagesError: null,
  hasMoreBefore: false,
  hasMoreAfter: false,
  loadMode: null,
  targetMessageId: null,

  isClickedMessageUponSearch: false,

  //
};

// ============================================
// ASYNC THUNKS
// ============================================

/**
 * Load initial messages (most recent)
 */
export const loadInitialMessages = createAsyncThunk<
  MessagesResponse,
  { conversationId: number; limit?: number },
  { rejectValue: string }
>(
  "messages/loadInitialMessages",
  async ({ conversationId, limit = 10 }, thunkAPI) => {
    try {
      const response = await axios.get(
        `/conversations/${conversationId}/messages`,
        { params: { limit } }
      );
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Error loading messages."
      );
    }
  }
);

/**
 * Load messages before (older messages when scrolling up)
 */
export const loadMessagesBefore = createAsyncThunk<
  MessagesResponse,
  { conversationId: number; beforeMessageId: number; limit?: number },
  { rejectValue: string }
>(
  "messages/loadMessagesBefore",
  async ({ conversationId, beforeMessageId, limit = 20 }, thunkAPI) => {
    try {
      const response = await axios.get(
        `/conversations/${conversationId}/messages`,
        { params: { before: beforeMessageId, limit } }
      );
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Error loading older messages."
      );
    }
  }
);

/**
 * Load messages after (newer messages when scrolling down in search mode)
 */
export const loadMessagesAfter = createAsyncThunk<
  MessagesResponse,
  { conversationId: number; afterMessageId: number; limit?: number },
  { rejectValue: string }
>(
  "messages/loadMessagesAfter",
  async ({ conversationId, afterMessageId, limit = 5 }, thunkAPI) => {
    try {
      const response = await axios.get(
        `/conversations/${conversationId}/messages`,
        { params: { after: afterMessageId, limit } }
      );
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Error loading newer messages."
      );
    }
  }
);

/**
 * Load messages around a target message (for search)
 */
export const loadMessagesAround = createAsyncThunk<
  MessagesResponse & { targetMessage: ChatMessage },
  {
    conversationId: number;
    messageId: number;
    before?: number;
    after?: number;
  },
  { rejectValue: string }
>(
  "messages/loadMessagesAround",
  async ({ conversationId, messageId, before = 10, after = 10 }, thunkAPI) => {
    try {
      const response = await axios.get(
        `/conversations/${conversationId}/messages/${messageId}/around`,
        { params: { before, after } }
      );
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Error loading messages around target."
      );
    }
  }
);

/**
 * Search messages
 */
export const searchMessages = createAsyncThunk<
  { data: ChatMessage[]; count: number; query: string },
  { conversationId: number; query: string; limit?: number },
  { rejectValue: string }
>(
  "messages/searchMessages",
  async ({ conversationId, query, limit = 50 }, thunkAPI) => {
    try {
      const response = await axios.get(
        `/conversations/${conversationId}/search`,
        { params: { q: query, limit } }
      );
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Error searching messages."
      );
    }
  }
);

export const getConversationMessages = createAsyncThunk(
  "messages/getConversationMessages",
  async (data: any, thunkAPI: any) => {
    try {
      const response = await axios.get(
        `/conversations/${data?.conversationId}/messages`,
        { params: data?.params }
      );
      // console.log({ response });
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Error occured."
      );
    }
  }
);

export const getIndividualMessages = createAsyncThunk(
  "messages/getIndividualMessage",
  async (data: any, thunkAPI: any) => {
    try {
      const response = await axios.get(
        `/conversations/getMessagesByConversationId/${data?.conversationId}`
      );
      // console.log({ response });
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Error occured."
      );
    }
  }
);

export const getUserMessages = createAsyncThunk(
  "messages/getUserMessages",
  async (data: { skipLoading: boolean }, thunkAPI: any) => {
    try {
      const response = await axios.get(`/messages/getUserMessages`);
      // console.log({ response });
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Error occured."
      );
    }
  }
);

export const addMessage = createAsyncThunk(
  "messages/addMessage",
  async (data: any, thunkAPI: any) => {
    try {
      const response = await axios.post(`/messages/addConversation`, data);
      // console.log({ response });
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Error occured."
      );
    }
  }
);

export const sendMessageToUser = createAsyncThunk(
  "messages/sendMessageToUser",
  async (data: any, thunkAPI: any) => {
    try {
      const response = await axios.post(`/messages/sendMessageToUser`, data);
      console.log({ response });
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Error occured."
      );
    }
  }
);

export const updateMessage = createAsyncThunk(
  "messages/updateMessage",
  async (data: any, thunkAPI: any) => {
    try {
      const response = await axios.put(`/messages/updateConversation`, data);
      console.log({ response });
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Error occured."
      );
    }
  }
);

export const deleteMessage = createAsyncThunk(
  "messages/deleteMessage",
  async (data: any, thunkAPI: any) => {
    try {
      const response = await axios.delete(
        `/messages/deleteMessage/${data.messageId}`,
        data
      );
      console.log({ response });
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Error occured."
      );
    }
  }
);

// export const getSearchUserMessages = createAsyncThunk(
//   "messages/getSearchUserMessages",
//   async (data, thunkAPI: any) => {
//     try {
//       const response = await axios.get(`/messages/searchUserMessages`, {
//         params: data,
//         conversationId: data?.conversationId
//       });
//       console.log({ response });
//       return response.data;
//     } catch (err: any) {
//       return thunkAPI.rejectWithValue(
//         err.response?.data?.error || "Error occured."
//       );
//     }
//   }
// );

export const getSearchUserMessages = createAsyncThunk(
  "messages/getSearchUserMessages",
  async (data: { conversationId: string; messageText: string }, thunkAPI) => {
    try {
      const response = await axios.get(`/messages/searchUserMessages`, {
        params: {
          messageText: data.messageText,
          conversationId: data.conversationId,
        },
      });
      // console.log({ response });
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Error occured."
      );
      m;
    }
  }
);

//
// Create the slice
const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setIsUserReplying: (state, action) => {
      state.isUserReplying = action.payload;
    },
    setGetMessageData: (state, action) => {
      state.getMessageData = action.payload;
    },
    setTextMessageInput: (state, action) => {
      state.textMessageInput = action.payload;
    },
    setTextMessageIsEditing: (state, action) => {
      state.textMessageIsEditing = action.payload;
    },
    setIndividualMessages: (state, action) => {
      state.individualMessages = action.payload;
    },
    setScrollToMessageId: (state, action) => {
      state.scrollToMessageId = action.payload;
    },
    setShowMenu: (state, action) => {
      state.showMenu = action.payload;
    },
    setEnteredRightSidebarText: (state, action) => {
      state.enteredRightSidebarText = action.payload;
    },
    setIsSearchClicked: (state, action) => {
      state.isSearchClicked = action.payload;
    },
    setMessagesLoading: (state, action) => {
      state.messagesLoading = action.payload;
    },
    setIsClickedMessageUponSearch: (state, action) => {
      state.isClickedMessageUponSearch = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ============================================
    // LOAD INITIAL MESSAGES
    // ============================================
    builder.addCase(loadInitialMessages.pending, (state) => {
      state.messagesLoading = true;
      state.messagesError = null;
    });
    builder.addCase(loadInitialMessages.fulfilled, (state, action) => {
      state.messagesLoading = false;
      state.messagesDataArray = action.payload.data;
      state.hasMoreBefore = action.payload.pagination.hasMore;
      state.hasMoreAfter = false; // No newer messages than most recent
      state.loadMode = "conversation";
      state.targetMessageId = null;
      console.log(
        "📱 Loaded initial messages:",
        action.payload.pagination.count
      );
    });
    builder.addCase(loadInitialMessages.rejected, (state, action) => {
      state.messagesLoading = false;
      state.messagesError = action.payload || "Failed to load messages";
      // console.error("Error loading initial messages:", action.payload);
    });

    //
    // ============================================
    // LOAD MESSAGES BEFORE (Scrolling Up)
    // ============================================
    builder.addCase(loadMessagesBefore.pending, (state) => {
      state.messagesLoading = true;
      state.messagesError = null;
    });
    builder.addCase(loadMessagesBefore.fulfilled, (state, action) => {
      state.messagesLoading = false;
      // Prepend older messages to the beginning
      state.messagesDataArray = [
        ...action.payload.data,
        ...state.messagesDataArray,
      ];
      state.hasMoreBefore = action.payload.pagination.hasMore;
      // console.log("⬆️ Loaded older messages:", action.payload.pagination.count);
    });
    builder.addCase(loadMessagesBefore.rejected, (state, action) => {
      state.messagesLoading = false;
      state.messagesError = action.payload || "Failed to load older messages";
      console.error("Error loading messages before:", action.payload);
    });

    // ============================================
    // LOAD MESSAGES AFTER (Scrolling Down)
    // ============================================
    builder.addCase(loadMessagesAfter.pending, (state) => {
      state.messagesLoading = true;
      state.messagesError = null;
    });
    builder.addCase(loadMessagesAfter.fulfilled, (state, action) => {
      state.messagesLoading = false;
      // Append newer messages to the end
      state.messagesDataArray = [
        ...state.messagesDataArray,
        ...action.payload.data,
      ];
      state.hasMoreAfter = action.payload.pagination.hasMore;
      // console.log("⬇️ Loaded newer messages:", action.payload.pagination.count);
    });
    builder.addCase(loadMessagesAfter.rejected, (state, action) => {
      state.messagesLoading = false;
      state.messagesError = action.payload || "Failed to load newer messages";
      // console.error("Error loading messages after:", action.payload);
    });
    //

    // ============================================
    // LOAD MESSAGES AROUND (Search Result)
    // ============================================
    builder.addCase(loadMessagesAround.pending, (state) => {
      state.messagesLoading = true;
      state.messagesError = null;
    });
    builder.addCase(loadMessagesAround.fulfilled, (state, action) => {
      state.messagesLoading = false;
      //
      state.messagesDataArray = action.payload.data;
      state.hasMoreBefore = action.payload.pagination.hasMoreBefore;
      state.hasMoreAfter = action.payload.pagination.hasMoreAfter;
      // state.loadMode = "search";
      state.targetMessageId = action.payload.targetMessage.id;
      console.log("🎯 Jumped to message:", action.payload.targetMessage.id);
    });
    builder.addCase(loadMessagesAround.rejected, (state, action) => {
      state.messagesLoading = false;
      state.messagesError =
        action.payload || "Failed to load messages around target";
      console.error("Error loading messages around:", action.payload);
    });

    //

    //
    builder.addCase(getIndividualMessages.pending, (state, _) => {
      state.loadingIndivMessages = true;
    });
    builder.addCase(getIndividualMessages.rejected, (state, _) => {
      state.loadingIndivMessages = true;
    });
    builder.addCase(getIndividualMessages.fulfilled, (state, action) => {
      //
      const payload = action.payload;
      state.individualMessages = initialState.individualMessages;
      //
      if (payload?.data) {
        state.loadingIndivMessages = false;
        state.individualMessages = payload.data;
      }
    });
    //
    builder.addCase(getConversationMessages.pending, (state, _) => {
      state.messagesLoading = true;
    });
    builder.addCase(getConversationMessages.rejected, (state, _) => {
      state.messagesLoading = true;
    });
    builder.addCase(getConversationMessages.fulfilled, (state, action) => {
      //
      const payload = action.payload;
      state.messagesDataArray = initialState.messagesDataArray;
      //
      if (payload?.data) {
        state.messagesLoading = false;
        state.messagesDataArray = payload.data;
      }
    });

    //

    builder.addCase(getUserMessages.pending, (state, action) => {
      // Only set loading to true if skipLoading is not passed
      if (!action.meta.arg?.skipLoading) {
        state.loadingUserMessages = true;
      }
    });
    builder.addCase(getUserMessages.fulfilled, (state, action) => {
      const payload = action.payload;
      if (payload?.data) {
        state.loadingUserMessages = false;
        state.userMessagesList = payload.data;
      }
    });
    builder.addCase(getUserMessages.rejected, (state, action) => {
      // Only set loading to true if skipLoading is not passed
      if (!action.meta.arg?.skipLoading) {
        state.loadingUserMessages = true;
      }
    });
    //
    builder.addCase(getSearchUserMessages.pending, (state, action) => {
      state.loadingSearchUserMessagesArray = true;
    });
    builder.addCase(getSearchUserMessages.fulfilled, (state, action) => {
      const payload = action.payload;
      if (payload?.data) {
        state.loadingSearchUserMessagesArray = false;
        state.searchUserMessagesArray = payload.data;
      }
    });
    builder.addCase(getSearchUserMessages.rejected, (state, action) => {
      state.loadingSearchUserMessagesArray = true;
    });
    //
    //
    builder.addCase(addMessage.pending, (state, _) => {
      state.loadingMessage = true;
    });
    builder.addCase(updateMessage.pending, (state, _) => {
      state.loadingMessage = true;
    });
    builder.addCase(deleteMessage.fulfilled, (state, action) => {
      const payload = action.payload;
      if (payload?.data) {
        const messageDataObject = payload.data;

        state.messagesDataArray = state.messagesDataArray.map((w) => {
          if (w?.id === messageDataObject?.id) {
            // Update the content and any other fields that changed
            return {
              ...w,
              deleted: messageDataObject?.deleted,
              updated_at: messageDataObject?.updated_at,
            };
          }
          return w;
        });
      }
    });

    builder.addCase(addMessage.fulfilled, (state, action) => {
      const payload = action.payload;
      if (payload?.data) {
        const messageDataObject = payload.data;
        state.loadingMessage = false;

        // Pushed this object to the messages list.

        // state.individualMessages.push(messageDataObject);
        // state.messageData = messageDataObject;

        state.messagesDataArray.push(messageDataObject);
      }
    });

    //
    builder.addCase(updateMessage.fulfilled, (state, action) => {
      //
      const payload = action.payload;
      //
      if (payload?.data) {
        //
        const messageDataObject = payload.data;
        //
        state.loadingMessage = false;
        state.messageData = messageDataObject;

        // Map through and update the matching message
        state.messagesDataArray = state.messagesDataArray.map((w) => {
          if (w?.id === messageDataObject?.id) {
            // Update the content and any other fields that changed
            return {
              ...w,
              content: messageDataObject?.content,
              updated_at: messageDataObject?.updated_at,
            };
          }
          return w;
        });
      }
    });
    // builder.addCase(updateMessage.fulfilled, (state, action) => {
    //   const payload = action.payload;
    //   if (payload?.data) {
    //     const messageDataObject = payload.data;
    //     state.loadingMessage = false;

    //     const holdMessages = state.messagesDataArray;

    //     console.log({ holdMessages });
    //     state.messagesDataArray.map((w) => {
    //       if (w?.id === messageDataObject?.data.id) {
    //         // Update the content
    //         return { ...w, content: messageDataObject?.content };
    //       }
    //       return w;
    //     });
    //     console.log({ messageDataObject });

    //     // Pushed this object to the messages list.
    //   }
    // });
  },
});

// Export actions and reducer
export const {
  setIsUserReplying,
  setGetMessageData,
  setTextMessageInput,
  setTextMessageIsEditing,
  setIndividualMessages,
  setScrollToMessageId,
  setShowMenu,
  setEnteredRightSidebarText,
  setIsSearchClicked,
  setMessagesLoading,
  setIsClickedMessageUponSearch,
} = messagesSlice.actions;

export default messagesSlice.reducer;
