import { Link } from 'react-router-dom'
import type { Topic } from '../types'

const difficultyStyles: Record<Topic['difficulty'], string> = {
  Beginner: 'bg-teal/10 text-teal border-teal/30',
  Intermediate: 'bg-gold/10 text-gold border-gold/30',
  Advanced: 'bg-cosmos-purple/10 text-cosmos-purple border-cosmos-purple/30',
}

const fallbackTopicImages: Record<string, string> = {
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

const getTopicImage = (topic: Topic) => topic.image_url || fallbackTopicImages[topic.slug] || '/topic_fundamentals.svg'

export default function TopicCard({ topic }: { topic: Topic }) {
  return (
    <Link
      to={`/learning/${topic.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="h-52 overflow-hidden bg-slate-100">
        <img src={getTopicImage(topic)} alt={topic.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="text-3xl">{topic.icon}</div>
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${difficultyStyles[topic.difficulty]}`}>
            {topic.difficulty}
          </span>
        </div>
        <h3 className="mt-4 font-display text-2xl font-bold text-slate-900">{topic.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{topic.description}</p>
        <div className="mt-6 flex items-center justify-between text-sm font-semibold text-slate-700">
          <span>{topic.lesson_count} lessons</span>
          <span className="text-teal transition-transform group-hover:translate-x-1">Start learning →</span>
        </div>
      </div>
    </Link>
  )
}
