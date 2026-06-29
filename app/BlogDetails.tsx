import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  EducationContentItem,
  getEducationalContentById,
  likeEducationalContent,
} from "@/services/education.service";

const { width, height } = Dimensions.get("window");

// ==============================
// BRAND TOKENS
// ==============================
const Colors = {
  background: "#FFFFFF",
  cardBg: "#FFFFFF",
  inputBg: "#FDF9F6",
  border: "#F0E4DC",
  cardBorder: "#F3F4F6",
  textDark: "#1C1C1E",
  textMuted: "#636366",
  textFaint: "#8E8E93",
  main: "#E5563D",
  mainSoft: "#FFF5F4",
  error: "#D64545",
  overlayBg: "rgba(28, 28, 30, 0.35)",
};

const placeholderImage = require("../assets/images/eduCont2.png");

const formatDate = (iso?: string) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

const estimateReadTime = (content?: string) => {
  const words = content?.trim()?.split(/\s+/).length || 0;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
};

const BlogScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [post, setPost] = useState<EducationContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const [showComments, setShowComments] = useState(false);
  const [slideAnim] = useState(new Animated.Value(height));
  const [newComment, setNewComment] = useState("");

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(false);
    try {
      const res = await getEducationalContentById(id);
      setPost(res.data);
      setLikesCount(res.data.likesCount ?? 0);
      setLiked(!!res.data.isLiked);
    } catch (e) {
      setError(true);
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const toggleComments = () => {
    if (!showComments) {
      setShowComments(true);
      Animated.timing(slideAnim, {
        toValue: height * 0.45,
        duration: 350,
        useNativeDriver: false,
      }).start();
    } else {
      handleCloseComments();
    }
  };

  const handleCloseComments = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 280,
      useNativeDriver: false,
    }).start(() => setShowComments(false));
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !post) return;
    // Optimistic local update — wire to addEducationalContentComment(id, text)
    // once that endpoint is confirmed on the backend.
    setPost({
      ...post,
      comments: [
        {
          id: `temp-${Date.now()}`,
          contentId: post.id,
          userId: "me",
          text: newComment,
          createdAt: new Date().toISOString(),
          user: { id: "me", name: "You" },
        },
        ...(post.comments ?? []),
      ],
      commentsCount: (post.commentsCount ?? 0) + 1,
    });
    setNewComment("");
  };

  const handleToggleLike = async () => {
    setLiked((prev) => !prev);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    try {
      if (id) await likeEducationalContent(id);
    } catch {
      setLiked((prev) => !prev);
      setLikesCount((prev) => (liked ? prev + 1 : prev - 1));
    }
  };

  const comments = post?.comments ?? [];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header with back arrow */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blog</Text>
        <View style={styles.backButton} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.main} />
        </View>
      ) : error || !post ? (
        <View style={styles.loadingContainer}>
          <Ionicons
            name="cloud-offline-outline"
            size={44}
            color={Colors.textFaint}
          />
          <Text style={styles.errorText}>Couldn&apos;t load this article.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchDetail}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.featuredCard}>
            <Image source={placeholderImage} style={styles.featuredImage} />
            <View style={styles.featuredTextContainer}>
              {post.tags?.length > 0 && (
                <View style={styles.tagRow}>
                  {post.tags.map((tag) => (
                    <View key={tag} style={styles.tagChip}>
                      <Text style={styles.tagChipText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
              <Text style={styles.featuredTitle}>{post.title}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>
                  {formatDate(post.createdAt)}
                </Text>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.metaText}>
                  {estimateReadTime(post.content)}
                </Text>
              </View>
              <Text style={styles.featuredDesc}>{post.content}</Text>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleToggleLike}
            >
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={20}
                color={Colors.main}
              />
              <Text style={styles.actionButtonText}>{likesCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={toggleComments}
            >
              <Ionicons
                name="chatbubble-outline"
                size={18}
                color={Colors.main}
              />
              <Text style={styles.actionButtonText}>
                Comments ({comments.length})
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {showComments && (
        <View style={styles.commentOverlay}>
          <TouchableWithoutFeedback onPress={handleCloseComments}>
            <View style={styles.overlayBackground} />
          </TouchableWithoutFeedback>

          <Animated.View style={[styles.commentSection, { top: slideAnim }]}>
            <TouchableOpacity
              style={styles.commentHandle}
              onPress={handleCloseComments}
              activeOpacity={0.7}
            />

            <ScrollView showsVerticalScrollIndicator={false}>
              {comments.length === 0 ? (
                <Text style={styles.noCommentsText}>
                  Be the first to comment on this article.
                </Text>
              ) : (
                comments.map((c) => (
                  <View key={c.id} style={styles.commentCard}>
                    <View style={styles.commentHeader}>
                      <View style={styles.commentAvatar}>
                        <Text style={styles.commentAvatarText}>
                          {(c.user?.name ?? "U").charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.commentUser}>
                          {c.user?.name ?? "User"}
                        </Text>
                        <Text style={styles.commentTime}>
                          {formatDate(c.createdAt)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.commentText}>{c.text}</Text>
                  </View>
                ))
              )}
            </ScrollView>

            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              keyboardVerticalOffset={80}
            >
              <View style={styles.commentInputContainer}>
                <TextInput
                  placeholder="Comment here..."
                  placeholderTextColor={Colors.textFaint}
                  style={styles.commentInput}
                  value={newComment}
                  onChangeText={setNewComment}
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleAddComment}
                >
                  <Ionicons name="send-outline" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default BlogScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: Platform.OS === "android" ? 10 : 4,
    paddingBottom: 8,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Lexend_700Bold",
    color: Colors.textDark,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  errorText: {
    fontFamily: "Lexend_400Regular",
    color: Colors.textMuted,
    marginTop: 12,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: Colors.main,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: { color: "#fff", fontFamily: "Lexend_600SemiBold" },
  featuredCard: {
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  featuredImage: { width: "100%", height: width * 0.4, resizeMode: "cover" },
  featuredTextContainer: { padding: 18 },
  tagRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  tagChip: {
    backgroundColor: Colors.mainSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  tagChipText: {
    color: Colors.main,
    fontSize: 11,
    fontFamily: "Lexend_600SemiBold",
    textTransform: "capitalize",
  },
  featuredTitle: {
    fontSize: 20,
    color: Colors.textDark,
    marginBottom: 8,
    fontFamily: "Lexend_700Bold",
  },
  metaRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  metaText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontFamily: "Lexend_400Regular",
  },
  metaDot: { marginHorizontal: 6, color: Colors.textMuted },
  featuredDesc: {
    fontSize: 15,
    color: "#3A3A3C",
    lineHeight: 23,
    fontFamily: "Lexend_400Regular",
  },
  actionsRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    paddingTop: 14,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  actionButtonText: {
    fontSize: 14,
    color: Colors.main,
    marginLeft: 6,
    fontFamily: "Lexend_600SemiBold",
  },
  commentOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayBackground: { flex: 1, backgroundColor: Colors.overlayBg },
  commentSection: {
    position: "absolute",
    left: 0,
    right: 0,
    height: height * 0.45,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    elevation: 20,
  },
  commentHandle: {
    width: 50,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 10,
  },
  noCommentsText: {
    textAlign: "center",
    color: Colors.textMuted,
    fontFamily: "Lexend_400Regular",
    marginTop: 30,
  },
  commentCard: {
    backgroundColor: Colors.inputBg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    backgroundColor: Colors.mainSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  commentAvatarText: {
    color: Colors.main,
    fontFamily: "Lexend_700Bold",
  },
  commentUser: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 14,
    color: Colors.textDark,
  },
  commentTime: {
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: "Lexend_400Regular",
  },
  commentText: {
    fontSize: 14,
    color: "#3A3A3C",
    lineHeight: 20,
    fontFamily: "Lexend_400Regular",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    paddingVertical: 10,
  },
  commentInput: {
    flex: 1,
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginRight: 8,
    textAlignVertical: "top",
    fontSize: 13,
    fontFamily: "Lexend_400Regular",
    color: Colors.textDark,
  },
  sendButton: {
    backgroundColor: Colors.main,
    padding: 10,
    borderRadius: 50,
  },
});
