import axios from "axios";
import { API_URL } from "./api_url";

export interface ProfileDataProps {
  token: string;
  _id?: string;
  bio: string;
  location: string;
  interests: string[];
  avatar: File | null;
}

export const getProfile = async (token: string) => {
  const res = await axios.get(`${API_URL}/profile`, {
    headers: {
      "x-auth-token": `${token}`,
    },
  });
  return res.data;
};

export const getProfileById = async (
  token: string,
  profileId: string | null
) => {
  const res = await axios.get(`${API_URL}/profile/${profileId}`, {
    headers: {
      "x-auth-token": `${token}`,
    },
  });
  return res.data;
};

export const createProfile = async (profileData: ProfileDataProps) => {
  const formData = new FormData();
  formData.append("bio", profileData.bio);
  formData.append("location", profileData.location);
  profileData.interests.forEach((interest) =>
    formData.append("interests", interest)
  );
  // formData.append("interests", profileData.interests.join(","));
  if (profileData.avatar) {
    formData.append("avatar", profileData.avatar);
  }
  const res = await axios.post(`${API_URL}/profile`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-auth-token": `${profileData.token}`,
    },
  });
  return res.data;
};

export const updateProfile = async (profileData: ProfileDataProps) => {
  const formData = new FormData();
  formData.append("bio", profileData.bio);
  formData.append("location", profileData.location);
  profileData.interests.forEach((interest) =>
    formData.append("interests", interest)
  );
  // formData.append("interests", profileData.interests.join(","));
  if (profileData.avatar) {
    formData.append("avatar", profileData.avatar);
  }
  const res = await axios.put(
    `${API_URL}/profile/${profileData._id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-auth-token": `${profileData.token}`,
      },
    }
  );
  return res.data;
};
