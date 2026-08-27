"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getWalletBalance, getSavingsTargets, getTransactions, SavingsTarget, WalletTransaction, addMoneyToWallet, withdrawMoneyFromWallet, getUserSettings, updateUserSettings, UserSettings } from "@/lib/mock-db"
import { formatNaira } from "@/lib/packages"
import { Plus, ArrowDownToLine, ArrowUpToLine, ChevronRight, Eye, EyeOff, Target, Tag, Copy, ShieldCheck, Landmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function WalletPage() {
  const [balance, setBalance] = useState(0)
  const [targets, setTargets] = useState<SavingsTarget[]>([])
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [showBalance, setShowBalance] = useState(true)
  const [txFilter, setTxFilter] = useState<"All" | "Money In" | "Money Out">("All")

  // Modal States
  const [isTopUpOpen, setIsTopUpOpen] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState("")
  
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState("")

  // Security & Setup States
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)
  const [isSetupOpen, setIsSetupOpen] = useState(false)
  const [setupStep, setSetupStep] = useState<1 | 2>(1)
  const [setupBank, setSetupBank] = useState("")
  const [setupAccountNum, setSetupAccountNum] = useState("")
  const [setupAccountName, setSetupAccountName] = useState("")
  const [setupPin, setSetupPin] = useState("")
  const [setupQuestion, setSetupQuestion] = useState("What was the name of your first pet?")
  const [setupAnswer, setSetupAnswer] = useState("")

  const [authPin, setAuthPin] = useState("")
  const [authAnswer, setAuthAnswer] = useState("")
  const [authError, setAuthError] = useState("")

  const refreshData = () => {
    setBalance(getWalletBalance())
    setTransactions(getTransactions().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    setUserSettings(getUserSettings())
  }

  useEffect(() => {
    setBalance(getWalletBalance())
    setTargets(getSavingsTargets())
    setTransactions(getTransactions().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    setUserSettings(getUserSettings())
    setIsLoaded(true)
  }, [])

  const handleTopUp = () => {
    const amount = Number(topUpAmount)
    if (amount > 0) {
      addMoneyToWallet("user-1", amount)
      refreshData()
      setIsTopUpOpen(false)
      setTopUpAmount("")
    }
  }

  const initiateWithdrawal = () => {
    if (!userSettings?.collectionAccount || !userSettings?.pin || !userSettings?.securityQuestion) {
      setIsSetupOpen(true)
      setSetupStep(1)
    } else {
      setIsWithdrawOpen(true)
    }
  }

  const handleSetupSubmit = () => {
    updateUserSettings({
      collectionAccount: {
        bankName: setupBank,
        accountNumber: setupAccountNum,
        accountName: setupAccountName
      },
      pin: setupPin,
      securityQuestion: {
        question: setupQuestion,
        answer: setupAnswer.toLowerCase()
      }
    })
    refreshData()
    setIsSetupOpen(false)
    setIsWithdrawOpen(true) // Automatically proceed to withdraw
  }

  const handleWithdraw = () => {
    setAuthError("")
    const amount = Number(withdrawAmount)
    
    // Validations
    if (amount <= 0 || amount > balance) {
      setAuthError("Invalid amount.")
      return
    }
    if (authPin !== userSettings?.pin) {
      setAuthError("Incorrect PIN.")
      return
    }
    if (authAnswer.toLowerCase() !== userSettings?.securityQuestion?.answer.toLowerCase()) {
      setAuthError("Incorrect Security Answer.")
      return
    }

    const accountInfo = `${userSettings.collectionAccount?.bankName} - ${userSettings.collectionAccount?.accountNumber}`
    const success = withdrawMoneyFromWallet("user-1", amount, accountInfo)
    
    if (success) {
      refreshData()
      setIsWithdrawOpen(false)
      setWithdrawAmount("")
      setAuthPin("")
      setAuthAnswer("")
    }
  }

  if (!isLoaded) return <div className="p-8">Loading wallet...</div>

  // Analytics Calculations
  const totalSaved = targets.reduce((sum, t) => sum + t.savedAmount, 0)
  const totalPaid = transactions
    .filter(t => t.type === "Reservation Payment" || t.type === "Package Payment")
    .reduce((sum, t) => sum + t.amount, 0)
  const thisMonthAdded = transactions
    .filter(t => t.type === "Add Money" && new Date(t.createdAt).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0)

  // Transaction Filtering
  const filteredTxs = transactions.filter(tx => {
    if (txFilter === "All") return true
    if (txFilter === "Money In") return tx.type === "Add Money"
    if (txFilter === "Money Out") return tx.type !== "Add Money"
    return true
  }).slice(0, 5) // Show only 5 recent

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8 space-y-8">
      {/* 1. The Premium Fintech Balance Card (Outlined) */}
      <div className="rounded-3xl bg-card border-2 border-primary/10 text-foreground p-8 sm:p-10 flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6 relative overflow-hidden shadow-xl shadow-primary/5">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-primary">
          <svg className="w-64 h-64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        </div>

        <div className="relative z-10 w-full sm:w-auto text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
            <span className="text-muted-foreground font-semibold tracking-wider text-sm uppercase">
              UfitGo Wallet
            </span>
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className="text-muted-foreground hover:text-foreground transition-colors bg-secondary p-1.5 rounded-md"
            >
              {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-serif font-bold tracking-tight mb-2">
            {showBalance ? formatNaira(balance) : "₦ •••••••"}
          </h1>
          
          <div className="inline-flex items-center gap-2 bg-secondary/80 px-3 py-1.5 rounded-full text-sm font-medium mt-2 text-foreground/80">
            <span>Wema Bank</span>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/50"></div>
            <span className="font-mono tracking-wider font-semibold">9938210042</span>
            <button className="text-primary hover:text-primary/80 ml-1 transition-colors">
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="relative z-10 flex w-full sm:w-auto gap-3">
          <Button 
            className="flex-1 sm:flex-none bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl h-12 px-8 shadow-lg"
            onClick={() => setIsTopUpOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Top Up
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 sm:flex-none border-border text-foreground hover:bg-secondary font-semibold rounded-xl h-12 px-6"
            onClick={initiateWithdrawal}
          >
            <ArrowDownToLine className="mr-2 h-4 w-4" /> Withdraw
          </Button>
        </div>
      </div>

      {/* 2. Financial Summary Strip */}
      <div className="grid grid-cols-3 divide-x divide-border bg-card rounded-2xl border border-border py-4 shadow-sm">
        <div className="text-center px-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Saved</p>
          <p className="font-bold text-foreground text-lg">{formatNaira(totalSaved)}</p>
        </div>
        <div className="text-center px-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Paid</p>
          <p className="font-bold text-foreground text-lg">{formatNaira(totalPaid)}</p>
        </div>
        <div className="text-center px-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Added this Month</p>
          <p className="font-bold text-green-600 text-lg">+{formatNaira(thisMonthAdded)}</p>
        </div>
      </div>

      {/* Split Layout: Transactions (Left) & Targets (Right) */}
      <div className="grid lg:grid-cols-5 gap-8">
        
        {/* 3. Integrated Transactions (60% width) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center bg-card border border-border rounded-t-2xl p-4 border-b-0">
            <h2 className="text-lg font-bold font-serif">Recent Transactions</h2>
            <div className="flex gap-4 text-sm font-medium">
              {(["All", "Money In", "Money Out"] as const).map(tab => (
                <button 
                  key={tab}
                  onClick={() => setTxFilter(tab)}
                  className={`pb-1 transition-colors ${txFilter === tab ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-b-2xl overflow-hidden -mt-4">
            {filteredTxs.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No transactions found.
              </div>
            ) : (
              <div>
                {filteredTxs.map((tx, idx) => {
                  const isNegative = tx.type !== "Add Money"
                  const Icon = tx.type === "Add Money" ? ArrowDownToLine :
                               tx.type === "Savings" ? Target :
                               tx.type === "Withdrawal" ? ArrowUpToLine : Tag

                  return (
                    <div 
                      key={tx.id} 
                      className={`flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors ${
                        idx !== filteredTxs.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-full flex-shrink-0 ${isNegative ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground">{tx.description}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(tx.createdAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-sm ${isNegative ? "text-foreground" : "text-green-600"}`}>
                          {isNegative ? "-" : "+"}{formatNaira(tx.amount)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            <div className="p-3 bg-secondary/20 text-center border-t border-border">
              <Link href="/wallet/transactions" className="text-sm font-semibold text-primary hover:underline">
                View All Transactions
              </Link>
            </div>
          </div>
        </div>

        {/* 4. Target Savings (40% width) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold font-serif">Target Savings</h2>
            <Link href="/wallet/target/new">
              <button className="text-sm font-semibold text-primary hover:underline flex items-center">
                <Plus className="h-4 w-4 mr-1" /> New
              </button>
            </Link>
          </div>

          {targets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center">
              <Target className="h-8 w-8 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">You have no active savings goals.</p>
              <Link href="/wallet/target/new">
                <Button size="sm" className="w-full">Create a Target</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {targets.map((target) => {
                const progress = Math.min(100, (target.savedAmount / target.targetAmount) * 100)
                
                return (
                  <Link key={target.id} href={`/wallet/target/${target.id}`} className="block">
                    <div className="rounded-2xl border border-border bg-card p-4 hover:border-primary/50 transition-colors shadow-sm group">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{target.category.includes('Umrah') ? '🕋' : '🎯'}</span>
                          <h3 className="font-semibold text-sm">{target.name}</h3>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>

                      <div className="mb-2 flex justify-between items-end">
                        <p className="font-bold text-foreground">
                          {formatNaira(target.savedAmount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          of {formatNaira(target.targetAmount)}
                        </p>
                      </div>
                      
                      <div className="w-full bg-secondary rounded-full h-1.5 mb-2">
                        <div 
                          className="bg-primary h-1.5 rounded-full transition-all" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      
                      <p className="text-[10px] font-bold text-primary text-right uppercase tracking-wider">
                        {Math.round(progress)}% complete
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

      </div>

      {/* Top Up Modal */}
      <Dialog open={isTopUpOpen} onOpenChange={setIsTopUpOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden sm:rounded-2xl border-0 shadow-2xl">
          <div className="bg-primary/5 px-6 pt-10 pb-8 text-center relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40"></div>
            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-primary/10 mb-4">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <DialogHeader className="sm:text-center">
              <DialogTitle className="text-2xl font-bold font-serif">Top Up Wallet</DialogTitle>
              <DialogDescription className="text-sm mt-2">
                Transfer money to your unique UfitGo virtual account. Funds will reflect in your wallet instantly.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="px-6 pb-8 pt-2 space-y-6">
            <div className="bg-secondary/20 border border-border rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Bank Name</span>
                <span className="font-bold">Wema Bank</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Account Name</span>
                <span className="font-bold">UfitGo - My Wallet</span>
              </div>
              <div className="h-px bg-border w-full my-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Account Number</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold font-mono text-lg tracking-wider text-primary">9938210042</span>
                  <button className="p-2 hover:bg-secondary rounded-md text-primary transition-colors bg-secondary/50">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 text-amber-700 text-xs p-3 rounded-lg font-medium">
              Only transfer NGN (Naira) to this account. Other currencies may be lost.
            </div>

            <Button 
              className="w-full h-12 text-base font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
              onClick={() => setIsTopUpOpen(false)}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Withdraw Authorization Modal */}
      <Dialog open={isWithdrawOpen} onOpenChange={(open) => {
        setIsWithdrawOpen(open)
        if (!open) setAuthError("") // Reset errors on close
      }}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden sm:rounded-2xl border-0 shadow-2xl">
          <div className="bg-primary/5 px-6 pt-10 pb-8 text-center relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40"></div>
            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-primary/10 mb-4">
              <ArrowUpToLine className="h-8 w-8 text-primary" />
            </div>
            <DialogHeader className="sm:text-center">
              <DialogTitle className="text-2xl font-bold font-serif">Withdraw Funds</DialogTitle>
              <DialogDescription className="text-sm mt-2">
                Authorize withdrawal to your secure collection account.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-6 pb-8 pt-2 space-y-5">
            <div className="bg-secondary/30 p-4 rounded-xl border border-transparent space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-semibold">Available Balance</span>
                <span className="font-bold text-foreground">{formatNaira(balance)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-semibold">Destination</span>
                <span className="font-semibold text-right max-w-[200px] truncate">
                  {userSettings?.collectionAccount?.bankName} - {userSettings?.collectionAccount?.accountNumber}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Amount to Withdraw (NGN)</label>
              <Input 
                type="number" 
                placeholder="Enter amount..." 
                value={withdrawAmount}
                onChange={e => setWithdrawAmount(e.target.value)}
                className="h-12 rounded-xl bg-secondary/30 border-transparent focus:bg-transparent focus:border-primary/50 transition-colors text-lg"
                max={balance}
              />
              {Number(withdrawAmount) > balance && (
                <p className="text-xs text-red-500 mt-1 font-medium ml-1">Amount exceeds available balance.</p>
              )}
            </div>

            <div className="h-px bg-border w-full my-4"></div>
            
            <p className="text-xs font-bold text-primary uppercase tracking-wider text-center">Security Authorization</p>

            <div className="space-y-1 text-center">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">6-Digit PIN</label>
              <Input 
                type="password"
                maxLength={6}
                placeholder="••••••" 
                value={authPin}
                onChange={e => setAuthPin(e.target.value.replace(/\D/g, ''))}
                className="h-14 rounded-xl text-center text-3xl tracking-[0.5em] bg-secondary/30 border-transparent focus:bg-transparent focus:border-primary/50 mx-auto w-48"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">{userSettings?.securityQuestion?.question}</label>
              <Input 
                type="text" 
                placeholder="Enter your answer" 
                value={authAnswer}
                onChange={e => setAuthAnswer(e.target.value)}
                className="h-12 rounded-xl bg-secondary/30 border-transparent focus:bg-transparent focus:border-primary/50 transition-colors"
              />
            </div>

            {authError && (
              <p className="text-sm text-red-600 text-center font-bold bg-red-50 border border-red-100 py-2 px-3 rounded-xl">{authError}</p>
            )}

            <div className="pt-2">
              <Button 
                className="w-full h-12 text-base font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
                onClick={handleWithdraw}
                disabled={!withdrawAmount || Number(withdrawAmount) <= 0 || Number(withdrawAmount) > balance || authPin.length !== 6 || !authAnswer.trim()}
              >
                Authorize & Withdraw
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Setup Modal */}
      <Dialog open={isSetupOpen} onOpenChange={setIsSetupOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden sm:rounded-2xl border-0 shadow-2xl">
          <div className="bg-primary/5 px-6 pt-10 pb-8 text-center relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40"></div>
            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-primary/10 mb-4">
              {setupStep === 1 ? (
                <Landmark className="h-8 w-8 text-primary" />
              ) : (
                <ShieldCheck className="h-8 w-8 text-primary" />
              )}
            </div>
            <DialogHeader className="sm:text-center">
              <DialogTitle className="text-2xl font-bold font-serif">
                {setupStep === 1 ? "Secure Your Withdrawals" : "Set Up Security PIN"}
              </DialogTitle>
              <DialogDescription className="text-sm mt-2">
                {setupStep === 1 
                  ? "Configure the specific bank account where your UfitGo funds will be deposited." 
                  : "Create a PIN and security question to authorize future transactions."}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-6 pb-8 pt-2 space-y-6">
            {setupStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Bank Name</label>
                  <Select value={setupBank} onValueChange={(val) => setSetupBank(val || "")}>
                    <SelectTrigger className="w-full h-12 rounded-xl bg-secondary/30 border-transparent focus:bg-transparent focus:border-primary/50 transition-colors">
                      <SelectValue placeholder="Select your bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Access Bank">Access Bank</SelectItem>
                      <SelectItem value="First Bank">First Bank</SelectItem>
                      <SelectItem value="GTBank">GTBank</SelectItem>
                      <SelectItem value="UBA">UBA</SelectItem>
                      <SelectItem value="Zenith Bank">Zenith Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Account Number</label>
                  <Input 
                    type="number"
                    placeholder="0123456789" 
                    value={setupAccountNum}
                    onChange={e => setSetupAccountNum(e.target.value)}
                    className="h-12 rounded-xl bg-secondary/30 border-transparent focus:bg-transparent focus:border-primary/50 transition-colors font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Account Name</label>
                  <Input 
                    placeholder="e.g. John Doe" 
                    value={setupAccountName}
                    onChange={e => setSetupAccountName(e.target.value)}
                    className="h-12 rounded-xl bg-secondary/30 border-transparent focus:bg-transparent focus:border-primary/50 transition-colors"
                  />
                </div>
                
                <div className="pt-2">
                  <Button 
                    className="w-full h-12 text-base font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
                    onClick={() => setSetupStep(2)}
                    disabled={!setupBank.trim() || !setupAccountNum.trim() || !setupAccountName.trim()}
                  >
                    Next: Security Setup
                  </Button>
                </div>
              </div>
            )}

            {setupStep === 2 && (
              <div className="space-y-5">
                <div className="space-y-1 text-center">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Create 6-Digit PIN</label>
                  <Input 
                    type="password"
                    maxLength={6}
                    placeholder="••••••" 
                    value={setupPin}
                    onChange={e => setSetupPin(e.target.value.replace(/\D/g, ''))}
                    className="h-14 rounded-xl text-center text-3xl tracking-[0.5em] bg-secondary/30 border-transparent focus:bg-transparent focus:border-primary/50 mx-auto w-48"
                  />
                </div>
                
                <div className="h-px bg-border my-4 w-full"></div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Security Question</label>
                    <Select value={setupQuestion} onValueChange={(val) => setSetupQuestion(val || "")}>
                      <SelectTrigger className="w-full h-12 rounded-xl bg-secondary/30 border-transparent focus:bg-transparent focus:border-primary/50 transition-colors">
                        <SelectValue placeholder="Select a question" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="What was the name of your first pet?">What was the name of your first pet?</SelectItem>
                        <SelectItem value="What city were you born in?">What city were you born in?</SelectItem>
                        <SelectItem value="What is your mother's maiden name?">What is your mother's maiden name?</SelectItem>
                        <SelectItem value="What was your childhood nickname?">What was your childhood nickname?</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Your Answer</label>
                    <Input 
                      type="text"
                      placeholder="Your secure answer" 
                      value={setupAnswer}
                      onChange={e => setSetupAnswer(e.target.value)}
                      className="h-12 rounded-xl bg-secondary/30 border-transparent focus:bg-transparent focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="outline"
                    className="w-1/3 h-12 text-base font-bold rounded-xl"
                    onClick={() => setSetupStep(1)}
                  >
                    Back
                  </Button>
                  <Button 
                    className="flex-1 h-12 text-base font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
                    onClick={handleSetupSubmit}
                    disabled={setupPin.length !== 6 || !setupAnswer.trim()}
                  >
                    Complete Setup
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
