"use client";

// pages/login.js
import { useEffect, useState } from "react";
import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { getTags } from "@/utils/api_tags";
import { Tags, User } from "@/utils/interface";
import { ProfileDataProps, createProfile } from "@/utils/api_profile";

interface CookieData {
  token: string;
  user: User;
  msg: string;
}

export default function LoginPage() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: tagsData = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags(),
  });

  const currentUserString = getCookie("currentUser");
  let currentUser = "";
  if (currentUserString) {
    currentUser = JSON.parse(currentUserString);
  } else {
    router.push("/login");
  }
  const { token }: any = currentUser;

  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [newTag, setNewTag] = useState<string>("");
  const [newTagsArr, setNewTagsArr] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [cookieData, setCookieData] = useState<CookieData | null>(null);

  useEffect(() => {
    const currentUserString = getCookie("currentUser");
    if (!currentUserString) {
      router.push("/login");
    } else {
      const currentUser = JSON.parse(currentUserString);
      setCookieData(currentUser);
    }
  }, []);

  const handleAddTag = () => {
    if (newTag.trim() !== "") {
      setNewTagsArr([...newTagsArr, newTag]);
      setNewTag("");
    }
  };

  const handleTagClick = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags((prevTags) => [...prevTags, tag]);
    } else {
      setSelectedTags((prevTags) => prevTags.filter((t) => t !== tag));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatar(e.target.files[0]);
    }
  };

  const createProfileMutation = useMutation({
    mutationFn: createProfile,
    onSuccess: (data) => {
      if (cookieData) {
        const updatedUser = {
          ...cookieData,
          user: { ...cookieData.user, profileId: data.profile._id },
        };
        setCookie("currentUser", JSON.stringify(updatedUser), {
          maxAge: 3600 * 24,
        });
        setCookieData(updatedUser); // Update state with new profileId
        enqueueSnackbar(data.message, { variant: "success" });
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        queryClient.invalidateQueries({ queryKey: ["tags"] });
        router.push("/");
      }
    },
    onError: (error: any) => {
      // console.log(error.response.data.msg)
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const profileData: ProfileDataProps = {
      token,
      bio,
      location,
      interests: selectedTags,
      avatar,
    };

    createProfileMutation.mutate(profileData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="bg-gray-300 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl text-gray-800 font-bold mb-6">
          Add your Profile
        </h1>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="bio"
            >
              Bio:
            </label>
            <input
              type="text"
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="location"
            >
              Location:
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="interests"
            >
              Interests
            </label>
            <div className="flex mt-1 mb-2">
              <input
                id="newTag"
                type="text"
                placeholder="New Tag"
                className=" block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <button
                type="button"
                className="ml-2 px-3  border rounded-md bg-gray-500 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                onClick={handleAddTag}
              >
                Add
              </button>
            </div>
            <div className="h-full overflow-y-auto">
              <div className="flex flex-wrap">
                {tagsData?.map((tag: Tags) => (
                  <button
                    key={tag._id}
                    type="button"
                    onClick={() => handleTagClick(tag.name)}
                    className={`mr-2 mb-2 px-3 py-1 border rounded-md ${
                      selectedTags?.includes(tag.name)
                        ? "bg-gray-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    } hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300 ease-in-out`}
                  >
                    {tag.name}
                  </button>
                ))}
                {newTagsArr?.map((tag: string, index: number) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className={`mr-2 mb-2 px-3 py-1 border rounded-md ${
                      selectedTags?.includes(tag)
                        ? "bg-gray-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    } hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300 ease-in-out`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="avatar"
            >
              Avatar:
            </label>
            <input
              type="file"
              id="avatar"
              onChange={handleAvatarChange}
              className="border text-black rounded border-gray-300 rounded-md w-full  py-1 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
