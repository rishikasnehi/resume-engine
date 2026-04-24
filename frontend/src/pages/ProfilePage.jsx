import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import AppLayout from '../components/layout/AppLayout'
import { authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Please select an image'); return }

    setUploading(true)
    const fd = new FormData()
    fd.append('image', file)
    try {
      const res = await authAPI.uploadImage(fd)
      updateUser({ profileImageUrl: res.data.imageUrl })
      toast.success('Profile image updated!')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—'

  return (
    <AppLayout>
      <div className="max-w-lg animate-fade-up">
        <h1 className="font-display text-3xl text-cream mb-6">Profile</h1>

        {/* Avatar */}
        <div className="bg-card border border-border rounded-sm p-6 mb-4">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-border">
                {user?.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-amber-accent/20 flex items-center justify-center">
                    <span className="text-amber-accent text-2xl font-display">
                      {user?.name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-ink/60 rounded-full">
                  <div className="w-5 h-5 border-2 border-amber-accent border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div>
              <h2 className="font-display text-xl text-cream">{user?.name}</h2>
              <p className="text-muted text-sm">{user?.email}</p>
              <Button
                variant="ghost"
                className="mt-2 text-xs px-0 text-amber-accent"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading…' : 'Change photo'}
              </Button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-card border border-border rounded-sm divide-y divide-border">
          {[
            { label: 'Name', value: user?.name },
            { label: 'Email', value: user?.email },
            { label: 'Email Verified', value: user?.emailVerified ? 'Yes ✓' : 'No — check your inbox' },
            { label: 'Subscription', value: user?.subscriptionPlan === 'premium' ? 'Premium ✦' : 'Free' },
            { label: 'Member since', value: formattedDate },
          ].map((row) => (
            <div key={row.label} className="px-5 py-3.5 flex items-center justify-between">
              <span className="text-xs text-muted uppercase tracking-wider font-medium">{row.label}</span>
              <span className={`text-sm ${row.label === 'Subscription' && user?.subscriptionPlan === 'premium' ? 'text-amber-accent' : 'text-cream'}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
