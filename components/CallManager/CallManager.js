"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useGlobal } from "reactn";
import socket from "@/utils/soket";
import Swal from "sweetalert2";

export default function CallManager({
  userId,
  userName = "Virtual-callbell-user",
}) {
  const [incomingCall, setIncomingCall] = useState(null);
  const [guestName, setGuestName] = useState("");
  const [callTo, setCallTo] = useState("");
  const [waitingCall, setWaitingCall] = useState(false);
  const [user] = useGlobal("user");
  const router = useRouter();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to socket server:", socket.id);
    });

    if (user) {
      socket.emit("register", user?.id);
    }

    socket.on("incoming-call", ({ from, roomName }) => {
      setIncomingCall({ from, roomName });
    });

    socket.on("call-accepted", ({ roomName, peerSocketId }) => {
      setWaitingCall(false);
      router.push(
        `/room?roomName=${roomName}&username=${
          guestName || "Guest"
        }&peerSocketId=${peerSocketId}`
      );
    });

    // 👇 Guest hears decline
    socket.on("call-declined", () => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Your call was declined",
      });
      setWaitingCall(false); // hide waiting modal
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-accepted");
      socket.off("call-declined");
    };
  }, [guestName, user, router]);

  const declineCall = useCallback(() => {
    if (!incomingCall) return;

    socket.emit("call-declined", {
      guestSocketId: incomingCall.from.socketId,
    });

    setIncomingCall(null); // close popup for registered user
  }, [incomingCall]);

  const callRegisteredUser = useCallback(() => {
    if (!callTo.trim()) return;

    const roomName = `call_guest_${callTo}_${Date.now()}`;
    setWaitingCall(true);

    socket.emit("guest-call", {
      from: guestName || "Guest",
      to: callTo,
      roomName,
    });
  }, [callTo, guestName]);

  const acceptCall = useCallback(() => {
    if (!incomingCall) return;

    socket.emit("call-accepted", {
      roomName: incomingCall.roomName,
      guestSocketId: incomingCall.from.socketId,
    });

    router.push(
      `/room?roomName=${incomingCall.roomName}&username=${user?.name}&peerSocketId=${incomingCall.from.socketId}`
    );
  }, [incomingCall, router, user]);

  return (
    <div className="flex gap-5 items-center justify-center w-full">
      <button
        onClick={callRegisteredUser}
        className="w-[70%] bg-green-600 text-white rounded-lg py-2 font-semibold hover:bg-green-700 transition">
        📞 Call {userName}
      </button>
      <button
        onClick={() => router.back()}
        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow hover:bg-gray-300 w-[30%]">
        Back
      </button>

      {/* Incoming Call Modal */}
      {incomingCall && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-sm text-center">
            <p className="text-lg font-semibold mb-4">
              📞 Incoming call from{" "}
              {/* <span className="text-blue-600">{incomingCall.from.name}</span> */}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={acceptCall}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                Accept
              </button>
              <button
                onClick={declineCall}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Waiting Modal */}
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
  );
}
