import SectionCard from '../SectionCard'
import Input from '../../common/Input'
import Button from '../../common/Button'

const empty = () => ({ company: '', role: '', startDate: '', endDate: '', description: '' })

export default function WorkSection({ resume, onChange }) {
  const list = resume?.workExperience || []

  const update = (i, field, value) => {
    const updated = list.map((item, idx) => idx === i ? { ...item, [field]: value } : item)
    onChange({ workExperience: updated })
  }

  const add = () => onChange({ workExperience: [...list, empty()] })
  const remove = (i) => onChange({ workExperience: list.filter((_, idx) => idx !== i) })

  return (
    <SectionCard title="Work Experience" description="List your most recent positions first.">
      <div className="space-y-5">
        {list.map((item, i) => (
          <div key={i} className="border border-border rounded-sm p-4 relative">
            <button
              onClick={() => remove(i)}
              className="absolute top-3 right-3 text-muted hover:text-red-400 transition-colors text-xs"
            >
              Remove
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <Input label="Company" value={item.company} onChange={(e) => update(i, 'company', e.target.value)} placeholder="Acme Corp" />
              <Input label="Role / Title" value={item.role} onChange={(e) => update(i, 'role', e.target.value)} placeholder="Software Engineer" />
              <Input label="Start Date" value={item.startDate} onChange={(e) => update(i, 'startDate', e.target.value)} placeholder="Jan 2022" />
              <Input label="End Date" value={item.endDate} onChange={(e) => update(i, 'endDate', e.target.value)} placeholder="Present" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted tracking-wider uppercase">Description</label>
              <textarea
                value={item.description}
                onChange={(e) => update(i, 'description', e.target.value)}
                placeholder="Describe your responsibilities and achievements…"
                rows={3}
                className="input-field w-full px-3.5 py-2.5 text-sm rounded-sm resize-none"
              />
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
