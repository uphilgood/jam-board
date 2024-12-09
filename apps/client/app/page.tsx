"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "./contexts/authContext";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();
  const { login, user, token } = useAuth();

  useEffect(() => {
    if (user?.username) {
      router.push("/boards");
    }
  }, [user?.username]);

  const handleGetStarted = () => {
    router.push("/login");
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white shadow-md rounded-lg max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Welcome to <span className="text-blue-600">Jam Board</span>
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Manage your boards, tasks, and work items with ease. Get started by
          logging in to your account.
        </p>
        <button
          onClick={handleGetStarted}
          className="w-full px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-md text-lg font-semibold"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
