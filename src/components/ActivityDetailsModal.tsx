import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "./Button";
import { IconComponent } from "./Icon";
import InfoRow from "./InfoRow";
import {
  ConfirmationModal,
  ConfirmationModalRef,
} from "./Modal/ConfirmationModal";
import Text from "./Text";

interface ActivityDetailsModalProps {
  visible: boolean;
  item: any;
  onClose: () => void;
  theme: any;
  onDelete: (item: any) => void;
}

export function ActivityDetailsModal({
  visible,
  item,
  onClose,
  theme,
  onDelete,
}: ActivityDetailsModalProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const confirmationModalRef = useRef<ConfirmationModalRef>(null);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  if (!item) return null;

  const isChargeOrder =
    item.hasOwnProperty("merchantName") &&
    item.hasOwnProperty("distrputerName");
  const isReceiptDocument =
    item.hasOwnProperty("fromAccountName") &&
    item.hasOwnProperty("toAccountName");

  let financialItem = "";
  let fromAccount = "";
  let toAccount = "";
  let amount = "";
  let insertDate = "";
  let chargeDate = "";

  if (isChargeOrder) {
    financialItem = "شحن رصيد";
    fromAccount = item.distrputerName;
    toAccount = item.merchantName;
    amount = `${item.amount} د.ل`;
    const insertDateObj = new Date(item.insertDate);
    insertDate = `${insertDateObj.getFullYear()}/${String(insertDateObj.getMonth() + 1).padStart(2, "0")}/${String(insertDateObj.getDate()).padStart(2, "0")}, ${String(insertDateObj.getHours()).padStart(2, "0")}:${String(insertDateObj.getMinutes()).padStart(2, "0")}:${String(insertDateObj.getSeconds()).padStart(2, "0")}`;
    if (item.chargeDate) {
      const chargeDateObj = new Date(item.chargeDate);
      chargeDate = `${chargeDateObj.getFullYear()}/${String(chargeDateObj.getMonth() + 1).padStart(2, "0")}/${String(chargeDateObj.getDate()).padStart(2, "0")}, ${String(chargeDateObj.getHours()).padStart(2, "0")}:${String(chargeDateObj.getMinutes()).padStart(2, "0")}:${String(chargeDateObj.getSeconds()).padStart(2, "0")}`;
    }
  } else if (isReceiptDocument) {
    financialItem = item.financialItemName;
    fromAccount = item.fromAccountName;
    toAccount = item.toAccountName;
    amount = `${item.amount} د.ل`;
    const insertDateObj = new Date(item.insertDate);
    insertDate = `${insertDateObj.getFullYear()}/${String(insertDateObj.getMonth() + 1).padStart(2, "0")}/${String(insertDateObj.getDate()).padStart(2, "0")}, ${String(insertDateObj.getHours()).padStart(2, "0")}:${String(insertDateObj.getMinutes()).padStart(2, "0")}:${String(insertDateObj.getSeconds()).padStart(2, "0")}`;
  }

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      paddingTop: 40,
      paddingHorizontal: 20,
      paddingBottom: 20,
      margin: 20,
      maxWidth: 400,
      width: "90%",
      position: "relative",
    },
    closeButton: {
      position: "absolute",
      top: 10,
      left: 10,
      padding: 10,
    },
    closeText: {
      fontSize: 30,
      color: theme.colors.primary,
    },
    statusIcon: {
      position: "absolute",
      top: -50,
      left: "50%",
      marginLeft: -20,
    },
    amount: {
      fontSize: 24,
      textAlign: "center",
      marginTop: 20,
      color: theme.colors.text,
    },
    detailsList: {},
    separator: {
      height: 1,
      backgroundColor: theme.colors.outline,
      width: "80%",
      alignSelf: "center",
      marginVertical: 10,
    },
    transactionCard: {
      backgroundColor: theme.colors.surface,
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
    },
    transactionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
    accountText: {
      fontSize: 16,
      color: theme.colors.text,
      flex: 1,
      textAlign: "center",
    },
    arrow: {
      marginHorizontal: 10,
    },
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={styles.modal}
        onPress={onClose}
        activeOpacity={1}
      >
        <View style={styles.container} onStartShouldSetResponder={() => true}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          {/* Status Icon at top center */}
          <Animated.View
            style={{
              position: "absolute",
              top: -49,
              left: "50%",
              marginLeft: -20,
              width: 100,
              height: 100,
              borderRadius: 50,
              borderWidth: 3,
              borderColor: item.isApproved ? "green" : "#ffc70dff",
              opacity: pulseAnim,
              zIndex: 20,
            }}
          />
          <View style={styles.statusIcon}>
            <IconComponent
              iconName={item.isApproved ? "check-circle" : "schedule"}
              iconSize={100}
              iconColor={item.isApproved ? "green" : "#ffc70dff"}
              iconContainerStyle={{ backgroundColor: theme.colors.surface }}
            />
          </View>

          {/* Amount centered bold */}
          <Text style={styles.amount}>{amount}</Text>

          {/* Vertical list of details */}
          <View style={styles.detailsList}>
            <InfoRow label="تاريخ الإصدار" value={insertDate} />
            {chargeDate ? (
              <InfoRow label="تاريخ الموافقة" value={chargeDate} />
            ) : null}
            <InfoRow label="البند المالي" value={financialItem} />
            <InfoRow label="المستند" value={`#${item.id}`} />
            {item.branchName ? (
              <InfoRow label="اسم الفرع" value={item.branchName} />
            ) : null}
            {item.branchId ? (
              <InfoRow label="معرف الفرع" value={item.branchId} />
            ) : null}
          </View>

          {/* Horizontal separator */}
          <View style={styles.separator} />

          {/* Transaction flow card */}
          <View style={styles.transactionCard}>
            <View style={styles.transactionRow}>
              <Text style={styles.accountText}>{toAccount}</Text>
              <View style={styles.arrow}>
                <IconComponent
                  iconName="arrow-back"
                  iconSize={24}
                  iconColor={theme.colors.primary}
                />
              </View>
              <Text style={styles.accountText}>{fromAccount}</Text>
            </View>
          </View>

          {/* Cancel request button for pending recharges */}
          {isChargeOrder && !item.isApproved && (
            <Button
              text="إلغاء الطلب"
              onPress={() => confirmationModalRef.current?.present()}
              style={{ marginTop: 20 }}
            />
          )}
        </View>
        <Button
          text="تحميل واصل PDF  "
          iconName="download"
          backgroundColor={theme.colors.primary}
          onPress={() => {
            // TODO: Implement PDF download functionality
            console.log("Download PDF receipt");
          }}
          style={{
            marginTop: 20,
            marginHorizontal: 20,
            marginLeft: 20,
            width: "90%",
          }}
        />
      </TouchableOpacity>
      <ConfirmationModal
        ref={confirmationModalRef}
        desc="هل أنت متأكد من إلغاء الطلب؟"
        onConfirm={() => onDelete(item)}
        onCancel={() => {}}
      />
    </Modal>
  );
}
