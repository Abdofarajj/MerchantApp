import React, { useState } from "react";
import { Alert, StyleSheet, Text, View, useColorScheme } from "react-native";
import {
  Button,
  Checkbox,
  TextInput as PaperTextInput,
} from "react-native-paper";
import { useLogin } from "../services/auth/hook";
import { useAuthStore } from "../store/authStore";
import { darkTheme, lightTheme } from "../theme";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRemember, setIsRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const { setToken, setRefreshToken, setSignedIn } = useAuthStore();

  const loginMutation = useLogin();

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    loginMutation.mutate(
      {
        username,
        password,
        rememberMe: isRemember,
      },
      {
        onSuccess: (response) => {
          // Store tokens and user info in auth store
          setToken(response.accessToken);
          setRefreshToken(response.refreshToken);
          setSignedIn(true);
          // TODO: Extract userId from token or get from separate API call
          // setUserId(response.userId); // If available in response
          // Navigation happens automatically through auth store changes
        },
        onError: (error) => {
          Alert.alert("Error", "Login failed: " + (error as Error).message);
        },
      }
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      padding: 20,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
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
    },
    checkboxContainer: {
      flexDirection: "row",
      alignItems: "center",
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
    <View style={styles.container}>
      <Text style={styles.title}>Merchant App</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

      <PaperTextInput
        style={styles.input}
        label="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        mode="outlined"
      />

      <PaperTextInput
        style={styles.input}
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        mode="outlined"
        right={
          <PaperTextInput.Icon
            icon={showPassword ? "eye-off" : "eye"}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={isRemember ? "checked" : "unchecked"}
          onPress={() => setIsRemember(!isRemember)}
          color={theme.colors.primary}
        />
        <Text style={styles.checkboxLabel}>Remember me</Text>
      </View>

      <Button
        style={styles.button}
        mode="contained"
        buttonColor={theme.colors.primary}
        onPress={handleLogin}
        loading={loginMutation.isPending}
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </Button>
    </View>
  );
}
