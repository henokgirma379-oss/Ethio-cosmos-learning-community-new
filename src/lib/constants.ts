/**
 * Shared constants across the application
 */

export const FALLBACK_TOPIC_IMAGES: Record<string, string> = {
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

export const CTA_IMAGES = {
  cosmos: '/cta_cosmos.svg',
  stargazer: '/hero_stargazer.svg',
}

/**
 * Get image URL for a topic, with fallback
 */
export function getTopicImage(imageUrl: string | null | undefined, topicSlug: string): string {
  return imageUrl || FALLBACK_TOPIC_IMAGES[topicSlug] || FALLBACK_TOPIC_IMAGES.fundamentals
}

/**
 * Navigation links used across pages
 */
export const PRIMARY_NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Learning', path: '/learning' },
  { label: 'Materials', path: '/materials' },
  { label: 'Chat', path: '/chat' },
  { label: 'About', path: '/about' },
]

export const AUTHORIZED_ADMIN_EMAIL = 'henokgirma379@gmail.com'
