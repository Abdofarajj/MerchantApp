import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";

// TODO: Add prefetch list (config, profile, role data)
// TODO: Delay UI rendering until isAppReady === true

export const useAppData = () => {
  const [isAppReady, setIsAppReady] = useState(false);
  const isHydrated = useAuthStore((state) => state.isSignedIn); // TODO: ensure this store is hydrated before api requests

  useEffect(() => {
    const prefetchData = async () => {
      // TODO: Add prefetch list (config, profile, role data)
      // Waits for store hydration
      // Calls prefetchers
      setIsAppReady(true);
    };

    if (isHydrated) {
      prefetchData();
    }
  }, [isHydrated]);

  return { isAppReady };
};
