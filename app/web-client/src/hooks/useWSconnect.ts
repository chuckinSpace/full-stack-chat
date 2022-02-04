import { useEffect, useState } from "react";
import socketIOClient, { Socket } from "socket.io-client";

export const useWSConnect = () => {
  const [WSSocket, setWSSocket] = useState<Socket>();

  useEffect(() => {
    let wsSocket: Socket;

    wsSocket = socketIOClient("http://localhost:3500/chat");

    setWSSocket(wsSocket);

    return () => {
      if (wsSocket) {
        wsSocket.disconnect();
      }
    };
  }, []);

  return WSSocket;
};
