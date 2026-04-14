import PageShell from '../components/PageShell'
import Card from '../components/Card'
import SectionHeader from '../components/SectionHeader'
import { PRIMARY_NAV_LINKS } from '../lib/constants'

const articles = [
  {
    title: 'How the Moon Shapes Observation Habits',
    description: 'A short guide to lunar phases, visibility, and how moonlight influences beginner stargazing sessions.',
  },
  {
    title: 'Why Nebulae Matter in the Story of Stars',
    description: 'Understand how gas clouds, stellar nurseries, and supernova remnants help scientists trace cosmic life cycles.',
  },
  {
    title: "Learning Astronomy from Ethiopia's Night Sky",
    description: 'An overview of how altitude, dark skies, and community curiosity create meaningful astronomy learning opportunities.',
  },
]

export default function ArticlesPage() {
  return (
    <PageShell navLinks={PRIMARY_NAV_LINKS} gradientStyle="gold">
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 pt-32">
        <Card variant="default" borderStyle="default" padding="lg" className="text-center">
          <h1 className="font-display text-4xl text-white sm:text-5xl">Articles & Insights</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Read short, approachable articles that connect astronomy concepts with observation, culture, and curiosity.
          </p>
        </Card>
      </section>

      {/* Articles Grid */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-10">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <Card key={article.title} variant="default" borderStyle="default" padding="md" hoverable>
              <div className="text-3xl">📰</div>
              <h2 className="mt-4 text-2xl font-semibold text-white">{article.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">{article.description}</p>
            </Card>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
