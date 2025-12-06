import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { IconComponent } from "./Icon";
import Text from "./Text";

interface PaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
  theme: any;
}

export default function Pagination({
  currentPage,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  theme,
}: PaginationProps) {
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      {/* Previous Button */}
      {hasPreviousPage && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => onPageChange(currentPage - 1)}
        >
          <IconComponent
            iconName="back"
            iconSize={20}
            iconColor={theme.colors.primary}
          />
        </TouchableOpacity>
      )}

      {/* Previous Page Number */}
      {hasPreviousPage && (
        <TouchableOpacity
          style={styles.pageNumberContainer}
          onPress={() => onPageChange(currentPage - 1)}
        >
          <Text style={styles.pageNumberSecondary}>{currentPage - 1}</Text>
        </TouchableOpacity>
      )}

      {/* Current Page Number */}
      <View style={styles.currentPageContainer}>
        <Text style={styles.currentPageNumber}>{currentPage}</Text>
      </View>

      {/* Next Page Number */}
      {hasNextPage && (
        <TouchableOpacity
          style={styles.pageNumberContainer}
          onPress={() => onPageChange(currentPage + 1)}
        >
          <Text style={styles.pageNumberSecondary}>{currentPage + 1}</Text>
        </TouchableOpacity>
      )}

      {/* Next Button */}
      {hasNextPage && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => onPageChange(currentPage + 1)}
        >
          <IconComponent
            iconName="back"
            iconSize={20}
            iconColor={theme.colors.primary}
            iconContainerStyle={{ transform: [{ scaleX: -1 }] }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 30,
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[2],
      marginHorizontal: 16,
      marginVertical: theme.spacing[3],
    },
    button: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
    },
    disabledButton: {
      opacity: 0.5,
    },
    pageNumberContainer: {
      minWidth: 50,
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: theme.spacing[3],
    },
    pageNumber: {
      fontSize: 16,
      color: theme.colors.primary,
    },
    pageNumberSecondary: {
      fontSize: 14,
      color: theme.colors.text,
    },
    currentPageContainer: {
      minWidth: 50,
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: theme.spacing[3],
      backgroundColor: theme.colors.primary,
      borderRadius: 10,
      paddingHorizontal: theme.spacing[2],
      paddingVertical: theme.spacing[1],
    },
    currentPageNumber: {
      fontSize: 16,
      color: "white",
    },
  });
