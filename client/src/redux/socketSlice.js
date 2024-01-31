import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  socket: null,
  connected: false,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    initializeSocket: (state, action) => {
      const newSocket = action.payload;

      if (newSocket) {
        state.socket = newSocket;
        state.connected = newSocket.connected; // Set the initial connection status
      } else {
        state.socket = null;
        state.connected = false;
      }
    },
    setConnectedStatus: (state, action) => {
      state.connected = action.payload;
    },
  },
});

export const { initializeSocket, setConnectedStatus } = socketSlice.actions;
export default socketSlice.reducer;
