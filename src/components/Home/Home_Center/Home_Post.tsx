import { deletePost, getPosts } from "@/utils/api_posts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { Post, User } from "../../../utils/interface";
import Spinner from "@/components/Spinner";
import ButtonGroup from "@/components/Button";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useSnackbar } from "notistack";
import { likePost } from "@/utils/api_like";

interface Home_PostProps {
  setView: (view: string) => void;
  setPostId: (view: string) => void;
  setProfileId: (view: string) => void;
  setBackPage: (view: string) => void;
  user: User | null;
  token: string;
}

export default function Home_Post({
  user,
  token,
  setView,
  setPostId,
  setProfileId,
  setBackPage,
}: Home_PostProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const {
    data: posts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts", token],
    queryFn: () => getPosts(token),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      enqueueSnackbar("Deleted Successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: any) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });

  const likePostMutation = useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      // enqueueSnackbar("Deleted Successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: any) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });

  const handlePostLike = (postId: string) => {
    likePostMutation.mutate({
      _id: postId,
      token,
    });
  };

  if (isLoading) {
    return <Spinner />;
  }

  const handleEdit = (postId: string) => {
    setView("Home_EditPost");
    setPostId(postId);
  };

  const handleDelete = (postId: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deleteMutation.mutate({ postId, token });
    }
  };

  const goPostDetail = (postId: string) => {
    setView("Home_PostDetail");
    setPostId(postId);
    setBackPage("Home_Post");
  };

  const goProfileDetail = (profileId: string) => {
    setView("Home_ProfileDetail");
    setProfileId(profileId);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="w-full mb-4 text-black">
        <input
          type="text"
          placeholder="Search username"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
        />
      </div>

      {posts.length === 0 ? (
        <div>No posts available</div>
      ) : (
        posts.map((post: Post) => (
          <div key={post._id} className="border p-4 rounded mb-4 ">
            <div className="flex justify-between items-center w-full mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 mr-4">
                  <Image
                    className="rounded-full h-full"
                    src={`http://localhost:2000/${post.user.profileId.avatar}`}
                    alt={`${post.user.username}'s avatar`}
                    width={999}
                    height={999}
                  />
                </div>
                <div
                  className="text-sm text-gray-200 hover:underline"
                  onClick={() => goProfileDetail(post.user._id)}
                >
                  {post.user.username}
                </div>
              </div>
              {user && (user.isAdmin || user._id === post.user._id) && (
                <div className="flex items-center">
                  <button
                    className="px-2 text-gray-700 transition duration-300 ease-in-out  hover:text-blue-500"
                    onClick={() => handleEdit(post._id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="px-2 text-gray-700 transition duration-300 ease-in-out  hover:text-red-500"
                    onClick={() => handleDelete(post._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>

            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-gray-500">{post.description}</p>
            {post.attachments && post.attachments.length > 1 ? (
              <div className="mt-2">
                <ul className=" grid grid-cols-3 list-disc list-inside">
                  {post.attachments.map((attachment) => (
                    <div key={attachment} className="w-full h-56">
                      <Image
                        className="w-full h-full"
                        src={`http://localhost:2000/${attachment}`}
                        alt={`${post.user.username}'s avatar`}
                        width={999}
                        height={999}
                      />
                    </div>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="mt-2">
                <ul className="list-disc list-inside">
                  {post.attachments?.map((attachment) => (
                    <div key={attachment} className="w-full h-full">
                      <Image
                        className="w-full h-full"
                        src={`http://localhost:2000/${attachment}`}
                        alt={`${post.user.username}'s avatar`}
                        width={999}
                        height={999}
                      />
                    </div>
                  ))}
                </ul>
              </div>
            )}

            <ButtonGroup
              isLiked={post?.likes?.includes(user._id) || false}
              onCommentClick={() => "hello"}
              onDetailClick={() => goPostDetail(post._id)}
              onLikeClick={() => handlePostLike(post._id)}
            />

            {post.comments && post.comments.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold border-t  pt-2">Comments:</h3>
                {post.comments.map((comment) => (
                  <div key={comment._id} className="mt-4 ">
                    <div className="flex items-start">
                      <div className="w-8 h-8 mr-4">
                        <Image
                          className="rounded-full w-full h-full"
                          src={`http://localhost:2000/${comment.user.profileId.avatar}`}
                          alt={`${comment.user.username}'s avatar`}
                          width={999}
                          height={999}
                        />
                      </div>
                      <p
                        className="text-gray-200 mr-3 hover:underline"
                        onClick={() => goProfileDetail(comment.user._id)}
                      >
                        {comment.user.username}:
                      </p>
                      <p className="text-gray-300">{comment.content}</p>
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      {new Date(comment.createdAt).toLocaleString()}
                    </div>
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-2 pl-4 border-l">
                        {comment.replies.map((reply) => (
                          <div key={reply._id} className="mt-3">
                            <div className="flex items-start">
                              <div className="w-8 h-8 mr-4">
                                <Image
                                  className="rounded-full w-full h-full"
                                  src={`http://localhost:2000/${reply.user.profileId.avatar}`}
                                  alt={`${reply.user.username}'s avatar`}
                                  width={999}
                                  height={999}
                                />
                              </div>
                              <p
                                className="text-gray-200 mr-3 hover:underline"
                                onClick={() => goProfileDetail(reply.user._id)}
                              >
                                {reply.user.username}:
                              </p>
                              <p className="text-gray-300">{reply.content}</p>
                            </div>{" "}
                            <div className="text-sm text-gray-500">
                              {new Date(reply.createdAt).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
