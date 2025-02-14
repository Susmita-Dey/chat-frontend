"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://chat-backend-ovra.onrender.com/api/auth/local/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Registration successful
        alert("Registration successful! Please login.");
        router.push("/");
      } else {
        // Registration failed
        alert(data.error?.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred during registration. Please try again.");
    }
  };

  return (
    <div className="container mx-auto flex justify-center items-center h-screen">
      <div className="flex flex-col items-center max-w-md w-full p-4 border border-gray-500 rounded shadow-lg shadow-gray-700 gradient-card">
        <h2 className="text-2xl mt-2 font-bold gradient-text">Welcome to Ayna Chat App</h2>
        <p className="text-base mt-1.5 text-gray-900">
          Create an account to continue
        </p>
        <form
          className="flex flex-col my-8 space-y-4 w-full px-4"
          onSubmit={handleSignup}
        >
          <span className="flex flex-col space-y-1">
            <label
              htmlFor="username"
              className="text-base text-gray-900 font-medium"
            >
              Username<span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="border border-gray-300 rounded p-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </span>
          <span className="flex flex-col space-y-1">
            <label
              htmlFor="email"
              className="text-base text-gray-900 font-medium"
            >
              Email Address<span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              placeholder="john@doe.com"
              className="border border-gray-300 rounded p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            Sign Up
          </button>
        </form>
        <span className="text-gray-900 text-sm font-mono font-bold">
          Already have an account?{" "}
          <Link href="/" className="text-blue-900">
            Sign in
          </Link>
        </span>
      </div>
    </div>
  );
}
