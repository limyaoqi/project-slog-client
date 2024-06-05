import axios from "axios";
import { API_URL } from "./api_url";

interface LikeProps {
  _id: string;
  token: string;
}

export const likePost = async (like: LikeProps) => {
  const res = await axios.post(`${API_URL}/like/post/${like._id}`, "", {
    headers: {
      "x-auth-token": `${like.token}`,
    },
  });

  return res.data;
};

export const likeComment = async (like: LikeProps) => {
  const res = await axios.post(`${API_URL}/like/comment/${like._id}`, "", {
    headers: {
      "x-auth-token": `${like.token}`,
    },
  });

  return res.data;
};

export const likeReply = async (like: LikeProps) => {
  const res = await axios.post(`${API_URL}/like/reply/${like._id}`, "", {
    headers: {
      "x-auth-token": `${like.token}`,
    },
  });

  return res.data;
};
