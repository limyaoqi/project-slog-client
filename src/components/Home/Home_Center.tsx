import Home_AddPost from "./Home_Center/Home_AddPost";
import Home_Post from "./Home_Center/Home_Post";
import Home_PostDetail from "./Home_Center/Home_PostDetail";
import Home_ProfileDetail from "./Home_Center/Home_ProfileDetail";
import Home_Chatroom from "./Home_Center/Home_Chatroom";
import { Friend } from "./Home";
import { useState } from "react";
import Home_EditPost from "./Home_Center/Home_EditPost";
import Home_EditProfile from "./Home_Center/Home_EditProfile";
import { User } from "@/utils/interface";
import Navbar from "../Navbar";
import { useRouter } from "next/navigation";
import Home_Left from "./Home_Left";
import Home_Right from "./Home_Right";
import Home_UserManagement from "./Home_Center/Home_UserManagement";

interface Home_CenterProps {
  view: string;
  setView: (view: string) => void;
  selectedFriendId: string;
  profileId: string;
  setProfileId: (view: string) => void;
  token: string;
  user: User;
  backpage: string;
  setBackpage: (backpage: string) => void;
  setSelectedFriendId: (selectedFriendId: string) => void;
}

export default function Home_Center({
  token,
  user,
  view,
  setView,
  selectedFriendId,
  setSelectedFriendId,
  profileId,
  setProfileId,
  backpage,
  setBackpage,
}: Home_CenterProps) {
  const [postId, setPostId] = useState<string>("");

  const router = useRouter();
  return (
    <div className="relative h-full">
      {/* Navbar component */}
      <div className="lg:hidden  fixed bottom-0 left-0 w-full  px-6  z-10">
        <Navbar
          setView={setView}
          token={token}
          user={user}
          goLogin={() => router.push("/login")}
          setProfileId={setProfileId}
        />
      </div>

      {/* Main content */}
      <div className="h-full overflow-y-auto">
        {view === "Home_Post" && (
          <Home_Post
            token={token}
            setView={setView}
            setPostId={setPostId}
            setProfileId={setProfileId}
            setBackpage={setBackpage}
            user={user}
          />
        )}
        {view === "Home_EditPost" && (
          <Home_EditPost setView={setView} postId={postId} token={token} />
        )}
        {view === "Home_EditProfile" && (
          <Home_EditProfile
            setView={setView}
            profileId={profileId}
            token={token}
          />
        )}
        {view === "Home_AddPost" && (
          <Home_AddPost setView={setView} backpage={backpage} token={token} />
        )}
        {view === "Home_PostDetail" && (
          <Home_PostDetail
            postId={postId}
            setView={setView}
            setProfileId={setProfileId}
            backpage={backpage}
            token={token}
            user={user}
          />
        )}
        {view === "Home_ProfileDetail" && (
          <Home_ProfileDetail
            token={token}
            user={user}
            setView={setView}
            setPostId={setPostId}
            profileId={profileId}
            setProfileId={setProfileId}
            setBackpage={setBackpage}
          />
        )}
        {view === "Home_Chatroom" && (
          <Home_Chatroom
            token={token}
            selectedFriendId={selectedFriendId}
            user={user}
            setView={setView}
            backpage={backpage}
          />
        )}
        {view === "Home_UserManagement" && (
          <Home_UserManagement
            token={token}
            currentUser={user}
            // selectedFriendId={selectedFriendId}
            setProfileId={setProfileId}
            setView={setView}
            setBackpage={setBackpage}
          />
        )}
        {view === "Home_Left" && (
          <Home_Left
            token={token}
            view={view}
            setView={setView}
            setSelectedFriendId={setSelectedFriendId}
            setBackpage={setBackpage}
            user={user}
          />
        )}
        {view === "Home_Right" && (
          <Home_Right token={token} setView={setView} />
        )}
      </div>
    </div>
  );
}
