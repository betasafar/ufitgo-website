"use client"

import { Menu, Bell } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { UfitGoLogo } from "@/components/ufitgo-logo"
import { DashboardSidebarContent } from "@/components/dashboard-sidebar"
import { useSession } from "next-auth/react"

export function DashboardHeader() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-4 md:hidden">
      <div className="flex items-center">
        <Sheet>
          <SheetTrigger className="text-muted-foreground hover:text-foreground">
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-[#FDFBF7]">
            <DashboardSidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-1 justify-center pl-4">
        <UfitGoLogo className="h-8 w-auto" />
      </div>

      <div className="flex items-center gap-3">
        <button className="text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold text-xs">
          {session?.user?.firstName?.charAt(0) || ""}{session?.user?.lastName?.charAt(0) || "U"}
        </div>
      </div>
    </header>
  )
}
