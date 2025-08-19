"use client";

// providers/CallProvider.jsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
// import { useSocket } from "./SocketProvider";
import { useRouter } from "next/navigation";
import { useGlobal } from "reactn";
import socket from "@/utils/soket";

const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const router = useRouter();
  const [incomingCall, setIncomingCall] = useState(null);
  const [user] = useGlobal("user");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!socket || !user) return;

    socket.on("connection", () => {
      console.log("✅ Socket connected");
    });

    if (user) {
      socket.emit("register", user.id);
    }

    socket.on("incoming-call", ({ from, roomName }) => {
      setIncomingCall({ from, roomName });
      setModalOpen(true);
    });

    socket.on("call-accepted", ({ roomName, peerSocketId }) => {
      router.push(
        `/room?roomName=${roomName}&username=${user.name}&peerSocketId=${peerSocketId}`
      );
    });

    socket.on("call-declined", () => {
      alert("Your call was declined");
    });

    socket.on("callCanceled", (data) => {
      // Check if the canceled call matches the incoming call
      // if (incomingCall && incomingCall.from.id === data.from) {
      //   setModalOpen(false);
      // }
      console.log(data);
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-accepted");
      socket.off("call-declined");
      socket.off("callCanceled");
    };
  }, [user, router, incomingCall]);

  const declineCall = useCallback(() => {
    if (!incomingCall) return;
    socket.emit("call-declined", { guestSocketId: incomingCall.from.socketId });
    setModalOpen(false);
    setIncomingCall(null);
  }, [incomingCall]);

  const acceptCall = useCallback(() => {
    if (!incomingCall) return;
    socket.emit("call-accepted", {
      roomName: incomingCall.roomName,
      guestSocketId: incomingCall.from.socketId,
    });
    setModalOpen(false);
    router.push(
      `/room?roomName=${incomingCall.roomName}&username=${user.name}&peerSocketId=${incomingCall.from.socketId}`
    );
  }, [incomingCall, router, user]);

  const data = {
    incomingCall,
    declineCall,
    acceptCall,
    modalOpen,
  };
  return <CallContext.Provider value={data}>{children}</CallContext.Provider>;
};

export const useCall = () => useContext(CallContext);
