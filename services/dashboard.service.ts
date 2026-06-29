import api from "./api";

/* =========================
   TYPES — matched exactly to backend response
========================= */

export type DashboardPhase =
  | "MENSTRUAL"
  | "FOLLICULAR"
  | "OVULATION"
  | "LUTEAL"
  | "UNKNOWN";
export type SeverityLevel = "MILD" | "MODERATE" | "SEVERE" | null;

export interface PredictionSummary {
  currentPhase: DashboardPhase;
  daysUntilNextPeriod: number | null;
  pregnancyOdds: "HIGH" | "MEDIUM" | "LOW";
  ovulationDate: string | null;
  isPredicted: boolean;
  cycleId?: string;
}

export interface WeeklyLogDay {
  date: string; // "YYYY-MM-DD"
  hasLog: boolean;
  isPeriodDay: boolean;
  symptoms: string[];
  severity: SeverityLevel;
}

/* =========================
   RESPONSE ENVELOPE
========================= */

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
}

/* =========================
   TYPES — Cycles & Pregnancy Odds
========================= */

export interface PregnancyOddsResponse {
  odds: "LOW" | "MEDIUM" | "HIGH";
  ovulationDate: string | null;
  daysFromOvulation: number;
  targetDate: string;
}

export interface CycleSummaryResponse {
  totalCycles: number;
  averageCycleLength: number;
  shortestCycle: number;
  longestCycle: number;
  irregularCycles: number;
  irregularityPercentage: number;
  averagePeriodLength: number;
}

/* =========================
   TYPES — SYMPTOMS LOG HISTORY
========================= */

export interface SymptomEntryItem {
  id: string;
  symptom: string;
  symptomId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSymptomLog {
  id: string;
  userId: string;
  date: string;
  severity: "MILD" | "MODERATE" | "SEVERE";
  notes: string;
  category: "PHYSICAL" | "EMOTIONAL";
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  phase: string;
  createdAt: string;
  updatedAt: string;
  symptomEntries: SymptomEntryItem[];
}

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserSymptomsParams {
  page?: number;
  limit?: number;
  search?: string;
  severity?: string;
}

export enum InsightType {
  NUTRIENT = "NUTRIENT",
  EXERCISE = "EXERCISE",
  ENERGY = "ENERGY",
  WARNING = "WARNING",
}

export interface InsightActionCard {
  id: string;
  type: InsightType;
  title: string;
  summary: string;
  content: string;
  scientificContext?: string;
  actionStep: string;
}

export interface DailyInsightsPayload {
  currentPhase: string;
  headline: string;
  actionCards: InsightActionCard[];
}

export const getDailyInsights = async (): Promise<DailyInsightsPayload> => {
  try {
    const response =
      await api.get<ApiEnvelope<DailyInsightsPayload>>("/insights/daily");
    return response.data.data;
  } catch (error: any) {
    console.log(
      "getDailyInsights system exception:",
      error?.response?.data || error,
    );
    throw new Error(
      error?.response?.data?.message || "Failed to compile wellness insights",
    );
  }
};

/* =========================
   GET PREDICTION SUMMARY
========================= */

export const getPredictionSummary = async (): Promise<PredictionSummary> => {
  try {
    const response = await api.get<ApiEnvelope<PredictionSummary>>(
      "/dashboard/prediction-summary",
    );
    return response.data.data;
  } catch (error: any) {
    console.log("GetPredictionSummary error:", error?.response?.data || error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch prediction summary",
    );
  }
};

/* =========================
   GET WEEKLY LOGS
========================= */

export const getWeeklyLogs = async (
  startDate: string, // "YYYY-MM-DD"
  endDate: string, // "YYYY-MM-DD"
): Promise<WeeklyLogDay[]> => {
  try {
    const response = await api.get<ApiEnvelope<WeeklyLogDay[]>>(
      `/dashboard/weekly-logs?startDate=${startDate}&endDate=${endDate}`,
    );
    return response.data.data ?? [];
  } catch (error: any) {
    console.log("GetWeeklyLogs error:", error?.response?.data || error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch weekly calendar logs",
    );
  }
};
/* =========================
   GET PREGNANCY ODDS BY DATE
========================= */

export const getPregnancyOdds = async (
  cycleId: string,
  dateIsoString: string,
): Promise<PregnancyOddsResponse> => {
  try {
    const response = await api.get<ApiEnvelope<PregnancyOddsResponse>>(
      `/cycles/${cycleId}/pregnancy-odds?date=${dateIsoString}`,
    );
    return response.data.data;
  } catch (error: any) {
    console.log("GetPregnancyOdds error:", error?.response?.data || error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch pregnancy odds",
    );
  }
};

/* =========================
   GET CYCLES SUMMARY STATS
========================= */

export const getCyclesSummary = async (): Promise<CycleSummaryResponse> => {
  try {
    const response =
      await api.get<ApiEnvelope<CycleSummaryResponse>>("/cycles/summary");
    return response.data.data;
  } catch (error: any) {
    console.log("GetCyclesSummary error:", error?.response?.data || error);
    throw new Error(
      error?.response?.data?.message ||
        "Failed to fetch cycle analytics summary",
    );
  }
};
/* =========================
   GET USER SYMPTOMS METHOD
========================= */

export const getUserSymptomsHistory = async (
  userId: string,
  params: UserSymptomsParams = {},
): Promise<{ data: UserSymptomLog[]; meta: PaginatedMeta }> => {
  try {
    const { page = 1, limit = 15, search = "", severity = "" } = params;

    // Constructing query string dynamically
    let queryString = `page=${page}&limit=${limit}`;
    if (search.trim())
      queryString += `&search=${encodeURIComponent(search.trim())}`;
    if (severity) queryString += `&severity=${severity}`;

    const response = await api.get<{
      success: boolean;
      message: string;
      statusCode: number;
      data: UserSymptomLog[];
      meta: PaginatedMeta;
    }>(`/symptoms/user/${userId}?${queryString}`);

    return {
      data: response.data.data || [],
      meta: response.data.meta || {
        total: 0,
        page: 1,
        limit: 15,
        totalPages: 1,
      },
    };
  } catch (error: any) {
    console.log(
      "getUserSymptomsHistory network exception:",
      error?.response?.data || error,
    );
    throw new Error(
      error?.response?.data?.message ||
        "Failed to fetch symptom history records",
    );
  }
};
