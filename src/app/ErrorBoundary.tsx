import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertOctagon } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Props { children: ReactNode }
interface State { hasError: boolean }

/**
 * Catches render-time exceptions so a single broken component can never
 * white-screen the whole app. Deliberately does not render error.message
 * or stack traces to the DOM (avoids leaking internals to end users) —
 * detailed diagnostics should go to a logging service in production.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production this should report to an error-tracking service
    // (e.g. Sentry) rather than just the console.
    console.error('IHPAU HR Cloud unhandled error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-50 px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-50 text-danger-500">
            <AlertOctagon size={26} />
          </div>
          <div>
            <p className="text-base font-semibold text-ink-900">Something went wrong</p>
            <p className="mt-1 max-w-sm text-sm text-ink-500">
              An unexpected error occurred while rendering this page. Please try reloading.
            </p>
          </div>
          <Button onClick={() => window.location.assign('/dashboard')}>Reload IHPAU HR Cloud</Button>
        </div>
      )
    }
    return this.props.children
  }
}
