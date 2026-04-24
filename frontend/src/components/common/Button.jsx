import Spinner from './Spinner'

/**
 * Reusable Button component
 * variant: 'primary' | 'secondary' | 'ghost' | 'danger'
 */
export default function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-body font-medium text-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-amber-accent disabled:opacity-50 disabled:cursor-not-allowed rounded-sm'

  const variants = {
    primary:
      'bg-amber-accent text-ink px-5 py-2.5 hover:bg-amber-light active:scale-[0.98]',
    secondary:
      'border border-border text-cream px-5 py-2.5 hover:border-amber-accent hover:text-amber-accent active:scale-[0.98]',
    ghost:
      'text-muted px-4 py-2 hover:text-cream active:scale-[0.98]',
    danger:
      'bg-red-500/10 text-red-400 border border-red-500/20 px-5 py-2.5 hover:bg-red-500/20 active:scale-[0.98]',
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : null}
      {children}
    </button>
  )
}
