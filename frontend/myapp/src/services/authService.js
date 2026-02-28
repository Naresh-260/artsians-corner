import axiosInstance from "./axiosInstance";

export const registerUser = (data) => {
  return axiosInstance.post("/auth/register", data);
};

export const loginUser = (data) => {
  console.log("AuthService - Sending login request:", data);
  return axiosInstance.post("/auth/login", data);
};