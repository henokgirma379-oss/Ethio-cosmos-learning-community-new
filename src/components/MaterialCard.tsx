interface MaterialCardProps {
  title: string
  description: string
  preview: React.ReactNode
  actionLabel: string
  onClick: () => void
}

export default function MaterialCard({ title, description, preview, actionLabel, onClick }: MaterialCardProps) {
  return (
    <div className="rounded-2xl border border-teal/20 bg-deep-navy/90 p-6 shadow-lg shadow-black/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-glow">
      <div className="mb-5 overflow-hidden rounded-xl border border-white/10">{preview}</div>
      <h3 className="font-display text-2xl text-white">{title}</h3>
      <p className="mt-3 min-h-14 text-sm leading-6 text-slate-300">{description}</p>
      <button
        onClick={onClick}
        className="mt-5 rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950 transition-all duration-200 hover:scale-[1.02] hover:brightness-110"
      >
        {actionLabel}
      </button>
    </div>
  )
}
