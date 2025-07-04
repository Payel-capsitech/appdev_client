import axios from "axios";

export const API_URL = "http://localhost:7166/api/auth";

export const registerUser = async (email: string, password: string, role: string) => {
  const response = await axios.post(`${API_URL}/register`, { email, password, role });
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};