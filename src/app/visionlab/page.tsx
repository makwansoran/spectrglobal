import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/logo";
import { VisionLabLoginForm } from "./login-form";
import "./visionlab.css";

export const metadata: Metadata = {
  title: { absolute: "VisionLab" },
};

export default function VisionLabDownloadPage() {
  return (
    <main id="main-content" className="fixed inset-0 bg-black text-white">
      <Link href="/" className="absolute left-5 top-5 inline-flex items-center gap-2">
        <LogoMark invert className="h-5 w-5" title="" />
        <Wordmark className="text-[13px] text-white" />
      </Link>
      <VisionLabLoginForm />
    </main>
  );
}
