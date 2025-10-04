import { useState } from 'react'
import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { CRYPTOCURRENCIES } from '@/core/data/cryptocurrencies'
import { DashboardLayout } from './DashboardLayout'
import { BuyCryptoModal } from './BuyCryptoModal'
import { 
  Plus, 
  Send, 
  Download, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  TrendingDown,
  Search,
  ArrowUpDown
} from 'lucide-react'

export function Wallet() {
  const [showBalances, setShowBalances] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showBuyModal, setShowBuyModal] = useState(false)

  // Mock wallet data - in real app this would come from API/state
  const walletAssets = [
    {
      ...CRYPTOCURRENCIES.find(c => c.symbol === 'BTC')!,
      balance: 0.12345678,
      balanceUSD: 5401.23,
      allocation: 45.2
    },
    {
      ...CRYPTOCURRENCIES.find(c => c.symbol === 'ETH')!,
      balance: 2.45678901,
      balanceUSD: 6512.34,
      allocation: 54.5
    },
    {
      ...CRYPTOCURRENCIES.find(c => c.symbol === 'USDT')!,
      balance: 1234.56,
      balanceUSD: 1234.56,
      allocation: 10.3
    }
  ]

  const totalBalance = walletAssets.reduce((sum, asset) => sum + asset.balanceUSD, 0)

  const filteredAssets = walletAssets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout
      title="Wallet"
      subtitle="Manage your cryptocurrency portfolio"
    >
      <div className="max-w-6xl space-y-6">
        {/* Portfolio Overview */}
        <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white rounded-2xl p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-white/80 text-sm mb-1">Total Portfolio Value</p>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold">
                  {showBalances ? `$${totalBalance.toLocaleString('en-US', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                  })}` : '••••••'}
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 p-2"
                  onClick={() => setShowBalances(!showBalances)}
                >
                  {showBalances ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-1 text-green-200">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+$234.56 (2.1%)</span>
              </div>
              <p className="text-white/60 text-xs mt-1">24h change</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Button 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              onClick={() => setShowBuyModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Buy
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/20 border-white/30 border">
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/20 border-white/30 border">
              <Download className="w-4 h-4 mr-2" />
              Receive
            </Button>
          </div>
        </div>

        {/* Assets List */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Your Assets</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search assets..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button size="sm" onClick={() => setShowBuyModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Asset
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredAssets.map((asset) => {
              const Icon = asset.icon
              const isPositive = asset.change24h > 0
              
              return (
                <div
                  key={asset.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: asset.color }}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="font-semibold">{asset.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{asset.symbol}</span>
                        <div className={`flex items-center gap-1 ${
                          isPositive ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {isPositive ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {isPositive ? '+' : ''}{asset.change24h.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold">
                      {showBalances 
                        ? `$${asset.balanceUSD.toLocaleString('en-US', { 
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2 
                          })}`
                        : '••••••'
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {showBalances 
                        ? `${asset.balance.toFixed(6)} ${asset.symbol}`
                        : '••••••'
                      }
                    </p>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Send className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <ArrowUpDown className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredAssets.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No assets found</h3>
              <p className="text-muted-foreground text-sm">
                Try adjusting your search or add a new cryptocurrency to your portfolio.
              </p>
            </div>
          )}
        </div>

        {/* Transaction History */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {[
              { type: 'buy', crypto: 'BTC', amount: 0.01234, usd: 540.12, date: '2024-01-15', status: 'completed' },
              { type: 'send', crypto: 'ETH', amount: -0.5, usd: -1325.00, date: '2024-01-14', status: 'completed' },
              { type: 'receive', crypto: 'USDT', amount: 500, usd: 500.00, date: '2024-01-13', status: 'completed' }
            ].map((tx, index) => {
              const crypto = CRYPTOCURRENCIES.find(c => c.symbol === tx.crypto)!
              const Icon = crypto.icon
              
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: crypto.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium capitalize">
                        {tx.type} {tx.crypto}
                      </p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-semibold ${
                      tx.amount > 0 ? 'text-green-600' : 'text-foreground'
                    }`}>
                      {tx.amount > 0 ? '+' : ''}{Math.abs(tx.amount)} {tx.crypto}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${Math.abs(tx.usd).toFixed(2)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Buy Crypto Modal */}
      <BuyCryptoModal
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
      />
    </DashboardLayout>
  )
}