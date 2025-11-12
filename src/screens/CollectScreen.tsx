import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Text from "../components/Text";
import { Button } from "react-native-paper";
import type { ConfirmationModalRef } from "../components/Modal";
import { ConfirmationModal } from "../components/Modal";
import Screen from "../components/Screen";
import { useHeader } from "../hooks/useHeader";
import { useReceiptCharge, useReceiptReCharge } from "../services/Documents";
import { useAuthStore } from "../store/authStore";
import { useToast } from "../utils/toast";

const { width: screenWidth } = Dimensions.get("window");

// Calculate tab dimensions
const tabBarWidth = screenWidth - 16 * 2; // paddingHorizontal of container (theme.spacing[4] * 2)
const tabWidth = (tabBarWidth - 8) / 2; // Subtract tabBar padding (theme.spacing[1] * 2 = 8)

export default function CollectScreen() {
  const [activeTab, setActiveTab] = useState<"pay" | "collect">("pay");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo } = useAuthStore();
  const textInputRef = useRef<TextInput>(null);
  const confirmationModalRef = useRef<ConfirmationModalRef>(null);

  // API hooks
  const receiptChargeMutation = useReceiptCharge();
  const receiptReChargeMutation = useReceiptReCharge();
  const { error: showErrorToast } = useToast();

  const tabIndicatorPosition = useRef(new Animated.Value(0)).current;
  const tabBackgroundPosition = useRef(new Animated.Value(0)).current;

  useHeader({
    title: "Collect Payment",
    showBackButton: true,
  });

  const isAmountValid = parseFloat(amount) >= 1;

  const handleTabPress = (tab: "pay" | "collect") => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      const targetPosition = tab === "pay" ? 0 : tabWidth;

      Animated.parallel([
        Animated.timing(tabIndicatorPosition, {
          toValue: targetPosition,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(tabBackgroundPosition, {
          toValue: targetPosition,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <Screen useSafeArea={true} backgroundColor="white">
        <View style={styles.container}>
          {/* Tab Bar */}
          <View style={styles.tabBar}>
            <Animated.View
              style={[
                styles.tabBackground,
                { transform: [{ translateX: tabBackgroundPosition }] },
              ]}
            />
            <TouchableOpacity
              style={styles.tab}
              onPress={() => handleTabPress("pay")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "pay"
                    ? styles.activeTabText
                    : styles.inactiveTabText,
                ]}
              >
                Pay
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tab}
              onPress={() => handleTabPress("collect")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "collect"
                    ? styles.activeTabText
                    : styles.inactiveTabText,
                ]}
              >
                Collect
              </Text>
            </TouchableOpacity>
          </View>

          {/* Input Section */}
          <View style={styles.inputContainer}>
            <View style={styles.inputLine}>
              <Text style={styles.currencyLabel}>LYD</Text>
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

          {/* Confirm Button */}
          <View>
            <Button
              mode="contained"
              onPress={async () => {
                const numAmount = parseFloat(amount);
                if (numAmount >= 1) {
                  setIsLoading(true);
                  try {
                    // Ensure we have a valid distributor ID
                    if (!userInfo?.distrputerId) {
                      throw new Error(
                        "Distributor ID not found. Please log in again."
                      );
                    }

                    if (activeTab === "pay") {
                      // Use ReceiptCharge for pay amount
                      await receiptChargeMutation.mutateAsync({
                        distrputerId: userInfo.distrputerId,
                        payed: numAmount,
                      });
                    } else {
                      // Use ReceiptReCharge for collect amount
                      await receiptReChargeMutation.mutateAsync({
                        distrputerId: userInfo.distrputerId,
                        payed: numAmount,
                      });
                    }

                    // Success - show confirmation modal
                    confirmationModalRef.current?.present();
                  } catch (error) {
                    // Error - show toast with actual API message
                    const apiError = error as any;
                    const errorMessage =
                      apiError?.response?.data?.messageName ||
                      apiError?.response?.data?.message ||
                      apiError?.response?.data ||
                      apiError?.message ||
                      "An error occurred";
                    showErrorToast(errorMessage);
                  } finally {
                    setIsLoading(false);
                  }
                }
              }}
              loading={isLoading}
              disabled={!isAmountValid || isLoading}
              buttonColor={
                isAmountValid ? "#333333" : "rgba(255, 255, 255, 0.1)"
              }
              textColor={isAmountValid ? "white" : "rgba(0, 0, 0, 0.2)"}
              style={styles.confirmButton}
              contentStyle={styles.confirmButtonContent}
            >
              {isLoading
                ? "Processing..."
                : activeTab === "pay"
                  ? "Pay Amount"
                  : "Collect Amount"}
            </Button>
          </View>
        </View>

        <ConfirmationModal
          ref={confirmationModalRef}
          message="Request Sent!"
          onRequest={async () => {
            // Modal is only shown after successful API call, so just resolve
            return Promise.resolve();
          }}
          onComplete={() => {
            setAmount("");
          }}
        />
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 16 },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#E0E0E0",
    borderRadius: 16,
    marginTop: -50,
    padding: 4,
    position: "relative",
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
    zIndex: 2,
  },
  tabBackground: {
    position: "absolute",
    top: 4,
    bottom: 4,
    left: 4,
    width: (screenWidth - 32 - 8) / 2 - 4 + 4,
    backgroundColor: "#007AFF",
    borderRadius: 12,
  },
  tabText: { fontSize: 16, fontWeight: "600" },
  activeTabText: { color: "white" },
  inactiveTabText: { color: "#9E9E9E" },
  inputContainer: { flex: 1, marginTop: 50 },
  inputLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  currencyLabel: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 8,
    opacity: 1,
  },
  input: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    borderWidth: 0,
    backgroundColor: "transparent",
    opacity: 1,
  },
  confirmButton: { height: 60 },
  confirmButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
});
