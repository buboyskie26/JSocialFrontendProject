import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { AuthService } from "./AuthService";
import axios from "../../utils/axiosConfig";

interface AuthState {
  user: { id: number; username: string; email: string } | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  getAllUserLoading: boolean;
  getAllUserArray: any | null;

  showRecentSearch: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  //
  getAllUserLoading: false,
  getAllUserArray: null,

  // Handles the timing of reflecting the your contacts
  showRecentSearch: false,
};

// ✅ Checks current session via cookie
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/auth/userProfile");
      console.log({ response });
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Unauthorized"
      );
    }
  }
);
//
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      // return await AuthService.login(credentials);
      // console.log({ credentials });
      const response = await axios.post("/auth/loginUser", credentials);
      if (response?.data?.token)
        localStorage.setItem("token", response.data.token);

      console.log({ response });
      return response.data; // { token, user }
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "auth/getAllUsers",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/auth/getAllUsers");
      console.log({ response });
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Unauthorized"
      );
    }
  }
);
//
export const getAllUsersBySearch = createAsyncThunk(
  "auth/getAllUsersBySearch",
  async (data, thunkAPI) => {
    try {
      const response = await axios.get("/auth/getAllUsersBySearch", {
        params: data,
      });
      // console.log({ response });
      return response.data;
    } catch (err: any) {
      console.log(err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Unauthorized"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/loginUser",
  async (_, thunkAPI) => {
    try {
      // return await AuthService.login(credentials);
      const response = await axios.post("/auth/logoutUser");
      localStorage.removeItem("token");
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    setShowRecentSearch: (state, action) => {
      state.showRecentSearch = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
      })
      //
      .addCase(getAllUsersBySearch.pending, (state) => {
        state.getAllUserLoading = true;
      })
      .addCase(getAllUsersBySearch.fulfilled, (state, action) => {
        state.getAllUserLoading = false;
        state.getAllUserArray = action.payload?.data;
      })
      .addCase(getAllUsersBySearch.rejected, (state) => {
        state.getAllUserLoading = false;
      })
      //
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
    // .addCase(logoutUser.fulfilled, (state, _) => {
    //   state.user = null;
    //   state.error = "";
    //   state.loading = false;
    // });
  },
  //   extraReducers: (builder) => {},
});

export const { logout, setShowRecentSearch } = authSlice.actions;
export default authSlice.reducer;
