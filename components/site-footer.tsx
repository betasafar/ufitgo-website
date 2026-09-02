import Link from "next/link"
import { UfitGoLogo } from "@/components/ufitgo-logo"

const columns = [
  {
    title: "Platform",
    links: [
      { label: "Explore Services", href: "/packages" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Become a Partner", href: "/partner" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Trust & Verification", href: "/trust" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/help" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Use", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Refund & Cancellation Policy", href: "/terms#refund" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_2fr]">
          <div>
            <UfitGoLogo className="h-8 w-auto" />
            <p className="mt-4 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
              Discover and book experiences from independent providers. Compare options and choose with confidence, all in one place.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} UfitGo. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground max-w-lg text-center sm:text-right">
            UfitGo is a technology platform, not a bank or currency trader. Savings are powered by regulated tier-1 banking partners and protected by NDIC.
          </p>
        </div>
      </div>
    </footer>
  )
}
