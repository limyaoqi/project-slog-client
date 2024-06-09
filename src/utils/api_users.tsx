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

interface blockUserData {
  userId: string;
  token: string;
  password: string;
  role?: "admin" | "user";
}

interface Params {
  search?: string;
}

export const getUser = async (token: string) => {
  const res = await axios.get(`${API_URL}/myUser`, {
    headers: {
      "x-auth-token": token,
    },
  });
  return res.data;
};

export const getUsers = async (token: string, search: string) => {
  let params: Params = {};
  if (search !== "") {
    params.search = search;
  }

  const queries = new URLSearchParams(params as Record<string, string>);
  const res = await axios.get(`${API_URL}?` + queries.toString(), {
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

export const blockUser = async (data: blockUserData) => {
  const res = await axios.put(
    `${API_URL}/block-user/${data.userId}`,
    JSON.stringify(data),
    {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": data.token,
      },
    }
  );
  return res.data;
};

export const unblockUser = async (data: blockUserData) => {
  const res = await axios.put(
    `${API_URL}/unblock-user/${data.userId}`,
    JSON.stringify(data),
    {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": data.token,
      },
    }
  );
  return res.data;
};

export const promoteToAdmin = async (data: blockUserData) => {
  const res = await axios.put(
    `${API_URL}/promote-to-admin/${data.userId}`,
    JSON.stringify(data),
    {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": data.token,
      },
    }
  );
  return res.data;
};
