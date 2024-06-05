import axios from "axios";
import { API_URL } from "./api_url";

export const getChatroom = async (token: string, userId?: string) => {
  const res = await axios.get(`${API_URL}/chat/${userId}`, {
    headers: {
      "x-auth-token": `${token}`,
    },
  });

  return res.data;
};
