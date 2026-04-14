import PageShell from '../components/PageShell'
import Card from '../components/Card'
import { PRIMARY_NAV_LINKS } from '../lib/constants'

const scientists = [
  { emoji: '🌍', name: 'Benjamin Banneker', field: 'Astronomy & Mathematics', years: '1731–1806', contribution: 'Calculated eclipse data, published almanacs, and promoted scientific learning for broader communities.' },
  { emoji: '✨', name: 'Wangari Maathai', field: 'Environmental Science', years: '1940–2011', contribution: 'Though not an astronomer, her scientific leadership and public education inspire African science engagement and stewardship.' },
  { emoji: '🛰️', name: 'Neil deGrasse Tyson', field: 'Astrophysics', years: '1958–present', contribution: 'Popularized astrophysics for global audiences through accessible talks, books, and public science outreach.' },
  { emoji: '🌌', name: 'Galileo Galilei', field: 'Observational Astronomy', years: '1564–1642', contribution: 'Used telescopes to observe moons of Jupiter, phases of Venus, and evidence that transformed astronomy.' },
  { emoji: '🔭', name: 'Vera Rubin', field: 'Galaxy Dynamics', years: '1928–2016', contribution: 'Provided strong evidence for dark matter through galaxy rotation studies.' },
  { emoji: '🧠', name: 'Katherine Johnson', field: 'Space Mathematics', years: '1918–2020', contribution: 'Calculated crucial orbital trajectories for NASA missions and advanced public recognition of women in science.' },
  { emoji: '☀️', name: 'Subrahmanyan Chandrasekhar', field: 'Stellar Physics', years: '1910–1995', contribution: 'Explained stellar evolution limits and laid foundations for black hole theory.' },
  { emoji: '🌠', name: 'Beth Brown', field: 'Astrophysics', years: '1969–2008', contribution: 'Researched elliptical galaxies and inspired students through science communication and mentorship.' },
]

export default function ScientistsPage() {
  return (
    <PageShell navLinks={PRIMARY_NAV_LINKS} gradientStyle="gold">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 pt-32">
        <Card variant="default" borderStyle="default" padding="lg" className="text-center">
          <h1 className="font-display text-4xl text-white sm:text-5xl">Scientists Who Shaped Our View of the Universe</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Meet scientists, educators, and scientific pioneers whose work helps learners understand space, motion, matter, and discovery.
          </p>
        </Card>
      </section>

      {/* Scientists Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-10">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {scientists.map((scientist) => (
            <Card key={scientist.name} variant="default" borderStyle="default" padding="md" hoverable>
              <div className="text-4xl">{scientist.emoji}</div>
              <h2 className="mt-4 text-2xl font-semibold text-white">{scientist.name}</h2>
              <p className="mt-2 text-sm font-semibold text-teal">{scientist.field}</p>
              <p className="mt-1 text-sm text-slate-400">{scientist.years}</p>
              <p className="mt-4 text-sm leading-7 text-slate-300">{scientist.contribution}</p>
            </Card>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
