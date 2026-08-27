"use client"

import { useQuery } from '@tanstack/react-query'
import Link from "next/link"
import { formatNaira } from "@/lib/packages"
import { CalendarDays, Users, ChevronRight, Clock, MapPin, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"

export default function BookingsPage() {
  const { data: session } = useSession()

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      if (!session?.accessToken) return []
      const API_URL = (process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8080") + "/api"
      const res = await fetch(`${API_URL}/bookings`, {
        headers: {
          "Authorization": `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        }
      })
      if (!res.ok) throw new Error("Failed to fetch bookings")
      return res.json()
    },
    enabled: !!session?.accessToken,
  })

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8 space-y-4">
        <div className="mb-8 space-y-2">
          <div className="h-8 w-48 bg-secondary/50 rounded-md animate-pulse"></div>
          <div className="h-4 w-64 bg-secondary/30 rounded-md animate-pulse"></div>
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="h-32 w-full rounded-2xl bg-secondary/20 animate-pulse border border-border"></div>
        ))}
      </div>
    )
  }

  // Ensure bookings is an array
  const safeBookings = Array.isArray(bookings) ? bookings : []

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">My Bookings</h1>
        <p className="text-muted-foreground">Track the status and payment progress of your packages.</p>
      </div>

      {safeBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-card">
          <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Clock className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No bookings yet</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            You haven't registered for any packages yet.
          </p>
          <Link 
            href="/packages"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Explore Packages
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {safeBookings.map((booking: any) => {
            const isConfirmed = booking.status === "Confirmed"
            const progressPercent = Math.min(100, Math.round((Number(booking.amountPaid) / Number(booking.totalAmount)) * 100))
            
            return (
              <Link key={booking.id} href={`/bookings/${booking.id}`}>
                <div className="flex flex-col sm:flex-row justify-between gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/50 transition-colors cursor-pointer group shadow-sm">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        isConfirmed ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                      }`}>
                        {booking.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs font-mono bg-secondary px-2 rounded">
                        {booking.bookingRef}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{booking.packageName}</h3>
                      <p className="text-sm text-muted-foreground">{booking.operatorName}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-foreground font-medium">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {booking.numberOfPilgrims} {booking.numberOfPilgrims === 1 ? 'Traveller' : 'Travellers'}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        {booking.departureDate}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-between sm:items-end border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-6 min-w-[200px]">
                    <div className="text-left sm:text-right w-full">
                      <div className="flex justify-between sm:justify-end gap-4 text-xs text-muted-foreground mb-1">
                        <span>Paid</span>
                        <span>Total</span>
                      </div>
                      <div className="flex justify-between sm:justify-end gap-2 items-baseline mb-2">
                        <span className="font-bold text-green-600">{formatNaira(booking.amountPaid)}</span>
                        <span className="text-muted-foreground">/</span>
                        <span className="font-semibold">{formatNaira(booking.totalAmount)}</span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors self-end mt-4">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
