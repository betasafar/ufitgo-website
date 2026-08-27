import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/login",
  },
})

export const config = {
  matcher: [
    "/wallet/:path*",
    "/dashboard/:path*",
    "/requests/:path*",
    "/compare/:path*"
  ]
}
