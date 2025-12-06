import NetInfo from "@react-native-community/netinfo";
import { AxiosError } from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { Checkbox } from "react-native-paper";
import Button from "../components/Button";
import { IconComponent } from "../components/Icon";
import Text from "../components/Text";
import { useLogin } from "../services/auth/hook";
import { useAuthStore } from "../store/authStore";
import { darkTheme, lightTheme } from "../theme";
import { useToast } from "../utils/toast";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRemember, setIsRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const { setToken, setRefreshToken, setSignedIn } = useAuthStore();
  const { error } = useToast();

  const loginMutation = useLogin();
  const animatedPadding = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        Animated.timing(animatedPadding, {
          toValue: e.endCoordinates.height + (Platform.OS === "ios" ? 20 : 0),
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    );
    const hideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        Animated.timing(animatedPadding, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    );
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [animatedPadding]);

  const handleLogin = async () => {
    if (!username || !password) {
      error("يرجى إدخال اسم المستخدم وكلمة المرور");
      return;
    }

    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      error("لا يوجد اتصال بالإنترنت");
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 7000);

    loginMutation.mutate(
      {
        username,
        password,
        rememberMe: isRemember,
        signal: controller.signal,
      },
      {
        onSuccess: (response) => {
          clearTimeout(timeoutId);
          // Store tokens and user info in auth store
          setToken(response.accessToken);
          setRefreshToken(response.refreshToken);
          setSignedIn(true);
          // TODO: Extract userId from token or get from separate API call
          // setUserId(response.userId); // If available in response
          // Navigation happens automatically through auth store changes
        },
        onError: (loginError) => {
          clearTimeout(timeoutId);
          if (loginError.name === "AbortError") {
            error("انتهت مهلة تسجيل الدخول");
          } else if (
            (loginError as AxiosError).request &&
            !(loginError as AxiosError).response
          ) {
            error("لا يوجد اتصال بالإنترنت");
          } else {
            error("فشل تسجيل الدخول");
          }
        },
      }
    );
  };

  const styles = StyleSheet.create({
    keyboardContainer: {
      flex: 1,
    },
    container: {
      flex: 1,
      justifyContent: "center",
      padding: 20,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: 32,
      textAlign: "center",
      marginBottom: 10,
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 16,
      textAlign: "center",
      marginBottom: 30,
      color: theme.colors.textSecondary,
    },
    input: {
      marginBottom: 15,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      borderRadius: 12,
      padding: 10,
      // backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      textAlign: "right",
    },
    passwordInput: {
      marginBottom: 15,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      borderRadius: 12,
      padding: 10,
      paddingLeft: 40,
      // backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      textAlign: "right",
    },
    checkboxContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      marginBottom: 15,
    },
    checkboxLabel: {
      marginLeft: 8,
      color: theme.colors.text,
    },
    button: {
      marginBottom: 15,
    },
  });

  return (
    <View style={styles.keyboardContainer}>
      <Animated.View
        style={[styles.container, { paddingBottom: animatedPadding }]}
      >
        <Text style={styles.title}>تطبيق التاجر</Text>
        <Text style={styles.subtitle}>تسجيل الدخول إلى حسابك</Text>

        <TextInput
          style={[styles.input, { fontFamily: "AlexandriaRegular" }]}
          placeholder="اسم المستخدم"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          showSoftInputOnFocus={true}
        />

        <View style={{ position: "relative" }}>
          <TextInput
            style={[styles.passwordInput, { fontFamily: "AlexandriaRegular" }]}
            placeholder="كلمة المرور"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            showSoftInputOnFocus={true}
          />
          <TouchableOpacity
            style={{ position: "absolute", left: 10, top: 12 }}
            onPress={() => setShowPassword(!showPassword)}
          >
            <IconComponent
              iconName={showPassword ? "eye" : "eyeOff"}
              iconSize={24}
              iconColor={theme.colors.text}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.checkboxContainer}>
          <Checkbox
            status={isRemember ? "checked" : "unchecked"}
            onPress={() => setIsRemember(!isRemember)}
            color={theme.colors.primary}
          />
          <Text style={styles.checkboxLabel}>تذكرني</Text>
        </View>

        <Button
          style={styles.button}
          gradientColors={[theme.colors.primary, theme.colors.secondary]}
          text={loginMutation.isPending ? "جاري تسجيل الدخول" : "تسجيل الدخول"}
          onPress={handleLogin}
          loading={loginMutation.isPending}
          disabled={loginMutation.isPending}
        />
      </Animated.View>
    </View>
  );
}
