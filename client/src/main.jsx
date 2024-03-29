import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { io } from "socket.io-client";
import { BrowserRouter } from "react-router-dom";

export const BASE_URL = "http://localhost:3000";
const socket = io(BASE_URL);

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <App socket={socket} />
    </Provider>
  </BrowserRouter>
);
