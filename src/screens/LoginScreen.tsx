import React, { useState } from "react";
import { Alert, StyleSheet, View, useColorScheme } from "react-native";
import { Button, TextInput as PaperTextInput } from "react-native-paper";
import Text from "../components/Text";
import { useLoginMutation } from "../services/Accounts/hook";
import { useAuthStore } from "../store/authStore";
import { darkTheme, lightTheme } from "../theme";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRemember] = useState(true);
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const { setToken, setRefreshToken, setSignedIn } = useAuthStore();

  const loginMutation = useLoginMutation();

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    loginMutation.mutate(
      {
        userName: username,
        password,
        isRemmeber: isRemember,
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
        secureTextEntry
        mode="outlined"
      />

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
