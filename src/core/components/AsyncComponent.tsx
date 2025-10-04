import React, { useState, useEffect, ReactNode } from 'react'
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from './ui/button'

interface AsyncComponentProps {
  children: ReactNode
  fallback?: ReactNode
  errorMessage?: string
  retryAction?: () => void
}

export function AsyncComponent({ 
  children, 
  fallback, 
  errorMessage = 'Something went wrong',
  retryAction 
}: AsyncComponentProps) {
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleError = (error: Error) => {
    console.error('AsyncComponent error:', error)
    setError(error)
    setIsLoading(false)
  }

  const handleRetry = () => {
    setError(null)
    setIsLoading(true)
    if (retryAction) {
      try {
        retryAction()
      } catch (err) {
        handleError(err as Error)
      }
    } else {
      // Default retry: reload the page
      window.location.reload()
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        
        <h3 className="font-semibold mb-2">Unable to Load</h3>
        <p className="text-muted-foreground text-sm mb-4 max-w-sm">
          {errorMessage}. This might be a temporary issue.
        </p>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRetry}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Try Again
        </Button>
      </div>
    )
  }

  if (isLoading && fallback) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Loading component for async operations
export function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  )
}

// Error component for failed operations
export function ErrorDisplay({ 
  message = 'Something went wrong', 
  onRetry,
  showRetry = true 
}: { 
  message?: string
  onRetry?: () => void
  showRetry?: boolean 
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6 text-yellow-600" />
      </div>
      
      <h3 className="font-semibold mb-2">Unable to Load</h3>
      <p className="text-muted-foreground text-sm mb-4 max-w-sm">{message}</p>
      
      {showRetry && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRetry || (() => window.location.reload())}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  )
}