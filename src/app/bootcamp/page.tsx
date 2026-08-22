import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { SpectrBootcamp } from "@/components/sections/spectr-bootcamp";
import { getAuthUser } from "@/lib/auth/guards";
import { spectrBootcamp } from "@/lib/content";
import { buildPageMetadata } from "@/lib/metadata";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";

export const metadata: Metadata = buildPageMetadata({
  title: "SPECTR BOOTCAMP",
  description: spectrBootcamp.body,
  path: spectrBootcamp.href,
});

export default async function BootcampPage() {
  const signedIn = await isBootcampSignedIn();

  return (
    <>
      <main id="main-content" className="flex-1 bg-white">
        <SpectrBootcamp signedIn={signedIn} />
      </main>
      <Footer />
    </>
  );
}

async function isBootcampSignedIn() {
  if (!supabaseUrl() || !supabaseAnonKey()) return false;
  const { user } = await getAuthUser();
  return Boolean(user);
}
