import api from "./api";

/* ==========================================================================
   TYPES & STRUCTURAL INTERFACES
   ========================================================================== */

export interface CreateSymptomPayload {
  userId: string;
  date: string; // ISO String
  symptoms: string[];
  severity: "MILD" | "MODERATE" | "SEVERE";
  notes?: string;
  category: "PHYSICAL" | "EMOTIONAL" | (string & {}); // Dynamic capture for custom texts
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  phase: "FOLLICULAR" | "OVULATORY" | "LUTEAL" | "MENSTRUATION" | "follicular";
}

export interface SymptomSubEntry {
  id: string;
  symptom: string;
  symptomId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SymptomRootRecord {
  id: string;
  userId: string;
  date: string;
  severity: "MILD" | "MODERATE" | "SEVERE";
  notes: string;
  category: string;
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  phase: string;
  createdAt: string;
  updatedAt: string;
  symptomEntries: SymptomSubEntry[];
}

// Meta pagination wrapper definition
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Standardized structure wrapper matching your Express API responses
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
  meta?: PaginationMeta;
}

/* ==========================================================================
   API SERVICE ACTIONS
   ========================================================================== */

// Create a new daily symptom entry record
export const createSymptom = async (
  payload: CreateSymptomPayload,
): Promise<ApiResponse<SymptomRootRecord>> => {
  const response = await api.post<ApiResponse<SymptomRootRecord>>(
    "/symptoms",
    payload,
  );
  return response.data;
};

// Get a specific symptom document log directly by its unique Object ID
export const getSymptomById = async (
  id: string,
): Promise<ApiResponse<SymptomRootRecord>> => {
  const response = await api.get<ApiResponse<SymptomRootRecord>>(
    `/symptoms/${id}`,
  );
  return response.data;
};

// Retrieve paginated historical list metrics belonging to a specific user
export const getSymptomsByUser = async (
  userId: string,
  page = 1,
  limit = 100,
): Promise<ApiResponse<SymptomRootRecord[]>> => {
  const response = await api.get<ApiResponse<SymptomRootRecord[]>>(
    `/symptoms/user/${userId}`,
    {
      params: { page, limit },
    },
  );
  return response.data;
};

// Modify an existing active symptom entry trace log
export const updateSymptom = async (
  id: string,
  payload: Partial<CreateSymptomPayload>,
): Promise<ApiResponse<SymptomRootRecord>> => {
  const response = await api.patch<ApiResponse<SymptomRootRecord>>(
    `/symptoms/${id}`,
    payload,
  );
  return response.data;
};

// Remove a specific symptom tracking node entirely from records
export const deleteSymptom = async (id: string): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/symptoms/${id}`);
  return response.data;
};
