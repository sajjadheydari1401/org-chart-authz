import "server-only";
import axios from "axios";

export const API = axios.create({
  baseURL: process.env.API_URL?.replace(/\/$/, ""),
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    withCredentials: true,
  },
  // The API helper reads the backend error envelope, including non-2xx responses.
  validateStatus: () => true,
});
