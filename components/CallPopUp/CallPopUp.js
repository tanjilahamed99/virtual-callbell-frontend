"use client";

import { useCall } from "@/provider/SoketProvider";
import { useEffect, useState, useRef } from "react";

export default function CallPopup() {
  const { incomingCall, declineCall, acceptCall, modalOpen } = useCall();
  const [canPlaySound, setCanPlaySound] = useState(false);
  const audioRef = useRef(null);

  // Enable sound on first user interaction
  useEffect(() => {
    const enableSound = () => setCanPlaySound(true);
    window.addEventListener("click", enableSound, { once: true });
    return () => window.removeEventListener("click", enableSound);
  }, []);

  // Play / stop ringtone
  useEffect(() => {
    if (!incomingCall || !canPlaySound) return;

    // Create audio only once
    if (!audioRef.current) {
      audioRef.current = new Audio("/ring.mp3");
      audioRef.current.loop = true;
    }

    // Play audio if modal is open
    if (modalOpen) {
      audioRef.current.play().catch((err) => console.log("Autoplay prevented:", err));
    } else {
      // Stop audio when modal closes
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Cleanup when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [incomingCall, canPlaySound, modalOpen]);

  if (!incomingCall) return null;

  return (
    <>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white w-80 rounded-3xl shadow-2xl flex flex-col items-center p-6">
            {/* Pulsing ring effect */}
            <div className="relative mb-4">
              <div className="absolute inset-0 rounded-full bg-green-400 opacity-30 animate-ping"></div>
              <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping delay-200"></div>
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center z-10">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-4.553a2 2 0 012.828 0l.172.172a2 2 0 010 2.828L18 12m0 0l4.553 4.553a2 2 0 010 2.828l-.172.172a2 2 0 01-2.828 0L15 14m3-2H9"
                  />
                </svg>
              </div>
            </div>

            {/* Caller info */}
            <h2 className="text-xl font-bold mb-1 text-black">Incoming Call</h2>
            <p className="text-gray-700 mb-6">{incomingCall.from.name}</p>

            {/* Accept / Decline buttons */}
            <div className="flex gap-6">
              <button
                onClick={acceptCall}
                className="bg-green-500 px-6 py-2 rounded-full text-white font-semibold shadow-md hover:bg-green-600 transition">
                Accept
              </button>
              <button
                onClick={declineCall}
                className="bg-red-500 px-6 py-2 rounded-full text-white font-semibold shadow-md hover:bg-red-600 transition">
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
