import { configureStore } from "@reduxjs/toolkit";
import userAuthReducer from "./userAuthentication";
import socketReducer from "./socketSlice";
export default configureStore({
  reducer: {
    socket: socketReducer,
    userAuth: userAuthReducer,
  },
});
