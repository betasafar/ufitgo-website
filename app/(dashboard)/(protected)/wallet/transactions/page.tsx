"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getTransactions, WalletTransaction } from "@/lib/mock-db"
import { formatNaira } from "@/lib/packages"
import { ArrowLeft, ArrowDownToLine, ArrowUpToLine, History, Wallet as WalletIcon, Target, Tag } from "lucide-react"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [filter, setFilter] = useState<"All" | "Add Money" | "Savings" | "Payment">("All")

  useEffect(() => {
    setTransactions(getTransactions().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    setIsLoaded(true)
  }, [])

  if (!isLoaded) return <div className="p-8">Loading history...</div>

  const filteredTxs = transactions.filter(tx => {
    if (filter === "All") return true
    if (filter === "Payment") return tx.type.includes("Payment")
    return tx.type === filter
  })

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="mb-6">
        <Link href="/wallet" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Wallet
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-serif font-bold text-foreground">Transaction History</h1>
        
        {/* Filters */}
        <div className="flex bg-secondary/50 p-1 rounded-xl">
          {["All", "Add Money", "Savings", "Payment"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                filter === f ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filteredTxs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 flex flex-col items-center justify-center text-center text-muted-foreground">
          <History className="h-10 w-10 mb-4 opacity-50" />
          <p>No transactions found for this filter.</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {filteredTxs.map((tx, idx) => {
            const isNegative = tx.type === "Savings" || tx.type === "Reservation Payment" || tx.type === "Package Payment" || tx.type === "Withdrawal"
            const Icon = tx.type === "Add Money" ? ArrowDownToLine :
                         tx.type === "Savings" ? Target :
                         tx.type === "Withdrawal" ? ArrowUpToLine : Tag

            return (
              <div 
                key={tx.id} 
                className={`flex items-center justify-between p-4 sm:p-5 hover:bg-secondary/20 transition-colors ${
                  idx !== filteredTxs.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl flex-shrink-0 ${isNegative ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{tx.description}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                      <span>{new Date(tx.createdAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' })}</span>
                      <span>•</span>
                      <span>Ref: {tx.id.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-semibold ${isNegative ? "text-foreground" : "text-green-600"}`}>
                    {isNegative ? "-" : "+"}{formatNaira(tx.amount)}
                  </p>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 inline-block ${
                    tx.status === "Successful" ? "bg-green-100 text-green-700" :
                    tx.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
