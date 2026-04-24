import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AppLayout from '../components/layout/AppLayout'
import { paymentAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'

// Load Razorpay SDK dynamically
function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

const FREE_FEATURES = [
  '1 resume',
  'Template 01 (Classic)',
  'All resume sections',
  'Send resume via email',
  'Cloudinary image hosting',
]

const PREMIUM_FEATURES = [
  'Unlimited resumes',
  'All 3 premium templates',
  'Custom color palettes',
  'Priority support',
  'Everything in Free',
]

export default function PricingPage() {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const isPremium = user?.subscriptionPlan?.toLowerCase() === 'premium'

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      // Step 1: Load Razorpay SDK
      const sdkLoaded = await loadRazorpay()
      if (!sdkLoaded) {
        toast.error('Failed to load payment gateway. Please try again.')
        return
      }

      // Step 2: Create order on backend
      const orderRes = await paymentAPI.createOrder('premium')
      const { orderId, amount, currency } = orderRes.data

      // Step 3: Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '', // set in .env
        amount,
        currency,
        order_id: orderId,
        name: 'Resume Engine',
        description: 'Premium Subscription',
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: { color: '#c9852a' },
        handler: async (response) => {
          // Step 4: Verify payment on backend
          try {
            const verifyRes = await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })

            if (verifyRes.data.status === 'success') {
              // Update local user state to reflect premium plan
              updateUser({ subscriptionPlan: 'premium' })
              toast.success('🎉 Upgraded to Premium!')
              navigate('/dashboard')
            } else {
              toast.error('Payment verification failed. Please contact support.')
            }
          } catch {
            toast.error('Verification error. Please contact support with your payment ID.')
          }
        },
        modal: {
          ondismiss: () => {
            toast('Payment cancelled.', { icon: 'ℹ️' })
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto animate-fade-up">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-cream mb-3">Simple Pricing</h1>
          <p className="text-muted">Start free, upgrade when you need more power.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Free plan */}
          <div className="border border-border rounded-sm p-6 bg-card">
            <div className="mb-5">
              <p className="text-xs font-mono text-muted uppercase tracking-wider mb-1">Free</p>
              <p className="font-display text-4xl text-cream">₹0</p>
              <p className="text-muted text-sm mt-1">Forever free</p>
            </div>
            <ul className="space-y-2.5 mb-6">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted">
                  <span className="text-amber-accent text-xs">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <div className={`w-full py-2.5 text-center text-sm rounded-sm border border-border text-muted ${!isPremium ? 'bg-surface' : ''}`}>
              {isPremium ? 'Previous plan' : 'Current plan'}
            </div>
          </div>

          {/* Premium plan */}
          <div className={`border rounded-sm p-6 relative overflow-hidden ${isPremium ? 'border-amber-accent bg-amber-accent/5' : 'border-amber-accent/40 bg-card'}`}>
            {/* Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-accent/10 rounded-full blur-3xl pointer-events-none" />

            <div className="mb-5">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-mono text-amber-accent uppercase tracking-wider">Premium</p>
                {isPremium && <span className="text-xs bg-amber-accent text-ink px-1.5 py-0.5 rounded-sm font-medium">Active</span>}
              </div>
              <p className="font-display text-4xl text-cream">₹999</p>
              <p className="text-muted text-sm mt-1">One-time payment</p>
            </div>
            <ul className="space-y-2.5 mb-6">
              {PREMIUM_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-cream">
                  <span className="text-amber-accent text-xs">✦</span>
                  {f}
                </li>
              ))}
            </ul>

            {isPremium ? (
              <div className="w-full py-2.5 text-center text-sm rounded-sm bg-amber-accent/20 text-amber-accent border border-amber-accent/30">
                ✓ You're on Premium
              </div>
            ) : (
              <Button
                onClick={handleUpgrade}
                loading={loading}
                className="w-full"
              >
                Upgrade to Premium
              </Button>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12 border-t border-border pt-8">
          <h2 className="font-display text-xl text-cream mb-5">FAQ</h2>
          <div className="space-y-4">
            {[
              { q: 'Is the payment one-time?', a: 'Yes — pay once, use forever. No subscriptions, no recurring charges.' },
              { q: 'Is it secure?', a: 'Payments are processed by Razorpay, a PCI-DSS compliant gateway. We never store your card details.' },
              { q: 'Can I get a refund?', a: 'Please contact support within 7 days of purchase if you have any issues.' },
            ].map((item) => (
              <div key={item.q} className="bg-card border border-border rounded-sm p-4">
                <p className="text-cream text-sm font-medium mb-1">{item.q}</p>
                <p className="text-muted text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
