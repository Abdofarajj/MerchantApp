"use client"

import { Ionicons } from "@expo/vector-icons"
import { useRef, useState } from "react"
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from "react-native"
import POSCard from "../components/POSCard"
import Screen from "../components/Screen"
import { darkTheme, lightTheme } from "../theme"

const { width: screenWidth } = Dimensions.get("window")

// Mock POS devices data
const mockPOSDevices = [
  {
    id: "1",
    serialNumber: "SN-A75-001234",
    model: "A75 Pro",
    addressName: "Main Store - Downtown Branch",
    status: "active" as const,
  },
  {
    id: "2",
    serialNumber: "SN-A75-001235",
    model: "A75 Pro",
    addressName: "North Branch",
    status: "active" as const,
  },
  {
    id: "3",
    serialNumber: "SN-A75-001236",
    model: "A75 Pro",
    addressName: "West Branch",
    status: "inactive" as const,
  },
  {
    id: "4",
    serialNumber: "SN-A75-001237",
    model: "A75 Pro",
    addressName: "East Branch",
    status: "active" as const,
  },
  {
    id: "5",
    serialNumber: "SN-A75-001238",
    model: "A75 Pro",
    addressName: "South Branch",
    status: "active" as const,
  },
]

export default function HomeScreen() {
  const colorScheme = useColorScheme()
  const theme = colorScheme === "dark" ? darkTheme : lightTheme
  const scrollViewRef = useRef<ScrollView>(null)
  const [currentPage, setCurrentPage] = useState(0)

  // Calculate number of pages (4 cards per page)
  const cardsPerPage = 4
  const totalPages = Math.ceil((mockPOSDevices.length + 1) / cardsPerPage)

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x
    const page = Math.round(contentOffsetX / screenWidth)
    setCurrentPage(page)
  }

  const styles = StyleSheet.create({
    scrollContent: {
      paddingHorizontal: 16,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 12,
    },
    avatarContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: "#14B8A6",
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      color: "#fff",
      fontSize: 20,
      fontWeight: "bold",
    },
    greetingContainer: {
      flex: 1,
    },
    greetingText: {
      fontSize: 14,
      color: "#14B8A6",
      fontWeight: "500",
    },
    merchantName: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    balanceCard: {
      marginHorizontal: 20,
      marginVertical: 16,
      backgroundColor: "#14B8A6",
      borderRadius: 20,
      padding: 24,
      shadowColor: "#14B8A6",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 10,
    },
    balanceLabel: {
      fontSize: 14,
      color: "rgba(255, 255, 255, 0.95)",
      fontWeight: "500",
      marginBottom: 8,
    },
    balanceAmount: {
      fontSize: 42,
      fontWeight: "bold",
      color: "#fff",
      letterSpacing: 1,
    },
    balanceCurrency: {
      fontSize: 18,
      color: "rgba(255, 255, 255, 0.95)",
      marginTop: 4,
    },
    actionButtonsContainer: {
      flexDirection: "row",
      paddingHorizontal: 20,
      gap: 12,
      marginBottom: 24,
    },
    actionButton: {
      flex: 1,
      backgroundColor: "#14B8A6",
      borderRadius: 16,
      paddingVertical: 20,
      paddingHorizontal: 16,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#14B8A6",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 6,
      minHeight: 100,
    },
    actionButtonSecondary: {
      backgroundColor: "#06B6D4",
    },
    actionButtonIcon: {
      marginBottom: 8,
    },
    actionButtonText: {
      fontSize: 15,
      fontWeight: "700",
      color: "#fff",
      textAlign: "center",
    },
    actionButtonSubtext: {
      fontSize: 11,
      color: "rgba(255, 255, 255, 0.9)",
      marginTop: 4,
      textAlign: "center",
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    viewAllButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    viewAllText: {
      fontSize: 14,
      color: "#14B8A6",
      fontWeight: "600",
    },
    posDevicesContainer: {
      marginBottom: 20,
    },
    posCardsWrapper: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: 14,
    },
    posCardContainer: {
      width: (screenWidth - 40) / 2,
    },
    addDeviceCard: {
      margin: 6,
      backgroundColor: "#F1F5F9",
      borderRadius: 15,
      borderWidth: 2,
      borderColor: "#14B8A6",
      borderStyle: "dashed",
      minHeight: 290,
      alignItems: "center",
      justifyContent: "center",
    },
    addDeviceIcon: {
      marginBottom: 12,
    },
    addDeviceText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#14B8A6",
    },
    paginationContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 12,
      marginBottom: 20,
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#CBD5E1",
      marginHorizontal: 4,
    },
    paginationDotActive: {
      backgroundColor: "#14B8A6",
      width: 24,
    },
  })

  return (
    <Screen useSafeArea backgroundColor="#F8FAFC">
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.avatarContainer}>
            <Ionicons name="person" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>Welcome,</Text>
            <Text style={styles.merchantName}>Ahmad Store</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#14B8A6" />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Account Balance</Text>
          <Text style={styles.balanceAmount}>125,450</Text>
          <Text style={styles.balanceCurrency}>IQD</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
            <Ionicons name="wallet-outline" size={28} color="#fff" style={styles.actionButtonIcon} />
            <Text style={styles.actionButtonText}>Request Credit</Text>
            <Text style={styles.actionButtonSubtext}>طلب رصيد</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.actionButtonSecondary]} activeOpacity={0.8}>
            <Ionicons name="cash-outline" size={28} color="#fff" style={styles.actionButtonIcon} />
            <Text style={styles.actionButtonText}>Collect Funds</Text>
            <Text style={styles.actionButtonSubtext}>تحصيل الرصيد</Text>
          </TouchableOpacity>
        </View>

        {/* POS Devices Section */}
        <View style={styles.posDevicesContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My POS Devices</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color="#14B8A6" />
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
              <View key={pageIndex} style={[styles.posCardsWrapper, { width: screenWidth }]}>
                {mockPOSDevices.slice(pageIndex * cardsPerPage, (pageIndex + 1) * cardsPerPage).map((device) => (
                  <View key={device.id} style={styles.posCardContainer}>
                    <POSCard {...device} />
                  </View>
                ))}

                {/* Add New Device Card */}
                {pageIndex === totalPages - 1 && mockPOSDevices.length % cardsPerPage !== 0 && (
                  <View style={styles.posCardContainer}>
                    <TouchableOpacity style={styles.addDeviceCard} activeOpacity={0.7}>
                      <Ionicons name="add-circle-outline" size={48} color="#14B8A6" style={styles.addDeviceIcon} />
                      <Text style={styles.addDeviceText}>Add New Device</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          {/* Pagination Dots */}
          {totalPages > 1 && (
            <View style={styles.paginationContainer}>
              {Array.from({ length: totalPages }).map((_, index) => (
                <View key={index} style={[styles.paginationDot, currentPage === index && styles.paginationDotActive]} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  )
}
