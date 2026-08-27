"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ShieldCheck, Target, Calculator, CheckCircle2, DollarSign } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const packageExamples = [
  {
    id: 'umrah',
    name: 'Umrah Package',
    packageValue: 3500000,
    referralFee: 75000,
  },
  {
    id: 'hajj',
    name: 'Hajj Package',
    packageValue: 8500000,
    referralFee: 150000,
  }
];

export default function PartnerCommissionPage() {
  const [activeTab, setActiveTab] = useState('umrah');
  const activePackage = packageExamples.find(p => p.id === activeTab) || packageExamples[0];
  const operatorRevenue = activePackage.packageValue - activePackage.referralFee;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0a1c12] pt-24 pb-32">
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary via-[#0a1c12] to-[#0a1c12]" />
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <h1 className="font-serif text-5xl font-bold tracking-tight text-white md:text-6xl mb-6">
              Pay Only When We Bring You A <span className="text-[#E5B611]">Customer</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed font-light max-w-3xl mx-auto mb-10">
              No upfront fees. No mandatory ad spend. Our transparent commercial model ensures that we only succeed when you do.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 -mt-16 z-20">
        <div className="container mx-auto px-4 pb-24">
          
          <div className="mx-auto max-w-6xl rounded-3xl bg-white p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            
            <div className="grid md:grid-cols-3 gap-10 mb-20">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Target className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">Zero Upfront Cost</h3>
                <p className="text-slate-600 leading-relaxed">
                  List your packages for free. We don't charge you for impressions or unconverted leads.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">Transparent Pricing</h3>
                <p className="text-slate-600 leading-relaxed">
                  Our referral commission is agreed upon with each partner based on your specific arrangement. No hidden fees.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Calculator className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">Stage-based Deduction</h3>
                <p className="text-slate-600 leading-relaxed">
                  Commissions are deducted seamlessly via our payment infrastructure only when the customer makes a payment. Registration fees belong to you.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-200 mb-16">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">How it Works</h2>
                  <p className="text-slate-600 mb-8 text-lg">
                    Below is an <strong className="text-slate-900">illustrative example</strong> of how our commercial split operates when a customer books a package.
                  </p>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-slate-700">Customer pays via secure portal</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-slate-700">Commission is automatically calculated</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-slate-700">Net revenue is deposited directly to your bank account</span>
                    </li>
                  </ul>

                  <div className="rounded-xl bg-blue-50 p-4 border border-blue-100">
                    <p className="text-sm text-blue-800 leading-relaxed">
                      <strong>Note:</strong> UfitGo's referral fee is deducted from the package value. Applicable payment processing costs are borne by UfitGo and do not reduce the operator's stated allocation.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                  <div className="flex justify-center gap-2 mb-6">
                    {packageExamples.map((pkg) => (
                      <button
                        key={pkg.id}
                        onClick={() => setActiveTab(pkg.id)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                          activeTab === pkg.id 
                            ? 'bg-slate-900 text-white' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {pkg.name}
                      </button>
                    ))}
                  </div>

                  <div className="text-center mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Illustrative Example</span>
                    <h3 className="text-2xl font-bold text-slate-900 mt-2">{activePackage.name}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                      <span className="text-slate-500">Package Value</span>
                      <span className="font-semibold text-slate-900">
                        ₦{activePackage.packageValue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                      <span className="text-slate-500">UfitGo Referral Fee</span>
                      <span className="font-semibold text-red-500">
                        - ₦{activePackage.referralFee.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-bold text-slate-900">Operator Revenue</span>
                      <div className="text-right">
                        <span className="font-bold text-xl text-primary">
                          ₦{operatorRevenue.toLocaleString()}
                        </span>
                        <p className="text-xs text-slate-500 mt-1 font-medium">Deposited directly to your account</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Ready to scale your business?</h3>
              <Link 
                href="/partner/apply" 
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Apply to be a Partner Today
              </Link>
            </div>

          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
