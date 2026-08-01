import type { Metadata } from "next";
import "./os.css";

export const metadata: Metadata = {
  title: "Spectr OS",
  description: "Spectr OS — command, metaphysics, catalog, map, and Argus.",
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="spectr-os fixed inset-0 z-[200] overflow-hidden bg-white text-[#16181d]">
      {children}
    </div>
  );
}
