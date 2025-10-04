import { useTheme } from '@/core/context/theme-context'

import logoTextDark from '@/assets/brand/logo-text-dark.png'
import logoTextWhite from '@/assets/brand/logo-text-white.png'

export function Footer() {
  const { theme } = useTheme()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src={theme === 'dark' ? logoTextWhite : logoTextDark} 
              alt="Pelt" 
              className="h-6"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            © {currentYear} Pelt. Your crypto, simplified.
          </p>
        </div>
      </div>
    </footer>
  )
}