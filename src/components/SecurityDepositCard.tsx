import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import Button from "./Button";
import { ConfirmationModal, ConfirmationModalRef } from "./Modal";
import Text from "./Text";

interface SecurityDepositCardProps {
  totalDeposit: number;
  remainingBalance: number;
}

const SecurityDepositCard: React.FC<SecurityDepositCardProps> = ({
  totalDeposit,
  remainingBalance,
}) => {
  const confirmationModalRef = useRef<ConfirmationModalRef>(null);
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
        iconSize={30}
        iconColor="white"
        height={40}
        width={100}
        style={{ alignSelf: "flex-end" }}
      />
      <ConfirmationModal
        ref={confirmationModalRef}
        desc="إرجاع الجهاز"
        onConfirm={() => {
          // Handle confirm action, e.g., return device
          console.log("Device returned");
        }}
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
