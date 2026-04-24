import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/templates', label: 'Templates' },
    { href: '/pricing', label: 'Pricing' },
  ]

  return (
    <header className="border-b border-border bg-ink/80 backdrop-blur-sm sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-6 h-6 bg-amber-accent rounded-sm flex items-center justify-center">
            <span className="text-ink text-xs font-display font-bold">R</span>
          </div>
          <span className="font-display text-base text-cream group-hover:text-amber-light transition-colors">
            Resume Engine
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-3 py-1.5 text-sm rounded-sm transition-colors ${
                isActive(link.href)
                  ? 'text-amber-accent'
                  : 'text-muted hover:text-cream'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Subscription badge */}
          {user?.subscriptionPlan === 'premium' ? (
            <span className="hidden md:inline-flex text-xs border border-amber-accent/30 text-amber-accent px-2 py-0.5 rounded-sm font-mono">
              PREMIUM
            </span>
          ) : (
            <span className="hidden md:inline-flex text-xs border border-border text-muted px-2 py-0.5 rounded-sm font-mono">
              FREE
            </span>
          )}

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-border"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-amber-accent/20 border border-amber-accent/40 flex items-center justify-center">
                  <span className="text-amber-accent text-xs font-medium">
                    {user?.name?.[0]?.toUpperCase()}
                  </span>
                </div>
              )}
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div
                className="absolute right-0 top-9 w-48 bg-card border border-border rounded-sm shadow-xl z-50 animate-fade-in py-1"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-xs font-medium text-cream truncate">{user?.name}</p>
                  <p className="text-xs text-muted truncate">{user?.email}</p>
                </div>
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-sm text-muted hover:text-cream hover:bg-surface transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/payment-history"
                  className="block px-3 py-2 text-sm text-muted hover:text-cream hover:bg-surface transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Payment History
                </Link>
                <hr className="border-border my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-surface transition-colors"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
