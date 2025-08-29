import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Middleware disabled for static export compatibility
// export function middleware(request: NextRequest) {
//   // Get the pathname of the request (e.g. /, /admin, /login)
//   const path = request.nextUrl.pathname

//   // Define paths that require authentication
//   const protectedPaths = ["/admin"]
//   const authPaths = ["/login", "/register"]

//   // Check if the current path is protected
//   const isProtectedPath = protectedPaths.some((protectedPath) => path.startsWith(protectedPath))

//   // Check if the current path is an auth path
//   const isAuthPath = authPaths.includes(path)

//   // For now, we'll let the client-side handle authentication
//   // In a real app, you'd check for valid tokens here

//   return NextResponse.next()
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// }
