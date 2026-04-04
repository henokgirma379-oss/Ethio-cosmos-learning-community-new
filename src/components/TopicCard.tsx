import { Link } from 'react-router-dom'
import type { Topic } from '../types'

const difficultyStyles: Record<Topic['difficulty'], string> = {
  Beginner: 'border-teal bg-teal-900/50 text-teal-200',
  Intermediate: 'border-yellow-700 bg-yellow-900/50 text-yellow-200',
  Advanced: 'border-purple-700 bg-purple-900/50 text-purple-200',
}

const topBorderStyles: Record<Topic['difficulty'], string> = {
  Beginner: 'border-t-teal',
  Intermediate: 'border-t-gold',
  Advanced: 'border-t-cosmos-purple',
}

export default function TopicCard({ topic }: { topic: Topic }) {
  return (
    <Link
      to={`/learning/${topic.slug}`}
      className={`group flex h-full flex-col rounded-xl border border-white/5 border-t-2 bg-deep-navy p-6 transition-all duration-300 hover:scale-105 hover:shadow-glow ${topBorderStyles[topic.difficulty]}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="text-3xl">{topic.icon}</div>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${difficultyStyles[topic.difficulty]}`}>
          {topic.difficulty}
        </span>
      </div>
      <h3 className="mt-4 font-display text-xl font-bold text-white">{topic.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-400">{topic.description}</p>
      <div className="mt-6 flex items-center justify-between text-sm text-teal">
        <span>{topic.lesson_count} lessons</span>
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </div>
    </Link>
  )
}
