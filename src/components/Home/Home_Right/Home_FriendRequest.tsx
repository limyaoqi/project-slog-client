import {
  acceptFriendRequest,
  rejectFriendRequest,
} from "@/utils/api_friendships";
import { ToggleAccordion } from "@/utils/interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useSnackbar } from "notistack";

export default function Home_FriendRequest({
  openAccordion,
  toggleAccordion,
  requests,
  token,
  setView,
}: ToggleAccordion) {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const acceptRequestMutation = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      enqueueSnackbar("Accept request Successful", {
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
    onError: (error: any) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });

  const rejectRequestMutation = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      enqueueSnackbar("Reject request Successful", {
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
    onError: (error: any) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });

  const handleAccept = (_id: string) => {
    acceptRequestMutation.mutate({
      _id,
      token,
    });
  };

  const handleReject = (_id: string) => {
    rejectRequestMutation.mutate({
      _id,
      token,
    });
  };

  return (
    <div
      className={`border border-gray-300 rounded ${
        openAccordion === "request" ? "flex-grow" : "flex-none"
      }`}
    >
      <div
        className="flex justify-between items-center px-4 py-2 rounded bg-black hover:bg-gray-900 focus:outline-none transition-colors duration-300 "
        onClick={toggleAccordion}
      >
        <button className="w-full  text-left text-lg font-semibold   ">
          Request
        </button>
        {requests && requests.length > 0 && (
          <span className=" h-3 w-3 rounded-full bg-red-500"></span>
        )}
      </div>

      {openAccordion === "request" && (
        <div className="bg-black rounded text-white px-2 py-2 space-y-4">
          {requests && requests.length > 0 ? (
            requests.map((request) => (
              <div
                key={request._id}
                className="px-2 py-2 bg-hoverGray rounded cursor-pointer flex items-center space-x-4"
              >
                <div className="w-10 h-10 mr-2">
                  <Image
                    className="rounded-full h-full"
                    src={`http://localhost:2000/${request.user1.profileId?.avatar}`}
                    alt={`${request.user2.username}'s avatar`}
                    width={999}
                    height={999}
                  />
                </div>
                <div className="flex-1">
                  <p>{request.user1.username} send you a friend request.</p>
                  <div className="mt-2 space-x-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                      onClick={() => handleAccept(request._id)}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      onClick={() => handleReject(request._id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 mt-2 bg-hoverGray rounded h-full overflow-y-auto">
              <p className="text-gray-300">You have no new requests.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
