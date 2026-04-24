import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import SectionCard from '../SectionCard'
import Input from '../../common/Input'
import Button from '../../common/Button'
import { resumeAPI } from '../../../services/api'

export default function ProfileSection({ resume, resumeId, onChange }) {
  const info = resume?.profileInfo || {}
  const [uploading, setUploading] = useState(false)
  const imgRef = useRef(null)

  const update = (field, value) =>
    onChange({ profileInfo: { ...info, [field]: value } })

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('profileImage', file)
    try {
      const res = await resumeAPI.uploadImages(resumeId, fd)
      onChange({ profileInfo: { ...info, profilePreviewUrl: res.data.profilePreviewUrl } })
      toast.success('Profile image updated')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <SectionCard title="Profile" description="Basic information that appears at the top of your resume.">
      {/* Profile image */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden border border-border bg-surface flex items-center justify-center">
            {info.profilePreviewUrl ? (
              <img src={info.profilePreviewUrl} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-muted text-2xl font-display">
                {info.fullName?.[0]?.toUpperCase() || '?'}
              </span>
            )}
          </div>
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-ink/60 rounded-full">
              <div className="w-4 h-4 border-2 border-amber-accent border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <div>
          <Button
            variant="secondary"
            onClick={() => imgRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading…' : 'Change photo'}
          </Button>
          <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} />
          <p className="text-xs text-muted mt-1">JPG, PNG, WebP · Max 5MB</p>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          label="Full Name"
          value={info.fullName || ''}
          onChange={(e) => update('fullName', e.target.value)}
          placeholder="Jane Smith"
        />
        <Input
          label="Designation / Job Title"
          value={info.designation || ''}
          onChange={(e) => update('designation', e.target.value)}
          placeholder="Senior Software Engineer"
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted tracking-wider uppercase">Summary</label>
          <textarea
            value={info.summary || ''}
            onChange={(e) => update('summary', e.target.value)}
            placeholder="A brief professional summary…"
            rows={4}
            className="input-field w-full px-3.5 py-2.5 text-sm rounded-sm resize-none"
          />
        </div>
      </div>
    </SectionCard>
  )
}
