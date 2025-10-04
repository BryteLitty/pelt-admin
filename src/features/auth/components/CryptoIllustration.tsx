import { useTheme } from '@/core/context/theme-context'

interface CryptoIllustrationProps {
  className?: string
}

export function CryptoIllustration({ className }: CryptoIllustrationProps) {
  const { theme } = useTheme()
  
  return (
    <div className={className}>
      <svg 
        viewBox="0 0 400 300" 
        className="w-full h-auto"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circles */}
        <circle 
          cx="200" 
          cy="150" 
          r="120" 
          fill={theme === 'dark' ? 'rgba(44, 246, 192, 0.05)' : 'rgba(44, 246, 192, 0.1)'} 
        />
        <circle 
          cx="200" 
          cy="150" 
          r="80" 
          fill={theme === 'dark' ? 'rgba(44, 246, 192, 0.08)' : 'rgba(44, 246, 192, 0.15)'} 
        />
        
        {/* Phone/Device */}
        <rect 
          x="150" 
          y="80" 
          width="100" 
          height="140" 
          rx="20" 
          fill={theme === 'dark' ? '#1A1F3A' : '#FFFFFF'} 
          stroke={theme === 'dark' ? '#2CF6C0' : '#0C1021'} 
          strokeWidth="2"
        />
        
        {/* Screen */}
        <rect 
          x="160" 
          y="100" 
          width="80" 
          height="100" 
          rx="8" 
          fill={theme === 'dark' ? '#0C1021' : '#F5F5F5'}
        />
        
        {/* Pelt Logo on screen */}
        <circle 
          cx="200" 
          cy="130" 
          r="15" 
          fill="#2CF6C0"
        />
        <text 
          x="200" 
          y="160" 
          textAnchor="middle" 
          fontSize="10" 
          fill={theme === 'dark' ? '#F5F5F5' : '#0C1021'}
          fontFamily="Inter, sans-serif"
          fontWeight="600"
        >
          PELT
        </text>
        
        {/* Security elements */}
        <circle 
          cx="120" 
          cy="120" 
          r="8" 
          fill="#2CF6C0" 
          opacity="0.8"
        />
        <circle 
          cx="280" 
          cy="180" 
          r="6" 
          fill="#2CF6C0" 
          opacity="0.6"
        />
        
        {/* Lock icon */}
        <g transform="translate(185, 180)">
          <rect 
            x="0" 
            y="8" 
            width="30" 
            height="20" 
            rx="4" 
            fill="#2CF6C0"
          />
          <path 
            d="M8 8V5a7 7 0 0114 0v3" 
            stroke={theme === 'dark' ? '#F5F5F5' : '#0C1021'} 
            strokeWidth="2" 
            fill="none"
          />
          <circle 
            cx="15" 
            cy="18" 
            r="2" 
            fill={theme === 'dark' ? '#0C1021' : '#FFFFFF'}
          />
        </g>
      </svg>
    </div>
  )
}