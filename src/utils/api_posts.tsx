import axios from "axios";
import { getCookie } from "cookies-next";
import { API_URL } from "./api_url";
import { Post, PostData } from "./interface";

interface DataProps {
  postId: string;
  token: string;
}

export const getPosts = async (token: string) => {
  const res = await axios.get(`${API_URL}/post`, {
    headers: {
      "x-auth-token": `${token}`,
    },
  });
  return res.data;
};

export const getPostById = async (postId: string | null) => {
  const res = await axios.get(`${API_URL}/post/${postId}`);
  return res.data;
};

export const createPost = async (postData: PostData) => {
  const formData = new FormData();
  formData.append("title", postData.title);
  formData.append("description", postData.description);
  formData.append("visibility", postData.visibility);
  formData.append("status", postData.status);
  postData.tags.forEach((tag) => formData.append("tags", tag));
  postData.attachments.forEach((file) => formData.append("attachments", file));

  const res = await axios.post(`${API_URL}/post`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-auth-token": `${postData.token}`,
    },
  });
  return res.data;
};

export const updatePost = async (postData: PostData) => {
  const formData = new FormData();
  formData.append("title", postData.title);
  formData.append("description", postData.description);
  formData.append("visibility", postData.visibility);
  formData.append("status", postData.status);
  postData.tags.forEach((tag) => formData.append("tags", tag));
  postData.attachments.forEach((file) => formData.append("attachments", file));
  const res = await axios.put(`${API_URL}/post/${postData._id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-auth-token": `${postData.token}`,
    },
  });
  return res.data;
};

export const deletePost = async (post: DataProps) => {
  const res = await axios.delete(`${API_URL}/post/${post.postId}`, {
    headers: {
      "x-auth-token": `${post.token}`,
    },
  });
  return res.data;
};
