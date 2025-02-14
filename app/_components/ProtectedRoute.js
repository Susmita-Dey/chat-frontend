"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }) => {
  const [isValidToken, setIsValidToken] = useState(null); // `null` initially to avoid flashing UI
  const router = useRouter();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsValidToken(false);
        return;
      }

      try {
        const response = await fetch(
          "https://chat-backend-ovra.onrender.com/api/users/me",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsValidToken(false);
        } else {
          setIsValidToken(true);
        }
      } catch (error) {
        console.error("Token validation error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsValidToken(false);
      }
    };

    validateToken();
  }, []); // 🔹 Remove `token` dependency to prevent infinite loops

  if (isValidToken === null) {
    return (
      <div className="flex flex-col space-y-3 items-center justify-center h-screen text-center">
        <h2 className="text-4xl font-bold text-gray-900">Loading...</h2>
        <p className="mt-2 text-xl text-gray-700">Please wait</p>
      </div>
    )
  }

  if (!isValidToken) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-4xl font-bold text-red-600">Unauthorized Access</h1>
        <p className="mt-2 text-lg text-gray-600">
          You need to log in to access this page.
        </p>
        <button
          className="mt-4 px-6 py-2 text-white bg-gray-950 rounded-md hover:bg-gray-800"
          onClick={() => router.push("/")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return <main>{children}</main>;
};

export default ProtectedRoute;
