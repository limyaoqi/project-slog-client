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
  user: User;
}

export default function Home_Left({
  setSelectedFriendId,
  setView,
  token,
  user,
}: HomeLeftProps) {
  const [search, setSearch] = useState<string>("");
  const { data: friends = [], refetch } = useQuery({
    queryKey: ["friends", search, token],
    queryFn: () => getAllFriend(search, token),
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    refetch();
  }, [search, refetch]);

  // const friends = [
  //   {
  //     _id: "1",
  //     user1: {
  //       _id: "user123",
  //       username: "john_doe",
  //       lastActive: "2024-06-05T12:00:00Z",
  //       isOnline: false,
  //       profileId: { avatar: "avatars/john_doe.jpg" },
  //     },
  //     user2: {
  //       _id: "friend1",
  //       username: "jane_smith",
  //       lastActive: "2024-06-06T08:00:00Z",
  //       isOnline: true,
  //       profileId: { avatar: "avatars/jane_smith.jpg" },
  //     },
  //     status: "accepted",
  //   },
  //   {
  //     _id: "2",
  //     user1: {
  //       _id: "user123",
  //       username: "john_doe",
  //       lastActive: "2024-06-05T12:00:00Z",
  //       isOnline: false,
  //       profileId: { avatar: "avatars/john_doe.jpg" },
  //     },
  //     user2: {
  //       _id: "friend2",
  //       username: "michael_brown",
  //       lastActive: "2024-06-01T14:00:00Z",
  //       isOnline: false,
  //       profileId: { avatar: "avatars/michael_brown.jpg" },
  //     },
  //     status: "accepted",
  //   },
  //   {
  //     _id: "3",
  //     user1: {
  //       _id: "user123",
  //       username: "john_doe",
  //       lastActive: "2024-06-05T12:00:00Z",
  //       isOnline: false,
  //       profileId: { avatar: "avatars/john_doe.jpg" },
  //     },
  //     user2: {
  //       _id: "friend3",
  //       username: "emma_wilson",
  //       lastActive: "2024-05-30T10:00:00Z",
  //       isOnline: false,
  //       profileId: { avatar: "avatars/emma_wilson.jpg" },
  //     },
  //     status: "accepted",
  //   },
  //   {
  //     _id: "4",
  //     user1: {
  //       _id: "user123",
  //       username: "john_doe",
  //       lastActive: "2024-06-05T12:00:00Z",
  //       isOnline: false,
  //       profileId: { avatar: "avatars/john_doe.jpg" },
  //     },
  //     user2: {
  //       _id: "friend4",
  //       username: "olivia_jones",
  //       lastActive: "2024-06-02T09:00:00Z",
  //       isOnline: true,
  //       profileId: { avatar: "avatars/olivia_jones.jpg" },
  //     },
  //     status: "accepted",
  //   },
  //   {
  //     _id: "5",
  //     user1: {
  //       _id: "user123",
  //       username: "john_doe",
  //       lastActive: "2024-06-05T12:00:00Z",
  //       isOnline: false,
  //       profileId: { avatar: "avatars/john_doe.jpg" },
  //     },
  //     user2: {
  //       _id: "friend5",
  //       username: "william_taylor",
  //       lastActive: "2024-06-04T15:00:00Z",
  //       isOnline: true,
  //       profileId: { avatar: "avatars/william_taylor.jpg" },
  //     },
  //     status: "accepted",
  //   },
  //   {
  //     _id: "6",
  //     user1: {
  //       _id: "user123",
  //       username: "john_doe",
  //       lastActive: "2024-06-05T12:00:00Z",
  //       isOnline: false,
  //       profileId: { avatar: "avatars/john_doe.jpg" },
  //     },
  //     user2: {
  //       _id: "friend6",
  //       username: "sophia_davis",
  //       lastActive: "2024-06-03T11:00:00Z",
  //       isOnline: false,
  //       profileId: { avatar: "avatars/sophia_davis.jpg" },
  //     },
  //     status: "accepted",
  //   },
  //   {
  //     _id: "7",
  //     user1: {
  //       _id: "user123",
  //       username: "john_doe",
  //       lastActive: "2024-06-05T12:00:00Z",
  //       isOnline: false,
  //       profileId: { avatar: "avatars/john_doe.jpg" },
  //     },
  //     user2: {
  //       _id: "friend7",
  //       username: "james_miller",
  //       lastActive: "2024-06-05T09:00:00Z",
  //       isOnline: true,
  //       profileId: { avatar: "avatars/james_miller.jpg" },
  //     },
  //     status: "accepted",
  //   },
  //   {
  //     _id: "8",
  //     user1: {
  //       _id: "user123",
  //       username: "john_doe",
  //       lastActive: "2024-06-05T12:00:00Z",
  //       isOnline: false,
  //       profileId: { avatar: "avatars/john_doe.jpg" },
  //     },
  //     user2: {
  //       _id: "friend8",
  //       username: "isabella_moore",
  //       lastActive: "2024-05-31T17:00:00Z",
  //       isOnline: false,
  //       profileId: { avatar: "avatars/isabella_moore.jpg" },
  //     },
  //     status: "accepted",
  //   },
  //   {
  //     _id: "9",
  //     user1: {
  //       _id: "user123",
  //       username: "john_doe",
  //       lastActive: "2024-06-05T12:00:00Z",
  //       isOnline: false,
  //       profileId: { avatar: "avatars/john_doe.jpg" },
  //     },
  //     user2: {
  //       _id: "friend9",
  //       username: "alexander_thomas",
  //       lastActive: "2024-06-06T07:00:00Z",
  //       isOnline: true,
  //       profileId: { avatar: "avatars/alexander_thomas.jpg" },
  //     },
  //     status: "accepted",
  //   },
  //   {
  //     _id: "10",
  //     user1: {
  //       _id: "user123",
  //       username: "john_doe",
  //       lastActive: "2024-06-05T12:00:00Z",
  //       isOnline: false,
  //       profileId: { avatar: "avatars/john_doe.jpg" },
  //     },
  //     user2: {
  //       _id: "friend10",
  //       username: "mia_wilson",
  //       lastActive: "2024-06-06T05:00:00Z",
  //       isOnline: true,
  //       profileId: { avatar: "avatars/mia_wilson.jpg" },
  //     },
  //     status: "accepted",
  //   },
  // ];

  return (
    <div className=" rounded text-white h-full overflow-hidden">
      <div className="sticky top-0  px-2 pt-4 rounded">
        <input
          type="text"
          placeholder="Search friends"
          className="w-full px-4 py-2 rounded-md border border-gray-300 text-black"
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      <div className="mt-4 space-y-2 b-black px-2 pb-20 h-full overflow-y-auto">
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
        })}
      </div>
    </div>
  );
}
