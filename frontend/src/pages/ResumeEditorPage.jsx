import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AppLayout from '../components/layout/AppLayout'
import { resumeAPI } from '../services/api'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'
import ProfileSection from '../components/resume/sections/ProfileSection'
import ContactSection from '../components/resume/sections/ContactSection'
import WorkSection from '../components/resume/sections/WorkSection'
import EducationSection from '../components/resume/sections/EducationSection'
import SkillsSection from '../components/resume/sections/SkillsSection'
import ProjectsSection from '../components/resume/sections/ProjectsSection'
import CertificationsSection from '../components/resume/sections/CertificationsSection'
import LanguagesSection from '../components/resume/sections/LanguagesSection'
import InterestsSection from '../components/resume/sections/InterestsSection'
import TemplateSection from '../components/resume/sections/TemplateSection'
import SendEmailModal from '../components/resume/SendEmailModal'

const SECTIONS = [
  { id: 'profile', label: 'Profile' },
  { id: 'contact', label: 'Contact' },
  { id: 'work', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'languages', label: 'Languages' },
  { id: 'interests', label: 'Interests' },
  { id: 'template', label: 'Template' },
]

export default function ResumeEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState('profile')
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    resumeAPI
      .getById(id)
      .then((res) => setResume(res.data))
      .catch(() => { toast.error('Resume not found'); navigate('/dashboard') })
      .finally(() => setLoading(false))
  }, [id])

  // Deep update helper — merges patch into resume state
  const updateResume = useCallback((patch) => {
    setResume((prev) => ({ ...prev, ...patch }))
    setDirty(true)
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await resumeAPI.update(id, resume)
      setResume(res.data)
      setDirty(false)
      toast.success('Saved!')
    } catch {
      toast.error('Failed to save resume')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 animate-fade-up">
        <div>
          <h1 className="font-display text-xl text-cream">{resume?.title}</h1>
          <p className="text-muted text-xs mt-0.5 font-mono">
            {dirty ? '● Unsaved changes' : 'All changes saved'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setShowEmailModal(true)}>
            Send via Email
          </Button>
          <Button onClick={handleSave} loading={saving} disabled={!dirty}>
            Save
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <aside className="w-44 shrink-0 hidden md:block">
          <nav className="sticky top-20 space-y-0.5">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full text-left px-3 py-2 text-sm rounded-sm transition-colors ${
                  activeSection === s.id
                    ? 'bg-amber-accent/10 text-amber-accent border-l-2 border-amber-accent pl-[10px]'
                    : 'text-muted hover:text-cream hover:bg-surface'
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile section tabs */}
        <div className="md:hidden w-full mb-4 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`shrink-0 px-3 py-1.5 text-xs rounded-sm border transition-colors ${
                  activeSection === s.id
                    ? 'bg-amber-accent/10 text-amber-accent border-amber-accent/30'
                    : 'border-border text-muted'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Editor panel */}
        <div className="flex-1 min-w-0 animate-fade-in">
          {activeSection === 'profile' && (
            <ProfileSection resume={resume} resumeId={id} onChange={updateResume} />
          )}
          {activeSection === 'contact' && (
            <ContactSection resume={resume} onChange={updateResume} />
          )}
          {activeSection === 'work' && (
            <WorkSection resume={resume} onChange={updateResume} />
          )}
          {activeSection === 'education' && (
            <EducationSection resume={resume} onChange={updateResume} />
          )}
          {activeSection === 'skills' && (
            <SkillsSection resume={resume} onChange={updateResume} />
          )}
          {activeSection === 'projects' && (
            <ProjectsSection resume={resume} onChange={updateResume} />
          )}
          {activeSection === 'certifications' && (
            <CertificationsSection resume={resume} onChange={updateResume} />
          )}
          {activeSection === 'languages' && (
            <LanguagesSection resume={resume} onChange={updateResume} />
          )}
          {activeSection === 'interests' && (
            <InterestsSection resume={resume} onChange={updateResume} />
          )}
          {activeSection === 'template' && (
            <TemplateSection resume={resume} onChange={updateResume} />
          )}
        </div>
      </div>

      {showEmailModal && (
        <SendEmailModal resumeId={id} onClose={() => setShowEmailModal(false)} />
      )}
    </AppLayout>
  )
}
