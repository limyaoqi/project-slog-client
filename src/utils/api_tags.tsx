import axios from "axios";
import { API_URL } from "./api_url";

export const getTags = async () => {
  const res = await axios.get(`${API_URL}/tags`);

  return res.data;
};
