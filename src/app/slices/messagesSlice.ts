import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig"; //
import type { Message } from "../types/messages";

// Define the state type
// interface MessagesInitialStateType {
//   searchInputFocused: boolean;
// }

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
};

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
  },
  extraReducers: (builder) => {
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
    builder.addCase(addMessage.fulfilled, (state, action) => {
      const payload = action.payload;
      if (payload?.data) {
        const messageDataObject = payload.data;
        state.loadingMessage = false;

        // Pushed this object to the messages list.

        // state.individualMessages.push(messageDataObject);
        // state.messageData = messageDataObject;
      }
    });
    //
    builder.addCase(updateMessage.fulfilled, (state, action) => {
      const payload = action.payload;
      if (payload?.data) {
        const messageDataObject = payload.data;
        state.loadingMessage = false;
        // Pushed this object to the messages list.
        // state.individualMessages.push(messageDataObject);
        state.messageData = messageDataObject;
      }
    });
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
} = messagesSlice.actions;

export default messagesSlice.reducer;
