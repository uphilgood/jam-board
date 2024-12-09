import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key"; // Use env for production

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value; // Get token from cookies

  if (!token) {
    // If no token is found, redirect to the login page
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Verify the JWT token
    jwt.verify(token, SECRET_KEY);
    // If verification passes, continue with the request
    return NextResponse.next();
  } catch (error) {
    console.error("Invalid token:", error);
    // If verification fails, redirect to the login page
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/boards/:path*"], // Apply the middleware to specific routes
};
