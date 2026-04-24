import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [resendEmail, setResendEmail] = useState('')
  const [showResend, setShowResend] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) return setErrors(errs)

    setLoading(true)
    try {
      const res = await authAPI.login(form)
      login(res.data)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Login failed'
      if (msg.toLowerCase().includes('not verified') || msg.toLowerCase().includes('email')) {
        setShowResend(true)
        setResendEmail(form.email)
      }
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      await authAPI.resendVerification(resendEmail)
      toast.success('Verification email resent! Check your inbox.')
      setShowResend(false)
    } catch (err) {
      toast.error('Failed to resend. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-7 h-7 bg-amber-accent rounded-sm flex items-center justify-center">
              <span className="text-ink text-sm font-display font-bold">R</span>
            </div>
          </Link>
          <h1 className="font-display text-2xl text-cream">Welcome back</h1>
          <p className="text-muted text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value })
              setErrors({ ...errors, email: '' })
            }}
            error={errors.email}
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => {
              setForm({ ...form, password: e.target.value })
              setErrors({ ...errors, password: '' })
            }}
            error={errors.password}
            autoComplete="current-password"
          />

          <Button type="submit" loading={loading} className="w-full mt-2">
            Sign in
          </Button>
        </form>

        {/* Resend verification */}
        {showResend && (
          <div className="mt-4 p-3 bg-amber-accent/10 border border-amber-accent/20 rounded-sm">
            <p className="text-xs text-amber-accent mb-2">Your email is not verified yet.</p>
            <button
              onClick={handleResend}
              className="text-xs underline text-amber-light hover:no-underline"
            >
              Resend verification email
            </button>
          </div>
        )}

        <p className="text-center text-sm text-muted mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-amber-accent hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
