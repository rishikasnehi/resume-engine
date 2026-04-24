import SectionCard from '../SectionCard'
import Input from '../../common/Input'
import Button from '../../common/Button'

const empty = () => ({ title: '', description: '', githubLink: '', liveLink: '' })

export default function ProjectsSection({ resume, onChange }) {
  const list = resume?.projects || []

  const update = (i, field, value) => {
    const updated = list.map((item, idx) => idx === i ? { ...item, [field]: value } : item)
    onChange({ projects: updated })
  }

  const add = () => onChange({ projects: [...list, empty()] })
  const remove = (i) => onChange({ projects: list.filter((_, idx) => idx !== i) })

  return (
    <SectionCard title="Projects" description="Showcase your best work.">
      <div className="space-y-5">
        {list.map((item, i) => (
          <div key={i} className="border border-border rounded-sm p-4 relative">
            <button onClick={() => remove(i)} className="absolute top-3 right-3 text-muted hover:text-red-400 text-xs transition-colors">
              Remove
            </button>
            <div className="space-y-3">
              <Input label="Project Title" value={item.title} onChange={(e) => update(i, 'title', e.target.value)} placeholder="My Awesome App" />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted tracking-wider uppercase">Description</label>
                <textarea
                  value={item.description}
                  onChange={(e) => update(i, 'description', e.target.value)}
                  placeholder="What does this project do? What tech did you use?"
                  rows={2}
                  className="input-field w-full px-3.5 py-2.5 text-sm rounded-sm resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="GitHub Link" value={item.githubLink} onChange={(e) => update(i, 'githubLink', e.target.value)} placeholder="github.com/user/repo" />
                <Input label="Live Link" value={item.liveLink} onChange={(e) => update(i, 'liveLink', e.target.value)} placeholder="myapp.vercel.app" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button variant="secondary" onClick={add} className="mt-4 w-full">
        + Add Project
      </Button>
    </SectionCard>
  )
}
