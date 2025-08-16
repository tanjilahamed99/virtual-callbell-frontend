"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";

// 👇 Explicitly point to backend server
const socket = io("http://localhost:5000", {
  transports: ["websocket"], // makes connection stable
});

export default function Home() {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [incomingCall, setIncomingCall] = useState(null);

  console.log('connected')

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to socket server:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Connection error:", err.message);
    });

    socket.on("users", setUsers);
    socket.on("incoming-call", ({ from, roomName }) => {
      setIncomingCall({ from, roomName });
    });

    // cleanup on unmount
    return () => {
      socket.off("users");
      socket.off("incoming-call");
    };
  }, []);

  const registerUser = () => {
    if (!username.trim()) return;
    socket.emit("register", username);
  };

  const callUser = (user) => {
    const roomName = `call_${username}_${user}_${Date.now()}`;
    socket.emit("call-user", { from: username, to: user, roomName });
    window.location.href = `/room?roomName=${roomName}&username=${username}`;
  };

  const acceptCall = () => {
    window.location.href = `/room?roomName=${incomingCall.roomName}&username=${username}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-black bg-gray-100 p-4">
      {!username ? (
        <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center mb-4">Join Call App</h1>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={registerUser}
            className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition"
          >
            Join
          </button>
        </div>
      ) : (
        <div className="w-full max-w-lg bg-white text-black shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Online Users</h2>
          {users.filter((u) => u !== username).length > 0 ? (
            <ul className="space-y-3">
              {users
                .filter((u) => u !== username)
                .map((user) => (
                  <li
                    key={user}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <span className="font-medium text-gray-700">{user}</span>
                    <button
                      onClick={() => callUser(user)}
                      className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
                    >
                      Call
                    </button>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-gray-500">No other users online</p>
          )}
        </div>
      )}

      {incomingCall && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-sm text-center">
            <p className="text-lg font-semibold mb-4">
              📞 Incoming call from <span className="text-blue-600">{incomingCall.from}</span>
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
  );
}
