import SectionCard from '../SectionCard'
import Input from '../../common/Input'
import Button from '../../common/Button'

const LEVELS = ['Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced', 'Native']
const empty = () => ({ name: '', proficiency: 'Intermediate' })

export default function LanguagesSection({ resume, onChange }) {
  const list = resume?.languages || []

  const update = (i, field, value) => {
    const updated = list.map((item, idx) => idx === i ? { ...item, [field]: value } : item)
    onChange({ languages: updated })
  }

  const add = () => onChange({ languages: [...list, empty()] })
  const remove = (i) => onChange({ languages: list.filter((_, idx) => idx !== i) })

  return (
    <SectionCard title="Languages" description="Languages you speak and your proficiency level.">
      <div className="space-y-3">
        {list.map((item, i) => (
          <div key={i} className="flex items-end gap-3">
            <div className="flex-1">
              <Input
                label={i === 0 ? 'Language' : undefined}
                value={item.name}
                onChange={(e) => update(i, 'name', e.target.value)}
                placeholder="English"
              />
            </div>
            <div className="w-44 flex flex-col gap-1.5">
              {i === 0 && <label className="text-xs font-medium text-muted tracking-wider uppercase">Proficiency</label>}
              <select
                value={item.proficiency}
                onChange={(e) => update(i, 'proficiency', e.target.value)}
                className="input-field px-3.5 py-2.5 text-sm rounded-sm"
              >
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <button onClick={() => remove(i)} className="text-muted hover:text-red-400 transition-colors text-xs mb-2.5">✕</button>
          </div>
        ))}
      </div>
      <Button variant="secondary" onClick={add} className="mt-4 w-full">
        + Add Language
      </Button>
    </SectionCard>
  )
}
