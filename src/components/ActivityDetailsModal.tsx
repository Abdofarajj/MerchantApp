import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
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

  const downloadReceiptAsPdf = async (html: string) => {
    try {
      // Generate PDF from HTML
      const { uri } = await Print.printToFileAsync({ html });

      // Create a unique filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileName = `receipt-${item.id}-${timestamp}.pdf`;

      // Try to save to document directory (bypass TypeScript issues)
      const documentDir = (FileSystem as any).documentDirectory;
      if (documentDir) {
        const permanentUri = `${documentDir}${fileName}`;

        // Copy the PDF to permanent storage
        await FileSystem.copyAsync({
          from: uri,
          to: permanentUri,
        });

        // Show success message
        alert(`تم حفظ الإيصال بنجاح!\nالملف: ${fileName}`);
        console.log("PDF saved to:", permanentUri);
      } else {
        alert("غير قادر على الوصول إلى مساحة التخزين");
      }
    } catch (error) {
      console.log("PDF download error:", error);
      alert("حدث خطأ أثناء حفظ الإيصال");
    }
  };

  const shareReceiptAsPdf = async (html: string) => {
    try {
      // Generate PDF from HTML
      const { uri } = await Print.printToFileAsync({ html });

      // Share the PDF
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "مشاركة الإيصال",
      });
    } catch (error) {
      console.log("PDF share error:", error);
      alert("حدث خطأ أثناء مشاركة الإيصال");
    }
  };

  const generateReceiptHtml = (item: any) => {
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

    return `
  <html>
    <head>
      <style>
        body {
          font-family: "Segoe UI", Arial, sans-serif;
          direction: rtl;
          background: #f4f5f7;
          margin: 0;
          padding: 40px 0;
          display: flex;
          justify-content: center;
        }

        .receipt-container {
          width: 100%;
          padding: 35px 40px;
        }

        h1 {
          text-align: center;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 30px;
          color: #222;
        }

        /* ROW */
        .row {
          display: flex;
          gap: 18px;
          padding: 14px 16px;
          border-radius: 10px;
          margin-bottom: 14px;
        }

        /* Alternating Background */
        .row:nth-child(odd) {
          background: #ffffff;
        }
        .row:nth-child(even) {
          background: none;
        }

        /* Row Title */
        .row-title {
          min-width: 140px;
          max-width: 160px;
          display: flex;
          align-items: center;
          font-size: 17px;
          font-weight: 700;
          color: #333;
        }

        .col {
          flex: 1;
        }

        .label {
          display: inline;
          font-size: 13px;
          color: #555;
          font-weight: 700;
          margin-left: 8px;
        }

        .value {
          font-size: 16px;
          font-weight: 500;
          color: #222;
        }
      </style>
    </head>

    <body>
      <div class="receipt-container">

        <h1>الإيصال</h1>

        <!-- ROW 1 -->
        <div class="row">
          <div class="row-title">البيانات الأساسية</div>

          <div class="col">
            <span class="label">المبلغ:</span>
            <span class="value">${amount}</span>
          </div>

          <div class="col">
            <span class="label">تاريخ الإصدار:</span>
            <span class="value">${insertDate}</span>
          </div>

          ${
            chargeDate
              ? `
          <div class="col">
            <span class="label">تاريخ الموافقة:</span>
            <span class="value">${chargeDate}</span>
          </div>`
              : ""
          }
        </div>

        <!-- ROW 2 -->
        <div class="row">
          <div class="row-title">البند المالي</div>

          <div class="col">
            <span class="label">البند المالي:</span>
            <span class="value">${financialItem}</span>
          </div>

          ${
            isReceiptDocument && item.financialItemId
              ? `
          <div class="col">
            <span class="label">معرف البند المالي:</span>
            <span class="value">${item.financialItemId}</span>
          </div>`
              : ""
          }
        </div>

        <!-- ROW 3 -->
        <div class="row">
          <div class="row-title">بيانات المستند</div>

          <div class="col">
            <span class="label">رقم المستند:</span>
            <span class="value">#${item.id}</span>
          </div>

          ${
            item.branchName
              ? `
          <div class="col">
            <span class="label">اسم الفرع:</span>
            <span class="value">${item.branchName}</span>
          </div>`
              : ""
          }

          ${
            item.branchId
              ? `
          <div class="col">
            <span class="label">معرف الفرع:</span>
            <span class="value">${item.branchId}</span>
          </div>`
              : ""
          }
        </div>

        <!-- ROW 4 -->
        <div class="row">
          <div class="row-title">حساب المرسل</div>

          <div class="col">
            <span class="label">من:</span>
            <span class="value">${fromAccount}</span>
          </div>

          ${
            isReceiptDocument && item.fromAccountId
              ? `
          <div class="col">
            <span class="label">المعرف:</span>
            <span class="value">${item.fromAccountId}</span>
          </div>`
              : ""
          }

          ${
            isChargeOrder && item.distrputerId
              ? `
          <div class="col">
            <span class="label">المعرف:</span>
            <span class="value">${item.distrputerId}</span>
          </div>`
              : ""
          }
        </div>

        <!-- ROW 5 -->
        <div class="row">
          <div class="row-title">حساب المستلم</div>

          <div class="col">
            <span class="label">إلى:</span>
            <span class="value">${toAccount}</span>
          </div>

          ${
            isReceiptDocument && item.toAccountId
              ? `
          <div class="col">
            <span class="label">المعرف:</span>
            <span class="value">${item.toAccountId}</span>
          </div>`
              : ""
          }

          ${
            isChargeOrder && item.merchantId
              ? `
          <div class="col">
            <span class="label">معرف التاجر:</span>
            <span class="value">${item.merchantId}</span>
          </div>`
              : ""
          }
        </div>

        <!-- ROW 6 -->
        <div class="row">
          <div class="row-title">تفاصيل إضافية</div>

          ${
            item.appUserName
              ? `
          <div class="col">
            <span class="label">اسم المستخدم:</span>
            <span class="value">${item.appUserName}</span>
          </div>`
              : ""
          }

          ${
            item.isApproved !== undefined
              ? `
          <div class="col">
            <span class="label">معتمد:</span>
            <span class="value">${item.isApproved ? "إيصال معتمد" : "إيصال غير معتمد"}</span>
          </div>`
              : ""
          }
        </div>

        ${
          isChargeOrder
            ? `
        <!-- ROW 7 -->
        <div class="row">
          <div class="row-title">أوامر الشحن</div>

          ${
            item.chargeDocumentId
              ? `
          <div class="col">
            <span class="label">معرف الوثيقة:</span>
            <span class="value">${item.chargeDocumentId}</span>
          </div>`
              : ""
          }

          ${
            item.updateToken
              ? `
          <div class="col">
            <span class="label">رمز التحديث:</span>
            <span class="value">${item.updateToken}</span>
          </div>`
              : ""
          }
        </div>`
            : ""
        }

      </div>
    </body>
  </html>
`;
  };

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
            <InfoRow label="تاريخ الإصدار " value={insertDate} />
            {chargeDate ? (
              <InfoRow label="تاريخ الموافقة " value={chargeDate} />
            ) : null}
            <InfoRow label="البند المالي " value={financialItem} />
            <InfoRow label="المستند " value={`#${item.id}`} />
            {item.branchName ? (
              <InfoRow label="اسم الفرع " value={item.branchName} />
            ) : null}
            {item.branchId ? (
              <InfoRow label="معرف الفرع " value={item.branchId} />
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
        <View
          style={{ flexDirection: "row", marginTop: 20, marginHorizontal: 20 }}
        >
          <Button
            text="تحميل "
            iconName="download"
            backgroundColor={theme.colors.primary}
            onPress={() => downloadReceiptAsPdf(generateReceiptHtml(item))}
            style={{
              flex: 1,
              marginRight: 10,
            }}
          />
          <Button
            text="مشاركة "
            iconName="share"
            backgroundColor={theme.colors.secondary}
            onPress={() => shareReceiptAsPdf(generateReceiptHtml(item))}
            style={{
              flex: 1,
              marginLeft: 10,
            }}
          />
        </View>
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
