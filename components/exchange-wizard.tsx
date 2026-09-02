"use client"
import Link from "next/link"
import { useState, useMemo, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { MapPin, Truck, Store, ArrowRight, ShieldCheck, CheckCircle2, Navigation, MessageCircle, ArrowDownUp, Info, Sparkles, TrendingDown, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { EXCHANGE_CITIES, MOCK_BANKS, getUfitGoDeliveryFee, DeliveryMethod } from "@/lib/mock-data-exchange"
import { exchangeService, ExchangeAgent, ExchangeOrder } from "@/lib/exchange.service"

export function ExchangeWizard() {
  const { data: session } = useSession()
  const [step, setStep] = useState(1) // 1 = Form, 2 = Status
  
  // State
  const [currency, setCurrency] = useState<"SAR" | "USD">("SAR")
  const [city, setCity] = useState(EXCHANGE_CITIES[0])
  const [agents, setAgents] = useState<ExchangeAgent[]>([])
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null)
  const [amountNaira, setAmountNaira] = useState("")
  const [method, setMethod] = useState<DeliveryMethod>("pickup")
  const [refundBank, setRefundBank] = useState("")
  const [refundAccount, setRefundAccount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Order State
  const [currentOrder, setCurrentOrder] = useState<ExchangeOrder | null>(null)
  const [otp, setOtp] = useState<string>("")
  const [orderStatus, setOrderStatus] = useState<string>("pending")
  
  const [isChangeAgentOpen, setIsChangeAgentOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(true)

  // Socket instance management
  useEffect(() => {
    return () => {
      exchangeService.disconnect()
    }
  }, [])

  // Fetch agents when currency/city changes
  useEffect(() => {
    if (!(session?.user as any)?.token && !(session?.user as any)?.accessToken) return;
    const token = (session?.user as any).token || (session?.user as any).accessToken;
    let isMounted = true;
    
    const fetchAgents = async () => {
      setIsSearching(true);
      try {
        const fetchedAgents = await exchangeService.getAgents(token as string, currency, city);
        if (isMounted) {
          setAgents(fetchedAgents);
          if (fetchedAgents.length > 0) {
            setSelectedAgentId(fetchedAgents[0].id);
          } else {
            setSelectedAgentId(null);
          }
        }
      } catch (e) {
        console.warn("Failed to fetch agents", e);
        if (isMounted) {
          setAgents([]);
          setSelectedAgentId(null);
        }
      } finally {
        if (isMounted) setIsSearching(false);
      }
    };
    
    // Add artificial delay for UX
    const timer = setTimeout(() => {
      fetchAgents();
    }, 1000);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [city, currency, session]);

  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0]

  const handleConfirmPayment = async () => {
    const token = (session?.user as any)?.token || (session?.user as any)?.accessToken;
    if (!token || !selectedAgentId) return;
    
    setIsProcessing(true)
    try {
      const result = await exchangeService.createOrder(token as string, {
        agentId: selectedAgentId,
        amountNgn: Number(amountNaira),
        amountForeign: calculatedReceiveAmount,
        currency,
        fulfillmentMethod: method.toUpperCase(),
        refundBankCode: refundBank,
        refundAccountNumber: refundAccount
      });
      
      setCurrentOrder(result.order);
      setOtp(result.otp);
      setOrderStatus("pending");
      setStep(2);
      
      // Connect socket
      exchangeService.connect(token as string);
      exchangeService.onOrderUpdated((updatedOrder) => {
        if (updatedOrder.id === result.order.id) {
          setCurrentOrder(updatedOrder);
          if (updatedOrder.status === 'AGENT_ACCEPTED') setOrderStatus('accepted');
          if (updatedOrder.status === 'COMPLETED') setOrderStatus('completed');
          if (updatedOrder.status === 'CANCELLED') setOrderStatus('cancelled');
        }
      });
    } catch (e) {
      console.warn("Failed to create order", e);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false)
    }
  }
  
  const handleCancelOrder = async () => {
    const token = (session?.user as any)?.token || (session?.user as any)?.accessToken;
    if (!token || !currentOrder) return;
    try {
      await exchangeService.cancelOrder(token as string, currentOrder.id);
      setOrderStatus('cancelled');
    } catch (e) {
      console.warn("Failed to cancel order", e);
      alert("Could not cancel order.");
    }
  }

  // MOCK Rates for now since API doesn't return rates in Agent entity yet
  // We simulate exchange rate for UI demonstration
  const currentRate = selectedAgent ? (currency === "SAR" ? 333.33 : 1250) : 0
  const currencySymbol = currency === "SAR" ? "SAR" : "USD"
  const calculatedReceiveAmount = Math.floor(Number(amountNaira) / (currentRate || 1))
  const isFormValid = Number(amountNaira) > 0 && refundAccount.length === 10 && refundBank && selectedAgentId !== null

  return (
    <div className="mx-auto max-w-2xl bg-white rounded-xl shadow-sm border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-[#FDFBF7] p-4 sm:p-6 border-b border-border flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground">
          {step === 1 ? "Travel Amenities" : "Order Status"}
        </h2>
      </div>

      <div className="p-4 sm:p-6 bg-[#F8F9FA]">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            {/* Currency Filter (Top) */}
            <div className="flex items-center justify-between gap-4">
               <div className="flex bg-white rounded-xl p-1 shadow-sm border border-border flex-1">
                <button 
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${currency === 'SAR' ? 'bg-[#FDFBF7] text-primary shadow-sm border border-border/50' : 'text-muted-foreground hover:bg-secondary/50'}`}
                  onClick={() => setCurrency('SAR')}
                >
                  🇸🇦 SAR
                </button>
                <button 
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${currency === 'USD' ? 'bg-[#FDFBF7] text-primary shadow-sm border border-border/50' : 'text-muted-foreground hover:bg-secondary/50'}`}
                  onClick={() => setCurrency('USD')}
                >
                  🇺🇸 USD
                </button>
              </div>
              <div className="w-40">
                  <Select value={city} onValueChange={(val) => setCity(val || "")}>
                  <SelectTrigger className="h-10 text-sm font-semibold bg-white shadow-sm">
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXCHANGE_CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 1. Best Agent Card (Smart Default) */}
            {isSearching ? (
              <div className="bg-white p-8 rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center text-center space-y-5 animate-in fade-in zoom-in-95">
                <div className="relative flex items-center justify-center w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping"></div>
                  <div className="absolute inset-2 rounded-full border-4 border-primary/40 animate-ping" style={{ animationDelay: '300ms' }}></div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary z-10 bg-white shadow-sm">
                    <MapPin className="h-6 w-6 animate-bounce" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-xl font-serif text-foreground">Finding the best match...</h3>
                  <p className="text-sm text-muted-foreground mt-1">Searching for agents nearby with the best exchange rate</p>
                </div>
              </div>
            ) : selectedAgent ? (
              <div className="bg-white p-5 rounded-2xl border border-border shadow-sm animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-[#B8860B] mr-1.5 text-sm">✨</span>
                    <span className="text-[#B8860B] text-xs font-bold uppercase tracking-wider">Suggested Agent</span>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="text-muted-foreground hover:text-foreground p-1 transition-colors">
                        <Info className="h-4 w-4" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl border-0 shadow-xl">
                      <div className="bg-[#0f4c5c] p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="flex items-center gap-3 mb-2 relative z-10">
                          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                            <Sparkles className="h-5 w-5 text-yellow-300" />
                          </div>
                          <DialogTitle className="text-xl font-serif text-white">Smart Match</DialogTitle>
                        </div>
                        <p className="text-white/80 text-sm relative z-10">We scan all available agents to instantly find your perfect match.</p>
                      </div>
                      
                      <div className="p-6 space-y-5 bg-white">
                        <div className="flex gap-4">
                          <div className="bg-[#FFFDF5] text-[#B8860B] border border-[#F0E6D2] p-2.5 rounded-full h-fit shrink-0 shadow-sm">
                            <TrendingDown className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-foreground">Best Exchange Rate</h4>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">We filter for the lowest competitive rates so you get the maximum value for your money.</p>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="bg-green-50 text-green-600 border border-green-100 p-2.5 rounded-full h-fit shrink-0 shadow-sm">
                            <MapPin className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-foreground">Closest Proximity</h4>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">If multiple agents offer the top rate, we auto-select the one closest to you for fast fulfillment.</p>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="bg-blue-50 text-blue-600 border border-blue-100 p-2.5 rounded-full h-fit shrink-0 shadow-sm">
                            <ShieldCheck className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-foreground">Verified Trust</h4>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">We only suggest highly-rated agents with proven track records on UfitGo.</p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#FDFBF7] border border-border flex items-center justify-center text-primary font-bold text-lg relative">
                      {selectedAgent.companyName?.charAt(0) || 'A'}
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-lg">{selectedAgent.companyName}</h4>
                        {selectedAgent.trustScore > 80 && <ShieldCheck className="h-4 w-4 text-green-500" />}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                        <MapPin className="h-3 w-3 mr-1" /> {selectedAgent.location || city} • ⭐ {(selectedAgent.trustScore / 20).toFixed(1)}
                      </div>
                    </div>
                  </div>
                  
                  <Dialog open={isChangeAgentOpen} onOpenChange={setIsChangeAgentOpen}>
                    <DialogTrigger asChild>
                      <button className="text-sm font-semibold text-[#B8860B] hover:underline">Change</button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Select Agent in {city}</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-3 py-4">
                        {agents.map(agent => (
                          <div 
                            key={agent.id} 
                            onClick={() => { setSelectedAgentId(agent.id); setIsChangeAgentOpen(false); }}
                            className={`p-4 rounded-xl border cursor-pointer transition-colors ${selectedAgentId === agent.id ? 'border-[#B8860B] bg-[#FFFDF5]' : 'border-border hover:border-primary/50 bg-white'}`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-bold">{agent.companyName}</div>
                                <div className="text-xs text-muted-foreground">⭐ {(agent.trustScore / 20).toFixed(1)}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-[#B8860B]">₦{currentRate}</div>
                                <div className="text-xs text-muted-foreground">per {currencySymbol}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="bg-[#FFFDF5] border border-[#F0E6D2] rounded-xl p-4 flex justify-between items-center">
                   <div>
                     <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Exchange Rate</div>
                     <div className="font-bold text-lg text-[#B8860B]">
                       ₦{currentRate} / 1 {currencySymbol}
                     </div>
                   </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center text-center space-y-4">
                <ShieldCheck className="h-12 w-12 text-muted-foreground/30" />
                <div>
                  <h3 className="font-bold text-lg text-foreground">No Agents Found</h3>
                  <p className="text-sm text-muted-foreground mt-1">There are no exchange agents currently available for {currency} in {city}.</p>
                </div>
              </div>
            )}

            {/* 2. Calculator */}
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-6 relative">
              <div className="bg-[#F8F9FA] rounded-xl p-4 border border-border/50">
                 <div className="text-xs font-bold text-muted-foreground uppercase mb-2">You Pay (NGN)</div>
                 <div className="flex items-center">
                    <span className="text-2xl font-bold text-muted-foreground mr-2">₦</span>
                    <input 
                      type="number"
                      className="bg-transparent border-none outline-none text-3xl font-bold w-full"
                      placeholder="0.00"
                      value={amountNaira}
                      onChange={(e) => setAmountNaira(e.target.value)}
                    />
                 </div>
              </div>

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#FFFDF5] border border-[#F0E6D2] rounded-full flex items-center justify-center text-[#B8860B] z-10 shadow-sm">
                <ArrowDownUp className="h-5 w-5" />
              </div>

              <div className="bg-[#F8F9FA] rounded-xl p-4 border border-border/50">
                 <div className="text-xs font-bold text-muted-foreground uppercase mb-2">You Receive ({currency})</div>
                 <div className="flex items-center">
                    <span className="text-2xl font-bold text-muted-foreground mr-2">{currencySymbol}</span>
                    <input 
                      type="text"
                      className="bg-transparent border-none outline-none text-3xl font-bold w-full"
                      value={calculatedReceiveAmount.toLocaleString()}
                      readOnly
                    />
                 </div>
              </div>
            </div>

            {/* 3. Fulfillment */}
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
              <label className="block text-sm font-bold mb-4 uppercase tracking-wide text-muted-foreground">Fulfillment Method</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setMethod('pickup')}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-colors ${method === 'pickup' ? 'border-[#B8860B] bg-[#FFFDF5] text-[#B8860B]' : 'border-border text-muted-foreground hover:border-[#B8860B]/50'}`}
                >
                  <Store className="h-6 w-6" />
                  <span className="font-bold text-sm">Pickup (Free)</span>
                </button>
                <button 
                  onClick={() => setMethod('delivery')}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-colors ${method === 'delivery' ? 'border-[#B8860B] bg-[#FFFDF5] text-[#B8860B]' : 'border-border text-muted-foreground hover:border-[#B8860B]/50'}`}
                >
                  <Truck className="h-6 w-6" />
                  <span className="font-bold text-sm text-center">Delivery<br/>(+{getUfitGoDeliveryFee(city, 0)} {currency})</span>
                </button>
              </div>
            </div>

            {/* 4. Secure Checkout & Refund Details */}
            {Number(amountNaira) > 0 && selectedAgent && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                {/* Secure Payment Note */}
                <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl text-sm flex gap-3">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-green-600" />
                  <p>Payments made through UfitGo are processed using integrated third-party payment infrastructure. The provider receives the money after you confirm collection.</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
                  <h3 className="font-serif font-bold text-lg border-b border-border pb-3">Payment Summary</h3>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Exchange Amount</span>
                    <span className="font-semibold">₦ {Number(amountNaira).toLocaleString()}</span>
                  </div>
                  {method === 'delivery' && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span className="font-semibold">{getUfitGoDeliveryFee(city, 0)} {currency}</span>
                    </div>
                  )}
                  
                  <div className="pt-3 border-t border-border flex justify-between items-center">
                    <span className="font-bold">Total Cash You Receive</span>
                    <span className="font-bold text-xl text-[#B8860B]">
                      {calculatedReceiveAmount - (method === 'delivery' ? getUfitGoDeliveryFee(city, 0) : 0)} {currency}
                    </span>
                  </div>
                </div>
                
                {/* Refund Account Info */}
                <div className="bg-[#FFFDF5] border border-[#F0E6D2] p-6 rounded-2xl shadow-sm space-y-5">
                  <h4 className="font-bold text-lg">Refund Account Details</h4>
                  <p className="text-xs text-muted-foreground">In case of cancellation or dispute, we will refund your Naira to this account.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold mb-1.5 uppercase text-muted-foreground">Which bank do you use?</label>
                      <Select value={refundBank} onValueChange={(val) => setRefundBank(val || "")}>
                        <SelectTrigger className="w-full h-12 bg-white">
                          <SelectValue placeholder="Select your bank" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOCK_BANKS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold mb-1.5 uppercase text-muted-foreground">Account Number</label>
                      <Input 
                        placeholder="Enter 10-digit account number" 
                        className="h-12 bg-white font-medium"
                        value={refundAccount}
                        onChange={(e) => setRefundAccount(e.target.value)}
                        maxLength={10}
                      />
                    </div>

                    {refundAccount.length === 10 && refundBank && (
                      <div className="bg-green-50 text-green-700 p-3 rounded-lg border border-green-200 flex items-center gap-2 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                        <CheckCircle2 className="h-4 w-4" />
                        ACCOUNT VERIFIED
                      </div>
                    )}
                  </div>
                </div>

                <Button className="w-full h-14 text-lg bg-[#B8860B] hover:bg-[#986F09] text-white rounded-xl shadow-md" disabled={!isFormValid || isProcessing} onClick={handleConfirmPayment}>
                  {isProcessing ? "Processing Secure Payment..." : `Pay ₦ ${Number(amountNaira).toLocaleString()} Securely`}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Order Status */}
        {step === 2 && (
          <div className="py-12 px-4 text-center space-y-8 animate-in fade-in zoom-in-95 bg-white rounded-2xl border border-border shadow-sm">
            {orderStatus === "pending" || orderStatus === "PAID" ? (
              <div className="space-y-4">
                <div className="w-16 h-16 border-4 border-[#B8860B] border-t-transparent rounded-full animate-spin mx-auto" />
                <h3 className="font-bold text-2xl font-serif">Waiting for Agent</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">Your funds are processed securely. Waiting for {selectedAgent?.companyName} to accept the order.</p>
                <div className="mt-8 pt-6 border-t border-border flex justify-center">
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 h-12 px-8 rounded-xl" onClick={handleCancelOrder}>
                    Cancel Order
                  </Button>
                </div>
              </div>
            ) : orderStatus === "accepted" || orderStatus === "AGENT_ACCEPTED" ? (
              <div className="space-y-6 text-left max-w-md mx-auto">
                <div className="flex flex-col items-center justify-center gap-2 text-green-600 mb-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-2xl font-serif">Agent Accepted Order!</h3>
                  <p className="text-muted-foreground text-sm">Please coordinate with the agent to receive your cash.</p>
                </div>
                
                <div className="bg-[#FFFDF5] border border-[#F0E6D2] p-5 rounded-2xl text-center space-y-2 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-2 opacity-10">
                     <ShieldCheck className="w-24 h-24" />
                   </div>
                   <p className="text-sm font-bold text-[#B8860B] uppercase tracking-wider">Your Secret OTP</p>
                   <p className="text-4xl font-black tracking-widest text-foreground py-2">{otp}</p>
                   <p className="text-xs text-muted-foreground">Only provide this code to the agent <strong className="text-red-500">after</strong> you have received the cash in hand.</p>
                </div>

                <div className="bg-[#F8F9FA] border border-border p-5 rounded-2xl space-y-4 mt-4">
                  <h4 className="font-bold text-sm uppercase text-muted-foreground tracking-wider mb-2">Coordination Details</h4>
                  
                  {method === 'pickup' ? (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#FFFDF5] border border-[#F0E6D2] text-[#B8860B] rounded-full flex items-center justify-center shrink-0">
                         <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-base">{selectedAgent?.location || city}</p>
                        <p className="text-sm text-muted-foreground mt-1">Show your order code <strong className="text-foreground">#{currentOrder?.id?.slice(0, 8)}</strong> when you arrive.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#FFFDF5] border border-[#F0E6D2] text-[#B8860B] rounded-full flex items-center justify-center shrink-0">
                        <Navigation className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-base">Agent is preparing delivery</p>
                        <p className="text-sm text-muted-foreground mt-1">They will arrive at your location in {city} shortly. Keep your phone nearby.</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <Button className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md mt-4 disabled:opacity-50" disabled>
                  Waiting for Agent to confirm OTP...
                </Button>
              </div>
            ) : orderStatus === "cancelled" || orderStatus === "CANCELLED" ? (
               <div className="space-y-4 py-8">
                 <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                   <XCircle className="h-12 w-12" />
                 </div>
                 <h3 className="font-bold text-3xl font-serif">Order Cancelled</h3>
                 <p className="text-muted-foreground max-w-sm mx-auto">Your order was cancelled and your funds have been refunded to your provided bank account.</p>
                 
                 <div className="pt-8 flex justify-center">
                   <Button className="h-12 px-8 rounded-xl bg-[#B8860B] hover:bg-[#9a7009] text-white" onClick={() => { setStep(1); setOrderStatus("pending"); setCurrentOrder(null); }}>
                     Start New Exchange
                   </Button>
                 </div>
               </div>
            ) : (
              <div className="space-y-4 py-8">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <h3 className="font-bold text-3xl font-serif">Exchange Complete!</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">Thank you for using UfitGo. Your funds have been securely released to the agent.</p>
                
                <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline" className="h-12 px-8 rounded-xl" onClick={() => { setStep(1); setOrderStatus("pending"); setCurrentOrder(null); }}>
                    Start New Exchange
                  </Button>
                  <Link href="/transactions">
                    <Button className="h-12 px-8 rounded-xl bg-[#B8860B] hover:bg-[#9a7009] text-white">
                      Track Transactions
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
