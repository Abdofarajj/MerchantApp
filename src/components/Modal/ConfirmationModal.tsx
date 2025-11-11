import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import Modal from "react-native-modal";

import { darkTheme, lightTheme } from "../../theme";

interface ConfirmationModalProps {
  message: string;
  onRequest: () => Promise<any>;
  onComplete?: () => void;
}

export type ConfirmationModalRef = {
  present: () => void;
  dismiss: () => void;
};

export const ConfirmationModal = forwardRef<
  ConfirmationModalRef,
  ConfirmationModalProps
>(({ message, onRequest, onComplete }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  useImperativeHandle(ref, () => ({
    present: () => {
      setIsVisible(true);
      setLoading(true);
      setSuccess(false);

      // Execute the request
      onRequest()
        .then(() => {
          setLoading(false);
          setSuccess(true);
          onComplete?.();
        })
        .catch((error) => {
          setLoading(false);
          setSuccess(false);
          setIsVisible(false);
          Alert.alert("Error", "Request failed: " + (error as Error).message);
        });
    },
    dismiss: () => {
      setIsVisible(false);
      setLoading(false);
      setSuccess(false);
    },
  }));

  const styles = StyleSheet.create({
    modal: {
      margin: 0,
      justifyContent: "center",
      alignItems: "center",
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.xl,
      padding: theme.spacing[6],
      margin: theme.spacing[4],
      minWidth: 280,
      alignItems: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    loadingContainer: {
      alignItems: "center",
      justifyContent: "center",
      minHeight: 120,
    },
    successContainer: {
      alignItems: "center",
      justifyContent: "center",
      minHeight: 120,
    },
    message: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.text2,
      textAlign: "center",
      marginTop: theme.spacing[3],
    },
  });

  return (
    <Modal
      isVisible={isVisible}
      style={styles.modal}
      onBackdropPress={() => setIsVisible(false)}
      onBackButtonPress={() => setIsVisible(false)}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropOpacity={0.5}
    >
      <View style={styles.container}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        )}

        {success && (
          <View style={styles.successContainer}>
            <Text style={styles.message}>{message}</Text>
          </View>
        )}
      </View>
    </Modal>
  );
});

ConfirmationModal.displayName = "ConfirmationModal";
