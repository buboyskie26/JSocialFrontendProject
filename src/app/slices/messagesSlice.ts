import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig"; //

// Define the state type
// interface MessagesInitialStateType {
//   searchInputFocused: boolean;
// }

// Define the initial state
const initialState = {
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
};

//
export const getIndividualMessages = createAsyncThunk(
  "messages/getIndividualMessage",
  async (data: any, thunkAPI: any) => {
    try {
      const response = await axios.get(
        `/conversations/getMessagesByConversationId/${data?.conversationId}`
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

export const getUserMessages = createAsyncThunk(
  "messages/getUserMessages",
  async (data, thunkAPI: any) => {
    try {
      const response = await axios.get(`/messages/getUserMessages`);
      console.log({ response });
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
  },
  extraReducers: (builder) => {
    builder.addCase(getIndividualMessages.pending, (state, _) => {
      state.loadingIndivMessages = true;
    });
    builder.addCase(getIndividualMessages.rejected, (state, _) => {
      state.loadingIndivMessages = true;
    });
    builder.addCase(getIndividualMessages.fulfilled, (state, action) => {
      const payload = action.payload;
      if (payload?.data) {
        state.loadingIndivMessages = false;
        state.individualMessages = payload.data;
      }
    });
    builder.addCase(getUserMessages.pending, (state, action) => {
      state.loadingUserMessages = true;
    });
    builder.addCase(getUserMessages.fulfilled, (state, action) => {
      const payload = action.payload;
      if (payload?.data) {
        state.loadingUserMessages = false;
        state.userMessagesList = payload.data;
      }
    });
    builder.addCase(getUserMessages.rejected, (state, action) => {
      state.loadingUserMessages = true;
    });
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
} = messagesSlice.actions;

export default messagesSlice.reducer;
