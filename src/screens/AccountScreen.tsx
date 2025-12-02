import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useMemo, useRef } from "react";
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Avatar from "../components/Avatar";
import Button from "../components/Button";
import Header from "../components/Header";
import InfoRow from "../components/InfoRow";
import { ConfirmationModal } from "../components/Modal/ConfirmationModal";
import Screen from "../components/Screen";
import Text from "../components/Text";
import { useHomeDetails } from "../hooks/useHomeDetails";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useAuthStore } from "../store/authStore";
import { darkTheme, lightTheme } from "../theme";

export default function AccountScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "Account">>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const snapshot = route.params?.snapshot;
  const { userInfo, logout } = useAuthStore();
  const { data, isLoading, signalRBalance } = useHomeDetails();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const logoutModalRef = useRef<{ present: () => void; dismiss: () => void }>(
    null
  );

  const currency = snapshot?.currency ?? data?.currency ?? "د.ل";
  const balance =
    signalRBalance ??
    snapshot?.balance ??
    data?.balance ??
    userInfo?.cardBalance ??
    0;
  const reserved = snapshot?.reservedAmount ?? userInfo?.amount ?? 0;

  const infoSections = useMemo(
    () => [
      {
        title: "معلومات التواصل",
        items: [
          {
            label: "الهاتف",
            value: userInfo?.phoneNumber ?? snapshot?.phoneNumber ?? "غير محدد",
            icon: "call",
          },
          {
            label: "البريد الإلكتروني",
            value: userInfo?.email ?? snapshot?.email ?? "غير متوفر",
            icon: "mail-outline",
          },
        ],
      },
    ],
    [snapshot, userInfo]
  );

  const handleLogout = () => {
    logoutModalRef.current?.present();
  };

  const handleLogoutConfirm = async () => {
    await logout();
  };

  const handleLogoutCancel = () => {
    logoutModalRef.current?.dismiss();
  };

  const handleResetPassword = () => {
    navigation.navigate("ResetPassword");
  };

  const callSupportPhone = () => {
    const phoneNumber = userInfo?.supportPhone;
    if (phoneNumber) {
      const url = `tel:${phoneNumber}`;
      Linking.openURL(url);
    }
  };

  return (
    <Screen useSafeArea={false} backgroundColor={theme.colors.background}>
      <Header title="الحساب" backgroundColor={theme.colors.background} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 140 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[styles.heroCard, { backgroundColor: theme.colors.surface }]}
        >
          <Avatar />
          <View style={styles.heroTexts}>
            <Text
              weight="semiBold"
              style={[styles.heroTitle, { color: theme.colors.text }]}
            >
              {userInfo?.displayName ?? snapshot?.displayName ?? "مستخدم"}
            </Text>
            <Text
              style={[
                styles.heroSubtitle,
                { color: theme.colors.textSecondary },
              ]}
            >
              {userInfo?.userName ?? snapshot?.userName ?? "اسم المستخدم"}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View
            style={[styles.statCard, { backgroundColor: theme.colors.surface }]}
          >
            <Text
              style={[styles.statLabel, { color: theme.colors.textSecondary }]}
            >
              الرصيد المتاح
            </Text>
            {isLoading ? (
              <ActivityIndicator color={theme.colors.primary} />
            ) : (
              <Text
                weight="bold"
                style={[styles.statValue, { color: theme.colors.text }]}
              >
                {balance.toLocaleString()} {currency}
              </Text>
            )}
          </View>

          <View
            style={[styles.statCard, { backgroundColor: theme.colors.surface }]}
          >
            <Text
              style={[styles.statLabel, { color: theme.colors.textSecondary }]}
            >
              رصيد المديونية
            </Text>
            <Text
              weight="bold"
              style={[styles.statValue, { color: theme.colors.warning }]}
            >
              {reserved.toLocaleString()} {currency}
            </Text>
          </View>
        </View>

        {infoSections.map((section) => (
          <View
            key={section.title}
            style={[
              styles.sectionCard,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text weight="semiBold" style={styles.sectionTitle}>
              {section.title}
            </Text>
            {section.items.map((item) => (
              <InfoRow
                key={item.label}
                hideLabel={true}
                value={item.value}
                iconName={item.icon}
                iconColor={theme.colors.primary}
                valueStyle={{
                  color: theme.colors.text,
                  fontSize: 18,
                  fontWeight: "600",
                }}
              />
            ))}
          </View>
        ))}

        {userInfo?.supportPhone && (
          <View
            style={[
              styles.supportCard,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text weight="semiBold" style={styles.sectionTitle}>
              الدعم الفني
            </Text>
            <TouchableOpacity onPress={callSupportPhone} activeOpacity={0.7}>
              <InfoRow
                hideLabel={true}
                value={userInfo.supportPhone}
                iconName="support-agent"
                iconColor={theme.colors.primary}
                valueStyle={{
                  color: theme.colors.text,
                  fontSize: 18,
                  fontWeight: "600",
                }}
              />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.actions}>
          <Button
            gradientColors={[theme.colors.primary, theme.colors.secondary]}
            text="إعادة تعيين كلمة المرور"
            onPress={handleResetPassword}
            style={{ width: "100%" }}
          />
          <Button
            backgroundColor={theme.colors.background2}
            text="تسجيل الخروج"
            textColor={theme.colors.text}
            onPress={handleLogout}
            style={{ width: "100%" }}
          />
        </View>
      </ScrollView>
      <ConfirmationModal
        ref={logoutModalRef}
        desc="هل أنت متأكد أنك تريد تسجيل الخروج؟"
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  heroCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    borderRadius: 22,
    padding: 20,
    gap: 16,
  },
  heroTexts: {
    flex: 1,
    alignItems: "flex-end",
  },
  heroTitle: {
    fontSize: 22,
    marginBottom: 4,
    textAlign: "right",
  },
  heroSubtitle: {
    fontSize: 14,
    opacity: 0.85,
    textAlign: "right",
  },
  statsRow: {
    flexDirection: "row-reverse",
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    alignItems: "flex-end",
    gap: 8,
  },
  statLabel: {
    fontSize: 14,
    textAlign: "right",
  },
  statValue: {
    fontSize: 20,
    textAlign: "right",
  },
  sectionCard: {
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: "right",
  },
  supportCard: {
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
});
