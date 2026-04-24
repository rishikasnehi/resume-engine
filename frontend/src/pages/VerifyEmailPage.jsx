import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { authAPI } from '../services/api'

export default function VerifyEmailPage() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('No verification token found.')
      return
    }

    authAPI
      .verifyEmail(token)
      .then((res) => {
        setStatus('success')
        setMessage(res.data.message || 'Email verified successfully!')
      })
      .catch((err) => {
        setStatus('error')
        setMessage(err.response?.data?.error || 'Verification failed. Token may be expired.')
      })
  }, [token])

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center animate-fade-up">
        {status === 'loading' && (
          <>
            <div className="w-12 h-12 border-2 border-amber-accent border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <p className="text-muted">Verifying your email…</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-12 h-12 rounded-full bg-amber-accent/10 border border-amber-accent/30 flex items-center justify-center mx-auto mb-6">
              <span className="text-amber-accent text-xl">✓</span>
            </div>
            <h2 className="font-display text-xl text-cream mb-2">Email verified!</h2>
            <p className="text-muted text-sm mb-6">{message}</p>
            <Link
              to="/login"
              className="inline-flex bg-amber-accent text-ink px-6 py-2.5 rounded-sm text-sm font-medium hover:bg-amber-light transition-colors"
            >
              Sign in
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-red-400 text-xl">✕</span>
            </div>
            <h2 className="font-display text-xl text-cream mb-2">Verification failed</h2>
            <p className="text-muted text-sm mb-6">{message}</p>
            <Link
              to="/login"
              className="inline-flex border border-border text-cream px-6 py-2.5 rounded-sm text-sm font-medium hover:border-amber-accent hover:text-amber-accent transition-colors"
            >
              Back to login
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
