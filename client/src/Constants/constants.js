import axios_ from "axios";
// const URL = "https://buzz-talk-oz3b.onrender.com";
const URL = "http://localhost:3000";
export const BASE_URL = URL;
export const CHAT_LIMIT_PER_PAGE = 20;
export const axios = axios_.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
