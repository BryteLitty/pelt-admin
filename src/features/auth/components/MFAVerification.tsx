import { useState, useRef, useEffect } from 'react'
import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { Label } from '@/core/components/ui/label'
import { useTheme } from '@/core/context/theme-context'
import { Shield, ArrowLeft } from 'lucide-react'

import logoTextDark from '@/assets/brand/logo-text-dark.png'
import logoTextWhite from '@/assets/brand/logo-text-white.png'

interface MFAVerificationProps {
  email: string
  onVerify: (code: string) => void
  onBack: () => void
  isLoading?: boolean
  error?: string
}

export function MFAVerification({
  email,
  onVerify,
  onBack,
  isLoading = false,
  error
}: MFAVerificationProps) {
  const { theme } = useTheme()
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value

    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all 6 digits are entered
    if (newCode.every(digit => digit !== '') && index === 5) {
      onVerify(newCode.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    // Handle paste
    if (e.key === 'v' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, 6).split('')
        const newCode = [...code]
        digits.forEach((digit, i) => {
          if (i < 6) newCode[i] = digit
        })
        setCode(newCode)

        // Focus the last filled input or the next empty one
        const nextEmptyIndex = newCode.findIndex(d => !d)
        if (nextEmptyIndex !== -1) {
          inputRefs.current[nextEmptyIndex]?.focus()
        } else {
          inputRefs.current[5]?.focus()
          // Auto-submit if all filled
          if (newCode.every(d => d)) {
            onVerify(newCode.join(''))
          }
        }
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fullCode = code.join('')
    if (fullCode.length === 6) {
      onVerify(fullCode)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('')

    const newCode = [...code]
    digits.forEach((digit, i) => {
      if (i < 6) newCode[i] = digit
    })
    setCode(newCode)

    // Focus the last filled input or the next empty one
    const nextEmptyIndex = newCode.findIndex(d => !d)
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus()
    } else {
      inputRefs.current[5]?.focus()
      // Auto-submit if all filled
      if (newCode.every(d => d)) {
        onVerify(newCode.join(''))
      }
    }
  }

  const isCodeComplete = code.every(digit => digit !== '')

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src={theme === 'dark' ? logoTextWhite : logoTextDark}
            alt="Pelt"
            className="h-8 mx-auto mb-6"
          />

          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>

          <h1 className="text-2xl font-bold mb-2">Two-Factor Authentication</h1>
          <p className="text-muted-foreground">
            Enter the 6-digit code from your authenticator app
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Signing in as <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-center block">Authentication Code</Label>
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-12 h-12 text-center text-lg font-semibold ${
                    error ? 'border-destructive' : ''
                  }`}
                  disabled={isLoading}
                />
              ))}
            </div>
            {error && (
              <p className="text-sm text-destructive text-center mt-2">{error}</p>
            )}
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full"
              disabled={!isCodeComplete || isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={onBack}
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Can't access your authenticator app?
            </p>
            <button
              type="button"
              className="text-sm text-primary hover:underline mt-1"
              disabled={isLoading}
            >
              Use backup code
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
