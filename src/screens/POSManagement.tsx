import { useFocusEffect, useRoute } from "@react-navigation/native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Linking, ScrollView, StyleSheet, View } from "react-native";
import DeviceActivityCard from "../components/DeviceActivityCard";
import Header from "../components/Header";
import { IconComponent } from "../components/Icon";
import Pagination from "../components/Pagination";
import Screen from "../components/Screen";
import SecurityDepositCard from "../components/SecurityDepositCard";
import Switch from "../components/Switch";
import Text from "../components/Text";
import { useColorScheme } from "../hooks/use-color-scheme";
import useDeviceActivation from "../hooks/useDeviceActivation";
import { DeviceMerchant } from "../services/DeviceMerchants/schema";
import { useGetByAccount } from "../services/Documents";
import { darkTheme, lightTheme } from "../theme";

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

export default function POSManagement() {
  const route = useRoute();
  const { device } = route.params as { device: DeviceMerchant };
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const { isEnabled, toggleDevice } = useDeviceActivation(device);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: deviceActivities,
    isLoading: activitiesLoading,
    refetch: refetchActivities,
  } = useGetByAccount({
    deviceId: device?.id || 0,
    pageSize: 10,
    pageNumber: currentPage,
  });

  // Refetch data on screen focus
  useFocusEffect(
    useCallback(() => {
      refetchActivities();
    }, [refetchActivities])
  );
  const openLocationInMaps = () => {
    const latitude = device?.linthtude;
    const longitude = device?.longtude;
    if (latitude && longitude) {
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  };

  const callPhoneNumber = () => {
    const phoneNumber = deviceActivities?.items?.[0]?.phoneNumber;
    if (phoneNumber) {
      const url = `tel:${phoneNumber}`;
      Linking.openURL(url);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate security deposit values
  const securityDeposit = device?.amountTax || 0;
  const paidSecurityDeposit = device?.deptAmountTax || 0;
  const remainingSecurityDeposit = securityDeposit - paidSecurityDeposit;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing[4],
      marginTop: 30,
    },
    content: {
      flex: 1,
      alignItems: "center",
      gap: 10,
    },
    title: {
      fontSize: 24,
      color: theme.colors.text,
      marginBottom: theme.spacing[4],
    },
    deviceInfo: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing[4],
      borderRadius: theme.radius.lg,
      marginBottom: theme.spacing[4],
      width: "100%",
    },
    deviceDetail: {
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: theme.spacing[2],
      textAlign: "right",
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    mapContainer: {
      width: "100%",
      height: 200,
      borderRadius: theme.radius.lg,
      overflow: "hidden",
      marginBottom: theme.spacing[4],
    },
    map: {
      flex: 1,
    },
    gradientContainer: {
      width: "100%",
      height: 300,
      borderRadius: 30,
      padding: theme.spacing[4],
      overflow: "hidden",
    },
    topSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing[4],
    },
    deviceName: {
      fontSize: 18,
      color: "white",
      textAlign: "right",
    },
    bottomSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      flex: 1,
    },
    leftInfo: {
      flex: 1,
      alignItems: "flex-end",
      justifyContent: "flex-end",
    },
    deviceId: {
      fontSize: 20,
      color: "white",
      textAlign: "right",
      marginBottom: theme.spacing[1],
    },
    serialNumber: {
      fontSize: 14,
      color: "white",
      textAlign: "right",
    },
    deviceImage: {
      width: 150,
      height: 250,
      borderRadius: theme.radius.md,
    },
    securityDepositContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: theme.spacing[4],
      backgroundColor: "white",
      borderRadius: 16,
      marginVertical: 8,
      width: "100%",
    },
    iconsContainer: {
      flexDirection: "column",
      alignItems: "center",
      gap: theme.spacing[6],
    },
    icon: {
      width: 40,
      height: 40,
      backgroundColor: "#1a1a1a",
      borderRadius: 24, // Make it circular
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <Screen useSafeArea={false}>
      <Header title={"إدارة الجهاز"} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.content}>
            {device && (
              <>
                <LinearGradient
                  colors={["#1a1a1a", "#2e2e2eff"]}
                  style={styles.gradientContainer}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 1 }}
                >
                  {/* Top horizontal section */}
                  <View style={styles.topSection}>
                    <Switch value={isEnabled} onValueChange={toggleDevice} />
                    <Text style={styles.deviceName}>{device.deviceName}</Text>
                  </View>

                  {/* Bottom horizontal section */}
                  <View style={styles.bottomSection}>
                    <Image
                      source={require("../assets/images/A75Pro.png")}
                      style={styles.deviceImage}
                      contentFit="contain"
                    />
                    <View style={styles.leftInfo}>
                      <Text style={styles.deviceId} weight="bold">
                        ID : {device.id}
                      </Text>
                      <Text style={styles.serialNumber} weight="extraLight">
                        SN : {device.serialNumber}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>

                <View style={styles.securityDepositContainer}>
                  <View style={styles.iconsContainer}>
                    <View style={styles.icon}>
                      <IconComponent
                        iconName="location-on"
                        iconSize={25}
                        iconColor="white"
                        onPress={openLocationInMaps}
                      />
                    </View>
                    <View style={styles.icon}>
                      <IconComponent
                        iconName="phone"
                        iconSize={25}
                        iconColor="white"
                        onPress={callPhoneNumber}
                      />
                    </View>
                  </View>
                  <SecurityDepositCard
                    totalDeposit={securityDeposit}
                    remainingBalance={remainingSecurityDeposit}
                  />
                </View>
              </>
            )}
          </View>
        </View>

        {/* Device Activities - Full Width */}
        <View>
          {deviceActivities?.items && deviceActivities.items.length > 0 ? (
            deviceActivities.items.map((activity, index) => (
              <AnimatedSection
                key={activity.id}
                visible={true}
                delay={index * 100}
              >
                <DeviceActivityCard item={activity} theme={theme} />
              </AnimatedSection>
            ))
          ) : !activitiesLoading ? (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                padding: theme.spacing[4],
                minHeight: 200,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: theme.colors.textSecondary,
                  textAlign: "center",
                }}
              >
                لا توجد أنشطة
              </Text>
            </View>
          ) : (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                padding: theme.spacing[4],
                minHeight: 200,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: theme.colors.textSecondary,
                }}
              >
                جاري التحميل...
              </Text>
            </View>
          )}

          {/* Pagination */}
          {deviceActivities?.items && deviceActivities.items.length > 0 && (
            <Pagination
              currentPage={deviceActivities.pageIndex}
              hasNextPage={deviceActivities.hasNextPage}
              hasPreviousPage={deviceActivities.hasPreviousPage}
              onPageChange={handlePageChange}
              theme={theme}
            />
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
