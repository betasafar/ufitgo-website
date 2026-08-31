"use client"

import { useState } from "react"
import { Search, Filter, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, RefreshCcw, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type TransactionStatus = "Pending" | "In Progress" | "Completed" | "Cancelled" | "Cancellation in Review"

interface Transaction {
  id: string
  type: "Exchange" | "Deposit" | "Withdrawal" | "Registration Fee" | "Installment Payment"
  title: string
  amount: string
  date: string
  status: TransactionStatus
  details?: {
    agentName?: string
    exchangeRate?: string
    receiveAmount?: string
    deliveryMethod?: string
  }
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "TX-94821",
    type: "Exchange",
    title: "SAR Exchange Order",
    amount: "₦ 1,450,000",
    date: "Oct 12, 2023 • 14:30",
    status: "In Progress",
    details: {
      agentName: "Ibrahim Al-Faisal",
      exchangeRate: "1 SAR = 410 NGN",
      receiveAmount: "3,536 SAR",
      deliveryMethod: "Cash Pickup (Jeddah)"
    }
  },
  {
    id: "TX-94820",
    type: "Deposit",
    title: "Wallet Funding",
    amount: "+ ₦ 50,000",
    date: "Oct 10, 2023 • 09:15",
    status: "Completed",
  },
  {
    id: "TX-94819",
    type: "Exchange",
    title: "USD Exchange Order",
    amount: "₦ 5,000,000",
    date: "Oct 05, 2023 • 11:20",
    status: "Completed",
    details: {
      agentName: "Sarah M.",
      exchangeRate: "1 USD = 1,150 NGN",
      receiveAmount: "4,347 USD",
      deliveryMethod: "Hotel Delivery (Makkah)"
    }
  },
  {
    id: "TX-94818",
    type: "Registration Fee",
    title: "Ramadan Umrah Registration",
    amount: "- ₦ 50,000",
    date: "Oct 01, 2023 • 16:45",
    status: "Completed",
  },
  {
    id: "TX-94817",
    type: "Exchange",
    title: "SAR Exchange Order",
    amount: "₦ 200,000",
    date: "Sep 28, 2023 • 10:05",
    status: "Cancelled",
  },
]

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("All")
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const [cancelReason, setCancelReason] = useState("")

  const filtered = transactions.filter(tx => {
    const matchesSearch = tx.title.toLowerCase().includes(search.toLowerCase()) || tx.id.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "All" || tx.type === typeFilter;
    return matchesSearch && matchesType;
  })

  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case "Pending":
      case "In Progress":
      case "Cancellation in Review":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "Completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "Cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Exchange":
        return <RefreshCcw className="h-5 w-5 text-blue-500" />
      case "Deposit":
        return <ArrowDownLeft className="h-5 w-5 text-green-500" />
      case "Withdrawal":
      case "Registration Fee":
      case "Installment Payment":
        return <ArrowUpRight className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const handleMarkReceived = () => {
    if (!selectedTx) return
    setTransactions(prev => prev.map(t => t.id === selectedTx.id ? { ...t, status: "Completed" } : t))
    setSelectedTx({ ...selectedTx, status: "Completed" })
  }

  const handleCancelTransaction = () => {
    if (!selectedTx || !cancelReason.trim()) return
    setTransactions(prev => prev.map(t => t.id === selectedTx.id ? { ...t, status: "Cancellation in Review" } : t))
    setSelectedTx({ ...selectedTx, status: "Cancellation in Review" })
    setIsCancelling(false)
    setCancelReason("")
  }

  const handleCloseModal = (open: boolean) => {
    if (!open) {
      setSelectedTx(null)
      setIsCancelling(false)
      setCancelReason("")
    }
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
          <p className="text-muted-foreground">Track all your financial activity and exchange orders.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search transactions..." 
            className="pl-9 bg-transparent border-0 shadow-none focus-visible:ring-0"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="w-px h-6 bg-border mx-2"></div>
        <div className="w-40 shrink-0">
          <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val || "")}>
            <SelectTrigger className="h-9 bg-transparent border-0 shadow-none focus:ring-0 text-muted-foreground font-semibold">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="Exchange">Exchanges</SelectItem>
              <SelectItem value="Deposit">Deposits</SelectItem>
              <SelectItem value="Withdrawal">Withdrawals</SelectItem>
              <SelectItem value="Registration Fee">Registration Fees</SelectItem>
              <SelectItem value="Installment Payment">Installments</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No transactions found.</div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map(tx => (
              <div 
                key={tx.id} 
                className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => setSelectedTx(tx)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    {getTypeIcon(tx.type)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base">{tx.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{tx.date}</span>
                      <span className="w-1 h-1 bg-border rounded-full"></span>
                      <span className="text-xs font-semibold flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded-full">
                        {getStatusIcon(tx.status)}
                        {tx.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold text-sm sm:text-base ${tx.amount.startsWith("+") ? "text-green-600" : ""}`}>
                    {tx.amount}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{tx.id}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      <Dialog open={!!selectedTx} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden sm:rounded-2xl border-0 shadow-2xl">
          <div className="bg-primary/5 px-6 pt-10 pb-8 text-center relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40"></div>
            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-primary/10 mb-4">
              {isCancelling ? (
                <XCircle className="h-8 w-8 text-red-500" />
              ) : (
                <FileText className="h-8 w-8 text-primary" />
              )}
            </div>
            <DialogHeader className="sm:text-center">
              <DialogTitle className="text-2xl font-bold font-serif">{isCancelling ? "Cancel Order" : "Transaction Details"}</DialogTitle>
              <DialogDescription className="text-sm mt-2 font-mono">
                {selectedTx?.id}
              </DialogDescription>
            </DialogHeader>
          </div>
          
          {selectedTx && !isCancelling && (
            <div className="px-6 pb-8 pt-2 space-y-6">
              <div className="flex justify-between items-center bg-secondary/30 p-4 rounded-xl border border-transparent">
                <span className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Status</span>
                <span className="font-bold flex items-center gap-2">
                  {getStatusIcon(selectedTx.status)}
                  {selectedTx.status}
                </span>
              </div>

              <div className="space-y-3 px-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium text-sm">Type</span>
                  <span className="font-semibold">{selectedTx.type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium text-sm">Date</span>
                  <span className="font-semibold">{selectedTx.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium text-sm">Amount (NGN)</span>
                  <span className="font-bold text-lg">{selectedTx.amount}</span>
                </div>
                
                {selectedTx.details && (
                  <>
                    <div className="h-px bg-border my-4"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium text-sm">Agent</span>
                      <span className="font-semibold">{selectedTx.details.agentName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium text-sm">Exchange Rate</span>
                      <span className="font-semibold">{selectedTx.details.exchangeRate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium text-sm">You Receive</span>
                      <span className="font-bold text-primary text-lg">{selectedTx.details.receiveAmount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium text-sm">Delivery</span>
                      <span className="font-semibold">{selectedTx.details.deliveryMethod}</span>
                    </div>
                  </>
                )}
              </div>

              {selectedTx.type === "Exchange" && (selectedTx.status === "In Progress" || selectedTx.status === "Pending") && (
                <div className="pt-4 border-t border-border space-y-4">
                  <p className="text-sm text-primary/80 bg-primary/10 p-4 rounded-xl font-medium leading-relaxed">
                    Have you met with the agent and successfully received your cash in {selectedTx.details?.receiveAmount?.split(' ')[1] || 'foreign currency'}?
                  </p>
                  <div className="flex flex-col gap-3">
                    <Button 
                      className="w-full h-12 text-base font-bold bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all" 
                      onClick={handleMarkReceived}
                    >
                      Yes, I Have Received My Cash
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full h-12 text-base font-bold text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 rounded-xl" 
                      onClick={() => setIsCancelling(true)}
                    >
                      Request Cancellation
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedTx && isCancelling && (
            <div className="px-6 pb-8 pt-2 space-y-6">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Please provide a reason for cancelling this exchange order. Your request will be reviewed by our support team.
                </p>
                <Textarea 
                  placeholder="Tell us why you want to cancel..." 
                  className="min-h-[120px] resize-none focus:bg-transparent bg-secondary/30 border-transparent focus:border-primary/50 transition-colors rounded-xl"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button 
                  className="w-full h-12 text-base font-bold bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all rounded-xl" 
                  onClick={handleCancelTransaction}
                  disabled={!cancelReason.trim()}
                >
                  Submit Cancellation Request
                </Button>
                <Button 
                  variant="ghost"
                  className="w-full h-12 text-base font-bold rounded-xl" 
                  onClick={() => setIsCancelling(false)}
                >
                  Go Back
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
