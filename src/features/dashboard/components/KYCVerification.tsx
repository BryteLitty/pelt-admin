import { Button } from '@/core/components/ui/button'
import { CheckCircle, AlertCircle, Clock, FileText, Camera, CreditCard } from 'lucide-react'
import { DashboardLayout } from './DashboardLayout'

export function KYCVerification() {
  // Mock KYC status - in real app this would come from API/state
  const kycStatus = {
    level: 1, // 0: Not started, 1: Basic, 2: Enhanced
    status: 'pending', // 'pending', 'approved', 'rejected', 'not_started'
    limits: {
      daily: 1000,
      monthly: 10000,
    }
  }

  const verificationSteps = [
    {
      id: 1,
      title: 'Personal Information',
      description: 'Full name, date of birth, address',
      icon: FileText,
      status: 'completed',
      required: 'Basic KYC'
    },
    {
      id: 2,
      title: 'Government ID',
      description: 'Upload passport, driver\'s license, or national ID',
      icon: CreditCard,
      status: 'pending',
      required: 'Basic KYC'
    },
    {
      id: 3,
      title: 'Selfie Verification',
      description: 'Take a selfie for identity verification',
      icon: Camera,
      status: 'not_started',
      required: 'Enhanced KYC'
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <div className="h-5 w-5 border-2 border-muted rounded-full" />
    }
  }

  return (
    <DashboardLayout
      title="KYC Verification"
      subtitle="Verify your identity to unlock higher transaction limits"
    >
      <div className="max-w-4xl space-y-6">
        {/* Current Status */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Verification Status</h2>
              <div className="flex items-center gap-2">
                {kycStatus.status === 'approved' ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-green-600 font-medium">Level {kycStatus.level} Verified</span>
                  </>
                ) : kycStatus.status === 'pending' ? (
                  <>
                    <Clock className="h-5 w-5 text-yellow-500" />
                    <span className="text-yellow-600 font-medium">Under Review</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground font-medium">Not Verified</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Current Limits</p>
              <p className="font-semibold">Daily: ${kycStatus.limits.daily.toLocaleString()}</p>
              <p className="font-semibold">Monthly: ${kycStatus.limits.monthly.toLocaleString()}</p>
            </div>
          </div>

          {kycStatus.status === 'pending' && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
                  Your verification is being reviewed. This usually takes 1-3 business days.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Verification Steps */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Verification Steps</h2>
          
          <div className="space-y-4">
            {verificationSteps.map((step, index) => {
              const Icon = step.icon
              const isDisabled = index > 0 && verificationSteps[index - 1].status !== 'completed'
              
              return (
                <div
                  key={step.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border ${
                    step.status === 'completed'
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : step.status === 'pending'
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                      : 'bg-muted/50 border-border'
                  }`}
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-background border border-border rounded-full flex items-center justify-center">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{step.title}</h3>
                      {getStatusIcon(step.status)}
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {step.required}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">
                      {step.description}
                    </p>
                    
                    {step.status === 'not_started' && !isDisabled && (
                      <Button size="sm">
                        Start Verification
                      </Button>
                    )}
                    
                    {step.status === 'pending' && (
                      <Button size="sm" variant="outline" disabled>
                        Under Review
                      </Button>
                    )}
                    
                    {step.status === 'completed' && (
                      <Button size="sm" variant="outline" disabled>
                        Completed
                      </Button>
                    )}
                    
                    {isDisabled && (
                      <Button size="sm" variant="outline" disabled>
                        Complete Previous Step
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Unlock Higher Limits</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-primary">Enhanced KYC Benefits</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Daily limit: $50,000
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Monthly limit: $500,000
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Virtual card access
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Advanced trading features
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Security & Compliance</h3>
              <p className="text-sm text-muted-foreground">
                Our KYC process ensures the highest security standards and regulatory compliance, 
                protecting both you and our platform from fraud and illegal activities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}