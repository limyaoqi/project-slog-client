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
import { useEffect, useState } from "react";

interface HomeLeftProps {
  setSelectedFriendId: (selectedFriendId: string) => void;
  setView: (view: string) => void;
  token: string;
  view: string;
  user: User;
  setBackpage: (backpage: string) => void;
}

const generateFakeFriends = () => {
  const friends = [];
  for (let i = 1; i <= 10; i++) {
    friends.push({
      _id: `friend${i}`,
      user1: {
        _id: `user${i}`,
        username: `User${i}`,
        email: `user${i}@example.com`,
        profileId: {
          avatar: `avatars/avatar${i}.jpg`,
        },
        isOnline: i % 2 === 0,
        lastActive: new Date(
          new Date().setDate(new Date().getDate() - i)
        ).toISOString(),
      },
      user2: {
        _id: `user${i + 10}`,
        username: `Friend${i}`,
        email: `friend${i}@example.com`,
        profileId: {
          avatar: `avatars/avatar${i + 10}.jpg`,
        },
        isOnline: i % 2 !== 0,
        lastActive: new Date(
          new Date().setDate(new Date().getDate() - (i + 5))
        ).toISOString(),
      },
    });
  }
  return friends;
};

export default function Home_Left({
  setSelectedFriendId,
  setBackpage,
  setView,
  token,
  view,
  user,
}: HomeLeftProps) {
  const [search, setSearch] = useState<string>("");
  const { data: friends = [], refetch } = useQuery({
    queryKey: ["friends", search, token],
    queryFn: () => getAllFriend(search, token),
  });

  useEffect(() => {
    refetch();
  }, [search, refetch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // const friends = generateFakeFriends();

  return (
    <div className=" rounded text-white bg-black pb-4 lg:pb-20 h-full overflow-hidden">
      <div className="  px-2 pt-4  rounded">
        <input
          type="text"
          placeholder="Search friends"
          className="w-full px-4 py-2 rounded-md border border-gray-300 text-black"
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      <div className="mt-4 space-y-2 b-black px-2 h-full overflow-y-auto">
        {friends.length > 0 ? (
          friends.map((friend: Friendship) => {
            const currentUserIsUser1 = friend.user1._id === user?._id;
            const displayUser = currentUserIsUser1
              ? friend.user2
              : friend.user1;

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
                  if (view !== "Home_Chatroom") {
                    setBackpage(view);
                  }
                  setView("Home_Chatroom");
                }}
                className="flex items-center p-2 bg-hoverGray rounded cursor-pointer"
              >
                <div className="w-10 h-10 mr-4">
                  <Image
                    className="rounded-full h-full"
                    src={`http://localhost:2000/${displayUser.profileId?.avatar}`}
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
          })
        ) : (
          <div className="text-center text-gray-500">No friends available</div>
        )}
      </div>
    </div>
  );
}
