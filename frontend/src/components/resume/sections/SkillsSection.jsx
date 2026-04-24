import SectionCard from '../SectionCard'
import Input from '../../common/Input'
import Button from '../../common/Button'

const empty = () => ({ name: '', proficiency: 5 })

export default function SkillsSection({ resume, onChange }) {
  const list = resume?.skills || []

  const update = (i, field, value) => {
    const updated = list.map((item, idx) => idx === i ? { ...item, [field]: value } : item)
    onChange({ skills: updated })
  }

  const add = () => onChange({ skills: [...list, empty()] })
  const remove = (i) => onChange({ skills: list.filter((_, idx) => idx !== i) })

  return (
    <SectionCard title="Skills" description="Technical and soft skills with proficiency level (1–10).">
      <div className="space-y-3">
        {list.map((item, i) => (
          <div key={i} className="flex items-end gap-3">
            <div className="flex-1">
              <Input
                label={i === 0 ? 'Skill' : undefined}
                value={item.name}
                onChange={(e) => update(i, 'name', e.target.value)}
                placeholder="e.g. React, Python, Leadership"
              />
            </div>
            <div className="w-28">
              <div className={i === 0 ? 'flex flex-col gap-1.5' : ''}>
                {i === 0 && <label className="text-xs font-medium text-muted tracking-wider uppercase">Level</label>}
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={item.proficiency}
                    onChange={(e) => update(i, 'proficiency', Number(e.target.value))}
                    className="flex-1 accent-amber-500"
                  />
                  <span className="text-xs text-amber-accent font-mono w-4 text-right">{item.proficiency}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => remove(i)}
              className="text-muted hover:text-red-400 transition-colors text-xs mb-2.5"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <Button variant="secondary" onClick={add} className="mt-4 w-full">
        + Add Skill
      </Button>
    </SectionCard>
  )
}
