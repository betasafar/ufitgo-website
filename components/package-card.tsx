"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { BadgeCheck, CalendarDays, Clock, Check, ArrowRight, GitCompare, MapPin, Heart } from "lucide-react"
import { type Package, formatNaira } from "@/lib/packages"
import { cn } from "@/lib/utils"

export function PackageCard({ pkg, noImage = false }: { pkg: Package; noImage?: boolean }) {
  const [isSaved, setIsSaved] = useState(false)
  const [imageError, setImageError] = useState(false)

  const hasValidImage = pkg.cardImage && pkg.cardImage !== "/placeholder.svg" && !imageError

  // Get up to 2 initials from the package name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-xl hover:shadow-primary/5 relative">
      {!noImage && (
        <Link href={`/packages/${pkg.id}`} className="relative block aspect-[16/10] w-full overflow-hidden bg-zinc-100 flex items-center justify-center">
          {hasValidImage ? (
            <Image
              src={pkg.cardImage}
              alt={`${pkg.name} — ${pkg.operator.name}`}
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/5">
              <span className="text-5xl font-bold text-primary/30 uppercase tracking-widest">
                {getInitials(pkg.name)}
              </span>
            </div>
          )}
          <div className="absolute left-3 top-3 flex gap-2">
            <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground shadow-sm">
              {pkg.type}
            </span>
            <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground capitalize shadow-sm">
              {pkg.category}
            </span>
          </div>
          <button 
            onClick={(e) => {
              e.preventDefault()
              setIsSaved(!isSaved)
            }}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-md shadow-sm transition-transform hover:scale-110"
            aria-label={isSaved ? "Remove from saved" : "Save package"}
          >
            <Heart className={cn("h-4 w-4 transition-colors", isSaved ? "fill-red-500 text-red-500" : "text-foreground")} />
          </button>
        </Link>
      )}

      <div className="flex flex-1 flex-col p-5">
        {noImage && (
          <div className="flex justify-between items-center mb-4">
            <span className="rounded-full border border-primary/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              {pkg.type}
            </span>
            <span className="text-sm font-medium text-muted-foreground capitalize">
              {pkg.category}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span>Provided by: {pkg.operator.name}</span>
          {pkg.operator.verified && (
            <span className="inline-flex items-center gap-1 text-primary" title="Verified operator">
              <BadgeCheck className="h-4 w-4" />
              <span className="sr-only">Verified operator</span>
            </span>
          )}
        </div>

        <h3 className="mt-1 font-serif text-xl font-semibold text-foreground">
          <Link href={`/packages/${pkg.id}`} className="hover:text-primary">
            {pkg.name}
          </Link>
        </h3>

        <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0 text-primary/70" />
            <dd>{pkg.duration} days</dd>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="h-4 w-4 shrink-0 text-primary/70" />
            <dd>{pkg.departureDate}</dd>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground col-span-2">
            <MapPin className="h-4 w-4 shrink-0 text-primary/70" />
            <dd>From {pkg.departureCity}</dd>
          </div>
        </dl>

        <ul className="mt-4 flex flex-col gap-1.5">
          {pkg.highlights.slice(0, 3).map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-foreground/80">
              <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-5 border-t border-border pt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground">Starting from</p>
              <p className="font-serif text-xl font-semibold text-foreground leading-none mt-1">{formatNaira(pkg.priceFrom)}</p>
            </div>
            <Link
              href={`/compare?id=${pkg.id}`}
              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground hover:bg-primary/5"
              title="Compare Alternatives"
            >
              <GitCompare className="h-3.5 w-3.5" />
              Compare
            </Link>
          </div>
          
          <Link
            href={`/packages/${pkg.id}`}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:scale-[1.02] active:scale-100"
          >
            See Details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-4 pt-3 border-t border-border/30">
          <p className="text-[10px] leading-tight text-muted-foreground/60 text-center">
            UfitGo facilitates discovery and booking. This experience is provided by the independent provider above.
          </p>
        </div>
      </div>
    </article>
  )
}
