import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { emailAPI } from '../../services/api'
import Button from '../common/Button'
import Input from '../common/Input'

export default function SendEmailModal({ resumeId, onClose }) {
  const [form, setForm] = useState({
    recipientEmail: '',
    subject: 'My Resume',
    message: 'Please find my resume attached.\n\nBest regards',
  })
  const [pdfFile, setPdfFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const fileRef = useRef(null)

  const validate = () => {
    const e = {}
    if (!form.recipientEmail) e.recipientEmail = 'Recipient email is required'
    else if (!/\S+@\S+\.\S+/.test(form.recipientEmail)) e.recipientEmail = 'Enter a valid email'
    if (!pdfFile) e.pdf = 'Please attach a PDF file'
    return e
  }

  const handleSend = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) return setErrors(errs)

    setLoading(true)
    const fd = new FormData()
    fd.append('recipientEmail', form.recipientEmail)
    fd.append('subject', form.subject)
    fd.append('message', form.message)
    fd.append('pdfFile', pdfFile)

    try {
      await emailAPI.sendResume(fd)
      toast.success(`Resume sent to ${form.recipientEmail}`)
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-ink/80 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-card border border-border rounded-sm w-full max-w-md p-6 animate-fade-up">
        <h2 className="font-display text-xl text-cream mb-1">Send Resume</h2>
        <p className="text-muted text-sm mb-5">Attach your exported PDF and send it directly.</p>

        <form onSubmit={handleSend} className="space-y-4">
          <Input
            label="Recipient Email"
            type="email"
            placeholder="recruiter@company.com"
            value={form.recipientEmail}
            onChange={(e) => { setForm({ ...form, recipientEmail: e.target.value }); setErrors({ ...errors, recipientEmail: '' }) }}
            error={errors.recipientEmail}
          />
          <Input
            label="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="My Resume"
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted tracking-wider uppercase">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={3}
              className="input-field w-full px-3.5 py-2.5 text-sm rounded-sm resize-none"
            />
          </div>

          {/* PDF upload */}
          <div>
            <label className="text-xs font-medium text-muted tracking-wider uppercase block mb-1.5">
              PDF Resume
            </label>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className={`w-full border border-dashed rounded-sm py-3 text-sm transition-colors ${
                errors.pdf ? 'border-red-500/50' : 'border-border hover:border-amber-accent/50'
              }`}
            >
              {pdfFile ? (
                <span className="text-amber-accent">{pdfFile.name}</span>
              ) : (
                <span className="text-muted">Click to upload PDF</span>
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => { setPdfFile(e.target.files[0]); setErrors({ ...errors, pdf: '' }) }}
            />
            {errors.pdf && <p className="text-xs text-red-400 mt-1">{errors.pdf}</p>}
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="flex-1">
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
