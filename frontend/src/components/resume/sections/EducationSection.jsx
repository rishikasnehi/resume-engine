import SectionCard from '../SectionCard'
import Input from '../../common/Input'
import Button from '../../common/Button'

const empty = () => ({ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' })

export default function EducationSection({ resume, onChange }) {
  const list = resume?.education || []

  const update = (i, field, value) => {
    const updated = list.map((item, idx) => idx === i ? { ...item, [field]: value } : item)
    onChange({ education: updated })
  }

  const add = () => onChange({ education: [...list, empty()] })
  const remove = (i) => onChange({ education: list.filter((_, idx) => idx !== i) })

  return (
    <SectionCard title="Education" description="Degrees and academic credentials.">
      <div className="space-y-5">
        {list.map((item, i) => (
          <div key={i} className="border border-border rounded-sm p-4 relative">
            <button onClick={() => remove(i)} className="absolute top-3 right-3 text-muted hover:text-red-400 text-xs transition-colors">
              Remove
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Institution" value={item.institution} onChange={(e) => update(i, 'institution', e.target.value)} placeholder="MIT" />
              <Input label="Degree" value={item.degree} onChange={(e) => update(i, 'degree', e.target.value)} placeholder="Bachelor of Science" />
              <Input label="Field of Study" value={item.fieldOfStudy} onChange={(e) => update(i, 'fieldOfStudy', e.target.value)} placeholder="Computer Science" />
              <div /> {/* spacer */}
              <Input label="Start Date" value={item.startDate} onChange={(e) => update(i, 'startDate', e.target.value)} placeholder="Sep 2018" />
              <Input label="End Date" value={item.endDate} onChange={(e) => update(i, 'endDate', e.target.value)} placeholder="May 2022" />
            </div>
          </div>
        ))}
      </div>
      <Button variant="secondary" onClick={add} className="mt-4 w-full">
        + Add Education
      </Button>
    </SectionCard>
  )
}
