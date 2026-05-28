import type { Metadata } from "next";
import { FundingClient } from "@/components/funding-client";

export const metadata: Metadata = { title: "Business Orders" };

export default function PartnershipPage() {
  return <FundingClient />;
}
