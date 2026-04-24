import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import SectionCard from '../SectionCard'
import { templateAPI } from '../../../services/api'
import Spinner from '../../common/Spinner'

const TEMPLATE_LABELS = { '01': 'Classic', '02': 'Modern', '03': 'Executive' }

const PALETTES = [
  ['#1a1a2e', '#16213e', '#0f3460', '#e94560'],
  ['#2d3436', '#636e72', '#b2bec3', '#fdcb6e'],
  ['#2c3e50', '#34495e', '#95a5a6', '#1abc9c'],
  ['#1e272e', '#485460', '#808e9b', '#f53b57'],
]

export default function TemplateSection({ resume, onChange }) {
  const [templateData, setTemplateData] = useState(null)
  const [loading, setLoading] = useState(true)

  const current = resume?.template || {}

  useEffect(() => {
    templateAPI.getTemplates()
      .then((res) => setTemplateData(res.data))
      .catch(() => toast.error('Failed to load templates'))
      .finally(() => setLoading(false))
  }, [])

  const selectTemplate = (id) => {
    if (!templateData?.availableTemplates?.includes(id)) return
    onChange({ template: { ...current, theme: id } })
  }

  const selectPalette = (palette) => {
    onChange({ template: { ...current, colorPalette: palette } })
  }

  if (loading) return (
    <SectionCard title="Template">
      <div className="flex justify-center py-8"><Spinner /></div>
    </SectionCard>
  )

  const available = templateData?.availableTemplates || []
  const all = templateData?.allTemplates || []
  const isPremium = templateData?.isPremiumUser

  return (
    <SectionCard title="Template" description="Choose a design template and color palette.">
      {/* Template grid */}
      <div className="mb-6">
        <p className="text-xs text-muted uppercase tracking-wider font-medium mb-3">Design Template</p>
        <div className="grid grid-cols-3 gap-3">
          {all.map((id) => {
            const isAvailable = available.includes(id)
            const isSelected = current.theme === id
            return (
              <button
                key={id}
                onClick={() => selectTemplate(id)}
                disabled={!isAvailable}
                className={`relative border rounded-sm p-4 text-center transition-all ${
                  isSelected
                    ? 'border-amber-accent bg-amber-accent/10'
                    : isAvailable
                    ? 'border-border hover:border-amber-accent/50'
                    : 'border-border opacity-40 cursor-not-allowed'
                }`}
              >
                {/* Fake preview */}
                <div className="w-full h-16 bg-surface rounded-sm mb-2 flex flex-col gap-1 items-center justify-center px-2">
                  <div className="w-full h-1.5 bg-muted/30 rounded-full" />
                  <div className="w-3/4 h-1 bg-muted/20 rounded-full" />
                  <div className="w-full h-1 bg-muted/20 rounded-full" />
                </div>
                <p className="text-xs text-muted">{TEMPLATE_LABELS[id]}</p>
                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-amber-accent rounded-full" />
                )}
                {!isAvailable && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs bg-ink/80 text-muted px-1.5 py-0.5 rounded-sm font-mono">PRO</span>
                  </span>
                )}
              </button>
            )
          })}
        </div>
        {!isPremium && (
          <p className="text-xs text-muted mt-3">
            <Link to="/pricing" className="text-amber-accent hover:underline">Upgrade to Premium</Link>{' '}
            to unlock all 3 templates.
          </p>
        )}
      </div>

      {/* Color palettes */}
      <div>
        <p className="text-xs text-muted uppercase tracking-wider font-medium mb-3">Color Palette</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PALETTES.map((palette, i) => {
            const isSelected = JSON.stringify(current.colorPalette) === JSON.stringify(palette)
            return (
              <button
                key={i}
                onClick={() => selectPalette(palette)}
                className={`border rounded-sm p-2 transition-all ${
                  isSelected ? 'border-amber-accent' : 'border-border hover:border-amber-accent/50'
                }`}
              >
                <div className="flex gap-1 justify-center">
                  {palette.map((color) => (
                    <div key={color} className="w-5 h-5 rounded-full border border-white/10" style={{ background: color }} />
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </SectionCard>
  )
}
