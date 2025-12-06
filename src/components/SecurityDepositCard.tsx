import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { useReferenceDevice } from "../services/Documents/hook";
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
  const paid = totalDeposit - remainingBalance;
  const confirmationModalRef = useRef<ConfirmationModalRef>(null);
  const toast = useToast();
  const referenceDeviceMutation = useReferenceDevice();

  const handleConfirm = async () => {
    console.log("deviceId:", deviceId);
    if (!deviceId) {
      toast.error("Device ID is required");
      return;
    }

    try {
      const response = await referenceDeviceMutation.mutateAsync(deviceId);

      if (response.isError) {
        toast.error(response.messageName);
      } else {
        toast.success(response.messageName);
      }

      confirmationModalRef.current?.dismiss();
    } catch (error) {
      console.error("Error calling referenceDevice:", error);
      toast.error("Failed to reference device");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.amount} weight="medium">
        المتبقي : {remainingBalance.toFixed(2)} د.ل
      </Text>
      <Text style={styles.totalAmount}>المدفوع: {paid.toFixed(2)} د.ل</Text>
      <Button
        onPress={() => confirmationModalRef.current?.present()}
        gradientColors={["#1a1a1a", "#424242ff"]}
        iconName="return"
        iconSize={40}
        iconColor="white"
        height={40}
        width={100}
        style={{ alignSelf: "flex-end" }}
        disabled={referenceDeviceMutation.isPending}
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
    fontSize: 26,
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
