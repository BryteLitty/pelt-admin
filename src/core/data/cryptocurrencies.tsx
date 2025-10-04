import React from 'react'

export interface Cryptocurrency {
  id: string
  name: string
  symbol: string
  price: number
  change24h: number
  icon: React.ComponentType<{ className?: string }>
  color: string
}

// Simple SVG components for crypto icons
export const BitcoinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.169-.756-.756-1.159-1.544-1.284v-.896h-.896v.84c-.225 0-.454.014-.681.028v-.868h-.896v.896c-.185.011-.365.022-.538.022H9.31v.952s.669-.014.655 0c.378 0 .503.28.49.442v1.456c.028 0 .065-.007.103-.014-.032.014-.069.021-.103.035v2.084c-.042.294-.168.546-.565.546.014.014-.655 0-.655 0l-.182 1.064h2.63c.238 0 .476.014.707.021v.91h.896v-.875c.238.014.462.021.681.021v.854h.896v-.91c1.321-.077 2.237-.413 2.351-1.673.091-.999-.378-1.575-1.141-1.947.511-.294.847-.749.707-1.895zm-1.292 2.068c0 .966-2.059.861-2.715.861v-1.72c.656 0 2.715-.154 2.715.859zm-.413-2.078c0 .882-1.68.777-2.128.777v-1.554c.448 0 2.128-.14 2.128.777z"/>
  </svg>
)

export const EthereumIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L5.062 12.25L12 16.5l6.938-4.25L12 0zm0 18L5.062 13.75L12 24l6.938-10.25L12 18z"/>
  </svg>
)

export const USDTIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.906 4.656c.885 1.215.962 2.4.962 2.4S17.598 8.444 12 8.444s-7.868-1.388-7.868-1.388.077-1.185.962-2.4C6.094 3.442 8.932 2.7 12 2.7s5.906.742 6.906 1.956zm-1.835 9.75c-.384.632-.96 1.26-1.704 1.836-.745.576-1.58 1.04-2.497 1.376-.916.336-1.876.504-2.87.504-.994 0-1.954-.168-2.87-.504-.917-.336-1.752-.8-2.497-1.376-.744-.576-1.32-1.204-1.704-1.836-.336-.552-.504-1.104-.504-1.656s.168-1.104.504-1.656c.384-.632.96-1.26 1.704-1.836.745-.576 1.58-1.04 2.497-1.376.916-.336 1.876-.504 2.87-.504.994 0 1.954.168 2.87.504.917.336 1.752.8 2.497 1.376.744.576 1.32 1.204 1.704 1.836.336.552.504 1.104.504 1.656s-.168 1.104-.504 1.656z"/>
    <path d="M12.896 12v2.944c.832-.064 1.568-.224 2.208-.48.64-.256 1.12-.576 1.44-.96.32-.384.48-.8.48-1.248 0-.448-.16-.864-.48-1.248-.32-.384-.8-.704-1.44-.96-.64-.256-1.376-.416-2.208-.48v-.568h-.896V12h.896z"/>
  </svg>
)

export const BNBIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.353 2.7175-2.7154L12 18.5768l4.624-4.6566zm-1.2732-1.9447L12 15.3243 8.6481 12l3.3519-3.3519L15.3519 12zM7.353 4.6566L0 11.9795l2.7175 2.7154L12 5.4109l9.2825 9.2825L24 11.9795 16.647 4.6566l-2.7154 2.7175L12 9.3056 10.0684 7.374 7.353 4.6566z"/>
  </svg>
)

export const CardanoIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.314 17.651c-.412 0-.826-.063-1.239-.126-.825-.189-1.461-.756-1.775-1.581-.126-.349-.189-.762-.189-1.175 0-.825.315-1.587.882-2.154.567-.567 1.329-.882 2.154-.882s1.587.315 2.154.882c.567.567.882 1.329.882 2.154 0 .413-.063.826-.189 1.175-.314.825-.95 1.392-1.775 1.581-.413.063-.826.126-1.239.126zm.252-8.748c-.252 0-.504-.063-.756-.126-.63-.189-1.134-.567-1.449-1.134-.126-.252-.189-.567-.189-.882 0-.63.252-1.197.693-1.638.441-.441 1.008-.693 1.638-.693s1.197.252 1.638.693c.441.441.693 1.008.693 1.638 0 .315-.063.63-.189.882-.315.567-.819.945-1.449 1.134-.252.063-.504.126-.756.126z"/>
  </svg>
)

export const SolanaIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.73 17.52c.13-.13.31-.2.5-.2h15.54c.58 0 .87.7.46 1.11l-2.97 2.97c-.13.13-.31.2-.5.2H1.22c-.58 0-.87-.7-.46-1.11l2.97-2.97zm2.97-14.08c.13-.13.31-.2.5-.2h15.54c.58 0 .87.7.46 1.11L19.23 7.32c-.13.13-.31.2-.5.2H3.19c-.58 0-.87-.7-.46-1.11l2.97-2.97zm0 7.04c.13-.13.31-.2.5-.2h15.54c.58 0 .87.7.46 1.11L19.23 14.36c-.13.13-.31.2-.5.2H3.19c-.58 0-.87-.7-.46-1.11l2.97-2.97z"/>
  </svg>
)

export const PolygonIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L1.608 6v12L12 24l10.392-6V6L12 0zm-6.569 17.482V6.518L12 2.25l6.569 4.268v10.964L12 21.75l-6.569-4.268z"/>
  </svg>
)

export const CRYPTOCURRENCIES: Cryptocurrency[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 43750.23,
    change24h: 2.45,
    icon: BitcoinIcon,
    color: '#F7931A'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 2650.48,
    change24h: -1.23,
    icon: EthereumIcon,
    color: '#627EEA'
  },
  {
    id: 'tether',
    name: 'Tether',
    symbol: 'USDT',
    price: 1.00,
    change24h: 0.02,
    icon: USDTIcon,
    color: '#26A17B'
  },
  {
    id: 'binancecoin',
    name: 'BNB',
    symbol: 'BNB',
    price: 310.75,
    change24h: 3.67,
    icon: BNBIcon,
    color: '#F0B90B'
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    price: 102.33,
    change24h: -0.89,
    icon: SolanaIcon,
    color: '#9945FF'
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    price: 0.52,
    change24h: 1.85,
    icon: CardanoIcon,
    color: '#0033AD'
  },
  {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    price: 0.89,
    change24h: 4.12,
    icon: PolygonIcon,
    color: '#8247E5'
  }
]