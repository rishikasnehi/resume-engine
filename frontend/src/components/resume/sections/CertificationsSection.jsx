import SectionCard from '../SectionCard'
import Input from '../../common/Input'
import Button from '../../common/Button'

const empty = () => ({ name: '', issuer: '', year: '' })

export default function CertificationsSection({ resume, onChange }) {
  const list = resume?.certifications || []

  const update = (i, field, value) => {
    const updated = list.map((item, idx) => idx === i ? { ...item, [field]: value } : item)
    onChange({ certifications: updated })
  }

  const add = () => onChange({ certifications: [...list, empty()] })
  const remove = (i) => onChange({ certifications: list.filter((_, idx) => idx !== i) })

  return (
    <SectionCard title="Certifications" description="Professional certificates and licenses.">
      <div className="space-y-4">
        {list.map((item, i) => (
          <div key={i} className="border border-border rounded-sm p-4 relative">
            <button onClick={() => remove(i)} className="absolute top-3 right-3 text-muted hover:text-red-400 text-xs transition-colors">
              Remove
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input label="Certificate Name" value={item.name} onChange={(e) => update(i, 'name', e.target.value)} placeholder="AWS Certified Developer" />
              <Input label="Issuer" value={item.issuer} onChange={(e) => update(i, 'issuer', e.target.value)} placeholder="Amazon Web Services" />
              <Input label="Year" value={item.year} onChange={(e) => update(i, 'year', e.target.value)} placeholder="2023" />
            </div>
          </div>
        ))}
      </div>
      <Button variant="secondary" onClick={add} className="mt-4 w-full">
        + Add Certification
      </Button>
    </SectionCard>
  )
}
