"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { formatNaira } from "@/lib/packages"
import { getBookingStatusPresentation, isCancelledBooking, matchesBookingFilter } from "@/lib/booking"
import { type Booking } from "@/types/booking"
import { Bell, BellRing, Package, X, CalendarDays, Users, ChevronRight, Clock, Briefcase, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DashboardOverview() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const [isLoaded, setIsLoaded] = useState(false)
  const [allNotifications, setAllNotifications] = useState<any[]>([])

  const { data: bookingsData, isLoading: isBookingsLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      if (!session?.accessToken) return []
      const API_URL = (process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8080") + "/api"
      const res = await fetch(`${API_URL}/bookings`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      })
      if (!res.ok) return []
      return res.json()
    },
    enabled: !!session?.accessToken,
  })

  useEffect(() => {
    if (session?.user?.id && session?.accessToken) {
      import("@/lib/api").then(({ fetchUserNotifications }) => {
        fetchUserNotifications(session.user.id, session.accessToken as string)
          .then((data) => {
            if (Array.isArray(data)) {
              setAllNotifications(data)
            }
          })
          .catch((err) => console.error("Failed to load notifications:", err))
          .finally(() => setIsLoaded(true))
      })
    } else {
      setIsLoaded(true)
    }
  }, [session])

  if (!isLoaded) return <div className="p-8">Loading dashboard...</div>

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  const unreadCount = allNotifications.filter((n) => !n.read).length
  const unreadAlerts = allNotifications.filter((n) => !n.read)

  const tabs = [
    { name: "My Bookings", href: "/bookings" },
    { name: "Explore Packages", href: "/packages" },
    { name: "Verified Operators", href: "/operators" },
    { name: "Travel Support", href: "/support" },
  ]

  const safeBookings = (Array.isArray(bookingsData) ? bookingsData : []) as Booking[]
  const activeBookings = safeBookings.filter((b) => !isCancelledBooking(b))
  const actionRequiredCount = activeBookings.filter((b) =>
    matchesBookingFilter(b, "ACTION_REQUIRED"),
  ).length
  const inProgressCount = activeBookings.filter((b) =>
    matchesBookingFilter(b, "IN_PROGRESS"),
  ).length
  const completedCount = activeBookings.filter((b) =>
    matchesBookingFilter(b, "COMPLETED"),
  ).length

  const handleDismiss = (id: string) => {
    setAllNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
    import("@/lib/api").then(({ markNotificationAsRead }) => {
      markNotificationAsRead(id, session?.accessToken as string).catch((err) =>
        console.error("Failed to dismiss:", err),
      )
    })
  }

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
            Assalamu Alaikum, {(session?.user as any)?.firstName || "Pilgrim"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your Hajj and Umrah package bookings and travel milestones.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="hidden sm:inline-block font-medium">{today}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative outline-none">
                <Bell className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 border-2 border-background rounded-full"></span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 p-0 rounded-2xl shadow-xl border-border/50"
            >
              <div className="p-4 border-b border-border/50">
                <h3 className="font-bold text-foreground font-serif">
                  Notifications
                </h3>
                <p className="text-xs text-muted-foreground">
                  You have {unreadCount} unread message
                  {unreadCount !== 1 ? "s" : ""}.
                </p>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {allNotifications.length > 0 ? (
                  allNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-border/20 hover:bg-slate-50 transition-colors ${!notification.read ? "bg-amber-50/30" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <BellRing
                            className={`w-4 h-4 ${!notification.read ? "text-amber-500" : "text-muted-foreground"}`}
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p
                            className={`text-sm ${!notification.read ? "font-bold text-foreground" : "font-medium text-muted-foreground"}`}
                          >
                            {notification.title || notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground/70 font-medium">
                            {new Date(
                              notification.createdAt,
                            ).toLocaleDateString()}{" "}
                            at{" "}
                            {new Date(
                              notification.createdAt,
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-sm text-muted-foreground font-medium">
                    No notifications yet.
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Alerts */}
      {unreadAlerts.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {unreadAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center gap-2 bg-card border border-border rounded-full py-2 px-4 text-sm shadow-sm transition-all hover:shadow-md"
            >
              <BellRing className="w-3 h-3 text-amber-500" />
              <span className="font-semibold text-foreground ml-1">
                {alert.title || alert.message}
              </span>
              <span className="text-muted-foreground text-xs mx-1">
                {new Date(alert.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => handleDismiss(alert.id)}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Pills */}
      <div className="bg-card border border-border rounded-full p-2 flex gap-1 overflow-x-auto hide-scrollbar shadow-sm my-6">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (pathname === "/dashboard" && tab.name === "My Bookings")

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"}`}
            >
              {tab.name}
            </Link>
          )
        })}
      </div>

      {/* Booking Tracking Summary Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/bookings"
          className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:border-primary/40 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Active Bookings
            </span>
            <Briefcase className="h-4 w-4 text-primary" />
          </div>
          <p className="text-3xl font-bold font-serif text-foreground">
            {activeBookings.length}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {actionRequiredCount > 0
              ? `${actionRequiredCount} requiring action`
              : "All active registrations"}
          </p>
        </Link>

        <Link
          href="/bookings"
          className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:border-primary/40 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              In Progress
            </span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-3xl font-bold font-serif text-foreground">
            {inProgressCount}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Upcoming departures & payment plans
          </p>
        </Link>

        <Link
          href="/bookings"
          className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:border-primary/40 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Completed Trips
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold font-serif text-foreground">
            {completedCount}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Fulfilled Hajj & Umrah journeys
          </p>
        </Link>
      </div>

      {/* My Bookings & Tracking List */}
      <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-lg font-serif">
              My Bookings & Trip Tracking
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select any booking to track its status, upload travel documents, or pay an installment.
            </p>
          </div>
          <Link
            href="/bookings"
            className="text-primary text-sm font-bold hover:underline"
          >
            View All
          </Link>
        </div>

        {isBookingsLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-28 w-full rounded-2xl bg-secondary/30 animate-pulse border border-border"
              />
            ))}
          </div>
        ) : activeBookings.length > 0 ? (
          <div className="space-y-4">
            {activeBookings.slice(0, 5).map((booking) => {
              const statusPresentation = getBookingStatusPresentation(booking)
              const progressPercent = Math.min(
                100,
                Math.round(
                  (Number(booking.amountPaid || 0) /
                    Math.max(1, Number(booking.totalAmount || 1))) *
                    100,
                ),
              )

              return (
                <Link key={booking.id} href={`/bookings/${booking.id}`}>
                  <div className="flex flex-col sm:flex-row justify-between gap-4 p-5 rounded-2xl border border-border bg-slate-50/70 hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusPresentation.className}`}
                        >
                          {statusPresentation.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs font-mono bg-secondary px-2 rounded">
                          {booking.bookingRef}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">
                          {booking.packageName}
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium">
                          {booking.operatorName}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-foreground font-semibold">
                        <div className="flex items-center gap-1.5">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {booking.numberOfPilgrims}{" "}
                          {booking.numberOfPilgrims === 1
                            ? "Traveller"
                            : "Travellers"}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          {booking.departureDate}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between sm:items-end border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-6 min-w-[210px]">
                      <div className="text-left sm:text-right w-full">
                        <div className="flex justify-between sm:justify-end gap-4 text-xs text-muted-foreground mb-1">
                          <span>Paid</span>
                          <span>Total</span>
                        </div>
                        <div className="flex justify-between sm:justify-end gap-2 items-baseline mb-2">
                          <span className="font-bold text-green-600">
                            {formatNaira(booking.amountPaid)}
                          </span>
                          <span className="text-muted-foreground">/</span>
                          <span className="font-semibold">
                            {formatNaira(booking.totalAmount)}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-1 text-xs font-bold text-primary mt-4 group-hover:translate-x-0.5 transition-transform">
                        Track Booking <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-border">
            <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4">
              <Package className="h-6 w-6 text-muted-foreground/60" />
            </div>
            <h3 className="font-bold text-foreground mb-2">
              No active bookings yet
            </h3>
            <p className="text-muted-foreground text-sm mb-6 font-medium">
              Browse verified Hajj and Umrah packages to register and track your booking here.
            </p>
            <Link href="/packages">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl px-8 h-11 shadow-sm">
                Explore Packages
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
