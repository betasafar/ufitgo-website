import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

// Bypass local self-signed cert issues only in development
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  const originalEmit = process.emit;
  (process as any).emit = function (name: any, data: any, ...args: any[]) {
    if (name === "warning" && data && data.name === "Warning" && data.message.includes("NODE_TLS_REJECT_UNAUTHORIZED")) {
      return false;
    }
    return originalEmit.apply(process, [name, data, ...args] as any);
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL 
  ? `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api` 
  : (process.env.NEXT_PUBLIC_USER_API_URL || "http://localhost:8080/api");

export const authOptions: any = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }
        
        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            }),
            headers: { "Content-Type": "application/json" }
          })
          
          let data;
          const text = await res.text();
          try {
            data = JSON.parse(text);
          } catch (e) {
            console.error("Non-JSON response from auth backend:", text.substring(0, 200));
            throw new Error(`Authentication server error: ${text.substring(0, 50)}`);
          }
          
          if (res.ok && data?.success && data?.user) {
            // Include backend JWT token in user object so it gets passed to jwt callback
            return { ...data.user, token: data.token }
          }
          
          throw new Error(data?.message || "Invalid credentials")
        } catch (error: any) {
          throw new Error(error.message || "Authentication failed")
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }: any) {
      // Initial sign in
      if (account && user) {
        if (account.provider === "google") {
          // Handshake Google id_token with our backend
          try {
            const res = await fetch(`${API_URL}/auth/google-login`, {
              method: 'POST',
              body: JSON.stringify({ token: account.id_token }),
              headers: { "Content-Type": "application/json" }
            })
            const data = await res.json()
            if (res.ok && data.success) {
              token.accessToken = data.token
              token.id = data.user.id
              token.email = data.user.email
              token.firstName = data.user.firstName
              token.lastName = data.user.lastName
              token.phone = data.user.phone
              token.location = data.user.location
              token.kycStatus = data.user.kycStatus
              token.isVerified = data.user.isVerified
            } else {
              token.error = "GoogleLoginBackendError"
            }
          } catch (e) {
            token.error = "GoogleLoginNetworkError"
          }
        } else if (account.provider === "credentials") {
          // Credentials login already fetched everything in authorize()
          token.accessToken = user.token
          token.id = user.id
          token.email = user.email
          token.firstName = user.firstName
          token.lastName = user.lastName
          token.phone = user.phone
          token.location = user.location
          token.kycStatus = user.kycStatus
          token.isVerified = user.isVerified
        }
      }
      return token
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.phone = token.phone as string | undefined
        session.user.location = token.location as string | undefined
        session.user.kycStatus = token.kycStatus as string | undefined
        session.user.isVerified = token.isVerified as boolean | undefined
        session.accessToken = token.accessToken as string | undefined
        session.error = token.error as string | undefined
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
