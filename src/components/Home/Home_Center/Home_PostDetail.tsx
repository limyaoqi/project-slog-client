import Spinner from "@/components/Spinner";
import { getPostById } from "@/utils/api_posts";
import { Comment } from "@/utils/interface";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";

interface Home_PostDetailProps {
  postId: string | null;
  backpage: string;
  setView: (view: string) => void;
  token: string;
  setProfileId: (view: string) => void;
}

export default function Home_PostDetail({
  postId,
  setView,
  setProfileId,
  backpage,
}: Home_PostDetailProps) {
  const {
    data: post = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostById(postId),
  });

  if (isLoading) {
    return <Spinner />;
  }

  const goProfileDetail = (profileId: string) => {
    setView("Home_ProfileDetail");
    setProfileId(profileId);
  };
  return (
    <div className="h-full overflow-y-auto">
      <button
        onClick={() => setView(backpage)}
        className="bg-gray-300 px-3 py-2 rounded text-black mb-2"
      >
        <FaArrowLeft />
      </button>
      <div className="border p-4 rounded mb-4">
        <div className="flex items-center mb-4">
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
            onClick={() => goProfileDetail(post.user.profileId._id)}
          >
            {post.user.username}
          </div>
        </div>
        <h2 className="text-xl font-bold">{post.title}</h2>
        <p className="text-gray-700">{post.description}</p>
        {post.attachments && post.attachments.length > 1 ? (
          <div className="mt-2">
            <ul className=" grid grid-cols-3 list-disc list-inside">
              {post.attachments.map((attachment: string) => (
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
              {post.attachments?.map((attachment: string) => (
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
        {post.comments && post.comments.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold border-t  pt-2">Comments:</h3>
            {post.comments.map((comment: Comment) => (
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
    </div>
  );
}
