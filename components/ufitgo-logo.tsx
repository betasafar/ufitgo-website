import { cn } from "@/lib/utils"

export function UfitGoLogo({ className, isLight = false }: { className?: string, isLight?: boolean }) {
  return (
    <span className={`inline-flex items-center ${className ?? ""}`}>
      <svg
        viewBox="-4 -3 40 40"
        className={cn("h-8 w-8")}
        fill="none"
        aria-hidden="true"
      >
        {/* Bold Crescent Moon */}
        <path 
          d="M27 21 A 14 14 0 1 1 11 5 A 11 11 0 1 0 27 21 Z" 
          fill="#dcb232" 
        />
        {/* Massive Medina Dome */}
        <path 
          d="M10 29 V 17 C 10 9, 18 7, 18 2 C 18 7, 26 9, 26 17 V 29 Z" 
          fill={isLight ? "white" : "currentColor"} 
          className={isLight ? "" : "text-primary"} 
        />
        {/* Dome Base */}
        <rect x="8" y="29" width="20" height="3" fill={isLight ? "white" : "currentColor"} className={isLight ? "" : "text-primary"} />
      </svg>
      <span className={cn("font-serif text-xl font-semibold tracking-tight leading-none pt-1 -ml-1", isLight ? "text-white" : "text-foreground")}>
        Ufit<span className={isLight ? "text-white" : "text-primary"}>Go</span>
      </span>
    </span>
  )
}
