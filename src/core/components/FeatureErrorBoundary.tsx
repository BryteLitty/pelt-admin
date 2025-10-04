import React, { Component, ReactNode } from 'react'
import { Button } from './ui/button'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Props {
  children: ReactNode
  featureName: string
}

interface State {
  hasError: boolean
  error?: Error
}

export class FeatureErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`${this.props.featureName} error:`, error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="text-center max-w-md">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            
            <h2 className="text-xl font-semibold mb-2">
              {this.props.featureName} Unavailable
            </h2>
            <p className="text-muted-foreground mb-6">
              This feature is temporarily unavailable. Please try again later or go back to the dashboard.
            </p>
            
            <div className="flex flex-col gap-3">
              <Link to="/dashboard">
                <Button className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              
              <Button 
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}