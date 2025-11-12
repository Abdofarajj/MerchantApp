import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { AppState } from "react-native";
import { Config } from "../../config";
import { useAuthStore } from "../../store/authStore";
import { useSignalRStore } from "../../store/signalR.store";
import { logger } from "../../utils/logger";
import { refresh } from "../auth/service";

let connection: HubConnection | null = null;
let refreshPromise: Promise<any> | null = null;

const getAccessToken = async (): Promise<string> => {
  const token = useAuthStore.getState().token;

  if (!token) {
    throw new Error("No authentication token available");
  }

  // Check if token is expired (simple check - can be enhanced with JWT decoding)
  // For now, assume token is valid if present
  return token;
};

const refreshAccessToken = async (): Promise<string> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = refresh()
    .then((response) => {
      const newToken = response.accessToken;
      useAuthStore.getState().setToken(newToken);
      return newToken;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

const getEntityId = async (): Promise<string> => {
  // Use accountId from userInfo for SignalR group (should be available after login)
  const userInfo = useAuthStore.getState().userInfo;
  if (userInfo?.accountId) {
    return userInfo.accountId.toString();
  }

  // Fallback to userId (should be set during login)
  const userId = useAuthStore.getState().userId;
  if (userId) {
    return userId;
  }

  // If neither is available, throw error (userInfo should be fetched after login)
  logger.error(
    "No entity ID available - userInfo should be fetched after login"
  );
  throw new Error(
    "Unable to determine entity ID for SignalR group - user not properly authenticated"
  );
};

const normalizeBalancePayload = (payload: any): number => {
  if (typeof payload === "number") {
    return payload;
  }
  if (payload && typeof payload.balance === "number") {
    return payload.balance;
  }
  if (payload && typeof payload.amount === "number") {
    return payload.amount;
  }
  logger.warn("Unexpected balance payload shape:", payload);
  return 0;
};

const handleBalanceUpdate = (payload: any) => {
  const balance = normalizeBalancePayload(payload);
  useSignalRStore.getState().setBalance(balance);
  useSignalRStore.getState().setLastPayload(payload);
};

const joinGroup = async (entityId: string) => {
  if (!connection) return;

  try {
    const groupName = `balance-group-${entityId}`;
    await connection.invoke("JoinGroup", groupName);
    logger.log("Joined SignalR group:", groupName);
  } catch (error) {
    logger.error("Failed to join SignalR group:", error);
  }
};

const leaveGroup = async (entityId: string) => {
  if (!connection) return;

  try {
    const groupName = `balance-group-${entityId}`;
    await connection.invoke("LeaveGroup", groupName);
    logger.log("Left SignalR group:", groupName);
  } catch (error) {
    logger.error("Failed to leave SignalR group:", error);
  }
};

const setupEventHandlers = () => {
  if (!connection) return;

  connection.on("ReceiveBalance", handleBalanceUpdate);
  connection.on("BalanceUpdated", handleBalanceUpdate);
  connection.on("balanceReceived", handleBalanceUpdate);

  connection.onreconnecting(() => {
    logger.log("SignalR reconnecting...");
    useSignalRStore.getState().setConnected(false);
  });

  connection.onreconnected(async () => {
    logger.log("SignalR reconnected");
    useSignalRStore.getState().setConnected(true);

    // Rejoin group on reconnect
    try {
      const entityId = await getEntityId();
      await joinGroup(entityId);
    } catch (error) {
      logger.error("Failed to rejoin group after reconnect:", error);
    }
  });

  connection.onclose(() => {
    logger.log("SignalR connection closed");
    useSignalRStore.getState().setConnected(false);
  });
};

const handleAppStateChange = (nextAppState: string) => {
  if (nextAppState === "background") {
    // Optionally stop connection in background
    logger.log("App going to background, stopping SignalR connection");
    stopSignalRConnection();
  } else if (nextAppState === "active") {
    // Restart connection when app becomes active
    logger.log("App becoming active, starting SignalR connection");
    createSignalRConnection();
  }
};

export const createSignalRConnection = async (): Promise<HubConnection> => {
  if (connection && connection.state === "Connected") {
    return connection;
  }

  const maxRetries = 5;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      await getAccessToken();

      connection = new HubConnectionBuilder()
        .withUrl(Config.SIGNAL_R_URL, {
          accessTokenFactory: async () => {
            try {
              return await getAccessToken();
            } catch {
              // Token expired, try refresh
              return await refreshAccessToken();
            }
          },
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      setupEventHandlers();

      await connection.start();
      logger.log("SignalR connected successfully");

      useSignalRStore.getState().setConnected(true);

      // Join group
      const entityId = await getEntityId();
      await joinGroup(entityId);

      // Setup app state listener
      AppState.addEventListener("change", handleAppStateChange);

      return connection;
    } catch (error) {
      logger.error(
        `SignalR connection failed (attempt ${retryCount + 1}/${maxRetries}):`,
        error
      );
      useSignalRStore.getState().setConnected(false);

      // If auth error, try refresh and retry once
      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof error.message === "string" &&
        (error.message.includes("401") || error.message.includes("403"))
      ) {
        try {
          await refreshAccessToken();
          return createSignalRConnection(); // Retry with new token
        } catch (refreshError) {
          logger.error("Token refresh failed:", refreshError);
          // Clear tokens and logout
          useAuthStore.getState().logout();
          throw new Error("Authentication failed, please login again");
        }
      }

      retryCount++;
      if (retryCount < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff, max 30s
        logger.log(`Retrying SignalR connection in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        logger.error("Max retries reached for SignalR connection");
        throw error;
      }
    }
  }

  throw new Error("Failed to establish SignalR connection after retries");
};

export const stopSignalRConnection = async (): Promise<void> => {
  if (!connection) return;

  try {
    // Leave group
    const entityId = await getEntityId();
    await leaveGroup(entityId);

    await connection.stop();
    logger.log("SignalR disconnected");
  } catch (error) {
    logger.error("Error stopping SignalR connection:", error);
  } finally {
    connection = null;
    useSignalRStore.getState().setConnected(false);
    useSignalRStore.getState().reset();

    // Remove app state listener (React Native AppState doesn't have removeEventListener, use removeListener)
    // AppState.removeEventListener('change', handleAppStateChange);
  }
};

export const getSignalRConnection = (): HubConnection | null => {
  return connection;
};
