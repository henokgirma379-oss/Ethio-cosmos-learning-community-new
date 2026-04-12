import { Link } from 'react-router-dom'
import type { Topic } from '../types'

const difficultyStyles: Record<Topic['difficulty'], string> = {
  Beginner: 'bg-teal/20 text-teal border-teal/40',
  Intermediate: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30',
  Advanced: 'bg-purple-400/20 text-purple-300 border-purple-400/30',
}

const topicFallbackImages: Record<string, string> = {
  fundamentals: '/topic_fundamentals.svg',
  ethiopia: '/topic_ethiopia.svg',
  'solar-system': '/topic_solar_system.svg',
  planets: '/topic_planets.svg',
  moon: '/topic_moon.svg',
  stars: '/topic_stars.svg',
  'black-holes': '/topic_black_holes.svg',
  wormholes: '/topic_wormholes.svg',
  nebulae: '/topic_nebulae.svg',
  asteroids: '/topic_asteroids.svg',
}

export default function TopicCard({ topic }: { topic: Topic }) {
  const image = topic.image_url ?? topicFallbackImages[topic.slug] ?? null

  return (
    <Link
      to={`/learning/${topic.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="relative h-48 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={topic.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-800 text-5xl">
            {topic.icon}
          </div>
        )}
        <span
          className={`absolute right-3 top-3 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm ${difficultyStyles[topic.difficulty]}`}
        >
          {topic.difficulty}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 text-slate-900">
        <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-blue-700">
          {topic.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{topic.description}</p>
        <div className="mt-4 text-sm text-slate-500">{topic.lesson_count} lessons</div>
      </div>
    </Link>
  )
}
