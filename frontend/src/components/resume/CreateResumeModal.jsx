import { useState } from 'react'
import toast from 'react-hot-toast'
import { resumeAPI } from '../../services/api'
import Button from '../common/Button'
import Input from '../common/Input'

export default function CreateResumeModal({ onClose, onCreated }) {
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!title.trim()) return setError('Title is required')

    setLoading(true)
    try {
      const res = await resumeAPI.create({ title: title.trim() })
      toast.success('Resume created!')
      onCreated(res.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create resume')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-ink/80 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-card border border-border rounded-sm w-full max-w-sm p-6 animate-fade-up">
        <h2 className="font-display text-xl text-cream mb-1">New resume</h2>
        <p className="text-muted text-sm mb-5">Give your resume a title to get started.</p>

        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Title"
            type="text"
            placeholder="e.g. Software Engineer @ Google"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setError('') }}
            error={error}
            autoFocus
          />
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="flex-1">
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
