import { useState } from 'react'
import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { Label } from '@/core/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/core/components/ui/dialog'
import { CRYPTOCURRENCIES, type Cryptocurrency } from '@/core/data/cryptocurrencies'
import { Search, TrendingUp, TrendingDown } from 'lucide-react'

interface BuyCryptoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BuyCryptoModal({ isOpen, onClose }: BuyCryptoModalProps) {
  const [selectedCrypto, setSelectedCrypto] = useState<Cryptocurrency | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [amount, setAmount] = useState('')

  const filteredCryptos = CRYPTOCURRENCIES.filter(crypto =>
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCryptoSelect = (crypto: Cryptocurrency) => {
    setSelectedCrypto(crypto)
  }

  const handleBuy = () => {
    if (selectedCrypto && amount) {
      // TODO: Implement actual buy logic
      console.log(`Buying ${amount} USD worth of ${selectedCrypto.symbol}`)
      onClose()
    }
  }

  const calculateCryptoAmount = (usdAmount: string) => {
    if (!selectedCrypto || !usdAmount) return '0'
    const crypto = parseFloat(usdAmount) / selectedCrypto.price
    return crypto.toFixed(6)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Buy Cryptocurrency</DialogTitle>
          <DialogClose onClick={onClose} />
        </DialogHeader>

        {!selectedCrypto ? (
          // Crypto Selection View
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search cryptocurrencies..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid gap-3 max-h-96 overflow-y-auto">
              {filteredCryptos.map((crypto) => {
                const Icon = crypto.icon
                const isPositive = crypto.change24h > 0
                
                return (
                  <button
                    key={crypto.id}
                    onClick={() => handleCryptoSelect(crypto)}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: crypto.color }}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-semibold">{crypto.name}</p>
                        <p className="text-sm text-muted-foreground">{crypto.symbol}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold">
                        ${crypto.price.toLocaleString('en-US', { 
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2 
                        })}
                      </p>
                      <div className={`flex items-center gap-1 text-sm ${
                        isPositive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {isPositive ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {isPositive ? '+' : ''}{crypto.change24h.toFixed(2)}%
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          // Purchase View
          <div className="space-y-6">
            {/* Selected Crypto */}
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: selectedCrypto.color }}
              >
                <selectedCrypto.icon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-lg">{selectedCrypto.name}</p>
                <p className="text-muted-foreground">{selectedCrypto.symbol}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  ${selectedCrypto.price.toLocaleString('en-US', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                  })}
                </p>
                <div className={`flex items-center gap-1 text-sm ${
                  selectedCrypto.change24h > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {selectedCrypto.change24h > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {selectedCrypto.change24h > 0 ? '+' : ''}{selectedCrypto.change24h.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-3">
              <Label htmlFor="amount">Amount (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-8"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              
              {amount && (
                <div className="text-sm text-muted-foreground">
                  You will receive approximately <span className="font-semibold text-primary">
                    {calculateCryptoAmount(amount)} {selectedCrypto.symbol}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[50, 100, 250, 500].map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="text-xs"
                >
                  ${quickAmount}
                </Button>
              ))}
            </div>

            {/* Payment Method */}
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Payment Method</span>
                <span className="text-sm text-muted-foreground">Card ending in 4242</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  VISA
                </div>
                Processing fee: $2.99
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setSelectedCrypto(null)}
              >
                Back
              </Button>
              <Button 
                className="flex-1"
                onClick={handleBuy}
                disabled={!amount || parseFloat(amount) <= 0}
              >
                Buy {selectedCrypto.symbol}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}