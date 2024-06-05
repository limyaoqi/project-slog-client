import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { useSnackbar } from "notistack";
import { getProfileById, updateProfile } from "@/utils/api_profile";
import { getTags } from "@/utils/api_tags";
import { Tags } from "@/utils/interface";

interface Home_EditProfileProps {
  setView: (view: string) => void;
  token: string;
  profileId: string;
}

const Home_EditProfile: React.FC<Home_EditProfileProps> = ({
  setView,
  profileId,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Add state variables to manage form data
  const [bio, setBio] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [newTag, setNewTag] = useState<string>("");
  const [newTagsArr, setNewTagsArr] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [avatar, setAvatar] = useState<File | null>(null);

  const currentUserString = getCookie("currentUser");
  let currentUser = "";
  if (currentUserString) {
    currentUser = JSON.parse(currentUserString);
  } else {
    router.push("/login");
  }
  const { token }: any = currentUser;

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile", token, profileId],
    queryFn: () => getProfileById(token, profileId),
  });

  const { profile } = data;

  useEffect(() => {
    if (profile) {
      setBio(profile.bio);
      setLocation(profile.location);
      setSelectedTags(
        profile?.interests?.map((interest: Tags) => interest.name)
      );
      setAvatar(profile.avatar);
    }
  }, [profile]);

  const { data: tagsData = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags(),
  });

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

  // Define mutation for updating profile
  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      enqueueSnackbar("Profile updated successfully", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setView("Home_ProfileDetail");
    },
    onError: (error: any) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Construct profile data object
    const profileData = {
      _id: profile._id,
      token,
      bio,
      location,
      interests: selectedTags,
      avatar,
    };

    // Call mutation to update profile
    updateProfileMutation.mutate(profileData);
  };

  return (
    <div className="min-h-screen flex justify-center">
      <div className="bg-gray-300 p-8 rounded shadow-md w-full max-w-md h-full">
        <h1 className="text-2xl text-gray-800 font-bold mb-6">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700"
            >
              Bio
            </label>
            <input
              id="bio"
              type="text"
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              placeholder="Location"
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
          <div>
            <label
              htmlFor="avatar"
              className="block text-sm font-medium text-gray-700"
            >
              Avatar
            </label>
            <input
              type="file"
              id="avatar"
              onChange={handleAvatarChange}
              className="border text-black rounded border-gray-300 rounded-md w-full py-1 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home_EditProfile;
