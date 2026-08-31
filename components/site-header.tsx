"use client"

import { useState, useEffect } from "react"
import { Menu, X, User as UserIcon, LogOut, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { useSession, signOut, signIn } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UfitGoLogo } from "@/components/ufitgo-logo"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Operators", href: "/operators" },
  // { label: "Services", href: "/#services" },
  { label: "Why UfitGo", href: "/#why" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Become a Partner", href: "/#operators" },
]

export function SiteHeader({ transparentOnTop = false }: { transparentOnTop?: boolean }) {
  const [open, setOpen] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    if (!transparentOnTop) return
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    // Check initially
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [transparentOnTop])

  const isTransparent = transparentOnTop && !isScrolled

  return (
    <>
      <header 
        className={cn(
          "top-0 z-50 transition-all duration-300 animate-in slide-in-from-top-4 fade-in duration-700",
          transparentOnTop ? "fixed left-0 right-0" : "sticky",
          isTransparent 
            ? "bg-transparent border-transparent py-4" 
            : "bg-background/95 backdrop-blur-md border-b border-border/70 py-0"
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="/" className="flex items-center gap-2" aria-label="UfitGo home">
            <UfitGoLogo className="h-8 w-auto transition-colors duration-300" isLight={isTransparent} />
          </a>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-300",
                  isTransparent ? "text-white/90 hover:text-white" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" className={cn("relative h-9 w-9 rounded-full", isTransparent ? "hover:bg-white/20" : "")} />}>
                  <div className={cn("flex h-9 w-9 items-center justify-center rounded-full transition-colors font-bold", isTransparent ? "bg-white/20 text-white" : "bg-secondary text-foreground")}>
                    {(session.user as any)?.firstName?.charAt(0) || "U"}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{(session.user as any)?.firstName} {(session.user as any)?.lastName}</p>
                      {session.user?.email && <p className="text-sm text-muted-foreground">{session.user.email}</p>}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="text-red-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link 
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "rounded-full h-10 px-6 font-semibold transition-all duration-300",
                  isTransparent 
                    ? "border-white/30 text-white hover:bg-white/10 bg-transparent" 
                    : "border-zinc-600 bg-transparent hover:bg-secondary text-foreground"
                )} 
              >
                Sign in
              </Link>
            )}
            <a href="/#services" className={cn(buttonVariants(), "rounded-full bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-6 font-semibold transition-colors")}>
              Explore Services
            </a>
          </div>

          <button
            className={cn("inline-flex h-10 w-10 items-center justify-center rounded-full md:hidden transition-colors duration-300", isTransparent ? "text-white" : "text-foreground")}
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-[110] flex w-[75vw] max-w-sm flex-col bg-background p-6 shadow-2xl transition-transform duration-300 ease-in-out md:hidden",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between mb-8">
          <span className="font-serif font-bold text-xl">Menu</span>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex flex-col gap-2" aria-label="Mobile">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3.5 text-base font-medium text-foreground hover:bg-secondary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6">
            {session ? (
              <div className="flex flex-col space-y-4 pt-4 border-t border-border">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground font-medium">
                    {(session?.user as any)?.firstName?.charAt(0) || "U"}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{(session?.user as any)?.firstName} {(session?.user as any)?.lastName}</span>
                    <span className="text-xs text-muted-foreground">{session.user?.email}</span>
                  </div>
                </div>
                <Link 
                  href="/dashboard"
                  className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
                <Button 
                  variant="outline"
                  className="w-full justify-start text-muted-foreground"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <Link 
                href="/login"
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full bg-transparent h-12 text-base flex items-center justify-center"
                )} 
              >
                Sign in
              </Link>
            )}
            <a
              href="/#packages"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants(), "w-full h-12 text-base")}
            >
              Explore Services
            </a>
          </div>
        </nav>
      </div>
    </>
  )
}
