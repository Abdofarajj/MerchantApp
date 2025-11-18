import React, { useCallback } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import Text from "../components/Text";
import { darkTheme, lightTheme } from "../theme";
import POSCard from "./POSCard";

interface POSDevicesSectionProps {
  posData: any[] | undefined;
  posLoading: boolean;
  posError: any;
  onDevicePress?: (device: any) => void;
}

export default function POSDevicesSection({
  posData,
  posLoading,
  posError,
  onDevicePress,
}: POSDevicesSectionProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  const renderPOSDevice = useCallback(
    ({ item }: { item: any }) => (
      <POSCard device={item} onPress={() => onDevicePress?.(item)} />
    ),
    [onDevicePress]
  );

  const styles = StyleSheet.create({
    posHeader: {
      flexDirection: "row-reverse",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
      marginHorizontal: 16,
      marginTop: 20,
    },
    sectionTitle: {
      fontSize: 20,
      color: theme.colors.text,
      textAlign: "right",
    },
    viewAllText: {
      color: theme.colors.primary,
      fontSize: 14,
    },
  });

  return (
    <View>
      <View style={styles.posHeader}>
        <Text style={styles.sectionTitle}>نقاط البيع</Text>
        <TouchableOpacity
          onPress={() => Alert.alert("Devices", "عرض جميع الأجهزة")}
        >
          <Text style={styles.viewAllText}>عرض الكل</Text>
        </TouchableOpacity>
      </View>

      {/* Loading state */}
      {posLoading && (
        <Text
          style={{
            textAlign: "center",
            color: theme.colors.textSecondary,
            marginVertical: 20,
          }}
        >
          جارٍ تحميل أجهزة نقاط البيع...
        </Text>
      )}

      {/* Error state */}
      {posError && (
        <Text
          style={{
            textAlign: "center",
            color: theme.colors.error,
            marginVertical: 20,
          }}
        >
          فشل في تحميل أجهزة نقاط البيع
        </Text>
      )}

      {/* Devices list */}
      {posData && posData.length > 0 && (
        <FlatList
          data={posData}
          renderItem={renderPOSDevice}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={{ paddingHorizontal: 5 }}
          columnWrapperStyle={{ flexDirection: "row-reverse" }}
        />
      )}

      {/* Empty state */}
      {posData && posData.length === 0 && !posLoading && (
        <Text
          style={{
            textAlign: "center",
            color: theme.colors.textSecondary,
            marginVertical: 20,
          }}
        >
          لم يتم العثور على أجهزة نقاط البيع
        </Text>
      )}
    </View>
  );
}
