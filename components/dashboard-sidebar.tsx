"use client"

import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UfitGoLogo } from "@/components/ufitgo-logo"
import { History, Settings, HelpCircle, IdCard, Home, Package, Briefcase, Bell, LogOut } from "lucide-react"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const sidebarSections = [
  {
    title: "OVERVIEW",
    links: [
      { name: "Dashboard", href: "/dashboard", icon: Home },
    ]
  },
  {
    title: "PILGRIMAGE",
    links: [
      { name: "Packages", href: "/packages", icon: Package },
      { name: "Bookings", href: "/bookings", icon: Briefcase },
      { name: "Payment History", href: "/transactions", icon: History },
    ]
  },
  {
    title: "SERVICES",
    links: [
      { name: "Passport Assistance", href: "/passport", icon: IdCard },
    ]
  },
  {
    title: "SUPPORT",
    links: [
      { name: "Travel Support", href: "/support", icon: HelpCircle },
    ]
  }
]

export function DashboardSidebarContent() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <UfitGoLogo className="h-8 w-auto" />
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
        </button>
      </div>

      {/* User Profile Summary */}
      {session?.user && (
        <div className="px-6 py-4">
          <Link href="/profile" className="flex items-center gap-3 rounded-lg bg-card p-3 shadow-sm transition-colors hover:bg-secondary/50">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{session?.user?.firstName?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{session?.user?.firstName} {session?.user?.lastName}</span>
            </div>
          </Link>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-hide">
        {sidebarSections.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h4 className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground/70">
              {section.title}
            </h4>
            <div className="space-y-1">
              {section.links.map((link) => {
                const isActive = pathname.startsWith(link.href)
                const Icon = link.icon
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-accent/10 text-accent font-semibold" 
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", isActive ? "text-accent" : "text-muted-foreground")} />
                    {link.name}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}

        <div className="mt-8 mb-4">
          <h4 className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground/70">
            ACCOUNT
          </h4>
          <Link 
            href="/settings"
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors mb-1",
              pathname.startsWith("/settings")
                ? "bg-accent/10 text-accent font-semibold" 
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <Settings className={cn("h-4 w-4", pathname.startsWith("/settings") ? "text-accent" : "text-muted-foreground")} />
            Settings
          </Link>
          <button 
            onClick={() => setIsLogoutOpen(true)}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>

      <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden sm:rounded-2xl border-0 shadow-2xl">
          <div className="bg-red-500/5 px-6 pt-10 pb-8 text-center relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/40 via-red-500 to-red-500/40"></div>
            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-red-500/10 mb-4">
              <LogOut className="h-8 w-8 text-red-500 ml-1" />
            </div>
            <DialogHeader className="sm:text-center">
              <DialogTitle className="text-2xl font-bold font-serif text-foreground">Sign Out</DialogTitle>
              <DialogDescription className="text-sm mt-2">
                Are you sure you want to sign out of your UfitGo account?
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="px-6 pb-8 pt-2 flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1 h-12 text-base font-bold rounded-xl"
              onClick={() => setIsLogoutOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 h-12 text-base font-bold rounded-xl shadow-md hover:shadow-lg transition-all bg-red-600 hover:bg-red-700 text-white"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Yes, Sign out
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function DashboardSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-[#FDFBF7] md:flex">
      <DashboardSidebarContent />
    </aside>
  )
}
