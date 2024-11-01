import axios_ from "axios";

export const BASE_URL = "http://localhost:3000";
export const CHAT_LIMIT_PER_PAGE = 20;
export const axios = axios_.create({
  baseURL: BASE_URL,
});
