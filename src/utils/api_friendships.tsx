import axios from "axios";
import { API_URL } from "./api_url";
interface DataFriend {
  _id: string;
  token: string;
}

export const getUserFriendShip = async (token: string, userId?: string) => {
  const res = await axios.get(`${API_URL}/friendships/${userId}`, {
    headers: {
      "x-auth-token": `${token}`,
    },
  });

  return res.data;
};
interface Params {
  search?: string;
}

export const getAllFriend = async (search: string, token: string) => {
  let params: Params = {};
  if (search !== "") {
    params.search = search;
  }

  const queries = new URLSearchParams(params as Record<string, string>);
  const res = await axios.get(`${API_URL}/friendships?` + queries.toString(), {
    headers: {
      "x-auth-token": `${token}`,
    },
  });

  return res.data;
};

export const getFriendRequest = async (token: string) => {
  const res = await axios.get(`${API_URL}/friendships/request`, {
    headers: {
      "x-auth-token": `${token}`,
    },
  });

  return res.data;
};

export const sendFriendRequest = async (data: DataFriend) => {
  const res = await axios.post(
    `${API_URL}/friendships/request/${data._id}`,
    "",
    {
      headers: {
        "x-auth-token": `${data.token}`,
      },
    }
  );

  return res.data;
};

export const acceptFriendRequest = async (data: DataFriend) => {
  const res = await axios.post(
    `${API_URL}/friendships/accept/${data._id}`,
    "",
    {
      headers: {
        "x-auth-token": `${data.token}`,
      },
    }
  );

  return res.data;
};

export const rejectFriendRequest = async (data: DataFriend) => {
  const res = await axios.post(
    `${API_URL}/friendships/reject/${data._id}`,
    "",
    {
      headers: {
        "x-auth-token": `${data.token}`,
      },
    }
  );

  return res.data;
};

export const unfriendUser = async (data: DataFriend) => {
  const res = await axios.post(
    `${API_URL}/friendships/unfriend/${data._id}`,
    "",
    {
      headers: {
        "x-auth-token": data.token,
      },
    }
  );
  return res.data;
};
