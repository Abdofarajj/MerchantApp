import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Avatar from "../components/Avatar";
import {
  RechargeBottomSheet,
  RechargeBottomSheetRef,
} from "../components/BottomSheet";
import POSDevicesSection from "../components/POSDevicesSection";
import QuickActionButton from "../components/QuickActionButton";
import Screen from "../components/Screen";
import Text from "../components/Text";
import { useColorScheme } from "../hooks/use-color-scheme";
import { useHomeDetails } from "../hooks/useHomeDetails";
import { usePosDetails } from "../hooks/usePosDetails";
import { useAuthStore } from "../store/authStore";
import { darkTheme, lightTheme } from "../theme";
import { logger } from "../utils/logger";
import { useToast } from "../utils/toast";

type QuickAction = {
  id: string;
  label: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  navigateTo: string;
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const { data, error, signalRBalance, signalRConnected } = useHomeDetails();
  const {
    data: posData,
    isLoading: posLoading,
    error: posError,
  } = usePosDetails();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const { userInfo } = useAuthStore();
  const toast = useToast();

  // Bottom sheet refs
  const rechargeSheetRef = useRef<RechargeBottomSheetRef>(null);

  // Log userInfo when component mounts or userInfo changes
  useEffect(() => {
    if (userInfo) {
      logger.log("HomeScreen: userInfo", userInfo);
    }
  }, [userInfo]);

  const handleQuickAction = useCallback(
    (action: string) => {
      if (action === "شحن") {
        // Navigate to RechargeScreen
        navigation.navigate("Recharge" as never);
      } else if (action === "تحصيل") {
        // Navigate to CollectScreen
        navigation.navigate("Collect" as never);
      } else {
        toast.info(`ميزة ${action} قادمة قريباً!`);
      }
    },
    [navigation, toast]
  );

  const quickActions = useMemo<QuickAction[]>(
    () => [
      {
        id: "recharge",
        label: "شحن",
        icon: "+",
        iconColor: theme.colors.white,
        iconBg: theme.colors.primary,
        navigateTo: "requests",
      },
      {
        id: "collect",
        label: "تحصيل",
        icon: "$",
        iconColor: theme.colors.white,
        iconBg: theme.colors.primary,
        navigateTo: "devices",
      },
    ],
    [theme.colors.white, theme.colors.primary]
  );

  if (!data) return null;

  if (error) {
    const styles = StyleSheet.create({
      errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: theme.colors.background,
      },
      errorText: {
        fontSize: 16,
        color: theme.colors.error,
      },
    });
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>❌ {error}</Text>
      </View>
    );
  }

  const styles = StyleSheet.create({
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      // backgroundColor: theme.colors.background,
    },
    errorText: {
      fontSize: 16,
      color: theme.colors.error,
      textAlign: "right",
    },
    header: {
      paddingHorizontal: 10,
      paddingTop: 50,
      paddingBottom: 10,
    },
    headerRow: {
      flexDirection: "row-reverse",
      alignItems: "center",
      marginBottom: 16,
    },
    greeting: {
      flexDirection: "column",
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 24,
      color: theme.colors.text,
      textAlign: "right",
    },
    headerSubtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "right",
    },
    balanceCard: {
      marginHorizontal: 16,
      backgroundColor: "none",
    },
    balanceLabel: {
      fontSize: 16,
      marginBottom: 8,
      textAlign: "right",
    },
    balanceAmount: {
      fontSize: 32,
      marginBottom: 16,
      textAlign: "right",
    },
    balanceDecimal: {
      color: theme.colors.outline,
      fontSize: 28,
    },
    actionsContainer: {
      paddingHorizontal: 16,
      marginTop: 24,
    },
    actionsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
  });

  return (
    <Screen
      useSafeArea={false}
      // style={{ backgroundColor: theme.colors.surface }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Avatar />
            <View style={styles.greeting}>
              <Text
                style={{
                  fontSize: 18,
                  color: "black",
                  textAlign: "right",
                }}
              >
                مرحبا
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "black",
                  opacity: 0.8,
                  textAlign: "right",
                }}
              >
                {userInfo?.displayName || "User"}
              </Text>
            </View>
          </View>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>
            الرصيد الحالي{signalRConnected}
          </Text>
          <Text style={styles.balanceAmount}>
            {(() => {
              const balanceStr = (
                signalRBalance ?? data.balance
              ).toLocaleString();
              const parts = balanceStr.split(".");
              return (
                <>
                  {parts[0]}
                  {parts[1] && (
                    <>
                      <Text style={styles.balanceAmount}>.</Text>
                      <Text style={styles.balanceDecimal}>{parts[1]}</Text>
                    </>
                  )}{" "}
                  {data.currency}
                </>
              );
            })()}
          </Text>
          <View
            style={{
              height: 1,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            }}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <QuickActionButton
                key={action.id}
                title={action.label}
                icon={action.icon}
                iconColor={action.iconColor}
                iconBg={action.iconBg}
                onPress={() => handleQuickAction(action.label)}
              />
            ))}
          </View>
        </View>

        {/* POS Devices */}
        <POSDevicesSection
          posData={posData}
          posLoading={posLoading}
          posError={posError}
        />
      </ScrollView>

      {/* Recharge Bottom Sheet */}
      <RechargeBottomSheet ref={rechargeSheetRef} />
    </Screen>
  );
}
