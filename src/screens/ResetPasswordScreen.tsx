import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import Screen from "../components/Screen";
import Text from "../components/Text";
import { useHeader } from "../hooks/useHeader";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useChangePasswordMutation } from "../services/Accounts/hook";
import { darkTheme, lightTheme } from "../theme";
import { useToast } from "../utils/toast";

export default function ResetPasswordScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const changePasswordMutation = useChangePasswordMutation();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const { error, success } = useToast();

  useHeader({ title: "تغيير كلمة المرور", showBackButton: true });

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      error("يرجى ملء جميع الحقول");
      return;
    }

    if (newPassword.length < 6) {
      error("كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    if (newPassword !== confirmPassword) {
      error("كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقين");
      return;
    }

    if (oldPassword === newPassword) {
      error("كلمة المرور الجديدة يجب أن تكون مختلفة عن كلمة المرور الحالية");
      return;
    }

    changePasswordMutation.mutate(
      {
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      },
      {
        onSuccess: (response) => {
          if (response.isError) {
            error(response.messageName || "حدث خطأ أثناء تغيير كلمة المرور");
          } else {
            success("تم تغيير كلمة المرور بنجاح");
            navigation.goBack();
          }
        },
        onError: (err: any) => {
          const errorMessage =
            err?.response?.data?.messageName ||
            err?.response?.data?.message ||
            err?.message ||
            "حدث خطأ أثناء تغيير كلمة المرور";
          error(errorMessage);
        },
      }
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flexGrow: 1,
    },
    title: {
      fontSize: 24,
      textAlign: "right",
      marginBottom: 8,
      color: theme.colors.text,
      fontFamily: "AlexandriaSemiBold",
    },
    subtitle: {
      fontSize: 14,
      textAlign: "right",
      marginBottom: 30,
      color: theme.colors.textSecondary,
      fontFamily: "AlexandriaRegular",
    },
    inputContainer: {
      marginBottom: 20,
      position: "relative",
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.outline,
      borderRadius: 12,
      padding: 15,
      paddingLeft: 50,
      color: theme.colors.text,
      textAlign: "right",
      fontSize: 16,
      fontFamily: "AlexandriaRegular",
      backgroundColor: theme.colors.surface,
    },
    passwordIcon: {
      position: "absolute",
      left: 15,
      top: 15,
      zIndex: 1,
    },
    button: {
      marginTop: 10,
      borderRadius: 12,
    },
    buttonLabel: {
      fontFamily: "AlexandriaSemiBold",
      fontSize: 16,
    },
  });

  return (
    <Screen useSafeArea={false} backgroundColor={theme.colors.background}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.title}>تغيير كلمة المرور</Text>
          <Text style={styles.subtitle}>
            أدخل كلمة المرور الحالية والجديدة لحسابك
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="كلمة المرور الحالية"
              placeholderTextColor={theme.colors.textSecondary}
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry={!showOldPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.passwordIcon}
              onPress={() => setShowOldPassword(!showOldPassword)}
            >
              <Ionicons
                name={showOldPassword ? "eye" : "eye-off"}
                size={24}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="كلمة المرور الجديدة"
              placeholderTextColor={theme.colors.textSecondary}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.passwordIcon}
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              <Ionicons
                name={showNewPassword ? "eye" : "eye-off"}
                size={24}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="تأكيد كلمة المرور الجديدة"
              placeholderTextColor={theme.colors.textSecondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.passwordIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye" : "eye-off"}
                size={24}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <Button
            style={styles.button}
            mode="contained"
            buttonColor={theme.colors.primary}
            onPress={handleChangePassword}
            loading={changePasswordMutation.isPending}
            disabled={
              changePasswordMutation.isPending ||
              !oldPassword ||
              !newPassword ||
              !confirmPassword
            }
            labelStyle={styles.buttonLabel}
          >
            {changePasswordMutation.isPending
              ? "جاري المعالجة..."
              : "تغيير كلمة المرور"}
          </Button>
        </View>
      </ScrollView>
    </Screen>
  );
}
