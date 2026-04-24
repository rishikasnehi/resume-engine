import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authAPI } from '../services/api'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

export default function RegisterPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({ name: '', email: '', password: '', profileImageUrl: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    else if (form.name.length > 20) e.name = 'Name must be under 20 characters'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    return e
  }

  // Upload profile image to Cloudinary via backend before submitting
  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    setPreviewUrl(URL.createObjectURL(file))
    setUploading(true)

    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await authAPI.uploadImage(formData)
      setForm((prev) => ({ ...prev, profileImageUrl: res.data.imageUrl }))
      toast.success('Profile image uploaded')
    } catch {
      toast.error('Failed to upload image')
      setPreviewUrl(null)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) return setErrors(errs)

    setLoading(true)
    try {
      await authAPI.register(form)
      toast.success('Account created! Please verify your email.')
      navigate('/login')
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Registration failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-7 h-7 bg-amber-accent rounded-sm flex items-center justify-center">
              <span className="text-ink text-sm font-display font-bold">R</span>
            </div>
          </Link>
          <h1 className="font-display text-2xl text-cream">Create account</h1>
          <p className="text-muted text-sm mt-1">Start building your resume today</p>
        </div>

        {/* Avatar upload */}
        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative w-16 h-16 rounded-full border-2 border-dashed border-border hover:border-amber-accent transition-colors group"
          >
            {previewUrl ? (
              <img src={previewUrl} alt="preview" className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-1">
                <span className="text-muted group-hover:text-amber-accent text-xs">Photo</span>
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-ink/70 rounded-full">
                    <div className="w-4 h-4 border-2 border-amber-accent border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="Jane Smith"
            value={form.name}
            onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }) }}
            error={errors.name}
            autoComplete="name"
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }) }}
            error={errors.email}
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }) }}
            error={errors.password}
            autoComplete="new-password"
          />

          <Button type="submit" loading={loading || uploading} className="w-full mt-2">
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-amber-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
