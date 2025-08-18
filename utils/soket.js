import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
  transports: ["websocket"],
  autoConnect: true,
});

export default socket;
