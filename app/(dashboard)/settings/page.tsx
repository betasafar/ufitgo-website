"use client"

import { useState, useEffect } from "react"
import { ShieldCheck, LockKeyhole, KeyRound, CheckCircle2, Landmark, ChevronRight } from "lucide-react"
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
import { getUserSettings, updateUserSettings, UserSettings } from "@/lib/mock-db"

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  
  // Modals state
  const [isPinModalOpen, setIsPinModalOpen] = useState(false)
  const [isSqModalOpen, setIsSqModalOpen] = useState(false)
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)

  // PIN Reset State
  const [currentPin, setCurrentPin] = useState("")
  const [newPin, setNewPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [pinError, setPinError] = useState("")
  const [pinSuccess, setPinSuccess] = useState(false)

  // Security Question Reset State
  const [sqCurrentPin, setSqCurrentPin] = useState("")
  const [newQuestion, setNewQuestion] = useState("What was the name of your first pet?")
  const [newAnswer, setNewAnswer] = useState("")
  const [sqError, setSqError] = useState("")
  const [sqSuccess, setSqSuccess] = useState(false)

  // Collection Account Reset State
  const [accCurrentPin, setAccCurrentPin] = useState("")
  const [newBankName, setNewBankName] = useState("")
  const [newAccountNum, setNewAccountNum] = useState("")
  const [newAccountName, setNewAccountName] = useState("")
  const [accError, setAccError] = useState("")
  const [accSuccess, setAccSuccess] = useState(false)

  useEffect(() => {
    const data = getUserSettings()
    setSettings(data)
    if (data?.collectionAccount) {
      setNewBankName(data.collectionAccount.bankName)
      setNewAccountNum(data.collectionAccount.accountNumber)
      setNewAccountName(data.collectionAccount.accountName)
    }
  }, [])

  const handleResetPin = () => {
    setPinError("")
    setPinSuccess(false)

    if (!settings?.pin) {
      setPinError("You haven't set up a PIN yet. Please do so from the Wallet page first.")
      return
    }

    if (currentPin !== settings.pin) {
      setPinError("Current PIN is incorrect.")
      return
    }

    if (newPin.length !== 6) {
      setPinError("New PIN must be 6 digits.")
      return
    }

    if (newPin !== confirmPin) {
      setPinError("New PIN and Confirm PIN do not match.")
      return
    }

    // Success
    updateUserSettings({ pin: newPin })
    setSettings(getUserSettings())
    setPinSuccess(true)
    setCurrentPin("")
    setNewPin("")
    setConfirmPin("")
    
    setTimeout(() => {
      setPinSuccess(false)
      setIsPinModalOpen(false)
    }, 2000)
  }

  const handleResetSecurityQuestion = () => {
    setSqError("")
    setSqSuccess(false)

    if (!settings?.pin) {
      setSqError("You haven't set up security details yet. Please do so from the Wallet page first.")
      return
    }

    if (sqCurrentPin !== settings.pin) {
      setSqError("Authorization PIN is incorrect.")
      return
    }

    if (!newAnswer.trim()) {
      setSqError("Please provide an answer.")
      return
    }

    // Success
    updateUserSettings({ 
      securityQuestion: {
        question: newQuestion,
        answer: newAnswer.trim()
      }
    })
    setSettings(getUserSettings())
    setSqSuccess(true)
    setSqCurrentPin("")
    setNewAnswer("")

    setTimeout(() => {
      setSqSuccess(false)
      setIsSqModalOpen(false)
    }, 2000)
  }

  const handleResetAccount = () => {
    setAccError("")
    setAccSuccess(false)

    if (!settings?.pin) {
      setAccError("You haven't set up security details yet.")
      return
    }

    if (accCurrentPin !== settings.pin) {
      setAccError("Authorization PIN is incorrect.")
      return
    }

    if (!newBankName.trim() || !newAccountNum.trim() || !newAccountName.trim()) {
      setAccError("Please fill out all bank details.")
      return
    }

    // Success
    updateUserSettings({ 
      collectionAccount: {
        bankName: newBankName.trim(),
        accountNumber: newAccountNum.trim(),
        accountName: newAccountName.trim()
      }
    })
    setSettings(getUserSettings())
    setAccSuccess(true)
    setAccCurrentPin("")

    setTimeout(() => {
      setAccSuccess(false)
      setIsAccountModalOpen(false)
    }, 2000)
  }

  const openModal = (modalSetter: any) => {
    // Reset all errors and states when opening a modal
    setPinError(""); setPinSuccess(false); setCurrentPin(""); setNewPin(""); setConfirmPin("");
    setSqError(""); setSqSuccess(false); setSqCurrentPin(""); setNewAnswer("");
    setAccError(""); setAccSuccess(false); setAccCurrentPin("");
    
    if (settings?.collectionAccount) {
      setNewBankName(settings.collectionAccount.bankName)
      setNewAccountNum(settings.collectionAccount.accountNumber)
      setNewAccountName(settings.collectionAccount.accountName)
    }

    modalSetter(true)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif mb-2">Account Settings</h1>
        <p className="text-muted-foreground">Manage your security preferences and withdrawal authorization.</p>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 bg-secondary/20 border-b border-border">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider ml-2">Security & Preferences</h2>
        </div>
        
        <div className="divide-y divide-border">
          {/* PIN Row */}
          <div 
            className="p-5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group"
            onClick={() => openModal(setIsPinModalOpen)}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <LockKeyhole className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Withdrawal PIN</h4>
                <p className="text-sm text-muted-foreground mt-0.5">Change the 6-digit PIN used to authorize your wallet withdrawals.</p>
              </div>
            </div>
            <div className="flex items-center text-primary group-hover:translate-x-1 transition-transform">
              <span className="text-sm font-semibold mr-1">Update</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>

          {/* Security Question Row */}
          <div 
            className="p-5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group"
            onClick={() => openModal(setIsSqModalOpen)}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <KeyRound className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Security Question</h4>
                <p className="text-sm text-muted-foreground mt-0.5">Change the security question used for two-factor authorization.</p>
              </div>
            </div>
            <div className="flex items-center text-primary group-hover:translate-x-1 transition-transform">
              <span className="text-sm font-semibold mr-1">Update</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>

          {/* Collection Account Row */}
          <div 
            className="p-5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group"
            onClick={() => openModal(setIsAccountModalOpen)}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Landmark className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Collection Account</h4>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {settings?.collectionAccount 
                    ? `Currently: ${settings.collectionAccount.bankName} - ${settings.collectionAccount.accountNumber}`
                    : "Configure the bank account where your funds will be deposited."}
                </p>
              </div>
            </div>
            <div className="flex items-center text-primary group-hover:translate-x-1 transition-transform">
              <span className="text-sm font-semibold mr-1">Update</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* PIN Reset Modal */}
      <Dialog open={isPinModalOpen} onOpenChange={setIsPinModalOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden sm:rounded-2xl border-0 shadow-2xl">
          <div className="bg-primary/5 px-6 pt-10 pb-8 text-center relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40"></div>
            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-primary/10 mb-4">
              <LockKeyhole className="h-8 w-8 text-primary" />
            </div>
            <DialogHeader className="sm:text-center">
              <DialogTitle className="text-2xl font-bold font-serif">Reset PIN</DialogTitle>
            </DialogHeader>
          </div>
          
          <div className="px-6 pb-8 pt-2 space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Current PIN</label>
              <Input 
                type="password"
                maxLength={6}
                placeholder="••••••" 
                value={currentPin}
                onChange={e => setCurrentPin(e.target.value.replace(/\D/g, ''))}
                className="h-12 rounded-xl text-center text-xl tracking-[0.5em] bg-secondary/30 border-transparent focus:bg-transparent focus:border-primary/50 transition-colors w-full"
              />
            </div>
            <div className="h-px bg-border my-2 w-full"></div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">New PIN</label>
                <Input 
                  type="password"
                  maxLength={6}
                  placeholder="••••••" 
                  value={newPin}
                  onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                  className="h-12 rounded-xl text-center text-xl tracking-[0.5em] bg-secondary/30 border-transparent focus:bg-transparent focus:border-primary/50 transition-colors w-full"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Confirm New PIN</label>
                <Input 
                  type="password"
                  maxLength={6}
                  placeholder="••••••" 
                  value={confirmPin}
                  onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  className="h-12 rounded-xl text-center text-xl tracking-[0.5em] bg-secondary/30 border-transparent focus:bg-transparent focus:border-primary/50 transition-colors w-full"
                />
              </div>
            </div>

            {pinError && <p className="text-sm text-red-600 font-bold bg-red-50 py-2 px-3 rounded-xl border border-red-100 text-center">{pinError}</p>}
            {pinSuccess && (
              <div className="flex items-center justify-center gap-2 text-sm text-green-700 font-bold bg-green-50 py-2 px-3 rounded-xl border border-green-200">
                <CheckCircle2 className="h-4 w-4" /> PIN successfully updated!
              </div>
            )}

            <Button 
              className="w-full h-12 text-base font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
              onClick={handleResetPin}
              disabled={currentPin.length !== 6 || newPin.length !== 6 || confirmPin.length !== 6}
            >
              Update PIN
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Security Question Reset Modal */}
      <Dialog open={isSqModalOpen} onOpenChange={setIsSqModalOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden sm:rounded-2xl border-0 shadow-2xl">
          <div className="bg-primary/5 px-6 pt-10 pb-8 text-center relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40"></div>
            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-primary/10 mb-4">
              <KeyRound className="h-8 w-8 text-primary" />
            </div>
            <DialogHeader className="sm:text-center">
              <DialogTitle className="text-2xl font-bold font-serif">Security Question</DialogTitle>
            </DialogHeader>
          </div>
          
          <div className="px-6 pb-8 pt-2 space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Authorization PIN</label>
              <Input 
                type="password"
                maxLength={6}
                placeholder="••••••" 
                value={sqCurrentPin}
                onChange={e => setSqCurrentPin(e.target.value.replace(/\D/g, ''))}
                className="h-12 rounded-xl text-center text-xl tracking-[0.5em] bg-secondary/30 border-transparent focus:bg-transparent focus:border-primary/50 transition-colors w-full"
              />
              <p className="text-[10px] text-muted-foreground ml-1">Enter your current PIN to authorize this change.</p>
            </div>
            <div className="h-px bg-border my-2 w-full"></div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">New Question</label>
                <Select value={newQuestion} onValueChange={(val) => setNewQuestion(val || "")}>
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
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">New Answer</label>
                <Input 
                  type="text"
                  placeholder="Your secure answer" 
                  value={newAnswer}
                  onChange={e => setNewAnswer(e.target.value)}
                  className="h-12 rounded-xl bg-secondary/30 border-transparent focus:bg-transparent focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            {sqError && <p className="text-sm text-red-600 font-bold bg-red-50 py-2 px-3 rounded-xl border border-red-100 text-center">{sqError}</p>}
            {sqSuccess && (
              <div className="flex items-center justify-center gap-2 text-sm text-green-700 font-bold bg-green-50 py-2 px-3 rounded-xl border border-green-200">
                <ShieldCheck className="h-4 w-4" /> Successfully updated!
              </div>
            )}

            <Button 
              className="w-full h-12 text-base font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
              onClick={handleResetSecurityQuestion}
              disabled={sqCurrentPin.length !== 6 || !newAnswer.trim()}
            >
              Update Security Question
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Collection Account Reset Modal */}
      <Dialog open={isAccountModalOpen} onOpenChange={setIsAccountModalOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden sm:rounded-2xl border-0 shadow-2xl">
          <div className="bg-primary/5 px-6 pt-10 pb-8 text-center relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40"></div>
            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-primary/10 mb-4">
              <Landmark className="h-8 w-8 text-primary" />
            </div>
            <DialogHeader className="sm:text-center">
              <DialogTitle className="text-2xl font-bold font-serif">Collection Account</DialogTitle>
            </DialogHeader>
          </div>
          
          <div className="px-6 pb-8 pt-2 space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Authorization PIN</label>
              <Input 
                type="password"
                maxLength={6}
                placeholder="••••••" 
                value={accCurrentPin}
                onChange={e => setAccCurrentPin(e.target.value.replace(/\D/g, ''))}
                className="h-12 rounded-xl text-center text-xl tracking-[0.5em] bg-secondary/30 border-transparent focus:bg-transparent focus:border-primary/50 transition-colors w-full"
              />
              <p className="text-[10px] text-muted-foreground ml-1">Enter your current PIN to authorize this change.</p>
            </div>
            <div className="h-px bg-border my-2 w-full"></div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Bank Name</label>
                  <Select value={newBankName} onValueChange={(val) => setNewBankName(val || "")}>
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
                  value={newAccountNum}
                  onChange={e => setNewAccountNum(e.target.value)}
                  className="h-12 rounded-xl bg-secondary/30 border-transparent focus:bg-transparent focus:border-primary/50 transition-colors font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Account Name</label>
                <Input 
                  placeholder="e.g. John Doe" 
                  value={newAccountName}
                  onChange={e => setNewAccountName(e.target.value)}
                  className="h-12 rounded-xl bg-secondary/30 border-transparent focus:bg-transparent focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            {accError && <p className="text-sm text-red-600 font-bold bg-red-50 py-2 px-3 rounded-xl border border-red-100 text-center">{accError}</p>}
            {accSuccess && (
              <div className="flex items-center justify-center gap-2 text-sm text-green-700 font-bold bg-green-50 py-2 px-3 rounded-xl border border-green-200">
                <ShieldCheck className="h-4 w-4" /> Successfully updated!
              </div>
            )}

            <Button 
              className="w-full h-12 text-base font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
              onClick={handleResetAccount}
              disabled={accCurrentPin.length !== 6 || !newBankName.trim() || !newAccountNum.trim() || !newAccountName.trim()}
            >
              Update Collection Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
