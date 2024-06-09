import axios from "axios";
import { API_URL } from "./api_url";

interface DataProps {
  content?: string;
  token: string;
  post_id?: string;
  comment_id?: string;
  reply_id?: string;
}
// Add a comment to a post
export const addComment = async (data: DataProps) => {
  // console.log(data)
  const response = await axios.post(
    `${API_URL}/comment/${data.post_id}`,
    data,
    {
      headers: {
        "x-auth-token": data.token,
      },
    }
  );
  return response.data;
};

// Delete a comment
export const deleteComment = async (data: DataProps) => {
  const response = await axios.delete(`${API_URL}/comment/${data.comment_id}`, {
    headers: {
      "x-auth-token": data.token,
    },
  });
  return response.data;
};

// Add a reply to a comment
export const addReply = async (data: DataProps) => {
  const response = await axios.post(
    `${API_URL}/comment/${data.post_id}/${data.comment_id}`,
    data,
    {
      headers: {
        "x-auth-token": data.token,
      },
    }
  );
  return response.data;
};

export const deleteReply = async (data: DataProps) => {
  const response = await axios.delete(
    `${API_URL}/comment/${data.post_id}/${data.comment_id}/${data.reply_id}`,
    {
      headers: {
        "x-auth-token": data.token,
      },
    }
  );
  return response.data;
};

// // Update a comment
// export const updateComment = async (commentId, content, token) => {
//   const response = await axios.put(
//     `${API_URL}/comment/${commentId}`,
//     { content },
//     {
//       headers: {
//         "x-auth-token": token,
//       },
//     }
//   );
//   return response.data;
// };
