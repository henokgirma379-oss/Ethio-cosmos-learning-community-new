interface FeatureCardProps {
  icon: string
  title: string
  description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-teal/20 bg-deep-navy/90 p-6 transition-all duration-300 hover:scale-105 hover:shadow-glow">
      <div className="mb-4 text-3xl">{icon}</div>
      <h3 className="font-display text-xl font-bold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
    </div>
  )
}
