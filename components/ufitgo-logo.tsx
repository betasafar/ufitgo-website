import { cn } from "@/lib/utils"

export function UfitGoLogo({ className, isLight = false }: { className?: string, isLight?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <svg
        viewBox="0 0 32 32"
        className={cn("h-8 w-8", isLight ? "text-white" : "text-primary")}
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2Zm0 4.2a3.4 3.4 0 1 1 0 6.8 3.4 3.4 0 0 1 0-6.8Zm7 17.5c0 .77-.63 1.4-1.4 1.4H10.4c-.77 0-1.4-.63-1.4-1.4v-.7c0-2.9 4.67-4.55 7-4.55s7 1.65 7 4.55v.7Z"
          fill="currentColor"
        />
      </svg>
      <span className={cn("font-serif text-xl font-semibold tracking-tight", isLight ? "text-white" : "text-foreground")}>
        Ufit<span className={isLight ? "text-white" : "text-primary"}>Go</span>
      </span>
    </span>
  )
}
