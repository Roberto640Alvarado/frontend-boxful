import { NextRequest, NextResponse } from "next/server";

const PRIVATE_ROUTES = ["/home", "/history"];
const PUBLIC_ONLY_ROUTES = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  const isPrivate = PRIVATE_ROUTES.some((r) => pathname.startsWith(r));
  const isPublicOnly = PUBLIC_ONLY_ROUTES.some((r) => pathname.startsWith(r));
  const isKnown = isPrivate || isPublicOnly;

  if (isPrivate && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublicOnly && token) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (!isKnown) {
    return NextResponse.redirect(
      new URL(token ? "/home" : "/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};