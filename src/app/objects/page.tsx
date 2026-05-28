import type { Metadata } from "next";
import { ObjectsClient } from "@/components/objects-client";

export const metadata: Metadata = { title: "Catalog" };

export default function ObjectsPage() {
  return <ObjectsClient />;
}
