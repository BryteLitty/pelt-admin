import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/core/components/ui/button'
import { useTheme } from '@/core/context/theme-context'
import { useLogout } from '@/core/hooks/useLogout'
import {
  Menu,
  Home,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  User
} from 'lucide-react'

import logoTextDark from '@/assets/brand/logo-text-dark.png'
import logoTextWhite from '@/assets/brand/logo-text-white.png'
import iconDark from '@/assets/brand/icon-dark.png'
import iconWhite from '@/assets/brand/icon-white.png'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const { theme } = useTheme()
  const location = useLocation()
  const { handleLogout } = useLogout()

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard', active: location.pathname === '/dashboard' },
    { icon: Users, label: 'User Management', href: '/dashboard/users', active: location.pathname === '/dashboard/users' },
  ]

  const bottomItems = [
    { icon: User, label: 'Settings', href: '/dashboard/settings', isLink: true },
    { icon: LogOut, label: 'Sign Out', href: '/login', isLink: false, onClick: handleLogout },
  ]

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-sidebar border-r border-sidebar-border h-screen sticky top-0 flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <Link to="/" className={`${isCollapsed ? 'hidden' : 'block'}`}>
            <img 
              src={theme === 'dark' ? logoTextWhite : logoTextDark} 
              alt="Pelt" 
              className="h-6 hover:opacity-80 transition-opacity"
            />
          </Link>
          
          <Link to="/" className={`${isCollapsed ? 'block' : 'hidden'} mx-auto`}>
            <img 
              src={theme === 'dark' ? iconWhite : iconDark} 
              alt="Pelt" 
              className="h-8 w-8 hover:opacity-80 transition-opacity"
            />
          </Link>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-2 hover:bg-sidebar-accent"
          >
            {isCollapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  item.active
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.label : ''}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm">{item.label}</span>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-2 border-t border-sidebar-border">
        <div className="space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon
            const isLink = item.isLink !== false // Default to true for backward compatibility
            
            if (isLink) {
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
                    isCollapsed ? 'justify-center' : ''
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && (
                    <span className="text-sm">{item.label}</span>
                  )}
                </Link>
              )
            } else {
              return (
                <button
                  key={item.href}
                  onClick={item.onClick}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors w-full ${
                    isCollapsed ? 'justify-center' : ''
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && (
                    <span className="text-sm">{item.label}</span>
                  )}
                </button>
              )
            }
          })}
        </div>
      </div>
    </div>
  )
}