"use client"

import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io();

export default function Home() {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [incomingCall, setIncomingCall] = useState(null);

  useEffect(() => {
    socket.on("users", setUsers);
    socket.on("incoming-call", ({ from, roomName }) => {
      setIncomingCall({ from, roomName });
    });
  }, []);

  const registerUser = () => {
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
    <div>
      {!username ? (
        <>
          <input
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={registerUser}>Join</button>
        </>
      ) : (
        <div>
          <h2>Online Users</h2>
          <ul>
            {users.filter(u => u !== username).map((user) => (
              <li key={user}>
                {user} <button onClick={() => callUser(user)}>Call</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {incomingCall && (
        <div style={{ background: "#eee", padding: "10px" }}>
          <p>Incoming call from {incomingCall.from}</p>
          <button onClick={acceptCall}>Accept</button>
        </div>
      )}
    </div>
  );
}
