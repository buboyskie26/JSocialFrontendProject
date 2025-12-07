import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig"; // 

// Define the state type
interface SharedState {
  searchInputFocused: boolean;
}

// Define the initial state
const initialState: SharedState = {
  searchInputFocused: false,
};

// Todo. Create a Global Loading.


// Create the slice
const sharedSlice = createSlice({
  name: "shared",
  initialState,
  reducers: {
    // Explicitly type the action payload for clarity
    setSearchInputFocused: (state, action: PayloadAction<boolean>) => {
      state.searchInputFocused = action.payload;
    },
  },
});

// Export actions and reducer
export const { setSearchInputFocused } = sharedSlice.actions;
export default sharedSlice.reducer;
