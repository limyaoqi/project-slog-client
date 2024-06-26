"use client";

import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Home_Center from "./Home_Center";
import Home_Left from "./Home_Left";
import Home_Right from "./Home_Right";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { User } from "@/utils/interface";
import { getUser } from "@/utils/api_users";
import { useQuery } from "@tanstack/react-query";

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastActive: string;
}
interface HomeProps {
  token: string;
}

export default function Home({ token }: HomeProps) {
  const router = useRouter();
  const [selectedFriendId, setSelectedFriendId] = useState<string>("");
  const [profileId, setProfileId] = useState<string>("");
  const [backpage, setBackpage] = useState<string>("");

  const [view, setView] = useState("Home_Post");

  const { data: user = [] } = useQuery({
    queryKey: ["user", token],
    queryFn: () => getUser(token),
  });

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col lg:flex-row w-full lg:h-88p">
        <div className="w-full lg:w-1/4 p-6 rounded-lg h-full hidden lg:block">
          <Home_Left
            token={token}
            view={view}
            setView={setView}
            setSelectedFriendId={setSelectedFriendId}
            setBackpage={setBackpage}
            user={user}
          />
        </div>
        <div className="w-full lg:w-1/2 border-x-2 border-customGray h-full">
          <div className="lg:p-4 px-4 pt-8 pb-20 rounded-lg h-full">
            <Home_Center
              backpage={backpage}
              setBackpage={setBackpage}
              token={token}
              user={user}
              view={view}
              setView={setView}
              selectedFriendId={selectedFriendId}
              profileId={profileId}
              setProfileId={setProfileId}
              setSelectedFriendId={setSelectedFriendId}
            />
          </div>
        </div>
        <div className="w-full lg:w-1/4 p-6 rounded-lg h-full hidden lg:block">
          <Home_Right setView={setView} token={token} />
        </div>
      </div>
      <div className="w-full h-12p justify-center px-4  hidden lg:flex">
        <div className="w-full lg:w-4/6">
          <Navbar
            setView={setView}
            token={token}
            user={user}
            goLogin={() => router.push("/login")}
            setProfileId={setProfileId}
          />
        </div>
      </div>
    </div>
  );
}
