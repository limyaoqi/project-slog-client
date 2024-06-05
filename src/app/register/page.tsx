"use client";

import { RegisterForm } from "@/components/Form";
import { register } from "@/utils/api_users";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";

export default function RegisterPage() {
  const { enqueueSnackbar } = useSnackbar();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      // console.log(data);
      enqueueSnackbar("Register Successfully", { variant: "success" });
      router.push("/login");
    },
    onError: (error: any) => {
      // console.log(error.response.data.msg)
      enqueueSnackbar(error.response.data.msg, { variant: "error" });
    },
  });

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Password and confirm password should be match");
      return;
    }
    registerMutation.mutate({
      username,
      email,
      password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-300 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl text-gray-800 font-bold mb-6">Register</h1>
        <RegisterForm
          username={username}
          setUsername={setUsername}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          handleRegister={handleRegister}
          error={error}
        />
        <p className="mt-4 text-sm text-center text-gray-600">
          {"Already have an account? "}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-500">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
