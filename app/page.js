"use client";

import Navbar from "@/components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useGlobal } from "reactn";

// Connect socket
const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

export default function Home() {
  const [username, setUsername] = useState("");
  const [incomingCall, setIncomingCall] = useState(null);
  const [guestName, setGuestName] = useState("");
  const [callTo, setCallTo] = useState(""); // Registered user to call
  const [waitingCall, setWaitingCall] = useState(false); // Guest waiting for call to be accepted
  const [user] = useGlobal("user"); // Logged-in registered user

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to socket server:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Connection error:", err.message);
    });

    // Registered user receives incoming call
    socket.on("incoming-call", ({ from, roomName }) => {
      setIncomingCall({ from, roomName });
    });

    // Guest is notified if call is accepted
    socket.on("call-accepted", ({ roomName }) => {
      setWaitingCall(false);
      window.location.href = `/room?roomName=${roomName}&username=${
        guestName || "Guest"
      }`;
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-accepted");
    };
  }, [guestName]);

  // Register user automatically if logged in
  useEffect(() => {
    if (user) {
      setUsername(user.name);
      socket.emit("register", user.id); // Only send ID
    }
  }, [user]);

  // Guest calls a registered user
  const callRegisteredUser = () => {
    if (!callTo.trim()) return;

    const roomName = `call_guest_${callTo}_${Date.now()}`;
    setWaitingCall(true); // Show guest "ringing" modal
    socket.emit("guest-call", {
      from: guestName || "Guest",
      to: callTo, // this should be the ID of the registered user
      roomName,
    });
  };

  // Accept call (for registered user)
  const acceptCall = () => {
    socket.emit("call-accepted", {
      roomName: incomingCall.roomName,
      guestSocketId: incomingCall.from.socketId,
    });
    window.location.href = `/room?roomName=${incomingCall.roomName}&username=${username}`;
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center text-black bg-gray-100 p-4">
        {/* Registered user */}
        {username ? (
          <div className="w-full max-w-lg bg-white text-black shadow-lg rounded-xl p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">
              Welcome, {username} 👋
            </h2>
            <p className="text-gray-500">
              You are online and waiting for calls…
            </p>
          </div>
        ) : (
          /* Guest */
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
              placeholder="Enter Registered User's ID"
              value={callTo}
              onChange={(e) => setCallTo(e.target.value)}
              className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={callRegisteredUser}
              className="w-full bg-green-600 text-white rounded-lg py-2 font-semibold hover:bg-green-700 transition">
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
                <span className="text-blue-600">{incomingCall?.from.name}</span>
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={acceptCall}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                  Accept
                </button>
                <button
                  onClick={() => setIncomingCall(null)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                  Decline
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Guest waiting modal */}
        {waitingCall && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-sm text-center">
              <p className="text-lg font-semibold mb-4">
                📞 Calling {callTo}… Waiting for them to pick up
              </p>
              <button
                onClick={() => setWaitingCall(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                Cancel Call
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
