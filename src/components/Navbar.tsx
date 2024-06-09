"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { logout } from "@/utils/api_users";
import { deleteCookie, getCookie } from "cookies-next";
import Link from "next/link";
import { useSnackbar } from "notistack";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User } from "@/utils/interface";
import { getProfile } from "@/utils/api_profile";

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

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile", token],
    queryFn: () => getProfile(token),
  });
  const { profile } = data;

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      enqueueSnackbar("Logout Successfully", { variant: "success" });
      deleteCookie("currentUser");
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

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav className="py-2 px-7 flex w-full items-center justify-between border-2 border-white lg:rounded-3xl rounded-t-3xl lg:bg-inherit bg-gray-800 hover:bg-gray-900 transition duration-300 ease-in-out">
      <div className="relative w-full" ref={dropdownRef}>
        {dropdownOpen && (
          <div className="lg:absolute lg:p-4 lg:shadow-xl lg:bg-backgroundGray lg:border-2 text-white lg:bottom-full lg:right-0 lg:mb-2 py-2 w-48 rounded-t-md  w-full z-20">
            <button
              onClick={() => {
                setView("Home_Post");
                setDropdownOpen(false);
              }}
              className="block w-full text-left mb-2 px-4 py-2  hover:bg-gray-950 hover:text-white rounded-lg transition duration-200 ease-in-out border-2  border-b-indigo-500 "
            >
              Home
            </button>
            <button
              onClick={() => {
                setView("Home_ProfileDetail");
                setProfileId(user._id);
              }}
              className="block w-full text-left mb-2 px-4 py-2  hover:bg-gray-950  hover:text-white rounded-lg transition duration-200 ease-in-out border-2  border-b-indigo-500 "
            >
              My Profile
            </button>
            <button
              onClick={() => setView("Home_AddPost")}
              className="block w-full text-left mb-2 px-4 py-2  hover:bg-gray-950  hover:text-white rounded-lg transition duration-200 ease-in-out border-2  border-b-indigo-500"
            >
              Add Post
            </button>
            <div className="lg:hidden">
              <button
                onClick={() => setView("Home_Left")}
                className="block w-full text-left mb-2 px-4 py-2 hover:bg-gray-950 hover:text-white rounded-lg transition duration-200 ease-in-out border-2 border-b-indigo-500"
              >
                Friend List
              </button>
              <button
                onClick={() => setView("Home_Right")}
                className="block w-full text-left mb-2 px-4 py-2 hover:bg-gray-950 hover:text-white rounded-lg transition duration-200 ease-in-out border-2 border-b-indigo-500"
              >
                Notifications
              </button>
            </div>
            {user && (user.role === "superAdmin" || user.role === "admin") && (
              <button
                onClick={() => setView("Home_UserManagement")}
                className="block w-full text-left mb-2 px-4 py-2  hover:bg-gray-950  hover:text-white rounded-lg transition duration-200 ease-in-out border-2  border-b-indigo-500"
              >
                User Management
              </button>
            )}
            <button
              onClick={handleLogout}
              className="block w-full text-left mb-2 px-4 py-2  hover:bg-gray-950  hover:text-white rounded-lg transition duration-200 ease-in-out border-2  border-b-indigo-500"
            >
              Logout
            </button>
          </div>
        )}
        <div className="flex  items-center justify-between w-full">
          <div className="text-white text-2xl font-bold w-1/5">
            <Link href="/">SLog</Link>
          </div>
          <button onClick={toggleDropdown} className="focus:outline-none">
            <div className="w-12 h-12 mr-4">
              {user && (
                <Image
                  className="rounded-full h-full"
                  src={`http://localhost:2000/${profile?.avatar}`}
                  alt={`${user?.username} avatar`}
                  width={999}
                  height={999}
                />
              )}
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}
