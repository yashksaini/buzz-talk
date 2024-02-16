import { createSlice } from "@reduxjs/toolkit";

export const userAuthSlice = createSlice({
  name: "userAuth",
  initialState: {
    isAuth: false,
    fullName: "",
    userId: "",
    username: "",
    imgUrl: "",
  },
  reducers: {
    changeAuthentication: (state, action) => {
      state.isAuth = action.payload.isAuth;
      state.fullName = action.payload.fullName;
      state.userId = action.payload.id;
      state.username = action.payload.username;
      state.imgUrl = action.payload.imgUrl;
    },
  },
});

export const { changeAuthentication } = userAuthSlice.actions;
export default userAuthSlice.reducer;
