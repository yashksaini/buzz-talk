import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../Constants/constants";

// Create an async thunk for fetching recent users
export const fetchRecentUsers = createAsyncThunk(
  "topUsers/fetchRecentUsers",
  async (userId) => {
    const response = await axios.get(`${BASE_URL}/users/recent-users`, {
      params: {
        userId: userId,
      },
    });
    return response.data;
  }
);

export const topUsersSlice = createSlice({
  name: "topUsers",
  initialState: {
    topUsersList: [],
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecentUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRecentUsers.fulfilled, (state, action) => {
        state.status = "completed";
        state.topUsersList = action.payload;
      })
      .addCase(fetchRecentUsers.rejected, (state) => {
        state.status = "error";
      });
  },
});

export default topUsersSlice.reducer;
