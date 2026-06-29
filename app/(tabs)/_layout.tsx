import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

// ==============================
// BRAND TOKENS
// ==============================
const Colors = {
  main: "#FF699C",
  mainSoft: "#FFF5F4",
  inactive: "#9ca3af",
  headerText: "#1C1C1E",
  white: "#FFFFFF",
};

// Reusable tab icon bubble so every tab stays visually identical
const TabIcon = ({
  name,
  color,
  focused,
  size = 20,
}: {
  name: string;
  color: string;
  focused: boolean;
  size?: number;
}) => (
  <View
    style={{
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: focused ? Colors.mainSoft : "transparent",
    }}
  >
    <Icon name={name} size={size} color={focused ? Colors.main : color} />
  </View>
);

// Reusable header title so typography stays identical across screens
const HeaderTitle = ({ title }: { title: string }) => (
  <Text
    style={{
      fontFamily: "Lexend_600SemiBold",
      fontSize: 18,
      color: Colors.headerText,
    }}
  >
    {title}
  </Text>
);

// Reusable back arrow so behavior/styling stays identical across screens
const HeaderBack = ({ onPress }: { onPress: () => void }) => (
  <Pressable onPress={onPress} style={{ marginLeft: 16, padding: 4 }}>
    <Icon name="arrow-back" size={24} color={Colors.main} />
  </Pressable>
);

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const sharedHeaderStyle = {
    backgroundColor: Colors.white,
    elevation: 0,
    shadowOpacity: 0,
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.main,
        tabBarInactiveTintColor: Colors.inactive,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 80 + insets.bottom,
          paddingBottom: insets.bottom + 20,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          fontFamily: "Lexend_400Regular",
        },
      }}
    >
      {/* 🏠 Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home-outline" color={color} focused={focused} />
          ),
        }}
      />

      {/* 📅 Track */}
      <Tabs.Screen
        name="track"
        options={{
          title: "Track",
          headerShown: true,
          headerTitleAlign: "center",
          headerTitle: () => <HeaderTitle title="Cycle Tracker" />,
          headerLeft: () => <HeaderBack onPress={() => router.replace("/")} />,
          headerStyle: sharedHeaderStyle,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="checkmark-circle-outline"
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      {/* 📰 Blog / Educational Content */}
      <Tabs.Screen
        name="blog"
        options={{
          title: "Blog",
          headerShown: true,
          headerTitleAlign: "center",
          headerTitle: () => <HeaderTitle title="Educational Content" />,
          headerLeft: () => <HeaderBack onPress={() => router.replace("/")} />,
          headerStyle: sharedHeaderStyle,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="book-outline" color={color} focused={focused} />
          ),
        }}
      />

      {/* ⚙️ Settings */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: true,
          headerTitleAlign: "center",
          headerTitle: () => <HeaderTitle title="Settings" />,
          headerLeft: () => <HeaderBack onPress={() => router.replace("/")} />,
          headerStyle: sharedHeaderStyle,
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name="person-outline"
              color={color}
              focused={focused}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
