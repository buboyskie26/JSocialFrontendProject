import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig"; //

// Define the state type
// interface MessagesInitialStateType {
//   searchInputFocused: boolean;
// }

// Define the initial state
const initialState = {
  //
  loadingSearches: false,
  // Holds the getUserRecentSearches Data
  getUserRecentSearchesArray: [],
};

export const getUserRecentSearches = createAsyncThunk(
  "recentSearches/getUserRecentSearches",
  async (_, thunkAPI: any) => {
    try {
      const response = await axios.get(`/recentSearches/getUserRecentSearches`);
      //   console.log({ response });
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Error occured."
      );
    }
  }
);

export const addUpdateRecentSearches = createAsyncThunk(
  "recentSearches/addUpdateRecentSearches",
  async (data, thunkAPI: any) => {
    try {
      const response = await axios.post(
        `/recentSearches/addUpdateRecentSearches`,
        data
      );
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Error occured."
      );
    }
  }
);

export const deletedRecentSearches = createAsyncThunk(
  "recentSearches/deletedRecentSearches",
  async (data, thunkAPI: any) => {
    //
    console.log({ data });
    //
    try {
      const response = await axios.delete(
        `/recentSearches/deletedRecentSearches`,
        {
          data,
        }
      );
      return response.data;
    } catch (err: any) {
      console.log({ err });
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Error occured."
      );
    }
  }
);

//
// Create the slice
const recentSearchesSlice = createSlice({
  name: "recentSearches",
  initialState,
  reducers: {
    // setTextMessageIsEditing: (state, action) => {
    //   state.textMessageIsEditing = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserRecentSearches.pending, (state, _) => {
      state.loadingSearches = true;
    });
    builder.addCase(getUserRecentSearches.rejected, (state, _) => {
      state.loadingSearches = true;
    });
    builder.addCase(getUserRecentSearches.fulfilled, (state, action) => {
      const payload = action.payload;
      if (payload?.data) {
        state.loadingSearches = false;
        state.getUserRecentSearchesArray = payload.data;
      }
    });
  },
});

// Export actions and reducer
export const {} = recentSearchesSlice.actions;

export default recentSearchesSlice.reducer;
