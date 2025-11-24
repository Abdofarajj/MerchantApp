import React, { forwardRef, useImperativeHandle, useState } from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import Modal from "react-native-modal";

import { usePosDetails } from "../../hooks/usePosDetails";
import { darkTheme, lightTheme } from "../../theme";
import POSDevicesSection from "../POSDevicesSection";

interface UserDeviceListModalProps {
  setID: React.Dispatch<React.SetStateAction<number>>;
}

export type UserDeviceListModalRef = {
  present: () => void;
  dismiss: () => void;
};

export const UserDeviceListModal = forwardRef<
  UserDeviceListModalRef,
  UserDeviceListModalProps
  >
(({ setID, }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const colorScheme = useColorScheme();
  const {
      data: posData,
      isLoading: posLoading,
      error: posError,
      refetch: refetchPosData,
    } = usePosDetails();

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
    },
    container: {
      alignSelf: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.xl,
      padding: theme.spacing[6],
      margin: theme.spacing[4],
      width: "100%",
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
        <POSDevicesSection 
        posData={posData}
        posLoading={posLoading}
        posError={posError}
        onDevicePress={( device ) => {
          setID(device.id);
          setIsVisible(false);
        } }
        />
      </View>
    </Modal>
  );
});


