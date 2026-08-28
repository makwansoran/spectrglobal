import { NextResponse, type NextRequest } from "next/server";
import { safeNextPath } from "@/lib/auth/next-path";
import { DEMO_COOKIE, readDemoSession } from "@/lib/demo-auth";

function needsLocalAuth(pathname: string) {
  return (
    pathname.startsWith("/dashboard") ||
    pathname === "/app" ||
    pathname.startsWith("/app/")
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await readDemoSession(request.cookies.get(DEMO_COOKIE)?.value);

  if (needsLocalAuth(pathname) && !session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname === "/login" && session) {
    const url = request.nextUrl.clone();
    url.pathname = safeNextPath(request.nextUrl.searchParams.get("next"), "/dashboard");
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|downloads/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|exe|dmg|AppImage)$).*)",
  ],
};
