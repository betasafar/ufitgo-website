import Image from "next/image"
import Link from "next/link"
import { BadgeCheck, Star, Briefcase, ShieldCheck } from "lucide-react"
import { type Operator } from "@/lib/packages"

export function OperatorCard({ operator }: { operator: Operator }) {
  // Get up to 2 initials from the operator name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  const nameToDisplay = operator.companyName || operator.name || "Unknown Operator"
  const hasValidImage = operator.logo && operator.logo !== "/placeholder.svg"

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-xl hover:shadow-primary/5 relative h-full">
      <Link href={`/operators/${operator.id}`} className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border bg-zinc-100 flex items-center justify-center shadow-sm">
            {hasValidImage ? (
              <Image
                src={operator.logo!}
                alt={`${nameToDisplay} logo`}
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-primary/40 uppercase">
                {getInitials(nameToDisplay)}
              </span>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-2">
             <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
               <Star className="h-3.5 w-3.5 fill-primary" />
               {operator.rating.toFixed(1)}
             </div>
             {(operator.verificationStatus === 'approved' || operator.verified) && (
               <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-semibold text-blue-600 uppercase tracking-wide">
                 <ShieldCheck className="h-3.5 w-3.5" />
                 Verified
               </span>
             )}
          </div>
        </div>

        <h3 className="mt-4 font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
          {nameToDisplay}
        </h3>
        
        <p className="mt-2 text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-1">
          {operator.description || "A trusted UfitGo travel partner dedicated to providing premium spiritual journeys."}
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm border-t border-border pt-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="h-4 w-4 shrink-0 text-primary/70" />
            <dd>{operator.yearsOfExperience || 1}+ Years Exp</dd>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <BadgeCheck className="h-4 w-4 shrink-0 text-primary/70" />
            <dd>UfitGo Partner</dd>
          </div>
        </dl>
      </Link>
    </article>
  )
}
