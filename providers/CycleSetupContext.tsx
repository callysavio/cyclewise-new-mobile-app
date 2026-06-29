
import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";

export interface CycleSetupState {
  startDate?: string;          // Last period start
  cycleLength?: number;        // Average cycle length
  bleedingLength?: number;     // Period duration
  notes?: string;
  tags?: string[];
  type?: "NATURAL" | "PILL" | "IUD" | "UNKNOWN";
}

interface CycleSetupContextType {
  state: CycleSetupState;
  setState: (newState: Partial<CycleSetupState>) => void;
  reset: () => void;
  isValid: () => boolean;
}

const CycleSetupContext =
  createContext<CycleSetupContextType | null>(null);

export const CycleSetupProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, setStateInternal] =
    useState<CycleSetupState>({});

  const setState = (
    newState: Partial<CycleSetupState>
  ) => {
    setStateInternal((prev) => ({
      ...prev,
      ...newState,
    }));
  };

  const reset = () => setStateInternal({});

  const isValid = () => {
    if (!state.startDate) return false;
    if (!state.cycleLength) return false;
    if (!state.bleedingLength) return false;
    return true;
  };

  return (
    <CycleSetupContext.Provider
      value={{
        state,
        setState,
        reset,
        isValid,
      }}
    >
      {children}
    </CycleSetupContext.Provider>
  );
};

export const useCycleSetup = () => {
  const ctx = useContext(CycleSetupContext);

  if (!ctx) {
    throw new Error(
      "useCycleSetup must be used within CycleSetupProvider"
    );
  }

  return ctx;
};