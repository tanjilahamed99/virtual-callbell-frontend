"use client";

import Navbar from "@/components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useGlobal } from "reactn";

// connect socket
const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

export default function Home() {
  const [username, setUsername] = useState("");
  const [incomingCall, setIncomingCall] = useState(null);
  const [guestName, setGuestName] = useState("");
  const [callTo, setCallTo] = useState(""); // registered user to call
  const [user] = useGlobal("user"); // logged in registered user details

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to socket server:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Connection error:", err.message);
    });

    // for registered user -> listen for incoming calls
    socket.on("incoming-call", ({ from, roomName }) => {
      setIncomingCall({ from, roomName });
    });

    return () => {
      socket.off("incoming-call");
    };
  }, []);

  // register user automatically if logged in
  useEffect(() => {
    if (user?.name) {
      setUsername(user.name);
      socket.emit("register", user.name);
    }
  }, [user]);

  // guest calling registered user
  const callRegisteredUser = () => {
    if (!callTo.trim()) return;
    const roomName = `call_guest_${callTo}_${Date.now()}`;
    socket.emit("call-user", {
      from: guestName || "Guest",
      to: callTo,
      roomName,
    });
    window.location.href = `/room?roomName=${roomName}&username=${guestName || "Guest"}`;
  };

  // accept call (for registered user)
  const acceptCall = () => {
    window.location.href = `/room?roomName=${incomingCall.roomName}&username=${username}`;
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center text-black bg-gray-100 p-4">
        {/* If registered user */}
        {username ? (
          <div className="w-full max-w-lg bg-white text-black shadow-lg rounded-xl p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">
              Welcome, {username} 👋
            </h2>
            <p className="text-gray-500">You are online and waiting for calls…</p>
          </div>
        ) : (
          /* If guest */
          <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-sm">
            <h1 className="text-2xl font-bold text-center mb-4">Guest Call</h1>
            <input
              type="text"
              placeholder="Your Name (Guest)"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Enter Registered User's Username"
              value={callTo}
              onChange={(e) => setCallTo(e.target.value)}
              className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={callRegisteredUser}
              className="w-full bg-green-600 text-white rounded-lg py-2 font-semibold hover:bg-green-700 transition"
            >
              📞 Call Registered User
            </button>
          </div>
        )}

        {/* Incoming call popup for registered users */}
        {incomingCall && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-sm text-center">
              <p className="text-lg font-semibold mb-4">
                📞 Incoming call from{" "}
                <span className="text-blue-600">{incomingCall.from}</span>
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={acceptCall}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Accept
                </button>
                <button
                  onClick={() => setIncomingCall(null)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
