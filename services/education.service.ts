import api from "./api";

/* ==========================================================================
   TYPES
   ========================================================================== */

export type Language =
  | "ENGLISH"
  | "YORUBA"
  | "HAUSA"
  | "FRENCH"
  | "SPANISH"
  | "GERMAN"
  | "ITALIAN"
  | "PORTUGUESE"
  | "DUTCH"
  | "RUSSIAN"
  | "CHINESE"
  | "JAPANESE"
  | "KOREAN"
  | "ARABIC"
  | "HINDI"
  | "BENGALI"
  | "URDU"
  | "TURKISH"
  | "VIETNAMESE"
  | "THAI"
  | "INDONESIAN"
  | "MALAY";

export interface ContentAuthor {
  id: string;
  name?: string;
  avatar?: string;
}

export interface CommentItem {
  id: string;
  contentId: string;
  userId: string;
  text: string;
  createdAt: string;
  user?: ContentAuthor;
}

export interface EducationContentItem {
  id: string;
  title: string;
  content: string;
  language: Language;
  tags: string[];
  createdAt: string;
  owner: string;
  user?: ContentAuthor;
  commentsCount?: number;
  likesCount?: number;
  isLiked?: boolean;
  comments?: CommentItem[];
}

// Matches the exact shape your backend returns for the list endpoint
export interface PaginatedListResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
  hasNext: boolean;
  hasPrev: boolean;
  totalPages: number;
}

// Matches the shape for single-resource endpoints
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
}

/* ==========================================================================
   API SERVICE ACTIONS
   ========================================================================== */

// Get a paginated list of educational content
export const getEducationalContent = async (
  page = 1,
  limit = 10,
): Promise<PaginatedListResponse<EducationContentItem[]>> => {
  const response = await api.get<PaginatedListResponse<EducationContentItem[]>>(
    "/educational-content",
    { params: { page, limit } },
  );
  return response.data;
};

// Get a single educational content item by id
export const getEducationalContentById = async (
  id: string,
): Promise<ApiResponse<EducationContentItem>> => {
  const response = await api.get<ApiResponse<EducationContentItem>>(
    `/educational-content/${id}`,
  );
  return response.data;
};

// NOTE: Like / comment-creation endpoints weren't included in what you shared.
// Wire these up once you confirm the routes — likely something like:
// POST /educational-content/:id/like
// POST /educational-content/:id/comments
export const likeEducationalContent = async (
  id: string,
): Promise<ApiResponse<{ liked: boolean; likesCount: number }>> => {
  const response = await api.post<
    ApiResponse<{ liked: boolean; likesCount: number }>
  >(`/educational-content/${id}/like`);
  return response.data;
};

export const addEducationalContentComment = async (
  id: string,
  text: string,
): Promise<ApiResponse<CommentItem>> => {
  const response = await api.post<ApiResponse<CommentItem>>(
    `/educational-content/${id}/comments`,
    { text },
  );
  return response.data;
};
