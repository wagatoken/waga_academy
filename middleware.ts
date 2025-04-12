import { createServerClient } from "@/lib/supabase/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Create a Supabase client configured to use cookies
  const { supabase, response } = createServerClient(request)

  // If Supabase client couldn't be created, just proceed without auth checks
  if (!supabase) {
    console.error("Supabase client could not be created in middleware")
    return NextResponse.next()
  }

  try {
    // Refresh session if expired
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If accessing admin routes, check if user is authenticated and has admin role
    if (request.nextUrl.pathname.startsWith("/admin")) {
      if (!session) {
        // Not logged in, redirect to login page
        const redirectUrl = new URL("/login", request.url)
        redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }

      // Check if user has admin role
      const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

      // Handle the case where profile might not exist yet
      if (error || !profile || profile.role !== "admin") {
        // Not an admin, redirect to unauthorized page
        return NextResponse.redirect(new URL("/unauthorized", request.url))
      }
    }

    // If accessing community pages, check if user is authenticated
    if (request.nextUrl.pathname.startsWith("/community") || request.nextUrl.pathname.startsWith("/dashboard")) {
      if (!session) {
        // Not logged in, redirect to login page
        const redirectUrl = new URL("/login", request.url)
        redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }
    }

    return response
  } catch (error) {
    console.error("Middleware error:", error)
    // In case of an error, allow access to non-protected routes
    if (
      request.nextUrl.pathname.startsWith("/admin") ||
      request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/community")
    ) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return NextResponse.next()
  }
}

// Specify which routes this middleware should run for
export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/community/:path*"],
}
