import { Ionicons } from "@expo/vector-icons";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import moment from "moment";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  getNotifications,
  markNotificationRead,
} from "@/services/notification.service";

const Colors = {
  main: "#FF699C",
  mainSoft: "#FFF5F4",
  headerText: "#1C1C1E",
  textDark: "#1F1F1F",
  textMuted: "#6B7280",
  white: "#FFFFFF",
  background: "#FCFCFC",
  border: "#F3F4F6",
};

export default function NotificationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
      setNotifications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [fetchNotifications]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    for (const notif of unread) {
      await handleMarkRead(notif.id);
    }
  };

  const formatTime = (dateString: string) => {
    return moment(dateString).fromNow();
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Notifications",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "Lexend_600SemiBold",
            fontSize: 18,
            color: Colors.headerText,
          },
          headerStyle: {
            backgroundColor: Colors.white,
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerBackBtn}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.main} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={handleMarkAllAsRead}
              style={styles.headerRightBtn}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons
                name="checkmark-done-outline"
                size={22}
                color={Colors.main}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={Colors.main} />
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons
                name="notifications-outline"
                size={48}
                color={Colors.textMuted}
              />
            </View>
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptySubtitle}>
              Important updates and reminders will appear here
            </Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.main}
              />
            }
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.card, !item.isRead && styles.unreadCard]}
                activeOpacity={0.85}
                onPress={() => handleMarkRead(item.id)}
              >
                <View style={styles.cardContent}>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name={
                        item.isRead ? "notifications-outline" : "notifications"
                      }
                      size={22}
                      color={Colors.main}
                    />
                  </View>

                  <View style={styles.textContainer}>
                    <Text style={styles.title} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.message} numberOfLines={2}>
                      {item.message}
                    </Text>
                    <Text style={styles.time}>
                      {formatTime(item.createdAt)}
                    </Text>
                  </View>

                  {!item.isRead && <View style={styles.unreadDot} />}
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBackBtn: {
    marginLeft: 16,
    padding: 6,
  },
  headerRightBtn: {
    marginRight: 16,
    padding: 6,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  unreadCard: {
    borderColor: Colors.main,
    backgroundColor: Colors.mainSoft,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 15.5,
    color: Colors.textDark,
    marginBottom: 4,
  },
  message: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  time: {
    fontFamily: "Lexend_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 6,
  },
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: Colors.main,
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 17,
    color: Colors.textDark,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13.5,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
});
