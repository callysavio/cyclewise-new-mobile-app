import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ImageBackground,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  EducationContentItem,
  getEducationalContent,
} from "@/services/education.service";

// ==============================
// BRAND COLORS
// ==============================
const Colors = {
  background: "#FFFFFF",
  text: "#11181C",
  subtext: "#6B7280",
  accent: "#e75480",
  accentSoft: "#FDE9EF",
  tint: "#0a7ea4",
  tintLight: "#D1F0F8",
  cardBg: "#FFFFFF",
  inputBg: "#F5F5F7",
  border: "#ECECEC",
};

const { width } = Dimensions.get("window");
const CARD_HEIGHT = width < 380 ? 170 : width < 768 ? 190 : 220;
const TITLE_SIZE = width < 380 ? 16 : 18;
const PAGE_LIMIT = 10;

const estimateReadTime = (content: string) => {
  const words = content?.trim()?.split(/\s+/).length || 0;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
};

// ==============================
// CARD
// ==============================
interface BlogCardProps {
  post: EducationContentItem;
  onPress: (post: EducationContentItem) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onPress }) => {
  const placeholderImage = require("../../assets/images/image1.png");

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => onPress(post)}
      style={styles.cardContainer}
    >
      <ImageBackground
        source={placeholderImage}
        style={[styles.cardImage, { height: CARD_HEIGHT }]}
        imageStyle={styles.cardImageRadius}
        resizeMode="cover"
      >
        <View style={styles.cardGradientOverlay}>
          {post.tags?.length > 0 && (
            <View style={styles.tagRow}>
              {post.tags.slice(0, 2).map((tag) => (
                <View key={tag} style={styles.tagChip}>
                  <Text style={styles.tagChipText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          <Text
            style={[styles.cardTitle, { fontSize: TITLE_SIZE }]}
            numberOfLines={2}
          >
            {post.title}
          </Text>

          <View style={styles.cardStatsRow}>
            <View style={styles.cardStatItem}>
              <Ionicons name="chatbubble-outline" size={13} color="#fff" />
              <Text style={styles.cardStats}>{post.commentsCount ?? 0}</Text>
            </View>
            <View style={styles.cardStatItem}>
              <Ionicons name="heart-outline" size={13} color="#fff" />
              <Text style={styles.cardStats}>{post.likesCount ?? 0}</Text>
            </View>
            <Text style={styles.cardStatsDot}>•</Text>
            <Text style={styles.cardStats}>
              {estimateReadTime(post.content)}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

// ==============================
// EMPTY / ERROR STATES
// ==============================
const EmptyState: React.FC<{ searching: boolean }> = ({ searching }) => (
  <View style={styles.emptyContainer}>
    <Ionicons
      name={searching ? "search-outline" : "newspaper-outline"}
      size={48}
      color={Colors.subtext}
    />
    <Text style={styles.emptyTitle}>
      {searching ? "No matching articles" : "No content yet"}
    </Text>
    <Text style={styles.emptySubtitle}>
      {searching
        ? "Try a different keyword."
        : "Check back soon — new articles are on the way."}
    </Text>
  </View>
);

const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <View style={styles.emptyContainer}>
    <Ionicons name="cloud-offline-outline" size={48} color={Colors.subtext} />
    <Text style={styles.emptyTitle}>Something went wrong</Text>
    <Text style={styles.emptySubtitle}>
      We couldn&apos;t load the content. Pull down to retry.
    </Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryButtonText}>Retry</Text>
    </TouchableOpacity>
  </View>
);

// ==============================
// MAIN COMPONENT
// ==============================
const EducationalContentOne: React.FC = () => {
  const router = useRouter();

  const [allPosts, setAllPosts] = useState<EducationContentItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const fetchPage = useCallback(async (pageToLoad: number, replace = false) => {
    try {
      setError(false);
      const res = await getEducationalContent(pageToLoad, PAGE_LIMIT);
      setAllPosts((prev) => (replace ? res.data : [...prev, ...res.data]));
      setHasNext(res.hasNext);
      setPage(pageToLoad);
    } catch {
      setError(true);
    }
  }, []);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    await fetchPage(1, true);
    setLoading(false);
  }, [fetchPage]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPage(1, true);
    setRefreshing(false);
  };

  const onLoadMore = async () => {
    if (!hasNext || loadingMore || query.trim().length > 0) return;
    setLoadingMore(true);
    await fetchPage(page + 1, false);
    setLoadingMore(false);
  };

  const handleOpenPost = (post: EducationContentItem) => {
    router.push({
      pathname: "/BlogDetails",
      params: { id: post.id },
    });
  };

  const filteredPosts = query.trim()
    ? allPosts.filter((p) => {
        const haystack =
          `${p.title} ${p.content} ${p.tags?.join(" ")}`.toLowerCase();
        return haystack.includes(query.trim().toLowerCase());
      })
    : allPosts;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Search Bar */}
      <View
        style={[
          styles.searchContainer,
          { borderColor: isSearchFocused ? Colors.accent : Colors.border },
        ]}
      >
        <Ionicons name="search" size={20} color={Colors.subtext} />
        <TextInput
          placeholder="Search articles, topics, tags..."
          placeholderTextColor={Colors.subtext}
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Ionicons name="close-circle" size={18} color={Colors.subtext} />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      ) : error && allPosts.length === 0 ? (
        <ErrorState onRetry={loadInitial} />
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BlogCard post={item} onPress={handleOpenPost} />
          )}
          contentContainerStyle={styles.postList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.accent}
            />
          }
          onEndReachedThreshold={0.4}
          onEndReached={onLoadMore}
          ListEmptyComponent={
            <EmptyState searching={query.trim().length > 0} />
          }
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator
                size="small"
                color={Colors.accent}
                style={{ marginVertical: 16 }}
              />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
};

// ==============================
// STYLES
// ==============================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 10 : 4,
    paddingBottom: 6,
  },
  headerTitle: {
    fontFamily: "Lexend",
    fontSize: width < 380 ? 22 : 26,
    fontWeight: "700",
    color: Colors.text,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 48,
    marginHorizontal: 20,
    marginTop: -20,
    marginBottom: 16,
    borderWidth: 1.5,
    backgroundColor: Colors.inputBg,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    fontFamily: "Lexend",
    color: Colors.text,
  },
  postList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  cardContainer: {
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 18,
    backgroundColor: Colors.cardBg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    justifyContent: "flex-end",
  },
  cardImageRadius: {
    borderRadius: 18,
  },
  cardGradientOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.42)",
    padding: 16,
  },
  tagRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  tagChip: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  tagChipText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "Lexend",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  cardTitle: {
    fontFamily: "Lexend",
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  cardStatsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardStatItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  cardStats: {
    fontFamily: "Lexend",
    fontSize: 13,
    color: "#f1f1f1",
    marginLeft: 4,
  },
  cardStatsDot: {
    color: "#f1f1f1",
    marginRight: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontFamily: "Lexend",
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 14,
  },
  emptySubtitle: {
    fontFamily: "Lexend",
    fontSize: 14,
    color: Colors.subtext,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: Colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: "#fff",
    fontFamily: "Lexend",
    fontWeight: "600",
  },
});

export default EducationalContentOne;
