import type { PageContent } from '../types'

export interface HomeContentValues {
  eyebrow: string
  title: string
  subtitle: string
  intro: string
  primaryCtaLabel: string
  primaryCtaPath: string
  secondaryCtaLabel: string
  secondaryCtaPath: string
  featuresTitle: string
  featuresDescription: string
  featuredTopicsTitle: string
  featuredTopicsDescription: string
}

export const HOME_CONTENT_SECTIONS = {
  eyebrow: 'hero-eyebrow',
  title: 'hero-title',
  subtitle: 'hero-subtitle',
  intro: 'hero-intro',
  primaryCtaLabel: 'hero-primary-cta-label',
  primaryCtaPath: 'hero-primary-cta-path',
  secondaryCtaLabel: 'hero-secondary-cta-label',
  secondaryCtaPath: 'hero-secondary-cta-path',
  featuresTitle: 'features-title',
  featuresDescription: 'features-description',
  featuredTopicsTitle: 'featured-topics-title',
  featuredTopicsDescription: 'featured-topics-description',
} as const

export const fallbackHomeContent: HomeContentValues = {
  eyebrow: 'EthioCosmos Learning Community',
  title: 'Explore the Universe with clarity, wonder, and community.',
  subtitle: 'A welcoming astronomy learning platform built for curious minds across Ethiopia and beyond.',
  intro: 'Learn astronomy through guided topics, practical materials, and a vibrant Ethiopian-centered learning journey built for curious minds.',
  primaryCtaLabel: 'Start Learning',
  primaryCtaPath: '/learning',
  secondaryCtaLabel: 'Browse Materials',
  secondaryCtaPath: '/materials',
  featuresTitle: 'Why learners choose EthioCosmos',
  featuresDescription: 'A clean learning experience first — ready for future visual theming without breaking structure.',
  featuredTopicsTitle: 'Featured Topics',
  featuredTopicsDescription: 'Start with three popular astronomy pathways designed for beginners and growing explorers.',
}

export function mapHomeContentRows(rows: PageContent[] | null | undefined): HomeContentValues {
  const rowMap = new Map((rows ?? []).map((row) => [row.section, row.content?.trim() ?? '']))

  const getValue = (section: string, fallback: string) => {
    const value = rowMap.get(section)
    return value && value.length > 0 ? value : fallback
  }

  return {
    eyebrow: getValue(HOME_CONTENT_SECTIONS.eyebrow, fallbackHomeContent.eyebrow),
    title: getValue(HOME_CONTENT_SECTIONS.title, fallbackHomeContent.title),
    subtitle: getValue(HOME_CONTENT_SECTIONS.subtitle, fallbackHomeContent.subtitle),
    intro: getValue(HOME_CONTENT_SECTIONS.intro, fallbackHomeContent.intro),
    primaryCtaLabel: getValue(HOME_CONTENT_SECTIONS.primaryCtaLabel, fallbackHomeContent.primaryCtaLabel),
    primaryCtaPath: getValue(HOME_CONTENT_SECTIONS.primaryCtaPath, fallbackHomeContent.primaryCtaPath),
    secondaryCtaLabel: getValue(HOME_CONTENT_SECTIONS.secondaryCtaLabel, fallbackHomeContent.secondaryCtaLabel),
    secondaryCtaPath: getValue(HOME_CONTENT_SECTIONS.secondaryCtaPath, fallbackHomeContent.secondaryCtaPath),
    featuresTitle: getValue(HOME_CONTENT_SECTIONS.featuresTitle, fallbackHomeContent.featuresTitle),
    featuresDescription: getValue(HOME_CONTENT_SECTIONS.featuresDescription, fallbackHomeContent.featuresDescription),
    featuredTopicsTitle: getValue(HOME_CONTENT_SECTIONS.featuredTopicsTitle, fallbackHomeContent.featuredTopicsTitle),
    featuredTopicsDescription: getValue(HOME_CONTENT_SECTIONS.featuredTopicsDescription, fallbackHomeContent.featuredTopicsDescription),
  }
}
