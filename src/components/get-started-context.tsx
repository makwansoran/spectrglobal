"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type GetStartedTab = "contact" | "partnership" | "investor";

type GetStartedContextValue = {
  open: boolean;
  tab: GetStartedTab;
  openGetStarted: (tab?: GetStartedTab) => void;
  closeGetStarted: () => void;
  setTab: (tab: GetStartedTab) => void;
};

const GetStartedContext = createContext<GetStartedContextValue | null>(null);

export function GetStartedProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<GetStartedTab>("contact");

  const openGetStarted = useCallback((nextTab: GetStartedTab = "contact") => {
    setTab(nextTab);
    setOpen(true);
  }, []);

  const closeGetStarted = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeGetStarted();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeGetStarted]);

  const value = useMemo(
    () => ({ open, tab, openGetStarted, closeGetStarted, setTab }),
    [open, tab, openGetStarted, closeGetStarted],
  );

  return <GetStartedContext.Provider value={value}>{children}</GetStartedContext.Provider>;
}

export function useGetStarted() {
  const context = useContext(GetStartedContext);
  if (!context) {
    throw new Error("useGetStarted must be used within GetStartedProvider");
  }
  return context;
}
