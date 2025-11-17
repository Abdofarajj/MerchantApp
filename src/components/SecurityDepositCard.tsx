import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { documentsService } from "../services/Documents/service";
import { useToast } from "../utils/toast";
import Button from "./Button";
import { ConfirmationModal, ConfirmationModalRef } from "./Modal";
import Text from "./Text";

interface SecurityDepositCardProps {
  totalDeposit: number;
  remainingBalance: number;
  deviceId?: number;
}

const SecurityDepositCard: React.FC<SecurityDepositCardProps> = ({
  totalDeposit,
  remainingBalance,
  deviceId,
}) => {
  const confirmationModalRef = useRef<ConfirmationModalRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleConfirm = async () => {
    if (!deviceId) {
      toast.error("Device ID is required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await documentsService.referenceDevice(deviceId);

      if (response.isError) {
        toast.error(response.messageName);
      } else {
        toast.success(response.messageName);
      }

      confirmationModalRef.current?.dismiss();
    } catch (error) {
      console.error("Error calling referenceDevice:", error);
      toast.error("Failed to reference device");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.amount} weight="medium">
        {remainingBalance.toFixed(2)} د.ل
      </Text>
      <Text style={styles.totalAmount}>
        المجموع: {totalDeposit.toFixed(2)} د.ل
      </Text>
      <Button
        onPress={() => confirmationModalRef.current?.present()}
        gradientColors={["#1a1a1a", "#424242ff"]}
        iconName="undo"
        iconSize={40}
        iconColor="white"
        height={40}
        width={100}
        style={{ alignSelf: "flex-end" }}
        disabled={isLoading}
      />
      <ConfirmationModal
        ref={confirmationModalRef}
        desc="إرجاع الجهاز"
        onConfirm={handleConfirm}
        onCancel={() => {
          // Handle cancel action
          console.log("Cancelled");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 30,
  },
  amount: {
    fontSize: 30,
    textAlign: "right",
  },
  totalAmount: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 16,
    textAlign: "right",
  },
});

export default SecurityDepositCard;
