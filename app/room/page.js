"use client";
import { useEffect, useRef } from "react";
import { Room, RoomEvent, createLocalTracks } from "livekit-client";

export default function RoomPage() {
  const videoRef = useRef(null);

  useEffect(() => {
    const joinRoom = async () => {
      const params = new URLSearchParams(window.location.search);
      const roomName = params.get("roomName");
      const username = params.get("username");

      // Get LiveKit token
      const res = await fetch(`https://backend-brown-iota.vercel.app/get-token?roomName=hello&username=tanjkil`);
      const { token } = await res.json();

      console.log(token);

      // Create a LiveKit room instance
      const room = new Room();

      // Connect to the room
      await room.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL, token);

      // Publish local camera & mic
      const tracks = await createLocalTracks({
        audio: true,
        video: true,
      });
      for (const track of tracks) {
        await room.localParticipant.publishTrack(track);
      }

      // Show remote participants’ video
      room.on(RoomEvent.TrackSubscribed, (track) => {
        if (track.kind === "video") {
          videoRef.current.appendChild(track.attach());
        }
      });
    };

    joinRoom();
  }, []);

  return <div ref={videoRef} />;
}
