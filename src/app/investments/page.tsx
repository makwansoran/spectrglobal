import type { Metadata } from "next";
import { InvestmentsClient } from "@/components/investments-client";

export const metadata: Metadata = { title: "Drones" };

export default function InvestmentsPage() {
  return <InvestmentsClient />;
}
