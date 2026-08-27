import Image from "next/image"
import { Smartphone, Download, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollReveal } from "@/components/scroll-reveal"

export function MobileAppCta() {
  return (
    <section id="mobile-app" className="overflow-hidden bg-zinc-950 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative grid items-center gap-12 rounded-3xl bg-zinc-900 px-6 py-12 sm:px-12 sm:py-16 lg:grid-cols-2 lg:gap-8">
          
          {/* Subtle background glow */}
          <div className="absolute inset-0 -z-10 rounded-3xl bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50 blur-2xl"></div>

          {/* Text Content */}
          <ScrollReveal className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/50 px-3 py-1.5 text-xs font-medium text-zinc-300">
              <Smartphone className="h-4 w-4 text-primary" />
              Coming Soon to iOS & Android
            </span>
            
            <h2 className="mt-6 font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Take UfitGo with you
            </h2>
            
            <p className="mt-4 text-lg leading-relaxed text-zinc-400">
              Manage your Hajj and Umrah bookings, compare packages on the go, and chat with your verified operators directly from your pocket. 
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              {/* Fake App Store Button */}
              <button className="flex h-14 w-full max-w-[200px] items-center justify-center gap-3 rounded-xl bg-zinc-800 px-4 text-white transition-colors hover:bg-zinc-700 sm:w-auto">
                <svg viewBox="0 0 384 512" className="h-7 w-7 fill-current" aria-hidden="true">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] leading-tight text-zinc-300">Download on the</div>
                  <div className="text-sm font-semibold leading-tight">App Store</div>
                </div>
              </button>

              {/* Fake Play Store Button */}
              <button className="flex h-14 w-full max-w-[200px] items-center justify-center gap-3 rounded-xl bg-zinc-800 px-4 text-white transition-colors hover:bg-zinc-700 sm:w-auto">
                <svg viewBox="0 0 512 512" className="h-7 w-7 fill-current" aria-hidden="true">
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] leading-tight text-zinc-300">GET IT ON</div>
                  <div className="text-sm font-semibold leading-tight">Google Play</div>
                </div>
              </button>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-4 text-sm text-zinc-400 lg:justify-start">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="inline-block h-8 w-8 rounded-full border-2 border-zinc-900 bg-zinc-700" />
                ))}
              </div>
              <div>
                Join <span className="font-semibold text-white">5,000+</span> pilgrims
              </div>
            </div>
          </ScrollReveal>

          {/* App Mockup Image / Simulator */}
          <div className="hidden lg:block relative mx-auto w-full max-w-[280px] lg:ml-auto lg:max-w-[320px]">
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
                    <h3 className="font-bold text-lg text-zinc-900 leading-none">UfitGo</h3>
                    <p className="text-[10px] text-zinc-500 font-medium mt-1">As-salamu alaykum, Ali</p>
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
                    <span className="text-[9px] font-semibold text-zinc-700">Exchange</span>
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
                 <div className="mt-1 pb-4">
                   <div className="flex justify-between items-center mb-2">
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
