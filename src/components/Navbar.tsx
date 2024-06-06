"use client";

import { useMutation } from "@tanstack/react-query";
import { logout } from "@/utils/api_users";
import { deleteCookie, getCookie } from "cookies-next";
import Link from "next/link";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User } from "@/utils/interface";

interface NavbarProps {
  setView: (view: string) => void;
  setProfileId: (view: string) => void;
  token: string;
  user: User;
  goLogin: () => void;
}

export default function Navbar({
  setView,
  token,
  user,
  goLogin,
  setProfileId,
}: NavbarProps) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatar, setAvatar] = useState("");

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    if (user) {
      setAvatar(user.profileId.avatar);
    }
  }, [user]);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      enqueueSnackbar("Logout Successfully", { variant: "success" });
      deleteCookie("currentUser");
      // goLogin();
      router.push("/login");
    },
    onError: (error: any) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logoutMutation.mutate({ token });
    }
  };
  return (
    <nav className="py-2 px-7 flex w-full items-center justify-between border-2 border-customGray rounded-3xl">
      <div className="text-white text-2xl font-bold w-1/5">
        <Link href="/">SLog</Link>
      </div>
      <div className="relative w-3/10">
        <button onClick={toggleDropdown} className="focus:outline-none">
          <div className="w-12 h-12 mr-4">
            {user && (
              <Image
                className="rounded-full h-full"
                src={`http://localhost:2000/${user.profileId.avatar}`}
                alt={`${user?.username} avatar`}
                width={999}
                height={999}
              />
            )}
          </div>
        </button>
        {dropdownOpen && (
          <div className="absolute bottom-full mb-2 py-2 w-48 rounded-md shadow-xl bg-white z-20">
            <button
              onClick={() => setView("Home_Post")}
              className="block w-full text-left px-4 py-2 text-black hover:bg-customGray hover:text-white"
            >
              Home
            </button>
            <button
              onClick={() => {
                setView("Home_ProfileDetail");
                setProfileId(user._id);
              }}
              className="block w-full text-left px-4 py-2 text-black hover:bg-customGray hover:text-white"
            >
              My Profile
            </button>
            <button
              onClick={() => setView("Home_AddPost")}
              className="block w-full text-left px-4 py-2 text-black hover:bg-customGray hover:text-white"
            >
              Add Post
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-black hover:bg-customGray hover:text-white"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
