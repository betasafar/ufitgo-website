"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { getWalletBalance, getSavingsTargets, getBookings, SavingsTarget, BookingRecord } from "@/lib/mock-db"
import { formatNaira } from "@/lib/packages"
import { Bell, BellRing, Package, X, Eye, EyeOff, CalendarDays, Users, ChevronRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export default function DashboardOverview() {
  const { data: session } = useSession()
  const pathname = usePathname()
  
  const [balance, setBalance] = useState(0)
  const [targets, setTargets] = useState<SavingsTarget[]>([])
  const [bookings, setBookings] = useState<BookingRecord[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [showBalance, setShowBalance] = useState(true)
  
  const [allNotifications, setAllNotifications] = useState<any[]>([])

  useEffect(() => {
    setBalance(getWalletBalance())
    setTargets(getSavingsTargets())
    setBookings(getBookings().reverse()) // Newest first

    if (session?.user?.id && session?.accessToken) {
      import("@/lib/api").then(({ fetchUserNotifications }) => {
        fetchUserNotifications(session.user.id, session.accessToken as string)
          .then((data) => {
            if (Array.isArray(data)) {
              setAllNotifications(data)
            }
          })
          .catch(err => console.error("Failed to load notifications:", err))
          .finally(() => setIsLoaded(true))
      })
    } else {
      setIsLoaded(true)
    }
  }, [session])

  if (!isLoaded) return <div className="p-8">Loading dashboard...</div>

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const unreadCount = allNotifications.filter(n => !n.read).length
  const unreadAlerts = allNotifications.filter(n => !n.read)

  const tabs = [
    { name: "Explore Packages", href: "/packages" },
    { name: "Travel Amenities", href: "/amenities" },
    { name: "Target Savings", href: "/wallet" },
    { name: "Travel Support", href: "/support" }
  ]

  const activeTarget = targets[0]
  const recentBooking = bookings[0]

  const handleDismiss = (id: string) => {
    setAllNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    import("@/lib/api").then(({ markNotificationAsRead }) => {
      markNotificationAsRead(id, session?.accessToken as string)
        .catch(err => console.error("Failed to dismiss:", err))
    })
  }

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
          Good morning, {(session?.user as any)?.firstName || "Ahmed"}
        </h1>
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
            <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl shadow-xl border-border/50">
              <div className="p-4 border-b border-border/50">
                <h3 className="font-bold text-foreground font-serif">Notifications</h3>
                <p className="text-xs text-muted-foreground">You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}.</p>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {allNotifications.length > 0 ? (
                  allNotifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border-b border-border/20 hover:bg-slate-50 transition-colors ${!notification.read ? 'bg-amber-50/30' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <BellRing className={`w-4 h-4 ${!notification.read ? 'text-amber-500' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className={`text-sm ${!notification.read ? 'font-bold text-foreground' : 'font-medium text-muted-foreground'}`}>
                            {notification.title || notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground/70 font-medium">
                            {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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
          {unreadAlerts.map(alert => (
            <div key={alert.id} className="flex items-center gap-2 bg-card border border-border rounded-full py-2 px-4 text-sm shadow-sm transition-all hover:shadow-md">
              <BellRing className="w-3 h-3 text-amber-500" />
              <span className="font-semibold text-foreground ml-1">{alert.title || alert.message}</span>
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
        {tabs.map(tab => {
          // Determine if active loosely based on path or default to Explore Packages for home
          const isActive = pathname === tab.href || (pathname === "/dashboard" && tab.name === "Explore Packages")
          
          return (
            <Link 
              key={tab.name}
              href={tab.href}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'}`}
            >
              {tab.name}
            </Link>
          )
        })}
      </div>

      {/* Split Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left: Target Savings & Active Requests */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Target Savings */}
          <div className="bg-card rounded-3xl border border-border p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
              <svg className="w-48 h-48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 22h20L12 2z" />
              </svg>
            </div>
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="font-bold text-lg font-serif">My Umrah Target 🕋</h3>
              <Link href="/wallet" className="text-primary text-sm font-bold hover:underline">
                View All
              </Link>
            </div>

            {activeTarget ? (
              <div className="relative z-10">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="text-foreground font-bold text-xl">{activeTarget.name}</p>
                    <p className="text-sm text-muted-foreground font-medium mt-1">
                      {formatNaira(activeTarget.savedAmount)} / {formatNaira(activeTarget.targetAmount)}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {Math.round((activeTarget.savedAmount / activeTarget.targetAmount) * 100)}% complete
                  </p>
                </div>
                
                <div className="w-full bg-secondary rounded-full h-3 mt-4 mb-4 overflow-hidden">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${Math.min(100, (activeTarget.savedAmount / activeTarget.targetAmount) * 100)}%` }}
                  ></div>
                </div>
                
                <Link href={`/wallet/target/${activeTarget.id}`}>
                  <Button variant="outline" className="w-full justify-between h-12 rounded-xl font-bold hover:bg-secondary">
                    Manage Target <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-6 relative z-10">
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Package className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm mb-4 font-medium">
                  Start saving early for your spiritual journey.
                </p>
                <Link href="/wallet/target/new" className="w-full">
                  <Button className="w-full h-12 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground">Create Target</Button>
                </Link>
              </div>
            )}
          </div>



        </div>

        {/* Right: Wallet */}
        <div className="bg-card rounded-[2rem] border border-border p-8 shadow-sm flex flex-col h-full">
          <div>
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-6">UfitGo Wallet</h4>
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-5xl font-black font-serif tracking-tighter text-foreground">
                {showBalance ? formatNaira(balance).replace('.00', '') : '₦ ••••'}
              </h2>
              <button onClick={() => setShowBalance(!showBalance)} className="text-muted-foreground hover:text-foreground transition-colors mt-2">
                {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
            {/* <p className="text-sm font-bold text-green-600">
              +₦50,000 this month
            </p> */}
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-5">
            <Link href="/wallet" className="w-full">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-12 shadow-sm">
                Top Up
              </Button>
            </Link>
            <Link href="/wallet" className="w-full">
              <Button variant="outline" className="w-full border-border text-foreground hover:bg-secondary font-bold rounded-xl h-12">
                Withdraw
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Active Bookings */}
      <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg font-serif">Recent Booking</h3>
          <Link href="/bookings" className="text-primary text-sm font-bold hover:underline">
            View All
          </Link>
        </div>

        {recentBooking ? (
          <Link href={`/bookings/${recentBooking.id}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border bg-slate-50 hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    recentBooking.status === "Confirmed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                  }`}>
                    {recentBooking.status}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {new Date(recentBooking.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{recentBooking.packageName}</h3>
                  <p className="text-sm text-muted-foreground font-medium">{recentBooking.operatorName}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-foreground font-bold">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {recentBooking.travellers} {recentBooking.travellers === 1 ? 'Traveller' : 'Travellers'}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    {recentBooking.departureDate}
                  </div>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-6">
                <div className="text-left sm:text-right">
                  <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Starting Price</p>
                  <p className="font-black text-xl">{formatNaira(recentBooking.priceFrom)}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-white border border-border shadow-sm flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-colors mt-0 sm:mt-4">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-border">
            <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <h3 className="font-bold text-foreground mb-2">No active bookings</h3>
            <p className="text-muted-foreground text-sm mb-6 font-medium">Browse packages to register</p>
            <Link href="/packages">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl px-8 h-11 shadow-sm">
                Browse Packages
              </Button>
            </Link>
          </div>
        )}
      </div>

     

    </div>
  )
}
