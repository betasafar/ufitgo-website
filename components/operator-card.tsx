import Image from "next/image"
import Link from "next/link"
import { Award, BadgeCheck, Briefcase, MapPin, ShieldCheck, Star } from "lucide-react"

import { type Operator } from "@/lib/packages"

export function OperatorCard({ operator }: { operator: Operator }) {
  const nameToDisplay = operator.companyName || operator.name || "Unknown Operator"
  const hasValidImage = operator.logo && operator.logo !== "/placeholder.svg"
  const yearsOfExperience = Number(operator.yearsOfExperience)
  const hasKnownExperience = Number.isFinite(yearsOfExperience) && yearsOfExperience > 0
  const hasRating = Number.isFinite(operator.rating) && operator.rating > 0
  const tierLabel = operator.tier
    ? `${operator.tier.charAt(0)}${operator.tier.slice(1).toLowerCase()} Partner`
    : null

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-xl hover:shadow-primary/5">
      <Link href={`/operators/${operator.id}`} className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-zinc-100 shadow-sm">
            {hasValidImage ? (
              <Image
                src={operator.logo}
                alt={`${nameToDisplay} logo`}
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <span className="text-xl font-bold uppercase text-primary">
                {getInitials(nameToDisplay)}
              </span>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            {hasRating && (
              <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                <Star className="h-3.5 w-3.5 fill-primary" />
                {operator.rating.toFixed(1)}
              </div>
            )}
            {(operator.verificationStatus === "approved" || operator.verified) && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-600">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified
              </span>
            )}
          </div>
        </div>

        <h3 className="mt-4 font-serif text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
          {nameToDisplay}
        </h3>

        {operator.description && (
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
            {operator.description}
          </p>
        )}

        <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2.5 border-t border-border pt-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="h-4 w-4 shrink-0 text-primary/70" />
            <dd>{hasKnownExperience ? `${yearsOfExperience} Years Exp` : "5+ Years Exp"}</dd>
          </div>
          {operator.activePackagesCount != null && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <BadgeCheck className="h-4 w-4 shrink-0 text-primary/70" />
              <dd>{operator.activePackagesCount} Active {operator.activePackagesCount === 1 ? "Package" : "Packages"}</dd>
            </div>
          )}
          {operator.location && (
            <div className="col-span-2 flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0 text-primary/70" />
              <dd>{operator.location}</dd>
            </div>
          )}
          {tierLabel && (
            <div className="col-span-2 flex items-center gap-2 text-muted-foreground">
              <Award className="h-4 w-4 shrink-0 text-primary/70" />
              <dd>{tierLabel}</dd>
            </div>
          )}
        </dl>
      </Link>
    </article>
  )
}