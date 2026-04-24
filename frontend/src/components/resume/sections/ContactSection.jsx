import SectionCard from '../SectionCard'
import Input from '../../common/Input'

export default function ContactSection({ resume, onChange }) {
  const info = resume?.contactInfo || {}

  const update = (field, value) =>
    onChange({ contactInfo: { ...info, [field]: value } })

  return (
    <SectionCard title="Contact" description="How recruiters can reach you.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Email" type="email" value={info.email || ''} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" />
        <Input label="Phone" type="tel" value={info.phone || ''} onChange={(e) => update('phone', e.target.value)} placeholder="+1 555 000 0000" />
        <Input label="Location" value={info.location || ''} onChange={(e) => update('location', e.target.value)} placeholder="San Francisco, CA" />
        <Input label="LinkedIn" value={info.linkedIn || ''} onChange={(e) => update('linkedIn', e.target.value)} placeholder="linkedin.com/in/username" />
        <Input label="GitHub" value={info.github || ''} onChange={(e) => update('github', e.target.value)} placeholder="github.com/username" />
        <Input label="Website" value={info.website || ''} onChange={(e) => update('website', e.target.value)} placeholder="yoursite.com" />
      </div>
    </SectionCard>
  )
}
