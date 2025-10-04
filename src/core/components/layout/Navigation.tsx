import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { ThemeToggle } from '../ui/theme-toggle'
import { useTheme } from '@/core/context/theme-context'

import logoTextDark from '@/assets/brand/logo-text-dark.png'
import logoTextWhite from '@/assets/brand/logo-text-white.png'

export function Navigation() {
  const { theme } = useTheme()

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/">
          <img 
            src={theme === 'dark' ? logoTextWhite : logoTextDark} 
            alt="Pelt" 
            className="h-8 hover:opacity-80 transition-opacity"
          />
        </Link>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button asChild size="sm">
            <Link to="/login">
              Login
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}