import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) return NextResponse.redirect(new URL("/", request.url));

  try {
    await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET_KEY!)
    );

    return NextResponse.next();
  } catch (error) {
    if (request.nextUrl.pathname !== "/")
      return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/home", "/upload", "/profile", "/images/:path*"],
};
