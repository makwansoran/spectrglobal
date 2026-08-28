import { cookies } from "next/headers";
import { DEMO_COOKIE, readDemoSession } from "@/lib/demo-auth";

export async function getLocalSession() {
  const jar = await cookies();
  return readDemoSession(jar.get(DEMO_COOKIE)?.value);
}
