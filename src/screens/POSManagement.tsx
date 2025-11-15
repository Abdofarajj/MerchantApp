import { useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import CustomSwitch from "../components/CustomSwitch";
import Header from "../components/Header";
import Screen from "../components/Screen";
import Text from "../components/Text";
import { useColorScheme } from "../hooks/use-color-scheme";
import { DeviceMerchant } from "../services/DeviceMerchants/schema";
import { darkTheme, lightTheme } from "../theme";

export default function POSManagement() {
  const route = useRoute();
  const { device } = route.params as { device: DeviceMerchant };
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const [isEnabled, setIsEnabled] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing[4],
      // paddingBottom: 100,
      marginTop: 30,
    },
    content: {
      flex: 1,
      // justifyContent: "center",
      alignItems: "center",
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
      height: 250,
      borderRadius: 30,
    },
  });

  return (
    <Screen useSafeArea={false}>
      <Header title={device ? ` ${device.deviceName}` : "إدارة أجهزة POS"} />
      <View style={styles.container}>
        <View style={styles.content}>
          {device && (
            <>
              <LinearGradient
                colors={["#1a1a1a", "#202020", "#252525", "#2c2c2c"]}
                style={styles.gradientContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={{ padding: theme.spacing[3] }}>
                  <CustomSwitch
                    value={isEnabled}
                    onValueChange={setIsEnabled}
                  />
                </View>
              </LinearGradient>

              {device.longtude && device.linthtude && (
                <View style={styles.mapContainer}>
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: 32.832063,
                      longitude: 13.047228,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude: 32.832063,
                        longitude: 13.047228,
                      }}
                      title={device.deviceName}
                      description={device.addressName}
                    />
                  </MapView>
                </View>
              )}
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceDetail}>
                  الرقم التسلسلي: {device.serialNumber}
                </Text>

                <Text style={styles.deviceDetail}>
                  العنوان: {device.addressName || "غير محدد"}
                </Text>
                <Text style={styles.deviceDetail}>
                  الحالة: {device.isActive ? "مفعل" : "غير مفعل"}
                </Text>
              </View>
            </>
          )}
          <Text style={styles.subtitle}>
            هذه الشاشة مخصصة لإدارة جهاز نقاط البيع المحدد
          </Text>
        </View>
      </View>
    </Screen>
  );
}
