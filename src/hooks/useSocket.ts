import { useEffect } from "react";
import { getSocket, initializeSocket } from "../app/socket/socket";

export const useSocket = () => {
  useEffect(() => {
    const socket = initializeSocket();

    return () => {
      // Don't disconnect on unmount - keep connection alive
      // Only disconnect on logout
    };
  }, []);

  return getSocket();
};
