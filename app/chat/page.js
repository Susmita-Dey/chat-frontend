"use client";
import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import ProtectedRoute from "../_components/ProtectedRoute";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:1337");

    socket.current.on("message", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: data.sender || "Server", text: data.text },
      ]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        "https://chat-backend-ovra.onrender.com/api/chat-messages",
        {
          method: "GET", headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const data = await response.json();
      if (data && data.data) {
        setMessages(
          data.data.map((item) => ({
            sender: item.username,
            text: item.message,
          }))
        );
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");

      if (!user || !token || !user.id) {
        alert("You are not logged in. Please log in to send messages.");
        return;
      }

      console.log("Sending message with user ID:", user.id);
      console.log("Token:", token);

      const response = await fetch(
        "https://chat-backend-ovra.onrender.com/api/chat-messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              message: message,
              users_permissions_user: user.id,
              timestamp: new Date().toISOString(),
            },
          }),
        }
      );
      console.log(user.id);

      const result = await response.json();
      console.log("API Response:", result);

      if (!response.ok) {
        console.log("Failed to send message.");
        return;
      }

      setMessages((prevMessages) => [...prevMessages, { sender: user.username, text: message }]);
      setMessage("");
    } catch (error) {
      alert("Error sending message.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    socket.current.disconnect();
    window.location.href = "/";
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto flex justify-center items-center h-screen">
        <div className="w-full max-w-xl flex flex-col h-full p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Welcome to the Chat</h2>
            <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleLogout}>
              Logout
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex flex-col flex-grow overflow-y-auto border border-gray-300 rounded p-4">
            {messages.map((msg, idx) => (
              <div key={idx} className="mb-2">
                <span className="font-bold">{msg.sender ? msg.sender : "Server"}: </span>
                <span>{msg.text}</span>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="flex mt-4 space-x-2">
            <input
              type="text"
              className="border border-gray-300 p-2 flex-grow"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button className="bg-black text-white px-4 py-2 rounded" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Chat;
