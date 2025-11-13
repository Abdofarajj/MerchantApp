import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Alert, StyleSheet, Text, useColorScheme, View } from "react-native";
import Modal from "react-native-modal";
import { Button, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCreateChargeOrderMutation } from "../../services/ChargeOrders";
import { darkTheme, lightTheme } from "../../theme";

export type RechargeBottomSheetRef = {
  present: () => void;
  dismiss: () => void;
};

export const RechargeBottomSheet = forwardRef<RechargeBottomSheetRef>(
  (_, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [amount, setAmount] = useState("");
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? darkTheme : lightTheme;
    const createChargeOrderMutation = useCreateChargeOrderMutation();

    useImperativeHandle(ref, () => ({
      present: () => setIsVisible(true),
      dismiss: () => {
        setIsVisible(false);
        setAmount("");
      },
    }));

    const handleConfirm = async () => {
      const numAmount = parseFloat(amount);
      if (!amount || isNaN(numAmount) || numAmount < 1) {
        Alert.alert(
          "Invalid Amount",
          "Please enter a valid amount greater than 0"
        );
        return;
      }

      try {
        await createChargeOrderMutation.mutateAsync({ amount: numAmount });
        Alert.alert("Success", "Recharge request sent successfully!");
        setIsVisible(false);
        setAmount("");
      } catch (error) {
        console.error("Create charge order failed:", error);
        Alert.alert(
          "Error",
          "Failed to send recharge request. Please try again."
        );
      }
    };

    const styles = StyleSheet.create({
      modal: {
        margin: 0,
        justifyContent: "flex-end",
      },
      container: {
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: theme.radius.xl,
        borderTopRightRadius: theme.radius.xl,
        paddingHorizontal: theme.spacing[4],
        paddingTop: theme.spacing[4],
        paddingBottom: insets.bottom + theme.spacing[4],
        minHeight: 300,
      },
      header: {
        fontSize: 20,
        color: theme.colors.text,
        textAlign: "center",
        marginBottom: theme.spacing[4],
      },
      input: {
        marginBottom: theme.spacing[4],
        backgroundColor: theme.colors.surfaceVariant,
      },
      button: {
        marginTop: theme.spacing[2],
      },
    });

    return (
      <Modal
        isVisible={isVisible}
        style={styles.modal}
        onBackdropPress={() => setIsVisible(false)}
        onBackButtonPress={() => setIsVisible(false)}
        animationInTiming={300}
        animationOutTiming={300}
        backdropOpacity={0.5}
      >
        <View style={styles.container}>
          <Text style={styles.header}>Enter Recharge Amount</Text>

          <TextInput
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="0.00"
            mode="outlined"
            style={styles.input}
            theme={{
              colors: {
                primary: theme.colors.primary,
                background: theme.colors.surfaceVariant,
              },
            }}
          />

          <Button
            mode="contained"
            onPress={handleConfirm}
            disabled={!amount || parseFloat(amount) < 1}
            buttonColor={theme.colors.primary}
            style={styles.button}
          >
            Confirm Recharge
          </Button>
        </View>
      </Modal>
    );
  }
);

RechargeBottomSheet.displayName = "RechargeBottomSheet";
