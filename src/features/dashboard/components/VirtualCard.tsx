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
  ShieldCheck,
  AlertCircle,
  Plus,
  DollarSign,
  Zap,
  Shield,
  Check
} from 'lucide-react'
import { DashboardLayout } from './DashboardLayout'

export function VirtualCard() {
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
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // In real app, show toast notification
  }

  const toggleCardStatus = () => {
    setCardStatus(current => current === 'active' ? 'paused' : 'active')
  }

  if (!isKYCVerified) {
    return (
      <DashboardLayout
        title="Virtual Card"
        subtitle="Spend your crypto anywhere with a virtual debit card"
      >
        <div className="max-w-4xl">
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-yellow-600" />
            </div>
            
            <h2 className="text-2xl font-semibold mb-4">KYC Verification Required</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              To access virtual cards, you need to complete your KYC verification process. 
              This ensures compliance and security for financial transactions.
            </p>
            
            <Button asChild>
              <a href="/dashboard/kyc">
                Complete KYC Verification
              </a>
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
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
      <div className="max-w-4xl space-y-6">
        {/* Card Display */}
        <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-white/80 text-sm">Balance</p>
                <p className="text-2xl font-bold">
                  ${cardData.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs bg-white/20 px-2 py-1 rounded">
                  {cardStatus.toUpperCase()}
                </span>
                <div className="text-right">
                  <p className="text-white/80 text-xs">{cardData.provider}</p>
                  <p className="text-white/80 text-xs">{cardData.type}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-white/80 text-xs mb-1">Card Number</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-lg">
                    {showCardDetails ? cardData.number : '•••• •••• •••• 9012'}
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 p-1"
                    onClick={() => setShowCardDetails(!showCardDetails)}
                  >
                    {showCardDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 p-1"
                    onClick={() => copyToClipboard(cardData.number)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-8">
                <div>
                  <p className="text-white/80 text-xs mb-1">Expiry</p>
                  <p className="font-mono">
                    {showCardDetails ? cardData.expiry : '••/••'}
                  </p>
                </div>
                <div>
                  <p className="text-white/80 text-xs mb-1">CVV</p>
                  <p className="font-mono">
                    {showCardDetails ? cardData.cvv : '•••'}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-white/80 text-xs mb-1">Cardholder Name</p>
                <p className="font-semibold">{cardData.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card Controls */}
        <div className="grid md:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="flex flex-col gap-2 h-20"
            onClick={toggleCardStatus}
          >
            {cardStatus === 'active' ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
            {cardStatus === 'active' ? 'Pause Card' : 'Activate Card'}
          </Button>
          
          <Button variant="outline" className="flex flex-col gap-2 h-20">
            <Settings className="w-5 h-5" />
            Card Settings
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col gap-2 h-20"
            onClick={() => setShowTopUpModal(true)}
          >
            <DollarSign className="w-5 h-5" />
            Top Up Card
          </Button>
          
          <Button variant="outline" className="flex flex-col gap-2 h-20">
            <AlertCircle className="w-5 h-5" />
            Report Issue
          </Button>
        </div>

        {/* Card Status Alert */}
        {cardStatus === 'paused' && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
                Your card is currently paused. Click "Activate Card" to resume transactions.
              </span>
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{transaction.merchant}</p>
                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-semibold ${
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
          
          <Button variant="outline" className="w-full mt-4">
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
                // In real app, this would create the card and update state
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