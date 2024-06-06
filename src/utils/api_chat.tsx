import axios from "axios";
import { API_URL } from "./api_url";

interface MessagePayload {
  token: string;
  userId: string;
  content: string;
}

export const getChatroom = async (token: string, userId?: string) => {
  const res = await axios.get(`${API_URL}/chat/${userId}`, {
    headers: {
      "x-auth-token": `${token}`,
    },
  });

  return res.data;
};

export const sendMessage = async ({
  token,
  userId,
  content,
}: MessagePayload) => {
  const res = await axios.post(
    `${API_URL}/chat/${userId}`,
    { content },
    {
      headers: {
        "x-auth-token": `${token}`,
      },
    }
  );

  return res.data;
};
