import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://demo-096p.onrender.com",
    headers: { "Content-Type": "Application/json" },
})