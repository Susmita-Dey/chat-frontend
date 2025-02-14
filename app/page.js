"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(() => {
    return typeof window !== "undefined" ? localStorage.getItem("token") : "";
  });

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://chat-backend-ovra.onrender.com/api/auth/local",
        {
          identifier,
          password,
        }
      );

      const token = response.data.jwt;
      const user = response.data.user;

      setToken(token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      alert("Login successful!");

      // Delay navigation slightly to avoid issues
      setTimeout(() => {
        router.push("/chat");
      }, 100);
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="container mx-auto flex justify-center items-center h-screen">
      <div className="flex flex-col items-center max-w-md w-full p-4 border border-gray-500 rounded shadow-lg shadow-gray-700 gradient-card">
        <h2 className="text-2xl mt-2 font-bold gradient-text">
          Welcome to Ayna Chat App
        </h2>
        <p className="text-base mt-1.5 text-gray-900">
          Please login to continue
        </p>
        <form
          className="flex flex-col my-8 space-y-4 w-full px-4"
          onSubmit={handleLogin}
        >
          <span className="flex flex-col space-y-1">
            <label
              htmlFor="email"
              className="text-base text-gray-900 font-medium"
            >
              Username or Email<span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="john or john@doe.com"
              className="border border-gray-300 rounded p-2"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </span>
          <span className="flex flex-col space-y-1">
            <label
              htmlFor="password"
              className="text-base text-gray-900 font-medium"
            >
              Password<span className="text-red-600">*</span>
            </label>
            <input
              type="password"
              placeholder="Password"
              className="border border-gray-300 rounded p-2 mt-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </span>
          <button
            type="submit"
            className="bg-gray-950 text-white rounded w-full p-2 mt-4"
          >
            Login
          </button>
        </form>
        <span className="text-gray-900 text-sm font-mono font-bold">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-900">
            Sign up
          </Link>
        </span>
      </div>
    </div>
  );
}
