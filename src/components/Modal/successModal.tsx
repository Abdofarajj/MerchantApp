import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Modal from "react-native-modal";

import { darkTheme, lightTheme } from "../../theme";
import Text from "../Text";

interface SuccessModalProps {
  message: string;
  onRequest: () => Promise<any>;
  onComplete?: () => void;
}

export type SuccessModalRef = {
  present: () => void;
  dismiss: () => void;
};

export const SuccessModal = forwardRef<SuccessModalRef, SuccessModalProps>(
  ({ message, onRequest, onComplete }, ref) => {
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
            // Error is now handled by the centralized toast system
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
        // elevation: 5,
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
      },
      closeButton: {
        position: "absolute",
        top: theme.spacing[3],
        right: theme.spacing[3],
        padding: theme.spacing[2],
        borderRadius: 20,
        backgroundColor: "transparent",
      },
      successIconContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: theme.spacing[2],
      },
      successIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#4CAF50",
        alignItems: "center",
        justifyContent: "center",
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
        color: theme.colors.text,
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
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsVisible(false)}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={20} color="rgba(128, 128, 128, 0.7)" />
          </TouchableOpacity>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          )}

          {success && (
            <View style={styles.successContainer}>
              <View style={styles.successIconContainer}>
                <View style={styles.successIcon}>
                  <Ionicons name="checkmark" size={24} color="white" />
                </View>
              </View>
              <Text style={styles.message}>{message}</Text>
            </View>
          )}
        </View>
      </Modal>
    );
  }
);

SuccessModal.displayName = "SuccessModal";
