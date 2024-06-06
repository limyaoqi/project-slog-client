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
}

export default function Home_Center({
  token,
  user,
  view,
  setView,
  selectedFriendId,
  profileId,
  setProfileId,
  backpage,
  setBackpage,
}: Home_CenterProps) {
  const [postId, setPostId] = useState<string>("");

  return (
    <>
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
        />
      )}
      {view === "Home_ProfileDetail" && (
        <Home_ProfileDetail
          setView={setView}
          setPostId={setPostId}
          profileId={profileId}
          setProfileId={setProfileId}
          setBackpage={setBackpage}
          token={token}
        />
      )}
      {view === "Home_Chatroom" && (
        <Home_Chatroom
          token={token}
          selectedFriendId={selectedFriendId}
          user={user}
        />
      )}
    </>
  );
}
