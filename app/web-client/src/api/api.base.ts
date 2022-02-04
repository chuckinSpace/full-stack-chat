import axios, { AxiosInstance } from "axios";
import { API_BASE_PATH } from "./api.constants";

/** Main Http request configuration for axios */
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_PATH,
});
