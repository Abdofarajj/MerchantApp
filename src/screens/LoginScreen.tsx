import React, { useState } from "react";
import { Alert, StyleSheet, Text, View, useColorScheme } from "react-native";
import { Button, TextInput as PaperTextInput } from "react-native-paper";
import { useAuthStore } from "../store/authStore";
import { darkTheme, lightTheme } from "../theme";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const { login } = useAuthStore();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    try {
      // Mock login - replace with actual API call
      await login(username, password);
      // No success message - navigation happens automatically
    } catch (error) {
      Alert.alert("Error", "Login failed: " + (error as Error).message);
    }
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
      >
        Login
      </Button>
    </View>
  );
}
