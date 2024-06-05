import axios from "axios";
import { API_URL } from "./api_url";

export const getNotifications = async (token: string) => {
  const res = await axios.get(`${API_URL}/notifications`, {
    headers: {
      "x-auth-token": `${token}`,
    },
  });

  return res.data;
};

export const readNotifications = async (token: string) => {
  const res = await axios.put(`${API_URL}/notifications`, "", {
    headers: {
      "x-auth-token": `${token}`,
    },
  });

  return res.data;
};
