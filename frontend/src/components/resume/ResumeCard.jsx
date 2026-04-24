import { useState } from 'react'

export default function ResumeCard({ resume, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const updatedAt = resume.updatedAt
    ? new Date(resume.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—'

  return (
    <div className="group bg-card border border-border rounded-sm overflow-hidden hover:border-amber-accent/30 transition-all duration-200 cursor-pointer">
      {/* Thumbnail */}
      <div className="h-36 bg-surface relative overflow-hidden" onClick={onEdit}>
        {resume.thumbNailLink ? (
          <img
            src={resume.thumbNailLink}
            alt={resume.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="font-display text-3xl text-border mb-1">R</div>
              <p className="text-xs text-border font-mono">No preview</p>
            </div>
          </div>
        )}
        {/* Template badge */}
        {resume.template?.theme && (
          <span className="absolute top-2 left-2 text-xs bg-ink/80 text-muted px-2 py-0.5 rounded-sm font-mono">
            {resume.template.theme}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="min-w-0" onClick={onEdit}>
          <p className="text-cream text-sm font-medium truncate">{resume.title}</p>
          <p className="text-muted text-xs mt-0.5">{updatedAt}</p>
        </div>

        {/* Actions menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-7 h-7 flex items-center justify-center text-muted hover:text-cream transition-colors rounded-sm hover:bg-surface"
          >
            ⋯
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 bottom-9 w-36 bg-card border border-border rounded-sm shadow-xl z-10 py-1 animate-fade-in"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                onClick={() => { setMenuOpen(false); onEdit() }}
                className="w-full text-left px-3 py-2 text-sm text-muted hover:text-cream hover:bg-surface transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => { setMenuOpen(false); onDelete() }}
                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-surface transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
