import { getAllFriend } from "@/utils/api_friendships";
import { Friend } from "./Home";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { Friendship, User } from "@/utils/interface";
import {
  parseISO,
  formatDistanceToNow,
  isBefore,
  subDays,
  format,
} from "date-fns";

interface HomeLeftProps {
  setSelectedFriendId: (selectedFriendId: string) => void;
  setView: (view: string) => void;
  token: string;
  user: User | null;
}

export default function Home_Left({
  setSelectedFriendId,
  setView,
  token,
  user,
}: HomeLeftProps) {
  const { data: friends = [] } = useQuery({
    queryKey: ["friends", token],
    queryFn: () => getAllFriend(token),
  });

  return (
    <div className="bg-black rounded text-white p-4 space-y-4 h-full overflow-y-auto">
      <div className="sticky top-0 bg-black py-4 rounded">
        <input
          type="text"
          placeholder="Search friends"
          className="w-full px-4 py-2 rounded-md border border-gray-300 text-black"
        />
      </div>
      <div className="mt-4 space-y-2">
        {friends.map((friend: Friendship) => {
          const currentUserIsUser1 = friend.user1._id === user?._id;

          const displayUser = currentUserIsUser1 ? friend.user2 : friend.user1;

          const lastActiveDate = parseISO(displayUser.lastActive.toString());
          const moreThan7DaysAgo = isBefore(
            lastActiveDate,
            subDays(new Date(), 7)
          );
          return (
            <div
              key={friend._id}
              onClick={() => {
                setSelectedFriendId(displayUser._id);
                setView("Home_Chatroom");
              }}
              className="flex items-center p-2 bg-hoverGray rounded cursor-pointer"
            >
              <div className="w-10 h-10 mr-4">
                <Image
                  className="rounded-full h-full"
                  src={`http://localhost:2000/${displayUser.profileId.avatar}`}
                  alt={`${displayUser.username}'s avatar`}
                  width={999}
                  height={999}
                />
              </div>
              <div className="ml-3 flex-1">
                <div className="text-lg">{displayUser.username}</div>
                <div className="flex items-center text-sm text-gray-400">
                  <span
                    className={`inline-block w-3 h-3 rounded-full mr-2 ${
                      displayUser.isOnline ? "bg-green-500" : "bg-gray-500"
                    }`}
                  ></span>
                  {displayUser.isOnline
                    ? "Online"
                    : moreThan7DaysAgo
                    ? `Last online: ${format(lastActiveDate, "yyyy-MM-dd")}`
                    : `Last online: ${formatDistanceToNow(lastActiveDate, {
                        addSuffix: true,
                      })}`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
