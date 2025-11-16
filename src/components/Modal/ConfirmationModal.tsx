import React, { forwardRef, useImperativeHandle, useState } from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import Modal from "react-native-modal";

import { darkTheme, lightTheme } from "../../theme";
import Button from "../Button";
import Text from "../Text";

interface ConfirmationModalProps {
  desc: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export type ConfirmationModalRef = {
  present: () => void;
  dismiss: () => void;
};

export const ConfirmationModal = forwardRef<
  ConfirmationModalRef,
  ConfirmationModalProps
>(({ desc, onConfirm, onCancel }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  useImperativeHandle(ref, () => ({
    present: () => {
      setIsVisible(true);
    },
    dismiss: () => {
      setIsVisible(false);
    },
  }));

  const styles = StyleSheet.create({
    modal: {
      margin: 0,
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.xl,
      padding: theme.spacing[6],
      margin: theme.spacing[4],
      minWidth: 280,
      alignItems: "center",
    },
    desc: {
      fontSize: 16,
      color: theme.colors.text2,
      textAlign: "center",
      marginBottom: theme.spacing[4],
    },
    buttonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
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
        <Text style={styles.desc}>{desc}</Text>
        <View style={styles.buttonsContainer}>
          <Button
            backgroundColor={theme.colors.background2}
            text="إلغاء"
            textColor="black"
            onPress={() => {
              onCancel();
              setIsVisible(false);
            }}
            style={{ flex: 1, marginHorizontal: theme.spacing[2] }}
          />
          <Button
            backgroundColor={theme.colors.primary}
            text="تأكيد"
            onPress={() => {
              onConfirm();
              setIsVisible(false);
            }}
            style={{ flex: 1, marginHorizontal: theme.spacing[2] }}
          />
        </View>
      </View>
    </Modal>
  );
});

ConfirmationModal.displayName = "ConfirmationModal";
