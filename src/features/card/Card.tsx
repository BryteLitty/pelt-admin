import { useState } from 'react'
import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { Label } from '@/core/components/ui/label'
import { useTheme } from '@/core/context/theme-context'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/core/components/ui/dialog'
import { 
  CreditCard, 
  Eye, 
  EyeOff, 
  Copy, 
  Pause, 
  Play, 
  Settings,
  AlertCircle,
  Plus,
  DollarSign,
  Zap,
  Shield,
  Check
} from 'lucide-react'
import { DashboardLayout } from '../dashboard/components/DashboardLayout'

export function Card() {
  const { theme } = useTheme()
  const [showCardDetails, setShowCardDetails] = useState(false)
  const [cardStatus, setCardStatus] = useState<'active' | 'paused' | 'blocked'>('active')
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [showCreateCardModal, setShowCreateCardModal] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState('')

  // Mock card data - in real app this would come from API
  const hasCard = true
  const isKYCVerified = true // KYC verification disabled as requested
  
  const cardData = {
    number: '4532 1234 5678 9012',
    cvv: '123',
    expiry: '12/28',
    name: 'JOHN DOE',
    balance: 2540.50,
    currency: 'USD',
    type: 'Virtual Debit Card',
    provider: 'Mastercard'
  }

  const transactions = [
    { id: 1, merchant: 'Amazon', amount: -29.99, date: '2024-01-15', status: 'completed' },
    { id: 2, merchant: 'Spotify', amount: -9.99, date: '2024-01-14', status: 'completed' },
    { id: 3, merchant: 'Crypto Top Up', amount: 500.00, date: '2024-01-12', status: 'completed' },
    { id: 4, merchant: 'Netflix', amount: -15.99, date: '2024-01-11', status: 'completed' },
    { id: 5, merchant: 'Uber', amount: -12.50, date: '2024-01-10', status: 'completed' },
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // In real app, show toast notification
  }

  const toggleCardStatus = () => {
    setCardStatus(current => current === 'active' ? 'paused' : 'active')
  }

  if (!hasCard) {
    return (
      <DashboardLayout
        title="Virtual Card"
        subtitle="Spend your crypto anywhere with a virtual debit card"
      >
        <div className="max-w-4xl">
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-primary" />
            </div>
            
            <h2 className="text-2xl font-semibold mb-4">Get Your Virtual Card</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create a virtual debit card to spend your crypto anywhere Mastercard is accepted. 
              Instantly convert crypto to fiat for seamless payments.
            </p>
            
            <Button 
              className="mb-4"
              onClick={() => setShowCreateCardModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Virtual Card
            </Button>
            
            <div className="grid md:grid-cols-3 gap-4 mt-8 text-left">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">Instant Creation</h3>
                <p className="text-sm text-muted-foreground">
                  Get your virtual card in seconds, ready to use immediately
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">Global Acceptance</h3>
                <p className="text-sm text-muted-foreground">
                  Use anywhere Mastercard is accepted worldwide
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">Real-time Control</h3>
                <p className="text-sm text-muted-foreground">
                  Pause, block, or manage your card instantly
                </p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Virtual Card"
      subtitle="Manage your virtual debit card"
    >
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Card and Controls */}
        <div className="space-y-6">
          {/* Card Display */}
          <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 backdrop-blur-xl border border-white/10 text-foreground rounded-2xl p-6 relative overflow-hidden shadow-2xl">
            {/* Glassmorphic background elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-10 translate-x-10" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/3 rounded-full translate-y-8 -translate-x-8" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 pointer-events-none" />
          
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-muted-foreground text-sm">Balance</p>
                  <p className="text-2xl font-bold text-primary">
                    ${cardData.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-primary/20 backdrop-blur-sm px-3 py-1 rounded-full border border-primary/30">
                    {cardStatus.toUpperCase()}
                  </span>
                  <div className="text-right">
                    <p className="text-muted-foreground text-xs">{cardData.provider}</p>
                    <p className="text-muted-foreground text-xs">{cardData.type}</p>
                  </div>
                </div>
              </div>
            
              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground text-xs mb-2">Card Number</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-base font-semibold">
                      {showCardDetails ? cardData.number : '•••• •••• •••• 9012'}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground hover:bg-primary/20 hover:text-primary p-1"
                      onClick={() => setShowCardDetails(!showCardDetails)}
                    >
                      {showCardDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground hover:bg-primary/20 hover:text-primary p-1"
                      onClick={() => copyToClipboard(cardData.number)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-8">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Expiry</p>
                    <p className="font-mono text-sm font-medium">
                      {showCardDetails ? cardData.expiry : '••/••'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">CVV</p>
                    <p className="font-mono text-sm font-medium">
                      {showCardDetails ? cardData.cvv : '•••'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Cardholder Name</p>
                  <p className="font-semibold text-sm">{cardData.name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card Controls */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="flex flex-col gap-2 h-16 bg-background/50 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:border-primary/30"
              onClick={toggleCardStatus}
            >
              {cardStatus === 'active' ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span className="text-xs">{cardStatus === 'active' ? 'Pause' : 'Activate'}</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col gap-2 h-16 bg-background/50 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:border-primary/30"
              onClick={() => setShowTopUpModal(true)}
            >
              <DollarSign className="w-4 h-4" />
              <span className="text-xs">Top Up</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col gap-2 h-16 bg-background/50 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:border-primary/30"
            >
              <Settings className="w-4 h-4" />
              <span className="text-xs">Settings</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col gap-2 h-16 bg-background/50 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:border-primary/30"
            >
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs">Report</span>
            </Button>
          </div>

          {/* Card Status Alert */}
          {cardStatus === 'paused' && (
            <div className="bg-yellow-50/80 dark:bg-yellow-900/30 backdrop-blur-sm border border-yellow-200/50 dark:border-yellow-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
                  Card paused. Click "Activate" to resume.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Transaction History */}
        <div className="bg-background/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-4 bg-background/40 backdrop-blur-sm border border-white/5 rounded-xl hover:bg-background/60 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{transaction.merchant}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-semibold text-sm ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-foreground'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {transaction.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-6 bg-background/50 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:border-primary/30"
          >
            View All Transactions
          </Button>
        </div>
      </div>

      {/* Top Up Modal */}
      <Dialog open={showTopUpModal} onOpenChange={setShowTopUpModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Top Up Virtual Card</DialogTitle>
            <DialogClose onClick={() => setShowTopUpModal(false)} />
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Current Balance</span>
                <span className="font-bold text-primary">${cardData.balance.toFixed(2)}</span>
              </div>
              <p className="text-sm text-muted-foreground">Available for spending</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topup-amount">Top Up Amount (USD)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="topup-amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-10"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[25, 50, 100, 200].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setTopUpAmount(amount.toString())}
                >
                  ${amount}
                </Button>
              ))}
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-sm">
                <Zap className="w-4 h-4" />
                <span>Funds will be instantly available on your card</span>
              </div>
            </div>

            <Button 
              className="w-full" 
              disabled={!topUpAmount || parseFloat(topUpAmount) <= 0}
              onClick={() => {
                console.log('Top up:', topUpAmount)
                setShowTopUpModal(false)
                setTopUpAmount('')
              }}
            >
              Top Up ${topUpAmount || '0.00'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Card Modal */}
      <Dialog open={showCreateCardModal} onOpenChange={setShowCreateCardModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Virtual Card</DialogTitle>
            <DialogClose onClick={() => setShowCreateCardModal(false)} />
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Your Virtual Card is Ready!</h3>
              <p className="text-muted-foreground text-sm">
                Create your virtual debit card in seconds and start spending your crypto anywhere.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm">Instant card creation</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm">Global acceptance with Mastercard</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm">Real-time spending controls</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm">Bank-level security</span>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    Security Notice
                  </p>
                  <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                    Your card details will be encrypted and stored securely. Never share your card information with anyone.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              className="w-full"
              onClick={() => {
                console.log('Creating virtual card...')
                setShowCreateCardModal(false)
              }}
            >
              Create My Virtual Card
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}