import { useState } from 'react'
import toast from 'react-hot-toast'
import SectionCard from '../SectionCard'
import Input from '../../common/Input'
import Button from '../../common/Button'
import { aiAPI } from '../../../services/api'

const empty = () => ({ company: '', role: '', startDate: '', endDate: '', description: '' })

export default function WorkSection({ resume, resumeId, onChange }) {
  const list = resume?.workExperience || []
  const [rewritingIndex, setRewritingIndex] = useState(null)
  const [suggestions, setSuggestions] = useState({})

  const update = (i, field, value) => {
    const updated = list.map((item, idx) => idx === i ? { ...item, [field]: value } : item)
    onChange({ workExperience: updated })
  }

  const rewrite = async (i) => {
    const rawText = list[i]?.description?.trim()
    if (!rawText) {
      toast.error('Add a description before rewriting it.')
      return
    }
    if (!resumeId) {
      toast.error('Resume ID is missing. Reopen this resume and try again.')
      return
    }

    setRewritingIndex(i)
    try {
      const response = await aiAPI.rewriteBullet(resumeId, 'WORK_EXPERIENCE', rawText)
      const data = response.data
      const rewrittenText = data?.rewrittenText ?? data?.rewrittenBullet ?? data?.rewrittenText ?? data?.text
      if (typeof rewrittenText !== 'string' || !rewrittenText.trim()) {
        throw new Error('The AI endpoint did not return rewritten text.')
      }
      setSuggestions((prev) => ({ ...prev, [i]: rewrittenText.trim() }))
      toast.success('AI suggestion is ready. Review it below.')
    } catch (error) {
      console.error('Rewrite bullet failed:', error.response?.data || error)
      toast.error(error.response?.data?.message || error.message || 'Could not rewrite this bullet.')
    } finally {
      setRewritingIndex(null)
    }
  }

  const acceptSuggestion = (i) => {
    update(i, 'description', suggestions[i])
    setSuggestions((prev) => {
      const next = { ...prev }
      delete next[i]
      return next
    })
    toast.success('Suggestion applied. Save your resume to keep the change.')
  }

  const add = () => onChange({ workExperience: [...list, empty()] })
  const remove = (i) => {
    onChange({ workExperience: list.filter((_, idx) => idx !== i) })
    setSuggestions((prev) => {
      const next = { ...prev }
      delete next[i]
      return next
    })
  }

  return (
    <SectionCard title="Work Experience" description="List your most recent positions first. Turn responsibilities into clear, impact-focused resume bullets with AI.">
      <div className="space-y-5">
        {list.map((item, i) => (
          <div key={i} className="border border-border rounded-xl p-4 sm:p-5 relative bg-card/70">
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-3 right-3 text-muted hover:text-red-400 transition-colors text-xs"
            >
              Remove
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 pr-14">
              <Input label="Company" value={item.company || ''} onChange={(e) => update(i, 'company', e.target.value)} placeholder="Acme Corp" />
              <Input label="Role / Title" value={item.role || ''} onChange={(e) => update(i, 'role', e.target.value)} placeholder="Software Engineer" />
              <Input label="Start Date" value={item.startDate || ''} onChange={(e) => update(i, 'startDate', e.target.value)} placeholder="Jan 2022" />
              <Input label="End Date" value={item.endDate || ''} onChange={(e) => update(i, 'endDate', e.target.value)} placeholder="Present" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted tracking-wider uppercase">Description / Bullet</label>
              <textarea
                value={item.description || ''}
                onChange={(e) => update(i, 'description', e.target.value)}
                placeholder="Describe your responsibilities and achievements…"
                rows={3}
                className="input-field w-full px-3.5 py-2.5 text-sm rounded-lg resize-y"
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-muted">AI improves wording; review the result for accuracy.</p>
                <Button type="button" onClick={() => rewrite(i)} loading={rewritingIndex === i} disabled={rewritingIndex !== null} className="!bg-gradient-to-r !from-violet-600 !to-fuchsia-500 hover:!from-violet-500 hover:!to-fuchsia-400">
                  ✨ Rewrite with AI
                </Button>
              </div>
              {suggestions[i] && (
                <div className="rounded-xl border border-violet-400/40 bg-violet-500/10 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-violet-200">
                    <span>✨</span> AI suggestion
                  </div>
                  <p className="text-sm text-cream whitespace-pre-wrap">{suggestions[i]}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" onClick={() => acceptSuggestion(i)}>Use this version</Button>
                    <Button type="button" variant="secondary" onClick={() => setSuggestions((prev) => {
                      const next = { ...prev }
                      delete next[i]
                      return next
                    })}>Discard</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <Button variant="secondary" onClick={add} className="mt-4 w-full">
        + Add Position
      </Button>
    </SectionCard>
  )
}
