import axios from "axios";

const API_URL = import.meta.env.API_URL || "http://localhost:8000/api/v1";

// const API_URL = process.env.API_URL || "http://localhost:8000/api/v1";

export const axiosPublic = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});
