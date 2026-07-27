"use client";

import { useEffect } from "react";
import { useGetStarted } from "@/components/get-started-context";

/** Opens the Get Started sidebar when visiting /contact. */
export function OpenGetStartedOnMount() {
  const { openGetStarted } = useGetStarted();

  useEffect(() => {
    openGetStarted("contact");
  }, [openGetStarted]);

  return null;
}
