import PageShell from '../components/PageShell'
import Card from '../components/Card'
import { PRIMARY_NAV_LINKS } from '../lib/constants'

const resources = {
  Books: [
    'Cosmos by Carl Sagan',
    'Astrophysics for People in a Hurry by Neil deGrasse Tyson',
    'Welcome to the Universe by Neil deGrasse Tyson, Michael Strauss, and J. Richard Gott',
  ],
  Websites: [
    'NASA Solar System Exploration',
    'ESA Space for Kids',
    'Sky & Telescope',
  ],
  Tools: [
    'Stellarium',
    'Heavens-Above',
    'Celestia',
  ],
}

export default function ResourcesPage() {
  return (
    <PageShell navLinks={PRIMARY_NAV_LINKS} gradientStyle="default">
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 pt-32">
        <Card variant="default" borderStyle="default" padding="lg" className="text-center">
          <h1 className="font-display text-4xl text-white sm:text-5xl">Astronomy Resources</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Keep learning with trusted books, websites, and tools that support self-study, classroom learning, and sky observation.
          </p>
        </Card>
      </section>

      {/* Resources Grid */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-10">
        <div className="grid gap-6 lg:grid-cols-3">
          {Object.entries(resources).map(([section, items]) => (
            <Card key={section} variant="default" borderStyle="default" padding="md">
              <h2 className="font-display text-3xl text-white">{section}</h2>
              <ul className="mt-5 space-y-3">
                {items.map((item) => (
                  <li key={item} className="rounded-2xl bg-navy/60 px-4 py-3 text-sm leading-7 text-slate-300">
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
