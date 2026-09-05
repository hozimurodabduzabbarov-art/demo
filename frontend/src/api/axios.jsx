import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "",
    headers: { "Content-Type": "Application/json" },
})