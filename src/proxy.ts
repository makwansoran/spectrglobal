import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { safeNextPath } from "@/lib/auth/next-path";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";
import { updateSession } from "@/lib/supabase/middleware";

function isProtectedPath(pathname: string) {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/mfa") ||
    pathname === "/careers/apply" ||
    pathname.startsWith("/careers/apply/")
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/app" || pathname.startsWith("/app/") || pathname === "/login") {
    return updateSession(request);
  }

  if (!supabaseUrl() || !supabaseAnonKey()) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl(), supabaseAnonKey(), {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isProtectedPath(pathname) && process.env.NODE_ENV !== "development") {
    const url = request.nextUrl.clone();
    url.pathname = pathname.startsWith("/careers") ? "/careers/login" : "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user && pathname.startsWith("/login")) {
    const url = request.nextUrl.clone();
    url.pathname = safeNextPath(request.nextUrl.searchParams.get("next"));
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|downloads/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|exe|dmg|AppImage)$).*)",
  ],
};
