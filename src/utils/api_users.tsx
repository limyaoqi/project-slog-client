import axios from "axios";
import { API_URL } from "./api_url";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export const getUsers = async (token:string) => {
  const res = await axios.get(`${API_URL}`, {
    headers: {
      "x-auth-token": token,
    },
  });
  return res.data;
};

export const login = async (data: LoginData) => {
  // console.log(user)
  // return
  const res = await axios.post(`${API_URL}/login`, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

export const register = async (user: RegisterData) => {
  const res = await axios.post(`${API_URL}/register`, user, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

export const logout = async ({ token }: any) => {
  await axios.post(`${API_URL}/logout`, "", {
    headers: {
      "x-auth-token": token,
    },
  });
  return { msg: "Logged out successfully" };
};
