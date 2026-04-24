import { useState } from 'react'
import SectionCard from '../SectionCard'
import Button from '../../common/Button'

export default function InterestsSection({ resume, onChange }) {
  const list = resume?.interests || []
  const [input, setInput] = useState('')

  const add = () => {
    const trimmed = input.trim()
    if (!trimmed || list.includes(trimmed)) return
    onChange({ interests: [...list, trimmed] })
    setInput('')
  }

  const remove = (idx) => onChange({ interests: list.filter((_, i) => i !== idx) })

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); add() }
  }

  return (
    <SectionCard title="Interests" description="Hobbies and personal interests that show your personality.">
      {/* Tag list */}
      {list.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {list.map((interest, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 text-sm bg-amber-accent/10 text-amber-accent border border-amber-accent/20 px-3 py-1 rounded-full">
              {interest}
              <button onClick={() => remove(i)} className="hover:text-red-400 transition-colors text-xs">✕</button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Photography, Open Source, Running"
          className="input-field flex-1 px-3.5 py-2.5 text-sm rounded-sm"
        />
        <Button variant="secondary" onClick={add} disabled={!input.trim()}>
          Add
        </Button>
      </div>
      <p className="text-xs text-muted mt-2">Press Enter to add quickly.</p>
    </SectionCard>
  )
}
