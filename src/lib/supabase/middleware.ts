import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";
import { DEMO_COOKIE, readDemoSession } from "@/lib/demo-auth";
import { safeNextPath } from "@/lib/auth/next-path";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const path = request.nextUrl.pathname;
  const isApp = path === "/app" || path.startsWith("/app/");
  const isLogin = path === "/login";

  const demoUser = await readDemoSession(request.cookies.get(DEMO_COOKIE)?.value);

  const url = supabaseUrl();
  const key = supabaseAnonKey();

  let user: { id: string } | null = null;

  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    });

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  }

  const signedIn = Boolean(user || demoUser);

  if (isApp && !signedIn) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/login";
    redirect.searchParams.set("next", path);
    return NextResponse.redirect(redirect);
  }

  if (isLogin && signedIn) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = safeNextPath(request.nextUrl.searchParams.get("next"), "/dashboard");
    redirect.search = "";
    return NextResponse.redirect(redirect);
  }

  return supabaseResponse;
}
