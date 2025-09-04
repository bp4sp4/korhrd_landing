import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 어드민 페이지 경로 확인 (단, /admin 자체는 제외)
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    request.nextUrl.pathname !== "/admin"
  ) {
    // Supabase 인증 쿠키 확인
    const supabaseAccessToken = request.cookies.get("sb-access-token");
    const supabaseRefreshToken = request.cookies.get("sb-refresh-token");

    // 인증 토큰이 없으면 로그인 페이지로 리다이렉트
    if (!supabaseAccessToken && !supabaseRefreshToken) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
