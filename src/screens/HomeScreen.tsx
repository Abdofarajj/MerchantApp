import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
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

const AnimatedSection = ({
  visible,
  delay = 0,
  children,
}: {
  visible: boolean;
  delay?: number;
  children: React.ReactNode;
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
        delay,
      }).start();
      Animated.timing(translateY, {
        toValue: 0,
        duration: 320,
        useNativeDriver: true,
        delay,
      }).start();
    }
  }, [visible, delay, opacity, translateY]);

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
      }}
    >
      {children}
    </Animated.View>
  );
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const { data, error, signalRBalance, signalRConnected } = useHomeDetails();
  const {
    data: posData,
    isLoading: posLoading,
    error: posError,
    refetch: refetchPosData,
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

  // Fallback: refetch on screen focus (optional, but recommended)
  useFocusEffect(
    useCallback(() => {
      refetchPosData();
    }, [refetchPosData])
  );

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

  // Visibility flags
  const hasProfile = !!userInfo;
  const hasBalance = typeof data?.balance !== "undefined";
  const hasWidgets = true; // Quick actions are always available

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
      textAlign: "center",
    },
    balanceAmount: {
      fontSize: 52,
      marginBottom: 20,
      color: theme.colors.text,
      textAlign: "center",
    },
    balanceDecimal: {
      color: theme.colors.outline,
      fontSize: 40,
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
    <Screen useSafeArea={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <AnimatedSection visible={hasProfile} delay={0}>
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Account" as never)}
              >
                <Avatar />
              </TouchableOpacity>
              <View style={styles.greeting}>
                <Text
                  style={{
                    fontSize: 18,
                    color: theme.colors.text,
                    textAlign: "right",
                  }}
                >
                  مرحبا
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: theme.colors.textSecondary,
                    textAlign: "right",
                  }}
                >
                  {userInfo?.displayName || "User"}
                </Text>
              </View>
            </View>
          </View>
        </AnimatedSection>

        {/* Balance Card */}
        <AnimatedSection visible={hasBalance} delay={320}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>
              الرصيد الحالي{signalRConnected}
            </Text>
            <Text style={styles.balanceAmount}>
              {(() => {
                const balance = signalRBalance ?? data?.balance ?? 0;
                const balanceStr = balance.toLocaleString();
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
                    {data?.currency || ""}
                  </>
                );
              })()}
            </Text>
          </View>
        </AnimatedSection>

        {/* Quick Actions */}
        <AnimatedSection visible={hasWidgets} delay={240}>
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
        </AnimatedSection>

        {/* POS Devices */}
        <AnimatedSection visible={true} delay={1000}>
          <POSDevicesSection
            posData={posData}
            posLoading={posLoading}
            posError={posError}
            onDevicePress={(device) =>
              (navigation as any).navigate("POSManagement", { device })
            }
          />
        </AnimatedSection>
      </ScrollView>

      {/* Recharge Bottom Sheet */}
      <RechargeBottomSheet ref={rechargeSheetRef} />
    </Screen>
  );
}
