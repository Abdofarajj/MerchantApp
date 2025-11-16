import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  useActivateDeviceMerchant,
  useDeactivateDeviceMerchant,
} from "../services/DeviceMerchants/hook";
import { DeviceMerchant } from "../services/DeviceMerchants/schema";
import { useToast } from "../utils/toast";

const useDeviceActivation = (device: DeviceMerchant | undefined) => {
  const [isEnabled, setIsEnabled] = useState(device?.isActive || false);
  const { success, error: showError } = useToast();
  const queryClient = useQueryClient();

  const activateMutation = useActivateDeviceMerchant();
  const deactivateMutation = useDeactivateDeviceMerchant();

  const toggleDevice = (value: boolean) => {
    console.log("toggleDevice called with value:", value);
    if (!device) {
      console.log("No device available");
      return;
    }

    // Optimistic update - immediately update UI
    const previousState = isEnabled;
    console.log("Previous state:", previousState, "New state:", value);
    setIsEnabled(value);

    // Handle API call asynchronously
    const performToggle = async () => {
      try {
        if (value) {
          // Activate
          await activateMutation.mutateAsync({
            id: device.id,
            updateToken: device.updateToken,
          });
          success("تم تفعيل الجهاز بنجاح");
        } else {
          // Deactivate
          await deactivateMutation.mutateAsync({
            id: device.id,
            updateToken: device.updateToken,
          });
          success("تم إلغاء تفعيل الجهاز بنجاح");
        }

        // Update the global query cache for HomeScreen
        queryClient.setQueryData(["posDetails"], (oldData: any) => {
          if (!oldData?.items) return oldData;
          return {
            ...oldData,
            items: oldData.items.map((d: DeviceMerchant) =>
              d.id === device.id ? { ...d, isActive: value } : d
            ),
          };
        });
      } catch (apiError) {
        // Revert on failure
        setIsEnabled(previousState);
        showError("فشل في تحديث حالة الجهاز");
        console.error("Failed to toggle device:", apiError);
      }
    };

    performToggle();
  };

  return {
    isEnabled,
    toggleDevice,
    isLoading: activateMutation.isPending || deactivateMutation.isPending,
  };
};

export default useDeviceActivation;
