"use client"

import { FormEvent, useState } from "react"
import { Smartphone } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"

export function MobileAppCta() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const subscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("submitting")
    setMessage("")

    try {
      const response = await fetch("/api/app-launch-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) throw new Error(payload?.message || "Unable to join the launch list.")
      setEmail("")
      setStatus("success")
      setMessage("You are on the list. We will email you when UfitGo is ready for you.")
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Unable to join the launch list.")
    }
  }

  return (
    <section id="mobile-app" className="scroll-mt-20 overflow-hidden bg-[#f4efe1] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative grid items-center gap-10 overflow-hidden rounded-2xl border border-[#cbdcd2] bg-[#e4f0e8] px-6 py-10 shadow-[0_24px_60px_rgba(16,44,41,0.12)] sm:px-12 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div className="absolute inset-x-0 top-0 h-2 bg-[#d1b874]" aria-hidden="true" />
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border-[28px] border-[#c6dfd0] opacity-70" aria-hidden="true" />

          {/* Text Content */}
          <ScrollReveal className="relative z-10 mx-auto max-w-xl text-left lg:mx-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#afc9bb] bg-[#f9f5e9] px-3 py-1.5 text-xs font-semibold text-[#0b3a35]">
              <Smartphone className="h-4 w-4 text-[#0b6b5d]" />
              UfitGo mobile app
            </span>
            
            <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight tracking-tight text-[#102c29] sm:text-4xl lg:text-5xl">
              Your journey, always within reach
            </h2>
            
            <p className="mt-4 text-base leading-relaxed text-[#41625b] sm:text-lg">
              Plan journeys, manage bookings, track travel savings, and compare packages wherever you are.
            </p>

            <form onSubmit={subscribe} className="mt-8 max-w-md">
              <label htmlFor="app-launch-email" className="text-sm font-bold text-[#102c29]">Get launch updates</label>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <input id="app-launch-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required className="min-h-12 min-w-0 flex-1 rounded-lg border border-[#afc9bb] bg-white px-4 py-3 text-sm text-[#102c29] placeholder:text-[#739189] outline-none focus:border-[#0b6b5d] focus:ring-2 focus:ring-[#0b6b5d]/15" />
                <button type="submit" disabled={status === "submitting"} className="h-12 rounded-lg bg-[#0b3a35] px-5 text-sm font-bold text-white transition-colors hover:bg-[#0b6b5d] disabled:cursor-not-allowed disabled:opacity-70">{status === "submitting" ? "Joining..." : "Notify me"}</button>
              </div>
              <p className="mt-3 text-xs leading-5 text-[#58776e]">By joining, you agree to receive one-time UfitGo app-launch updates. You can unsubscribe at any time.</p>
              {message && <p role="status" className={`mt-3 text-sm ${status === "success" ? "text-[#087260]" : "text-red-700"}`}>{message}</p>}
            </form>
          </ScrollReveal>

          {/* App Mockup Image / Simulator */}
          <div className="relative z-10 mx-auto w-full max-w-[220px] sm:max-w-[250px] lg:ml-auto lg:max-w-[320px]">
            <div className="relative aspect-[1/2.15] w-full overflow-hidden rounded-[2.5rem] border-[8px] border-zinc-950 bg-zinc-50 shadow-2xl flex flex-col">
              {/* iPhone Notch */}
              <div className="absolute top-0 inset-x-0 h-6 bg-zinc-950 rounded-b-3xl w-32 mx-auto z-20"></div>
              
              {/* Mockup content */}
              <div className="relative flex-1 w-full bg-zinc-50 p-4 pt-10 flex flex-col gap-4 overflow-y-auto overflow-x-hidden no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <style dangerouslySetInnerHTML={{__html: `
                  .no-scrollbar::-webkit-scrollbar { display: none; }
                `}} />
                
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-zinc-900 leading-none">UfitGo</h3>
                    <p className="text-[9px] text-zinc-500 font-medium mt-1">As-salamu alaykum, Ali</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-zinc-200 border border-zinc-300 flex items-center justify-center overflow-hidden">
                     <span className="text-sm">👤</span>
                  </div>
                </div>

                {/* Balance Card */}
                <div className="w-full rounded-2xl bg-zinc-900 text-white p-4 relative overflow-hidden shadow-lg mt-2">
                  <div className="absolute inset-0 opacity-20">
                     <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                       <path d="M0,0 L100,100 M100,0 L0,100" stroke="currentColor" strokeWidth="0.5" fill="none" />
                     </svg>
                  </div>
                  <div className="relative z-10">
                    <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider mb-1">Total Savings</p>
                    <h4 className="font-bold text-2xl text-white">₦1,450,000</h4>
                    <div className="mt-3 flex gap-2">
                      <button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-zinc-950 text-[11px] font-bold py-2 rounded-lg transition-colors">Top Up</button>
                      <button className="flex-1 bg-zinc-800 text-white text-[11px] font-bold py-2 rounded-lg">Withdraw</button>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <div className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-zinc-100 shadow-sm">
                    <span className="text-xl">🕋</span>
                    <span className="text-[9px] font-semibold text-zinc-700">Packages</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-zinc-100 shadow-sm">
                    <span className="text-xl">🎯</span>
                    <span className="text-[9px] font-semibold text-zinc-700">Target</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-zinc-100 shadow-sm">
                    <span className="text-xl">💱</span>
                    <span className="text-[9px] font-semibold text-zinc-700">Amenities</span>
                  </div>
                </div>

                {/* Target Savings Widget */}
                <div className="w-full rounded-2xl bg-white border border-zinc-100 p-4 shadow-sm mt-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-0.5">Active Goal</p>
                      <h5 className="font-bold text-sm text-zinc-900">Ramadan 2027</h5>
                    </div>
                    <span className="text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full text-[9px] font-bold">22%</span>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-full h-1.5 mt-2">
                    <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '22%' }}></div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-[10px] font-semibold text-zinc-900">₦1.45M <span className="text-zinc-400 font-normal">of ₦6.5M</span></p>
                    <p className="text-[9px] font-medium text-zinc-500">Save ₦420k/mo</p>
                  </div>
                </div>
                
                {/* Featured Packages */}
                 <div className="mt-4 pb-4">
                   <div className="flex justify-between items-center mb-3">
                     <h4 className="font-bold text-xs text-zinc-900">Trending Deals</h4>
                     <span className="text-[10px] font-semibold text-yellow-600">See all</span>
                   </div>
                   <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                     
                     {/* Deal Card 1 */}
                     <div className="min-w-[140px] bg-white border border-zinc-100 rounded-xl shadow-sm overflow-hidden flex flex-col">
                       <div className="h-20 w-full relative bg-zinc-200">
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                         <img src="/images/hero-kaaba.jpg" alt="Kaaba" className="w-full h-full object-cover" />
                         <div className="absolute top-1.5 left-1.5 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[8px] font-bold text-zinc-900 flex items-center gap-0.5">
                           ⭐ 4.9
                         </div>
                       </div>
                       <div className="p-2">
                         <h5 className="font-bold text-[10px] text-zinc-900 truncate">VIP Ramadan Umrah</h5>
                         <p className="text-[9px] text-zinc-500 mt-0.5">14 Days • 5-Star</p>
                         <p className="font-bold text-[11px] text-zinc-900 mt-1.5">₦3.2M</p>
                       </div>
                     </div>

                     {/* Deal Card 2 */}
                     <div className="min-w-[140px] bg-white border border-zinc-100 rounded-xl shadow-sm overflow-hidden flex flex-col">
                       <div className="h-20 w-full relative bg-zinc-200">
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                         <img src="/images/masjid-quba.jpg" alt="Masjid Quba" className="w-full h-full object-cover" />
                         <div className="absolute top-1.5 left-1.5 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[8px] font-bold text-zinc-900 flex items-center gap-0.5">
                           ⭐ 4.8
                         </div>
                       </div>
                       <div className="p-2">
                         <h5 className="font-bold text-[10px] text-zinc-900 truncate">Standard Hajj 2027</h5>
                         <p className="text-[9px] text-zinc-500 mt-0.5">30 Days • Makkah</p>
                         <p className="font-bold text-[11px] text-zinc-900 mt-1.5">₦6.5M</p>
                       </div>
                     </div>

                   </div>
                 </div>

              </div>

              {/* Bottom Navigation */}
              <div className="h-[72px] w-full bg-white border-t border-zinc-100 flex items-center justify-around px-2 z-10 pb-4 pt-2">
                <div className="flex flex-col items-center gap-1 text-zinc-900">
                  <span className="text-lg leading-none">🏠</span>
                  <span className="text-[8px] font-bold">Home</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-zinc-400">
                  <span className="text-lg leading-none opacity-80">🔍</span>
                  <span className="text-[8px] font-semibold">Discover</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-zinc-400">
                  <span className="text-lg leading-none opacity-80">💼</span>
                  <span className="text-[8px] font-semibold">Bookings</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-zinc-400">
                  <span className="text-lg leading-none opacity-80">💬</span>
                  <span className="text-[8px] font-semibold">Chat</span>
                </div>
              </div>
              
              {/* Optional: if they have a real image later, they can use next/image here */}
              {/* <Image src="/images/app-mockup.png" alt="UfitGo App Interface" fill className="object-cover" /> */}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
