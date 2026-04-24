import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import AppLayout from '../components/layout/AppLayout'
import { paymentAPI } from '../services/api'
import Spinner from '../components/common/Spinner'

const STATUS_STYLES = {
  paid: 'bg-green-500/10 text-green-400 border-green-500/20',
  created: 'bg-amber-accent/10 text-amber-accent border-amber-accent/20',
  failed: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    paymentAPI
      .getHistory()
      .then((res) => setPayments(res.data))
      .catch(() => toast.error('Failed to load payment history'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AppLayout>
      <div className="max-w-3xl animate-fade-up">
        <h1 className="font-display text-3xl text-cream mb-2">Payment History</h1>
        <p className="text-muted text-sm mb-8">All your past transactions.</p>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : payments.length === 0 ? (
          <div className="border border-dashed border-border rounded-sm py-16 text-center">
            <p className="text-muted">No payments yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((p, i) => (
              <div
                key={p._id}
                className="bg-card border border-border rounded-sm px-5 py-4 flex items-start justify-between gap-4 animate-fade-up"
                style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}
              >
                {/* Left */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-cream text-sm font-medium capitalize">{p.planType} Plan</span>
                    <span className={`text-xs border px-2 py-0.5 rounded-sm font-mono ${STATUS_STYLES[p.status] || STATUS_STYLES.created}`}>
                      {p.status}
                    </span>
                  </div>
                  <p className="text-muted text-xs font-mono truncate">Order: {p.razorpayOrderId}</p>
                  {p.razorpayPaymentId && (
                    <p className="text-muted text-xs font-mono truncate">Payment: {p.razorpayPaymentId}</p>
                  )}
                  <p className="text-muted text-xs mt-1">
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    }) : '—'}
                  </p>
                </div>

                {/* Right */}
                <div className="text-right shrink-0">
                  <p className="font-display text-lg text-cream">
                    ₹{((p.amount || 0) / 100).toFixed(0)}
                  </p>
                  <p className="text-muted text-xs">{p.currency}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
