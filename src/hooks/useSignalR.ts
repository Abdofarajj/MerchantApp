import {
  createSignalRConnection,
  stopSignalRConnection,
} from "../services/SignalR";
import { useSignalRStore } from "../store/signalR.store";

export const useSignalR = () => {
  const { balance, connected } = useSignalRStore();

  const start = async () => {
    try {
      await createSignalRConnection();
    } catch (error) {
      console.error("Failed to start SignalR connection:", error);
    }
  };

  const stop = async () => {
    try {
      await stopSignalRConnection();
    } catch (error) {
      console.error("Failed to stop SignalR connection:", error);
    }
  };

  return {
    balance,
    connected,
    start,
    stop,
  };
};
