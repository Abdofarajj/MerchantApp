import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import Button from "../components/Button";
import type { SuccessModalRef } from "../components/Modal";
import { SuccessModal } from "../components/Modal";
import Screen from "../components/Screen";
import Text from "../components/Text";
import { useHeader } from "../hooks/useHeader";
import { useCreateChargeOrderMutation } from "../services/ChargeOrders";
import { darkTheme, lightTheme } from "../theme";
import { useToast } from "../utils/toast";

export default function RechargeScreen() {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const textInputRef = useRef<TextInput>(null);
  const confirmationModalRef = useRef<SuccessModalRef>(null);
  const createChargeOrderMutation = useCreateChargeOrderMutation();
  const { error: showErrorToast } = useToast();

  // Configure header
  useHeader({
    title: "ادخل قيمة",
    showBackButton: true,
  });

  // Auto-focus the input when component mounts
  useEffect(() => {
    // Small delay to ensure the component is fully rendered
    const timer = setTimeout(() => {
      textInputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Check if amount is valid (greater than or equal to 1)
  const isAmountValid = parseFloat(amount) >= 1;

  const styles = StyleSheet.create({
    keyboardContainer: {
      flex: 1,
    },
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing[4],
    },
    inputContainer: {
      flex: 1,
      // justifyContent: "center",
    },
    inputLine: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    currencyLabel: {
      fontSize: 24,
      marginRight: theme.spacing[2],
      opacity: isAmountValid ? 1 : 0.5,
    },
    input: {
      fontSize: 24,
      textAlign: "left",
      borderWidth: 0,
      backgroundColor: "transparent",
      opacity: isAmountValid ? 1 : 0.5,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <Screen useSafeArea={true} backgroundColor="white">
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <View style={styles.inputLine}>
              <Text style={styles.currencyLabel}>د.ل</Text>
              <TextInput
                ref={textInputRef}
                value={amount}
                onChangeText={setAmount}
                placeholder="0"
                keyboardType="numeric"
                style={styles.input}
                cursorColor="rgba(0, 160, 40)"
                autoFocus={true}
                showSoftInputOnFocus={true}
              />
            </View>
          </View>

          <View>
            <Button
              onPress={async () => {
                const numAmount = parseFloat(amount);
                if (numAmount >= 1) {
                  setIsLoading(true);
                  try {
                    await createChargeOrderMutation.mutateAsync({
                      amount: numAmount,
                    });
                    // Success - show confirmation modal
                    confirmationModalRef.current?.present();
                  } catch (error) {
                    // Error - show toast with actual API message
                    const apiError = error as any;
                    let errorMessage =
                      apiError?.response?.data?.messageName ||
                      apiError?.response?.data?.message ||
                      apiError?.response?.data ||
                      apiError?.message ||
                      "حدث خطأ";
                    // Reverse numbers in the format int.dec to dec.int
                    errorMessage = errorMessage.replace(
                      /(\d+)\.(\d+)/g,
                      (match: string, int: string, dec: string) =>
                        `${dec}.${int}`
                    );
                    showErrorToast(errorMessage);
                  } finally {
                    setIsLoading(false);
                  }
                }
              }}
              loading={isLoading}
              disabled={!isAmountValid || isLoading}
              backgroundColor={isAmountValid ? "#333333" : "#CCCCCC"}
              text={isLoading ? "جاري المعالجة..." : "تأكيد"}
              height={60}
            />
          </View>
        </View>

        <SuccessModal
          ref={confirmationModalRef}
          message="تم ارسال الطلب!"
          onRequest={async () => {
            // Modal is only shown after successful API call, so just resolve
            return Promise.resolve();
          }}
          onComplete={() => {
            // Clear the amount input after successful recharge
            setAmount("");
            // Navigate back after successful recharge
            // navigation.goBack();
          }}
        />
      </Screen>
    </KeyboardAvoidingView>
  );
}
