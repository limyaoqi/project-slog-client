import { Post, User } from "../../../utils/interface";
import { deletePost, getPosts } from "@/utils/api_posts";
import { likePost } from "@/utils/api_like";
import {
  addComment,
  addReply,
  deleteComment,
  deleteReply,
} from "@/utils/api_comments";
import { useSnackbar } from "notistack";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import ButtonGroup from "@/components/Button";
import { FaEdit, FaHeart, FaReply, FaTrash } from "react-icons/fa";
import Model from "@/components/Model";
import { getUsers } from "@/utils/api_users";
import { set } from "date-fns";

interface Home_PostProps {
  setView: (view: string) => void;
  setPostId: (postId: string) => void;
  setProfileId: (profileId: string) => void;
  setBackpage: (backpage: string) => void;
  user: User;
  token: string;
}

export default function Home_Post({
  user,
  token,
  setView,
  setPostId,
  setProfileId,
  setBackpage,
}: Home_PostProps) {
  // const router = useRouter();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [content, setContent] = useState<string>("");
  const [post_id, setPost_id] = useState<string>("");
  const [comment_id, setComment_id] = useState<string>("");
  const [openModal, setOpenModal] = useState(false);
  const [type, setType] = useState("");
  const [showAllComments, setShowAllComments] = useState<{
    [key: string]: boolean;
  }>({});
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [search, setSearch] = useState("");

  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts", token],
    queryFn: () => getPosts(token),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users", token, search],
    queryFn: () => getUsers(token, search),
  });
  // console.log(users);

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

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      enqueueSnackbar("Deleted Successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: any) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: addComment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      enqueueSnackbar(data.message, { variant: "success" });
      setOpenModal(false);
      setContent("");
    },
    onError: (error: any) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });

  const addReplyMutation = useMutation({
    mutationFn: addReply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      enqueueSnackbar("Reply comment successfully", { variant: "success" });
      setOpenModal(false);
      setContent("");
    },
    onError: (error: any) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });

  const deleteReplyMutation = useMutation({
    mutationFn: deleteReply,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      enqueueSnackbar(data.message, { variant: "success" });
    },
    onError: (error: any) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });

  const handlePostLike = (id: string, type: "post" | "comment" | "reply") => {
    likePostMutation.mutate({
      type,
      _id: id,
      token,
    });
  };

  const handleEdit = (postId: string) => {
    setView("Home_EditPost");
    setPostId(postId);
  };

  const handleAddComment = () => {
    if (content !== "") {
      if (type === "addcomment") {
        addCommentMutation.mutate({
          content,
          token,
          post_id,
        });
      } else if (type === "addreply") {
        addReplyMutation.mutate({
          content,
          token,
          post_id,
          comment_id,
        });
      }
    } else {
      enqueueSnackbar("Please enter a comment before submitting.", {
        variant: "error",
      });
    }
  };

  const handleDelete = (postId: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deleteMutation.mutate({ postId, token });
    }
  };

  const handleDeleteComment = (comment_id: string) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation.mutate({ comment_id, token });
    }
  };

  const handleDeleteReply = (
    post_id: string,
    comment_id: string,
    reply_id: string
  ) => {
    if (confirm("Are you sure you want to delete this reply?")) {
      deleteReplyMutation.mutate({ post_id, comment_id, reply_id, token });
    }
  };

  const goPostDetail = (postId: string) => {
    setView("Home_PostDetail");
    setPostId(postId);
    setBackpage("Home_Post");
  };

  const goProfileDetail = (profileId: string) => {
    setView("Home_ProfileDetail");
    setProfileId(profileId);
  };

  const toggleShowReplies = (commentId: string) => {
    setShowReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const toggleShowAllComments = (postId: string) => {
    setShowAllComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="w-full mb-4 text-black">
        <input
          type="text"
          placeholder="Search username"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {openModal && (
        <Model
          content={content}
          setContent={setContent}
          setOpenModal={setOpenModal}
          handleSubmit={() => handleAddComment()}
        />
      )}
      {search !== "" ? (
        users.length === 0 ? (
          <div className="text-center text-gray-500">
            No Matching User Found
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((user: User) => (
              <div
                key={user._id}
                className="bg-white text-black p-6 rounded-lg shadow-md"
                onClick={() => goProfileDetail(user._id)}
              >
                <div className="w-32 h-32 mx-auto mb-4 rounded-full">
                  <Image
                    src={`http://localhost:2000/${user.profileId.avatar}`}
                    alt="Profile Avatar"
                    width={999}
                    height={999}
                    className="h-full rounded-full"
                  />
                </div>
                <h2 className="text-xl font-bold mb-2 text-center">
                  {user.username}
                </h2>
                <p className="text-gray-700 text-center">{user.email}</p>
              </div>
            ))}
          </div>
        )
      ) : posts.length === 0 ? (
        <div>No posts available</div>
      ) : (
        posts.map((post: Post) => (
          <div key={post._id} className="border p-4 rounded mb-4">
            <div className="flex justify-between items-center w-full mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 mr-4">
                  <Image
                    className="rounded-full h-full"
                    src={`http://localhost:2000/${post?.user?.profileId?.avatar}`}
                    alt={`${post?.user?.username}'s avatar`}
                    width={999}
                    height={999}
                  />
                </div>
                <div
                  className="text-sm text-gray-200 hover:underline break-words"
                  onClick={() => goProfileDetail(post.user._id)}
                >
                  {post?.user?.username}
                </div>
              </div>
              {user &&
                (user.role === "superAdmin" ||
                  user.role === "admin" ||
                  user._id === post?.user?._id) && (
                  <div className="flex items-center">
                    <button
                      className="px-2 text-gray-700 transition duration-300 ease-in-out hover:text-blue-500"
                      onClick={() => handleEdit(post._id)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="px-2 text-gray-700 transition duration-300 ease-in-out hover:text-red-500"
                      onClick={() => handleDelete(post._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
            </div>

            <h2 className="text-xl font-bold break-words">{post.title}</h2>
            <p className="text-gray-500 break-words">{post.description}</p>
            {post.attachments && post.attachments.length > 1 ? (
              <div className="mt-2">
                <ul className="grid grid-cols-3 list-disc list-inside ">
                  {post.attachments.map((attachment) => (
                    <div
                      key={attachment}
                      className="w-full h-56 border-2 border-indigo-500 rounded"
                    >
                      <Image
                        className="w-full h-full object-contain rounded "
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
                    <div key={attachment} className="w-full h-96 max-h-96 ">
                      <Image
                        className="w-full h-full object-contain rounded"
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
              isPostPage={true}
              isLiked={post.likes?.includes(user._id) ? true : false}
              onCommentClick={() => {
                setOpenModal(true);
                setType("addcomment");
                setPost_id(post._id);
              }}
              onDetailClick={() => goPostDetail(post._id)}
              onLikeClick={() => {
                handlePostLike(post._id, "post");
              }}
            />

            {post.comments && post.comments.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold border-t pt-2">Comments:</h3>
                {post.comments
                  .slice(
                    0,
                    showAllComments[post._id] ? post.comments.length : 4
                  )
                  .map((comment) => (
                    <div key={comment._id} className="mt-4">
                      <div className="flex items-center w-full">
                        <div className="w-8 h-8 mr-4">
                          <Image
                            className="rounded-full w-full h-full"
                            src={`http://localhost:2000/${comment.user.profileId?.avatar}`}
                            alt={`${comment.user.username}'s avatar`}
                            width={999}
                            height={999}
                          />
                        </div>
                        <p
                          className="text-gray-200 mr-3 hover:underline cursor-pointer break-words"
                          onClick={() => goProfileDetail(comment.user._id)}
                        >
                          {comment.user.username}:
                        </p>
                      </div>
                      <p className="text-gray-300 break-words my-2">
                        {comment.content}
                      </p>

                      <div className="flex justify-between items-center text-center">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <button
                              className="text-gray-500 hover:text-blue-500 transition-colors duration-300"
                              onClick={() => {
                                setOpenModal(true);
                                setType("addreply");
                                setPost_id(post._id);
                                setComment_id(comment._id);
                              }}
                            >
                              <FaReply />
                            </button>
                            <span className="ml-1 text-gray-500">
                              {comment.replies ? comment.replies.length : 0}
                            </span>
                          </div>
                          <div className="flex items-center">
                            {comment && comment.likes?.includes(user._id) ? (
                              <button
                                className="text-rose-500 hover:text-rose-300 transition-colors duration-300"
                                onClick={() =>
                                  handlePostLike(comment._id, "comment")
                                }
                              >
                                <FaHeart />
                              </button>
                            ) : (
                              <button
                                className="text-gray-500 hover:text-rose-300 transition-colors duration-300"
                                onClick={() =>
                                  handlePostLike(comment._id, "comment")
                                }
                              >
                                <FaHeart />
                              </button>
                            )}
                            <span className="ml-1 text-gray-500">
                              {comment && comment.likes?.length}
                            </span>
                          </div>
                          {user &&
                            (user.role === "superAdmin" ||
                              user.role === "admin" ||
                              user._id === post.user._id ||
                              user._id === comment.user._id) && (
                              <div className="flex items-center space-x-2">
                                <button
                                  className="text-gray-500 hover:text-red-500"
                                  onClick={() =>
                                    handleDeleteComment(comment._id)
                                  }
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleString()}
                        </div>
                      </div>

                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-2 pl-4 border-l">
                          <div className="flex items-center justify-center mt-2 mb-2">
                            <div className="flex-grow border-b border-white"></div>
                            <button
                              onClick={() => toggleShowReplies(comment._id)}
                              className="mx-4 text-blue-700 hover:text-blue-500 text-sm"
                            >
                              {showReplies[comment._id]
                                ? "Hide Replies"
                                : `Show Replies (${comment.replies.length})`}
                            </button>
                            <div className="flex-grow border-b border-white"></div>
                          </div>
                          {showReplies[comment._id] &&
                            comment.replies.map((reply) => (
                              <div key={reply._id} className="mt-3">
                                <div className="flex items-center w-full ">
                                  <div className="w-8 h-8 mr-4">
                                    <Image
                                      className="rounded-full w-full h-full"
                                      src={`http://localhost:2000/${reply.user.profileId?.avatar}`}
                                      alt={`${reply.user.username}'s avatar`}
                                      width={999}
                                      height={999}
                                    />
                                  </div>
                                  <p
                                    className="text-gray-200 mr-3 hover:underline cursor-pointer break-words"
                                    onClick={() =>
                                      goProfileDetail(reply.user._id)
                                    }
                                  >
                                    {reply.user.username}:
                                  </p>
                                </div>

                                <p className="text-gray-300 break-words my-2">
                                  {reply.content}
                                </p>

                                <div className="flex justify-between items-center text-center">
                                  <div className="flex items-center space-x-4">
                                    <div className="flex items-center">
                                      {reply &&
                                      reply.likes?.includes(user._id) ? (
                                        <button
                                          className="text-rose-500 hover:text-rose-300 transition-colors duration-300"
                                          onClick={() =>
                                            handlePostLike(reply._id, "reply")
                                          }
                                        >
                                          <FaHeart />
                                        </button>
                                      ) : (
                                        <button
                                          className="text-gray-500 hover:text-rose-300 transition-colors duration-300"
                                          onClick={() =>
                                            handlePostLike(reply._id, "reply")
                                          }
                                        >
                                          <FaHeart />
                                        </button>
                                      )}
                                      <span className="ml-1 text-gray-500">
                                        {reply && reply.likes?.length}
                                      </span>
                                    </div>
                                    {user &&
                                      (user.role === "superAdmin" ||
                                        user.role === "admin" ||
                                        user._id === post.user._id ||
                                        user._id === reply.user._id) && (
                                        <div className="flex items-center space-x-2">
                                          <button
                                            className="text-gray-500 hover:text-red-500"
                                            onClick={() =>
                                              handleDeleteReply(
                                                post._id,
                                                comment._id,
                                                reply._id
                                              )
                                            }
                                          >
                                            <FaTrash />
                                          </button>
                                        </div>
                                      )}
                                  </div>

                                  <div className="text-sm text-gray-500 mt-2">
                                    {new Date(reply.createdAt).toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                {post.comments.length > 4 && (
                  <div className="flex items-center justify-center mt-2 mb-2">
                    <div className="flex-grow border-b border-white"></div>
                    <button
                      onClick={() => toggleShowAllComments(post._id)}
                      className="mx-4 text-blue-700 hover:text-blue-500 text-sm"
                    >
                      {showAllComments[post._id]
                        ? "Show Less Comments"
                        : "Show More Comments"}
                    </button>
                    <div className="flex-grow border-b border-white"></div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
