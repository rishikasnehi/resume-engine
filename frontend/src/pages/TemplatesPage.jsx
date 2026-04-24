import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import AppLayout from '../components/layout/AppLayout'
import { templateAPI } from '../services/api'
import Spinner from '../components/common/Spinner'

const TEMPLATES = [
  { id: '01', name: 'Classic', desc: 'Timeless and ATS-friendly. Works for any industry.' },
  { id: '02', name: 'Modern', desc: 'Clean two-column layout with bold typography.' },
  { id: '03', name: 'Executive', desc: 'Premium design for senior-level professionals.' },
]

export default function TemplatesPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    templateAPI.getTemplates()
      .then((res) => setData(res.data))
      .catch(() => toast.error('Failed to load templates'))
      .finally(() => setLoading(false))
  }, [])

  const available = data?.availableTemplates || []
  const isPremium = data?.isPremiumUser

  return (
    <AppLayout>
      <div className="mb-8 animate-fade-up">
        <h1 className="font-display text-3xl text-cream">Templates</h1>
        <p className="text-muted text-sm mt-1">
          {isPremium ? 'All templates available on your Premium plan.' : 'Upgrade to unlock all templates.'}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TEMPLATES.map((t, i) => {
            const isAvailable = available.includes(t.id)
            return (
              <div
                key={t.id}
                className={`border rounded-sm overflow-hidden transition-all duration-200 animate-fade-up ${
                  isAvailable ? 'border-border hover:border-amber-accent/40' : 'border-border opacity-60'
                }`}
                style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}
              >
                {/* Mock preview */}
                <div className="h-52 bg-surface relative p-4 flex flex-col gap-2">
                  <div className="w-24 h-3 bg-amber-accent/40 rounded-full" />
                  <div className="w-40 h-2 bg-muted/30 rounded-full" />
                  <div className="w-32 h-2 bg-muted/20 rounded-full" />
                  <hr className="border-border my-1" />
                  {[80, 60, 70, 50].map((w, j) => (
                    <div key={j} className="h-1.5 bg-muted/20 rounded-full" style={{ width: `${w}%` }} />
                  ))}
                  {!isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center bg-ink/70">
                      <span className="text-xs border border-amber-accent/30 text-amber-accent px-3 py-1 rounded-sm font-mono">
                        PREMIUM
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 bg-card">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-display text-cream">{t.name}</h3>
                    <span className="text-xs font-mono text-muted">{t.id}</span>
                  </div>
                  <p className="text-muted text-xs">{t.desc}</p>
                  {!isAvailable && (
                    <Link
                      to="/pricing"
                      className="inline-block mt-3 text-xs text-amber-accent hover:underline"
                    >
                      Unlock with Premium →
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!isPremium && !loading && (
        <div className="mt-10 border border-amber-accent/20 bg-amber-accent/5 rounded-sm p-6 text-center">
          <p className="text-amber-accent font-display text-xl mb-2">Unlock all templates</p>
          <p className="text-muted text-sm mb-4">Upgrade to Premium for ₹999 and get access to all 3 professional templates.</p>
          <Link
            to="/pricing"
            className="inline-flex bg-amber-accent text-ink px-6 py-2.5 rounded-sm text-sm font-medium hover:bg-amber-light transition-colors"
          >
            View Pricing
          </Link>
        </div>
      )}
    </AppLayout>
  )
}
