"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ArrowRight, ShieldCheck, Star } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const images = [
  "/images/hero-kaaba.jpg",
  // "/images/medina.png",
  "/images/masjid-quba.jpg",
  "/images/mount-uhud.jpg"
]

export function Hero() {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="top" className="relative overflow-hidden py-24 sm:py-32 lg:py-40 bg-[radial-gradient(circle_at_top,_rgba(220,178,50,0.22),transparent_16%),linear-gradient(135deg,#0b2f2d_0%,#0f3d39_30%,#0b1f1d_100%)]">
      <div className="absolute inset-0">
        {images.map((src, idx) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            priority={idx === 0}
            sizes="100vw"
            className={cn(
              "object-cover mix-blend-screen transition-opacity duration-1000 ease-in-out",
              currentImage === idx ? "opacity-50" : "opacity-0"
            )}
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,26,24,0.28),rgba(10,26,24,0.82)_60%,rgba(10,26,24,0.96))]"></div>
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='400' viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M30 60C13.431 60 0 46.569 0 30S13.431 0 30 0s30 13.431 30 30-13.431 30-30 30zm0-4c14.359 0 26-11.641 26-26S44.359 4 30 4 4 15.641 4 30s11.641 26 26 26zm0-8c9.941 0 18-8.059 18-18S39.941 12 30 12 12 20.059 12 30s8.059 18 18 18zm0-4c7.732 0 14-6.268 14-14S37.732 16 30 16 16 22.268 16 30s6.268 14 14 14z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '120px 120px',
            maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)'
          }}
        />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 flex flex-col items-center text-center relative z-10">
        <span className="animate-fade-up delay-100 inline-flex items-center gap-2 rounded-full border border-[#dcb232]/30 bg-[#0e3c38]/80 px-3 py-1.5 text-xs font-medium text-[#f7e7b2] backdrop-blur-md mb-2 shadow-[0_8px_24px_rgba(220,178,50,0.12)]">
          <span className="flex h-1.5 w-1.5 rounded-full bg-[#dcb232]" />
          Nigeria&apos;s digital marketplace &amp; booking platform
        </span>
        <span className="animate-fade-up delay-100 inline-flex items-center gap-2 rounded-full border border-emerald-200/15 bg-emerald-900/35 px-3 py-1.5 text-xs font-medium text-emerald-100 backdrop-blur-md">
          <ShieldCheck className="h-4 w-4 text-[#dcb232]" />
          Target savings securely held via trusted tier-1 banking partners
        </span>

        <h1 className="animate-fade-up delay-200 mt-8 text-balance font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl max-w-4xl mx-auto">
          Discover. Book. <span className="text-[#f1d678]">Experience.</span>
        </h1>

        <p className="animate-fade-up delay-300 mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-zinc-200 sm:text-xl">
          Connect with trusted service providers and manage your journey through one simple platform.
        </p>

        <div className="animate-fade-up delay-400 mt-10 flex w-full flex-col items-center justify-center gap-6 sm:w-auto sm:flex-row">
          <a
            href="/#how-it-works"
            className={cn(buttonVariants({ size: "lg" }), "h-14 gap-2 rounded-full px-8 text-base font-semibold w-full sm:w-auto bg-[#dcb232] text-[#102c29] shadow-[0_18px_38px_rgba(220,178,50,0.28)] hover:bg-[#e7c55a] hover:-translate-y-0.5")}
          >
            Explore the journey
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="/#how-it-works"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }), "rounded-full h-14 px-8 text-base font-semibold w-full sm:w-auto border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white")}
          >
            How It Works
          </a>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
            <ShieldCheck className="h-5 w-5 text-[#dcb232]" />
            Verified operators only
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
            <Star className="h-5 w-5 fill-[#dcb232] text-[#dcb232]" />
          </div>
        </div>
      </div>
    </section>
  )
}
