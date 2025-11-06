import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface AvatarProps {
  style?: any;
}

export default function Avatar({ style }: AvatarProps) {
  return (
    <View style={[styles.avatar, style]}>
      <Ionicons name="person" size={20} color="white" />
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
});
