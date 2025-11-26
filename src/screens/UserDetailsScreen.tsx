import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useMemo, useRef } from "react";
import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";
import Button from "../components/Button";
import InfoRow from "../components/InfoRow";
import { ConfirmationModal, ConfirmationModalRef } from "../components/Modal";
import Screen from "../components/Screen";
import Text from "../components/Text";
import { useHeader } from "../hooks/useHeader";
import { RootStackParamList } from "../navigation/AppNavigator";
import { darkTheme, lightTheme } from "../theme";
export default function UserDetailsScreen() {
    const route = useRoute<RouteProp<RootStackParamList, "UserDetails">>();
    const {userInfo} = route.params;
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? darkTheme : lightTheme;
    useHeader({ title: "تفاصيل مستخدم الجهاز", showBackButton: true });
    const deleteConfirmationModalRef = useRef<ConfirmationModalRef>(null);
    const resetPasswordConfirmationModalRef = useRef<ConfirmationModalRef>(null);
      const infoSections = useMemo(
        () => [
          {
            title: "تفاصيل الحساب",
            items: [
              {
                label: "اسم الحساب",
                value: userInfo?.accountName ?? "-",
                icon: "account-balance",
              },
              {
                label: "اسم المستخدم",
                value: userInfo?.userName ??  "-",
                icon: "person-outline",
              },
            ],
          },
          {
            title: "معلومات التواصل",
            items: [
              {
                label: "الهاتف",
                value: userInfo?.phoneNumber ??  "غير محدد",
                icon: "call",
              },
              {
                label: "البريد الإلكتروني",
                value: userInfo?.email ?? "غير متوفر",
                icon: "mail-outline",
              },
            ],
          },
        ],
        [ userInfo]
      );
    
    const styles = StyleSheet.create({
        container: {
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
        statusPill: {
            flexDirection: "row-reverse",
            alignItems: "center",
            gap: 6,
            marginTop: 10,
            paddingVertical: 4,
            paddingHorizontal: 12,
            borderRadius: 999,
            backgroundColor: "rgba(37, 99, 235, 0.08)",
        },
        statusDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
        },
        statusText: {
            fontSize: 12,
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
        actions: {
            gap: 12,
            marginTop: 8,
        },
        });
    
    return <Screen useSafeArea={false} backgroundColor={theme.colors.background}>
        <ScrollView style={[styles.container]}>
            <View
                style={[styles.heroCard, { backgroundColor: theme.colors.surface }]}
                    >
            <View style={styles.heroTexts}>
            <Text
                weight="semiBold"
                style={[styles.heroTitle, { color: theme.colors.text }]}
            >
                {userInfo?.displayName ?? "اسم العرض"}
            </Text>
            <Text
                style={[
                styles.heroSubtitle,
                { color: theme.colors.textSecondary },
                ]}
            >
                {userInfo?.userName ?? "حساب المستخدم"}
            </Text>
            <Text
                style={[
                styles.heroSubtitle,
                { color: theme.colors.textSecondary },
                ]}
            >
                {userInfo?.accountName ?? "حساب حساب الجهاز"}
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
                        label={item.label}
                        value={item.value}
                        iconName={item.icon}
                        iconColor={theme.colors.primary}
                        labelStyle={{ color: theme.colors.textSecondary }}
                        valueStyle={{ color: theme.colors.text }}
                      />
                    ))}
                  </View>
                ))}
            <Button
            gradientColors={[theme.colors.primary, theme.colors.secondary]}
            text="إعادة تعيين كلمة المرور"
            onPress={() => resetPasswordConfirmationModalRef.current?.present()}
            style={{ width: "100%" }}
          />
        </ScrollView>
        <ConfirmationModal desc={"إعادة تعيين كلمة المرور؟"} 
        ref={resetPasswordConfirmationModalRef}
        onConfirm={() =>  {
            throw new Error("Function not implemented.");
        } } onCancel={() => {} }/>
    </Screen>
}