"use client";
import Home from "@/components/Home/Home";
import ReactQueryProvider from "./QueryClientProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { User } from "@/utils/interface";

export default function Main() {
  const router = useRouter();
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUserString = getCookie("currentUser");
    if (!currentUserString) {
      router.push("/login");
    } else {
      const currentUser = JSON.parse(currentUserString);
      const { token, user } = currentUser;
      if (!user.profileId || user.profileId === "") {
        router.push("/addprofile");
      }
      setToken(token);
      setUser(user);
    }
  }, []);

  console.log(user);

  return (
    // <ReactQueryProvider>
    <Home token={token} user={user} />
    // </ReactQueryProvider>
  );
}
