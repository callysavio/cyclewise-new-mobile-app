import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { Cycle, getCycles } from "@/services/cycle.service";
import { useAuth } from "@/providers/AuthProviders";

/* =========================
   TYPES
========================= */

interface CycleContextType {
  cycles: Cycle[];
  currentCycle: Cycle | null;
  loading: boolean;
  refreshCycles: () => Promise<void>;
  setCurrentCycle: (cycle: Cycle) => void;
}

/* =========================
   CONTEXT
========================= */

const CycleContext =
  createContext<CycleContextType | null>(null);

/* =========================
   PROVIDER
========================= */

export const CycleProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [currentCycle, setCurrentCycle] =
    useState<Cycle | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Auth state
  const { isAuthenticated, loading: authLoading } =
    useAuth();

  /* =========================
     FETCH CYCLES
  ========================= */

  const fetchCycles = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getCycles();

      setCycles(data);

      if (data.length > 0) {
        setCurrentCycle(data[0]); // latest cycle
      } else {
        setCurrentCycle(null);
      }
    } catch (error) {
      console.log("FetchCycle error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  /* =========================
     EFFECT (AUTH-GUARDED)
  ========================= */

  useEffect(() => {
    // ⏳ Wait for auth bootstrap to complete
    if (authLoading) return;

    // 🚫 Do nothing if not logged in
    if (!isAuthenticated) {
      setCycles([]);
      setCurrentCycle(null);
      setLoading(false);
      return;
    }

    // ✅ Safe to fetch now
    fetchCycles();
  }, [isAuthenticated, authLoading, fetchCycles]);

  /* =========================
     CONTEXT VALUE
  ========================= */

  return (
    <CycleContext.Provider
      value={{
        cycles,
        currentCycle,
        loading,
        refreshCycles: fetchCycles,
        setCurrentCycle,
      }}
    >
      {children}
    </CycleContext.Provider>
  );
};

/* =========================
   HOOK
========================= */

export const useCycle = () => {
  const ctx = useContext(CycleContext);

  if (!ctx) {
    throw new Error(
      "useCycle must be used within CycleProvider"
    );
  }

  return ctx;
};