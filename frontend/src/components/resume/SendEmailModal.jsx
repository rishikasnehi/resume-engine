import { useState } from 'react'
import toast from 'react-hot-toast'
import { emailAPI } from '../../services/api'
import Button from '../common/Button'
import Input from '../common/Input'

export default function SendEmailModal({
  resumeId,
  onClose,
}) {

  const [form, setForm] = useState({
    recipientEmail: '',
    subject: 'My Resume',
    message:
      'Please find my resume attached.\n\nBest regards',
  })

  const [loading, setLoading] = useState(false)

  const [errors, setErrors] = useState({})

  const validate = () => {

    const e = {}

    if (!form.recipientEmail) {
      e.recipientEmail = 'Recipient email is required'
    }
    else if (
      !/\S+@\S+\.\S+/.test(form.recipientEmail)
    ) {
      e.recipientEmail = 'Enter valid email'
    }

    return e
  }

  const handleSend = async (e) => {

    e.preventDefault()

    const errs = validate()

    if (Object.keys(errs).length) {
      return setErrors(errs)
    }

    setLoading(true)

    try {

      const fd = new FormData()

      fd.append(
        'recipientEmail',
        form.recipientEmail
      )

      fd.append(
        'subject',
        form.subject
      )

      fd.append(
        'message',
        form.message
      )

      fd.append(
        'resumeId',
        resumeId
      )

      await emailAPI.sendResume(fd)

      toast.success('Resume sent successfully')

      onClose()

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        'Failed to send email'
      )

    } finally {

      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-ink/80 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={(e) =>
        e.target === e.currentTarget && onClose()
      }
    >

      <div className="bg-card border border-border rounded-sm w-full max-w-md p-6">

        <h2 className="font-display text-xl text-cream mb-1">
          Send Resume
        </h2>

        <p className="text-muted text-sm mb-5">
          Your resume PDF will be generated automatically.
        </p>

        <form
          onSubmit={handleSend}
          className="space-y-4"
        >

          <Input
            label="Recipient Email"
            type="email"
            value={form.recipientEmail}
            onChange={(e) =>
              setForm({
                ...form,
                recipientEmail: e.target.value,
              })
            }
            error={errors.recipientEmail}
          />

          <Input
            label="Subject"
            value={form.subject}
            onChange={(e) =>
              setForm({
                ...form,
                subject: e.target.value,
              })
            }
          />

          <div className="flex flex-col gap-1.5">

            <label className="text-xs font-medium text-muted tracking-wider uppercase">
              Message
            </label>

            <textarea
              rows={4}
              value={form.message}
              onChange={(e) =>
                setForm({
                  ...form,
                  message: e.target.value,
                })
              }
              className="input-field w-full px-3.5 py-2.5 text-sm rounded-sm resize-none"
            />

          </div>

          <div className="flex gap-3 pt-2">

            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={loading}
              className="flex-1"
            >
              Send
            </Button>

          </div>

        </form>

      </div>

    </div>
  )
} 