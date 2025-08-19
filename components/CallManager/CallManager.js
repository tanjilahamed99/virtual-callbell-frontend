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
  const [waitingCall, setWaitingCall] = useState(false);
  const [user] = useGlobal("user");
  const router = useRouter();
  const guestName = localStorage.getItem("guestName");

  useEffect(() => {
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
      router.push("/");
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-accepted");
      socket.off("call-declined");
    };
  }, [guestName, user, router]);

  const callRegisteredUser = useCallback(() => {
    if (!userId.trim()) return;

    const roomName = `call_guest_${userId}_${Date.now()}`;
    setWaitingCall(true);

    socket.emit("guest-call", {
      from: guestName || "Guest",
      to: userId,
      roomName,
    });
  }, [userId, guestName]);

  const handleCloseCall = useCallback(() => {
    socket.emit("callCanceled", { userId });
    setWaitingCall(false);
  }, [userId]);

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

      {/* Waiting Modal */}
      {waitingCall && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-sm text-center">
            <p className="text-lg font-semibold mb-4 text-black">
              📞 Calling {userName}… Waiting for them to pick up
            </p>
            <button
              onClick={handleCloseCall}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
              Cancel Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
