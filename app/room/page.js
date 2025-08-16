"use client";
import { useEffect, useRef, useState } from "react";
import { Room, RoomEvent, createLocalTracks } from "livekit-client";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  ThumbsUp,
  Laugh,
  Heart,
} from "lucide-react"; // nice clean icons

export default function RoomPage() {
  const remoteContainerRef = useRef(null);
  const localVideoRef = useRef(null);
  const [room, setRoom] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [showReaction, setShowReaction] = useState(null);

  useEffect(() => {
    const joinRoom = async () => {
      const params = new URLSearchParams(window.location.search);
      const roomName = params.get("roomName");
      const username = params.get("username");

      // Get token
      const res = await fetch(
        `http://localhost:5000/get-token?roomName=${roomName}&username=${username}`
      );
      const { token } = await res.json();

      // Create room
      const room = new Room();
      setRoom(room);

      await room.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL, token);

      // Publish local tracks
      const tracks = await createLocalTracks({ audio: true, video: true });
      tracks.forEach((track) => {
        room.localParticipant.publishTrack(track);
        if (track.kind === "video") {
          const el = track.attach();
          el.className = "w-48 h-32 rounded-lg object-cover";
          localVideoRef.current.innerHTML = "";
          localVideoRef.current.appendChild(el);
        }
      });

      // Show remote videos
      room.on(RoomEvent.TrackSubscribed, (track) => {
        if (track.kind === "video") {
          const el = track.attach();
          el.className = "w-full h-full object-cover rounded-lg shadow-md";
          remoteContainerRef.current.appendChild(el);
        }
      });
    };

    joinRoom();
  }, []);

  // Toggle mic (disable/enable actual track)
  const toggleMic = () => {
    if (!room) return;
    room.localParticipant.audioTracks.forEach((pub) => {
      if (pub.track) {
        pub.track.setEnabled(!isMicOn);
      }
    });
    setIsMicOn(!isMicOn);
  };

  // Toggle camera (disable/enable actual track)
  const toggleCam = () => {
    if (!room) return;
    room.localParticipant.videoTracks.forEach((pub) => {
      if (pub.track) {
        pub.track.setEnabled(!isCamOn);
      }
    });
    setIsCamOn(!isCamOn);
  };

  // Leave room
  const leaveRoom = () => {
    room?.disconnect();
    window.location.href = "/";
  };

  // Show reaction bubble
  const sendReaction = (emoji) => {
    setShowReaction(emoji);
    setTimeout(() => setShowReaction(null), 2000);
  };

  return (
    <div className="relative h-screen w-full bg-gray-900 text-white flex flex-col">
      {/* Remote Video */}
      <div
        ref={remoteContainerRef}
        className="flex-1 flex items-center justify-center bg-black"
      />

      {/* Local Video */}
      <div
        ref={localVideoRef}
        className="absolute top-4 right-4 w-48 h-32 rounded-lg overflow-hidden shadow-lg border-2 border-white"
      />

      {/* Reaction bubble */}
      {showReaction && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-6xl animate-bounce">
          {showReaction}
        </div>
      )}

      {/* Control Bar */}
      <div className="p-4 bg-gray-800 flex justify-center space-x-4">
        {/* Mic */}
        <button
          onClick={toggleMic}
          className={`p-3 rounded-full ${
            isMicOn
              ? "bg-green-600 hover:bg-green-500"
              : "bg-red-600 hover:bg-red-500"
          }`}>
          {isMicOn ? (
            <Mic className="w-6 h-6" />
          ) : (
            <MicOff className="w-6 h-6" />
          )}
        </button>

        {/* Camera */}
        <button
          onClick={toggleCam}
          className={`p-3 rounded-full ${
            isCamOn
              ? "bg-green-600 hover:bg-green-500"
              : "bg-red-600 hover:bg-red-500"
          }`}>
          {isCamOn ? (
            <Video className="w-6 h-6" />
          ) : (
            <VideoOff className="w-6 h-6" />
          )}
        </button>

        {/* Leave */}
        <button
          onClick={leaveRoom}
          className="p-3 rounded-full bg-red-700 hover:bg-red-600">
          <PhoneOff className="w-6 h-6" />
        </button>

        {/* Reactions */}
        <button
          onClick={() => sendReaction("👍")}
          className="p-3 rounded-full bg-blue-600 hover:bg-blue-500">
          <ThumbsUp className="w-6 h-6" />
        </button>
        <button
          onClick={() => sendReaction("😂")}
          className="p-3 rounded-full bg-yellow-500 hover:bg-yellow-400">
          <Laugh className="w-6 h-6" />
        </button>
        <button
          onClick={() => sendReaction("❤️")}
          className="p-3 rounded-full bg-pink-600 hover:bg-pink-500">
          <Heart className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
