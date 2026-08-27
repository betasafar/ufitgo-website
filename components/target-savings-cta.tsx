"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Target, TrendingUp, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function TargetSavingsCta() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,0 L100,100 M100,0 L0,100" stroke="currentColor" strokeWidth="0.5" fill="none" />
        </svg>
      </div>
      
      <div className="container px-4 md:px-6 relative z-10 mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className={cn("inline-flex items-center rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-3 py-1 text-sm font-medium", isVisible ? "animate-fade-up delay-100" : "opacity-0")}>
              <span className="flex h-2 w-2 rounded-full bg-accent mr-2"></span>
              UfitGo Target Savings
            </div>
            
            <h2 className={cn("font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight", isVisible ? "animate-fade-up delay-200" : "opacity-0")}>
              Not ready to travel yet? Start planning your Umrah today.
            </h2>
            
            <p className={cn("text-base sm:text-lg text-primary-foreground/80 leading-relaxed max-w-lg mx-auto lg:mx-0", isVisible ? "animate-fade-up delay-300" : "opacity-0")}>
              Don't wait until you have ₦6.5m to start your journey. Set a target, save gradually at your own pace, and track your progress securely right here on UfitGo.
            </p>
            
            <ul className={cn("space-y-3 pt-4 text-left mx-auto max-w-sm lg:mx-0 lg:max-w-none", isVisible ? "animate-fade-up delay-400" : "opacity-0")}>
              <li className="flex items-start sm:items-center gap-3">
                <Target className="h-5 w-5 text-accent mt-0.5 sm:mt-0 flex-shrink-0" />
                <span className="text-sm sm:text-base">Set a specific goal and travel date</span>
              </li>
              <li className="flex items-start sm:items-center gap-3">
                <TrendingUp className="h-5 w-5 text-accent mt-0.5 sm:mt-0 flex-shrink-0" />
                <span className="text-sm sm:text-base">Get automated monthly or weekly saving plans</span>
              </li>
              <li className="flex items-start sm:items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-accent mt-0.5 sm:mt-0 flex-shrink-0" />
                <span className="text-sm sm:text-base">Use your balance seamlessly when you're ready to book</span>
              </li>
            </ul>

            <div className={cn("pt-6 w-full sm:w-auto", isVisible ? "animate-fade-up delay-400" : "opacity-0")}>
              <Link href="/wallet/target/new" className="block w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground h-14 px-8 text-base font-bold shadow-xl">
                  Start Saving Now
                </Button>
              </Link>
            </div>
          </div>
          
          <div className={cn("relative mx-auto w-full max-w-md lg:max-w-none px-2 sm:px-0", isVisible ? "animate-fade-up delay-300" : "opacity-0")}>
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent rounded-3xl transform rotate-2 sm:rotate-3 scale-105" />
            <div className="rounded-3xl border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur-sm p-6 sm:p-8 relative shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-primary-foreground/70 text-sm font-semibold uppercase tracking-wider mb-1">My Goal</p>
                  <h3 className="text-2xl font-serif font-bold">Ramadan Umrah 2027</h3>
                </div>
                <span className="text-4xl">🕋</span>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-end mb-2">
                  <p className="font-bold text-3xl">₦1,450,000</p>
                  <p className="text-sm text-primary-foreground/70">of ₦6,500,000</p>
                </div>
                <div className="w-full bg-black/20 rounded-full h-3">
                  <div className="bg-accent h-3 rounded-full" style={{ width: '22%' }}></div>
                </div>
                <p className="text-xs font-bold text-accent uppercase tracking-wider mt-2 text-right">22% Complete</p>
              </div>
              
              <div className="border-t border-primary-foreground/20 pt-6 mt-6">
                <p className="text-sm font-medium">Suggested Plan</p>
                <p className="text-lg font-bold text-accent mt-1">Save ₦420,000 / month</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
