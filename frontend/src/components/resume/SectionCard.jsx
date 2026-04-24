export default function SectionCard({ title, description, children }) {
  return (
    <div className="bg-card border border-border rounded-sm p-5 mb-4">
      <div className="mb-4">
        <h2 className="font-display text-lg text-cream">{title}</h2>
        {description && <p className="text-muted text-sm mt-0.5">{description}</p>}
      </div>
      <hr className="border-border mb-5" />
      {children}
    </div>
  )
}
