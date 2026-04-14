import { Link } from 'react-router-dom'
import type { Topic } from '../types'
import Badge from './Badge'
import { getTopicImage } from '../lib/constants'
import { cn } from '../lib/designSystem'

interface TopicCardProps {
  topic: Topic
  variant?: 'light' | 'dark'
}

export default function TopicCard({ topic, variant = 'light' }: TopicCardProps) {
  const isDark = variant === 'dark'

  return (
    <Link
      to={`/learning/${topic.slug}`}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-3xl border transition-all duration-300',
        isDark
          ? 'border-white/10 bg-deep-navy/85 shadow-xl shadow-black/20 hover:border-teal/30 hover:shadow-glow'
          : 'border-slate-200 bg-white shadow-xl shadow-black/10 hover:-translate-y-1 hover:shadow-2xl',
      )}
    >
      {/* Image */}
      <div className={cn('overflow-hidden', isDark ? 'h-56 bg-navy' : 'h-52 bg-slate-100')}>
        <img
          src={getTopicImage(topic.image_url, topic.slug)}
          alt={topic.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Header with Icon and Badge */}
        <div className="flex items-start justify-between gap-4">
          <div className="text-3xl">{topic.icon}</div>
          <Badge variant="difficulty" difficulty={topic.difficulty} size="sm" />
        </div>

        {/* Title */}
        <h3 className={cn('mt-4 font-display text-2xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>
          {topic.title}
        </h3>

        {/* Description */}
        <p className={cn('mt-3 flex-1 text-sm leading-7', isDark ? 'text-slate-300' : 'text-slate-600')}>
          {topic.description}
        </p>

        {/* Footer */}
        <div className={cn('mt-6 flex items-center justify-between text-sm font-semibold', isDark ? 'text-slate-300' : 'text-slate-700')}>
          <span>{topic.lesson_count} lessons</span>
          <span className="text-teal transition-transform group-hover:translate-x-1">Start learning →</span>
        </div>
      </div>
    </Link>
  )
}
