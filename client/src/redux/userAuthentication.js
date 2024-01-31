import { createSlice } from "@reduxjs/toolkit";

export const userAuthSlice = createSlice({
  name: "userAuth",
  initialState: {
    isAuth: false,
    fullName: "",
    userId: "",
  },
  reducers: {
    changeAuthentication: (state, action) => {
      state.isAuth = action.payload.isAuth;
      state.fullName = action.payload.fullName;
      state.userId = action.payload.id;
    },
  },
});

export const { changeAuthentication } = userAuthSlice.actions;
export default userAuthSlice.reducer;
