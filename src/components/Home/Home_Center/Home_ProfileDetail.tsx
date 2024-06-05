import { getProfile, getProfileById } from "@/utils/api_profile";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Spinner from "@/components/Spinner";
import { Post } from "@/utils/interface";
import { format, formatDistanceToNow } from "date-fns";
import { IoCaretBackOutline } from "react-icons/io5";
import {
  FaCheckCircle,
  FaCheckDouble,
  FaEdit,
  FaUserFriends,
  FaUserMinus,
  FaUserPlus,
} from "react-icons/fa";
import Link from "next/link";
import { getUserFriendShip } from "@/utils/api_friendships";

const formatDate = (dateString: string) => {
  const date = new Date(dateString).getTime(); // Convert to milliseconds
  const now = new Date().getTime(); // Convert to milliseconds
  const differenceInDays = (now - date) / (1000 * 60 * 60 * 24);

  if (differenceInDays < 7) {
    return formatDistanceToNow(date, { addSuffix: true });
  } else {
    return format(date, "dd/MM/yyyy");
  }
};

interface Home_ProfileDetailProps {
  setView: (view: string) => void;
  setPostId: (view: string) => void;
  setBackPage: (view: string) => void;
  setProfileId: (view: string) => void;
  token: string;
  profileId?: string;
}

export default function Home_ProfileDetail({
  setView,
  setPostId,
  profileId,
  setBackPage,
  setProfileId,
}: Home_ProfileDetailProps) {
  const router = useRouter();

  const currentUserString = getCookie("currentUser");
  let currentUser = "";
  if (currentUserString) {
    currentUser = JSON.parse(currentUserString);
  } else {
    router.push("/login");
  }

  const { token, user }: any = currentUser;

  // Define the query key based on profileId
  const queryKey = profileId
    ? ["profile", token, profileId] //userId
    : ["profile", token];

  // Define the query function based on profileId
  const queryFn = profileId
    ? () => getProfileById(token, profileId)
    : () => getProfile(token);

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey,
    queryFn,
  });

  const { data: relationship = [] } = useQuery({
    queryKey: ["relationship", token, profileId],
    queryFn: () => getUserFriendShip(token, profileId),
  });

  // console.log(relationship);

  if (isLoading) {
    return <Spinner />;
  }

  // const goPostDetail = (postId: string) => {
  //   setView("Home_PostDetail");
  //   setPostId(postId);
  // };

  const { profile, posts } = data;

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-full bg-gray-200 p-4 rounded-md shadow-md text-gray-800">
          <div className="mx-auto max-w-screen-xl px-4">
            <h1 className="text-2xl font-bold">Profile not found</h1>
            <p className="mb-3">Please create a profile to view this page.</p>
            <Link
              href={"/addprofile"}
              className=" bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-300 ease-in-out"
            >
              Go to Add Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const interests = profile.interests
    .map((interest: { name: string }) => interest.name)
    .join(", ");

  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-full bg-gray-300 p-4 rounded-md shadow-md text-gray-800">
        <div className="mx-auto max-w-screen-xl  px-4">
          <div className="flex justify-between items-center w-full mb-4">
            <h1 className="text-2xl font-bold">{`Welcome to ${profile.user.username}'s Profile`}</h1>
            {profile.user._id === user._id ? (
              <>
                <button
                  className="bg-blue-300 px-3 py-2 rounded-full hover:bg-black hover:text-blue-300 transition-all duration-300 ease-in-out"
                  onClick={() => {
                    setView("Home_EditProfile");
                    setProfileId(profile.user._id);
                    setBackPage("Home_ProfileDetail");
                  }}
                >
                  <FaEdit />
                </button>
              </>
            ) : (
              <div>
                <button className="bg-green-300 px-3 py-2 rounded">
                  <FaUserPlus />
                </button>
                {relationship && relationship.status === "accepted" ? (
                  <button className="bg-red-500 px-3 py-2 rounded-full hover:bg-red-600">
                    <FaUserMinus />
                  </button>
                ) : relationship && relationship.status === "pending" ? (
                  <button className="bg-gray-500 px-3 py-2 rounded-full">
                    <FaCheckCircle />
                  </button>
                ) : (
                  <button className="bg-green-500 px-3 py-2 rounded-full hover:bg-green-600">
                    <FaUserPlus />
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-wrap -mx-4">
            <div className="w-full lg:w-1/3 px-4 mb-4">
              <div className="bg-white rounded-md p-4 shadow-md h-full">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full ">
                  <Image
                    src={`http://localhost:2000/${profile.avatar}`}
                    alt="Profile Avatar"
                    width={999}
                    height={999}
                    className="h-full rounded-full"
                  />
                </div>
                <p className="mb-4">
                  <strong>Bio:</strong> <br />
                  {profile.bio}
                </p>
                <p className="mb-4">
                  <strong>Location:</strong> {profile.location}
                </p>
                <p className="mb-4">
                  <strong>Interests:</strong> {interests}
                </p>
              </div>
            </div>
            <div className="w-full lg:w-2/3 px-4 mb-4">
              <div className="bg-white rounded-md p-4 shadow-md h-full">
                {posts && posts.length > 0 ? (
                  <div className="overflow-y-auto max-h-96">
                    <h2 className="text-xl font-semibold mb-4">Posts</h2>
                    {posts.map((post: Post) => (
                      <div
                        key={post._id}
                        className="border border-black p-4 rounded mb-3 cursor-pointer"
                        onClick={() => {
                          setView("Home_PostDetail");
                          setPostId(post._id);
                          setBackPage("Home_ProfileDetail");
                        }}
                      >
                        <h3 className="text-lg font-bold">{post.title}</h3>
                        <p>{post.description}</p>
                        {post.tags && post.tags.length > 0 && (
                          <p>
                            <strong>Tags:</strong>{" "}
                            {post.tags.map((tag) => tag.name).join(", ")}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="">
                    {profile.user._id === user._id ? (
                      <>
                        <p className="mb-1">No posts yet. Go to add a post!</p>
                        <button
                          onClick={() => {
                            setView("Home_AddPost");
                            setBackPage("Home_ProfileDetail");
                          }}
                          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
                        >
                          Add Post
                        </button>
                      </>
                    ) : (
                      <p>This user has no posts yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
