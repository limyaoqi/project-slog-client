"use client";

// pages/login.js
import { useState } from "react";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/utils/api_users";
import { useSnackbar } from "notistack";
import { LoginForm } from "@/components/Form";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (!data.user.profileId) {
        data.user.profileId = "";
      }
      setCookie("currentUser", JSON.stringify(data), { maxAge: 3600 * 24 });
      enqueueSnackbar("Login Successfully", { variant: "success" });
      if (data.user.firstLogin) {
        router.push("/addprofile");
      } else {
        router.push("/");
      }
    },
    onError: (error: any) => {
      // console.log(error.response.data.msg)
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    if (email === "" || password === "") {
      enqueueSnackbar("Please insert all the form", {
        variant: "error",
      });
    } else {
      e.preventDefault();
      loginMutation.mutate({
        email,
        password,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="bg-gray-300 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl text-gray-800 font-bold mb-6">
          Welcome to SLog
        </h1>
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
          error={error}
        />
        <p className="mt-4 text-sm text-center text-gray-600">
          {"Don't have an account?  "}
          <Link
            href="/register"
            className="text-indigo-600 hover:text-indigo-500"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
