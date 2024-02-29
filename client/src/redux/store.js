import { configureStore } from "@reduxjs/toolkit";
import userAuthReducer from "./userAuthentication";
import topUsersReducer from "./topUsers";
export default configureStore({
  reducer: {
    userAuth: userAuthReducer,
    topUsers: topUsersReducer,
  },
});
