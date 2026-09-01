import { cn } from "@/lib/utils"

export function UfitGoLogoConcept1({ className, isLight = false }: { className?: string, isLight?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <svg
        viewBox="0 0 32 32"
        className={cn("h-8 w-8")}
        fill="none"
        aria-hidden="true"
      >
        {/* BOLD Filled Location Pin */}
        <path 
          d="M16 1C8.8 1 3 6.8 3 14c0 8.5 13 17 13 17s13-8.5 13-17c0-7.2-5.8-13-13-13Z" 
          fill={isLight ? "white" : "currentColor"} 
          className={isLight ? "" : "text-primary"} 
        />
        {/* Bold Kaaba Cutout (White/Dark Base) */}
        <path d="M10 9h12v11H10z" fill={isLight ? "#0f172a" : "white"} />
        {/* Kaaba Gold Band */}
        <rect x="10" y="11" width="12" height="2" fill="#dcb232" />
        {/* Kaaba Gold Door */}
        <rect x="14.5" y="15" width="3" height="5" fill="#dcb232" rx="0.5" />
      </svg>
      <span className={cn("font-serif text-xl font-semibold tracking-tight", isLight ? "text-white" : "text-foreground")}>
        Ufit<span className={isLight ? "text-white" : "text-primary"}>Go</span>
      </span>
    </span>
  )
}
