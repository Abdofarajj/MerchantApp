import React from "react";
import Toast, { ToastType } from "../components/Toast";
import { logger } from "./logger";

interface ToastConfig {
  message: string;
  type: ToastType;
  duration?: number;
}

class ToastManager {
  private currentToast: ToastConfig | null = null;
  private listeners: ((toast: ToastConfig | null) => void)[] = [];

  show(config: ToastConfig) {
    // Dismiss current toast if exists
    if (this.currentToast) {
      this.dismiss();
    }

    this.currentToast = config;
    this.listeners.forEach((listener) => listener(config));

    // Log in development
    if (__DEV__) {
      logger.log(`Toast [${config.type}]:`, config.message);
    }
  }

  dismiss() {
    if (this.currentToast) {
      this.listeners.forEach((listener) => listener(null));
      this.currentToast = null;
    }
  }

  subscribe(listener: (toast: ToastConfig | null) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Convenience methods
  error(message: string, duration?: number) {
    this.show({ message, type: "error", duration });
  }

  success(message: string, duration?: number) {
    this.show({ message, type: "success", duration });
  }

  info(message: string, duration?: number) {
    this.show({ message, type: "info", duration });
  }
}

export const toastManager = new ToastManager();

// React hook for using toast
export const useToast = () => {
  return {
    error: (message: string, duration?: number) =>
      toastManager.error(message, duration),
    success: (message: string, duration?: number) =>
      toastManager.success(message, duration),
    info: (message: string, duration?: number) =>
      toastManager.info(message, duration),
    dismiss: () => toastManager.dismiss(),
  };
};

// React component to render toasts
export function ToastContainer() {
  const [currentToast, setCurrentToast] = React.useState<ToastConfig | null>(
    null
  );

  React.useEffect(() => {
    const unsubscribe = toastManager.subscribe(setCurrentToast);
    return unsubscribe;
  }, []);

  if (!currentToast) return null;

  return React.createElement(Toast, {
    message: currentToast.message,
    type: currentToast.type,
    duration: currentToast.duration,
    onDismiss: () => setCurrentToast(null),
  });
}
