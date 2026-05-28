import type { Metadata } from "next";
import { InvestorsClient } from "@/components/investors-client";

export const metadata: Metadata = { title: "Customer Login" };

export default function InvestorsPage() {
  return <InvestorsClient />;
}
