import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AppLayout from '../components/layout/AppLayout'
import { resumeAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'
import ResumeCard from '../components/resume/ResumeCard'
import CreateResumeModal from '../components/resume/CreateResumeModal'

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const fetchResumes = async () => {
    setLoading(true)
    try {
      const res = await resumeAPI.getAll()
      setResumes(res.data)
    } catch {
      toast.error('Failed to load resumes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchResumes() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume? This cannot be undone.')) return
    try {
      await resumeAPI.delete(id)
      setResumes((prev) => prev.filter((r) => r._id !== id))
      toast.success('Resume deleted')
    } catch {
      toast.error('Failed to delete resume')
    }
  }

  const handleCreated = (newResume) => {
    setShowModal(false)
    navigate(`/resume/${newResume._id}`)
  }

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-8 animate-fade-up">
        <div>
          <h1 className="font-display text-3xl text-cream">
            Good {getGreeting()}, <em className="text-amber-accent not-italic">{user?.name?.split(' ')[0]}</em>
          </h1>
          <p className="text-muted text-sm mt-1">
            {resumes.length === 0
              ? 'Create your first resume to get started.'
              : `You have ${resumes.length} resume${resumes.length !== 1 ? 's' : ''}.`}
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} className="shrink-0">
          + New Resume
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-up stagger-1">
        {[
          { label: 'Resumes', value: resumes.length },
          { label: 'Plan', value: user?.subscriptionPlan === 'premium' ? 'Premium' : 'Free' },
          { label: 'Email verified', value: user?.emailVerified ? 'Yes' : 'No' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-sm px-4 py-3">
            <p className="text-muted text-xs font-mono uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-cream font-display text-lg">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Resumes grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-52 rounded-sm" />
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <EmptyState onNew={() => setShowModal(true)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map((resume, i) => (
            <div
              key={resume._id}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 0.06}s`, opacity: 0 }}
            >
              <ResumeCard
                resume={resume}
                onEdit={() => navigate(`/resume/${resume._id}`)}
                onDelete={() => handleDelete(resume._id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Create modal */}
      {showModal && (
        <CreateResumeModal onClose={() => setShowModal(false)} onCreated={handleCreated} />
      )}
    </AppLayout>
  )
}

function EmptyState({ onNew }) {
  return (
    <div className="border border-dashed border-border rounded-sm py-20 text-center animate-fade-in">
      <div className="w-12 h-12 rounded-sm bg-amber-accent/10 flex items-center justify-center mx-auto mb-4">
        <span className="text-amber-accent text-xl font-display">+</span>
      </div>
      <p className="text-cream font-display text-lg mb-2">No resumes yet</p>
      <p className="text-muted text-sm mb-6">Create your first resume to get started</p>
      <Button onClick={onNew}>Create Resume</Button>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
