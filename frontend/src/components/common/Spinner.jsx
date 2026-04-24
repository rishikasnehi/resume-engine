export default function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-[1.5px]',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-2',
  }

  return (
    <div
      className={`rounded-full border-cream/20 border-t-amber-accent animate-spin ${sizes[size]} ${className}`}
      style={{ animation: 'spin 0.7s linear infinite' }}
    />
  )
}
