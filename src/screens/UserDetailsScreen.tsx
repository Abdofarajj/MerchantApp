import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useMemo, useRef } from "react";
import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";
import Button from "../components/Button";
import InfoRow from "../components/InfoRow";
import { ConfirmationModal, ConfirmationModalRef } from "../components/Modal";
import Screen from "../components/Screen";
import Text from "../components/Text";
import { useHeader } from "../hooks/useHeader";
import { RootStackParamList } from "../navigation/AppNavigator";
import { usedeleteUserDeviceMutation } from "../services";
import { darkTheme, lightTheme } from "../theme";
import { useToast } from "../utils/toast";

export default function UserDetailsScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "UserDetails">>();
  const { userInfo } = route.params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  useHeader({ title: "تفاصيل مستخدم الجهاز", showBackButton: true });

  const deleteUserDeviceMutation = usedeleteUserDeviceMutation();
  const { error } = useToast();

  const deleteConfirmationModalRef = useRef<ConfirmationModalRef>(null);
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
            value: userInfo?.userName ?? "-",
            icon: "person-outline",
          },
        ],
      },
      {
        title: "معلومات التواصل",
        items: [
          {
            label: "الهاتف",
            value: userInfo?.phoneNumber ?? "غير محدد",
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
    [userInfo]
  );

  const handleDelete = () => {
    deleteUserDeviceMutation.mutate(
      { id: userInfo.id },
      {
        onSuccess: (response) => {
          // Handle success (e.g., show a success message, navigate back, etc.)
          alert("تم حذف مستخدم الجهاز بنجاح");
          navigation.goBack();
        },
        onError: (err) => {
          // Handle error (e.g., show an error message)
          error("حدث خطأ أثناء حذف مستخدم الجهاز");
          console.error("Delete User Device Error:", err);
        },
      }
    );
  };

  const styles = StyleSheet.create({
    container: {
      padding: 20,
      paddingBottom: 40,
      gap: 18,
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
    button: {
      margin: 5,
    },
  });

  return (
    <Screen useSafeArea={false} backgroundColor={theme.colors.background}>
      <ScrollView contentContainerStyle={[styles.container]}>
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
                valueStyle={{
                  color: theme.colors.text,
                  fontSize: theme.fonts.bodyMedium.fontSize,
                  marginHorizontal: theme.spacing[4],
                }}
              />
            ))}
          </View>
        ))}
        <Button
          gradientColors={[theme.colors.primary, theme.colors.secondary]}
          text="تعديل الحساب"
          onPress={() => navigation.navigate("EditUser", { user: userInfo })}
          style={styles.button}
        />
        <Button
          gradientColors={[theme.colors.error, theme.colors.onErrorContainer]}
          text="حذف الحساب"
          onPress={() => deleteConfirmationModalRef.current?.present()}
          style={styles.button}
        />
      </ScrollView>
      <ConfirmationModal
        ref={deleteConfirmationModalRef}
        desc="هل أنت متأكد أنك تريد حذف هذا المستخدم؟"
        onConfirm={handleDelete}
        onCancel={() => {
          // Handle cancel action
          console.log("Cancelled");
        }}
      />
    </Screen>
  );
}
