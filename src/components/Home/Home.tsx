"use client";

import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Home_Center from "./Home_Center";
import Home_Left from "./Home_Left";
import Home_Right from "./Home_Right";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { User } from "@/utils/interface";

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastActive: string;
}
interface HomeProps {
  token: string;
  user: User | null;
}

export default function Home({ token, user }: HomeProps) {
  const router = useRouter();
  const [selectedFriendId, setSelectedFriendId] = useState<string>("");
  const [profileId, setProfileId] = useState<string>("");

  const [view, setView] = useState("Home_Post");

  // console.log(user.firstLogin);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex w-full h-88p">
        <div className="w-1/4 p-6 rounded-lg  h-full">
          <Home_Left
            setSelectedFriendId={setSelectedFriendId}
            token={token}
            user={user}
            setView={setView}
          />
        </div>
        <div className="w-1/2 border-x-2 border-customGray ">
          <div className=" p-6 rounded-lg h-full ">
            <Home_Center
              token={token}
              user={user}
              view={view}
              setView={setView}
              selectedFriendId={selectedFriendId}
              profileId={profileId}
              setProfileId={setProfileId}
            />
          </div>
        </div>
        <div className="w-1/4 p-6 rounded-lg h-full">
          <Home_Right setView={setView} token={token} />
        </div>
      </div>
      <div className="flex w-full h-12p justify-center px-4">
        <div className="w-4/6">
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
