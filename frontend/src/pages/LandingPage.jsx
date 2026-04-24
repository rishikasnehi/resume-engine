import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-ink flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 h-14 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-amber-accent rounded-sm flex items-center justify-center">
            <span className="text-ink text-xs font-display font-bold">R</span>
          </div>
          <span className="font-display text-base text-cream">Resume Engine</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="text-sm bg-amber-accent text-ink px-4 py-2 rounded-sm hover:bg-amber-light transition-colors font-medium"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm text-muted hover:text-cream transition-colors">
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-sm bg-amber-accent text-ink px-4 py-2 rounded-sm hover:bg-amber-light transition-colors font-medium"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 border border-amber-accent/20 text-amber-accent text-xs px-3 py-1 rounded-full mb-8 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-accent animate-pulse" />
            Professional Resume Builder
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-7xl text-cream leading-tight mb-6">
            Craft your story,
            <br />
            <em className="text-amber-accent not-italic">land the role.</em>
          </h1>

          <p className="text-muted text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Build beautiful, ATS-optimized resumes with our intelligent editor.
            Multiple templates, real-time preview, and one-click email delivery.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to={user ? '/dashboard' : '/register'}
              className="bg-amber-accent text-ink px-7 py-3 rounded-sm font-medium text-sm hover:bg-amber-light transition-colors"
            >
              {user ? 'Go to Dashboard' : 'Start for free'}
            </Link>
            <Link
              to="/pricing"
              className="border border-border text-cream px-7 py-3 rounded-sm font-medium text-sm hover:border-amber-accent hover:text-amber-accent transition-colors"
            >
              View pricing
            </Link>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-20 text-left">
            {[
              { title: 'Rich Editor', desc: 'Full-featured resume editor with sections for experience, education, skills, projects & more.' },
              { title: 'Smart Templates', desc: 'Curated templates with customizable color palettes. Premium unlocks exclusive designs.' },
              { title: 'Instant Delivery', desc: 'Export as PDF and send directly to any recruiter email with a single click.' },
            ].map((f, i) => (
              <div key={i} className="border border-border bg-card p-5 rounded-sm hover:border-amber-accent/30 transition-colors">
                <div className="w-8 h-8 rounded-sm bg-amber-accent/10 flex items-center justify-center mb-3">
                  <span className="text-amber-accent font-mono text-xs">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="font-display text-cream text-base mb-2">{f.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4 text-center text-xs text-muted font-mono">
        © {new Date().getFullYear()} Resume Engine · Built with precision
      </footer>
    </div>
  )
}
