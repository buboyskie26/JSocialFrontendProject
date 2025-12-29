import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig";

// Define the state type
// interface SharedState {
//   searchInputFocused: boolean;
// }

// Define the initial state
const initialState: any = {
  selectedConversation: null,
  conversationList: [],

  // Holds the return data of adding conversation.
  returnedConversationData: null,
  // loadingConversationData
  loadingConversationData: false,
};
//
export const getIndividualMessages = createAsyncThunk(
  "conversation/getIndividualMessages",
  async (data, thunkAPI: any) => {
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

//

export const addConversation = createAsyncThunk(
  "conversation/addConversation",
  async (data: any, thunkAPI: any) => {
    try {
      const response = await axios.post(`/conversations/addConversation`, data);
      console.log({ response });
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Error occured."
      );
    }
  }
);

export const checkRecentSearchHasConvo = createAsyncThunk(
  "conversation/checkRecentSearchHasConvo",
  async (data, thunkAPI: any) => {
    try {
      const response = await axios.get(
        `/conversations/checkRecentSearchHasConvo/${data?.otherUserId}`
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

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
    setConversationList: (state, action) => {
      state.conversationList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addConversation.pending, (state, _) => {
      state.loadingConversationData = true;
    });
    builder.addCase(addConversation.fulfilled, (state, action) => {
      state.loadingConversationData = false;
      const payload = action.payload;
      if (payload?.data) {
        state.returnedConversationData = action.payload;
      }
    });
  },
});

// Export actions and reducer
export const { setSelectedConversation, setConversationList } =
  conversationSlice.actions;
export default conversationSlice.reducer;
