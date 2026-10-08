import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ArrowRight, ShieldCheck, Trash2 } from "lucide-react"

export default function AccountDeletionPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteHeader />

      <main className="container mx-auto flex-1 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Account and data deletion</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Delete your UfitGo account</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            You can permanently close your UfitGo account from the mobile app. This removes access to your account and anonymises your personal profile information.
          </p>

          <section className="mt-12 border-y border-slate-200 py-8">
            <div className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-700">
                <Trash2 className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Delete in the mobile app</h2>
                <ol className="mt-4 list-decimal space-y-3 pl-5 leading-7 text-slate-600">
                  <li>Sign in to the UfitGo mobile app.</li>
                  <li>Open your profile, then select Settings.</li>
                  <li>Choose Delete Account and confirm the deletion request.</li>
                </ol>
              </div>
            </div>
          </section>

          <section className="border-b border-slate-200 py-8">
            <div className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Before you request deletion</h2>
                <p className="mt-3 leading-7 text-slate-600">
                  Any active savings goal with funds must be broken and withdrawn before account deletion can be completed. We may retain limited booking and financial records where required for legal, fraud-prevention, accounting, or regulatory obligations.
                </p>
              </div>
            </div>
          </section>

          <section className="py-8">
            <h2 className="text-xl font-bold text-slate-900">Cannot sign in?</h2>
            <p className="mt-3 leading-7 text-slate-600">
              Email our support team from the email address linked to your UfitGo account. Include the subject “Account deletion request” so we can verify and process your request safely.
            </p>
            <a
              href="mailto:support@ufitgo.ng?subject=Account%20deletion%20request"
              className="mt-5 inline-flex items-center text-sm font-semibold text-primary hover:underline"
            >
              Request account deletion by email <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}