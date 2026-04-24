import { forwardRef } from 'react'

/**
 * Reusable Input component
 */
const Input = forwardRef(function Input(
  { label, error, className = '', ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-muted tracking-wider uppercase">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`input-field w-full px-3.5 py-2.5 text-sm rounded-sm ${
          error ? 'border-red-500/50' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-400 mt-0.5">{error}</p>
      )}
    </div>
  )
})

export default Input
