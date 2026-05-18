import { createContext, useContext } from "react";
import type { CommodityProfile } from "../types/commodity";

const CommodityProfileContext = createContext<CommodityProfile | null>(null);

export function CommodityProfileProvider({
  commodity,
  children,
}: {
  commodity: CommodityProfile;
  children: React.ReactNode;
}) {
  return (
    <CommodityProfileContext.Provider value={commodity}>{children}</CommodityProfileContext.Provider>
  );
}

export function useCommodityProfile() {
  const ctx = useContext(CommodityProfileContext);
  if (!ctx) throw new Error("useCommodityProfile must be used within CommodityProfileLayout");
  return ctx;
}
