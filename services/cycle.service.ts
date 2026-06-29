import api from "./api";

/* =========================
   TYPES — matched exactly to backend response
========================= */

export type CycleType = "NATURAL" | "PILL" | "IUD" | "UNKNOWN";

export type CyclePhase = "MENSTRUAL" | "FOLLICULAR" | "OVULATION" | "LUTEAL";

export interface Cycle {
  id: string;
  userId: string;
  startDate: string;
  endDate: string | null;
  isPredicted: boolean;
  ovulationDate: string | null;
  fertileWindowStart: string | null;
  fertileWindowEnd: string | null;
  bleedingLength: number | null;
  cycleLength: number | null;
  isIrregular: boolean;
  manuallyRecomputed: boolean;
  recomputedAt: string | null;
  notes: string | null;
  adminNotes: string | null;
  tags: string[];
  type: CycleType;
  phase: CyclePhase | null;
  createdAt: string;
  updatedAt: string;
}

/* =========================
   CREATE PAYLOAD — only fields the backend accepts
   (cycleLength, ovulationDate, fertileWindow*, isPredicted, isIrregular
   are all SERVER-COMPUTED — never send these from the client)
========================= */

export interface CreateCyclePayload {
  startDate: string; // "YYYY-MM-DD"
  endDate?: string; // "YYYY-MM-DD"
  notes?: string;
  adminNotes?: string;
  tags?: string[];
  type?: CycleType;
  phase?: CyclePhase;
  recomputedAt?: string;
  manuallyRecomputed?: boolean;
  bleedingLength?: number;
}

export interface UpdateCyclePayload extends Partial<CreateCyclePayload> {}

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
   CREATE CYCLE
========================= */

export const createCycle = async (
  payload: CreateCyclePayload,
): Promise<Cycle> => {
  try {
    const response = await api.post<ApiEnvelope<Cycle>>("/cycles", payload);
    return response.data.data;
  } catch (error: any) {
    console.log("CreateCycle error:", error?.response?.data || error);
    throw new Error(error?.response?.data?.message || "Failed to create cycle");
  }
};

/* =========================
   UPDATE CYCLE
========================= */

export const updateCycle = async (
  id: string,
  payload: UpdateCyclePayload,
): Promise<Cycle> => {
  try {
    const response = await api.patch<ApiEnvelope<Cycle>>(
      `/cycles/${id}`,
      payload,
    );
    return response.data.data; // ✅ fixed — was returning the whole envelope before
  } catch (error: any) {
    console.log("UpdateCycle error:", error?.response?.data || error);
    throw new Error(error?.response?.data?.message || "Failed to update cycle");
  }
};

/* =========================
   GET CYCLES
========================= */

export const getCycles = async (): Promise<Cycle[]> => {
  try {
    const response = await api.get<ApiEnvelope<Cycle[]>>("/cycles");
    return response.data.data ?? [];
  } catch (error: any) {
    console.log("GetCycles error:", error?.response?.data || error);
    throw new Error(error?.response?.data?.message || "Failed to fetch cycles");
  }
};

/* =========================
   GET SINGLE CYCLE
========================= */

export const getCycleById = async (id: string): Promise<Cycle> => {
  try {
    const response = await api.get<ApiEnvelope<Cycle>>(`/cycles/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.log("GetCycleById error:", error?.response?.data || error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch cycle"
    );
  }
};

/* =========================
   DELETE CYCLE
========================= */

export const deleteCycle = async (id: string): Promise<void> => {
  try {
    await api.delete(`/cycles/${id}`);
  } catch (error: any) {
    console.log("DeleteCycle error:", error?.response?.data || error);
    throw new Error(error?.response?.data?.message || "Failed to delete cycle");
  }
};
