import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { EmailVerificationBanner } from "@/components/email-verification-banner"

import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  // Redirect users who signed up with Google and haven't provided a phone number
  if (!session.user.phone) {
    redirect("/onboarding")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex flex-col md:pl-64">
        <DashboardHeader />
        <EmailVerificationBanner />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
