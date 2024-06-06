import axios from "axios";
import { API_URL } from "./api_url";

interface LikeProps {
  _id: string;
  token: string;
  type: "post" | "comment" | "reply";
}

export const likePost = async (like: LikeProps) => {
  const res = await axios.post(`${API_URL}/like/${like.type}/${like._id}`, "", {
    headers: {
      "x-auth-token": `${like.token}`,
    },
  });

  return res.data;
};


