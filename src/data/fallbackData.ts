import type { Lesson, Material, PageContent, Topic, Article, Scientist, Resource } from '../types'

export const fallbackTopics: Topic[] = [
  {
    id: '1',
    slug: 'fundamentals',
    title: 'Fundamentals of Astronomy',
    description: 'Core concepts of astronomy, observations, light, distance, and the structure of the sky.',
    difficulty: 'Beginner',
    lesson_count: 12,
    icon: '✨',
    color_accent: '#00c8c8',
    order_index: 1,
  },
  {
    id: '2',
    slug: 'ethiopia',
    title: 'Astronomy & Ethiopia',
    description: 'Explore Ethiopian astronomy heritage, indigenous knowledge, and African sky culture.',
    difficulty: 'Beginner',
    lesson_count: 8,
    icon: '🇪🇹',
    color_accent: '#f5c542',
    order_index: 2,
  },
  {
    id: '3',
    slug: 'solar-system',
    title: 'Solar System',
    description: 'Learn about the Sun, planets, moons, and the dynamic structure of our home system.',
    difficulty: 'Beginner',
    lesson_count: 15,
    icon: '☀️',
    color_accent: '#00c8c8',
    order_index: 3,
  },
  {
    id: '4',
    slug: 'planets',
    title: 'Planets',
    description: 'A deeper dive into rocky worlds, gas giants, atmospheres, and planetary science.',
    difficulty: 'Beginner',
    lesson_count: 10,
    icon: '🪐',
    color_accent: '#00c8c8',
    order_index: 4,
  },
  {
    id: '5',
    slug: 'moon',
    title: 'Moon',
    description: 'Understand lunar phases, eclipses, the lunar surface, and the Moon’s effect on Earth.',
    difficulty: 'Beginner',
    lesson_count: 9,
    icon: '🌙',
    color_accent: '#f5c542',
    order_index: 5,
  },
  {
    id: '6',
    slug: 'stars',
    title: 'Stars',
    description: 'Stellar birth, fusion, classification, and the life cycles of stars across the cosmos.',
    difficulty: 'Intermediate',
    lesson_count: 14,
    icon: '⭐',
    color_accent: '#f5c542',
    order_index: 6,
  },
  {
    id: '7',
    slug: 'black-holes',
    title: 'Black Holes',
    description: 'Gravity, spacetime, singularities, event horizons, and the science of the invisible.',
    difficulty: 'Advanced',
    lesson_count: 11,
    icon: '🕳️',
    color_accent: '#7c5cbf',
    order_index: 7,
  },
  {
    id: '8',
    slug: 'wormholes',
    title: 'Wormholes',
    description: 'Investigate theoretical tunnels through spacetime and the mathematics behind them.',
    difficulty: 'Advanced',
    lesson_count: 7,
    icon: '🌀',
    color_accent: '#7c5cbf',
    order_index: 8,
  },
  {
    id: '9',
    slug: 'nebulae',
    title: 'Nebulae',
    description: 'Discover stellar nurseries, gas clouds, supernova remnants, and cosmic color.',
    difficulty: 'Intermediate',
    lesson_count: 10,
    icon: '🌌',
    color_accent: '#f5c542',
    order_index: 9,
  },
  {
    id: '10',
    slug: 'asteroids',
    title: 'Asteroids',
    description: 'Understand minor bodies, asteroid belts, near-Earth objects, and orbital dynamics.',
    difficulty: 'Intermediate',
    lesson_count: 8,
    icon: '☄️',
    color_accent: '#f5c542',
    order_index: 10,
  },
]

export const fallbackLessons: Lesson[] = fallbackTopics.flatMap((topic, topicIndex) =>
  [
    {
      id: `${topic.id}-1`,
      topic_id: topic.id,
      slug: 'introduction',
      title: `Introduction to ${topic.title}`,
      content: `# Introduction to ${topic.title}\n\nThis lesson introduces the big ideas, vocabulary, and scientific perspective behind ${topic.title}. It is written for Ethiopian and African learners seeking a confident starting point in astronomy.\n\n## What you will learn\n- Core terminology\n- Why this topic matters in astronomy\n- How this idea connects to observation and exploration\n\n## Ethiopian context\nThe night sky over Ethiopia provides remarkable opportunities for observation due to altitude, dark-sky conditions in many regions, and rich traditions of sky awareness.\n\n## Reflection\nWhat questions does ${topic.title.toLowerCase()} raise for you about the universe?`,
      order_index: 1,
      duration_minutes: 10 + topicIndex,
    },
    {
      id: `${topic.id}-2`,
      topic_id: topic.id,
      slug: 'observation-and-application',
      title: `${topic.title}: Observation & Application`,
      content: `# ${topic.title}: Observation & Application\n\nThis lesson moves from theory to practice. Learners explore how astronomers observe, measure, and interpret evidence related to ${topic.title.toLowerCase()}.\n\n## Observation\nObservation begins with careful noticing: light, movement, brightness, timing, and comparison.\n\n## Application\nYou can apply this knowledge during stargazing sessions, classroom study, club discussions, and independent research.\n\n## Next steps\nContinue by comparing this topic with others in the learning pathway and noting recurring scientific patterns.`,
      order_index: 2,
      duration_minutes: 14 + topicIndex,
    },
  ],
)

export const fallbackAboutContent: Record<string, PageContent[]> = {
  mission: [
    {
      id: 1,
      page: 'about',
      section: 'mission',
      content_type: 'text',
      content:
        'Ethio-Cosmos exists to inspire curiosity, build astronomical literacy, and make high-quality space education more accessible to Ethiopian and African learners through a welcoming digital community.',
      image_url: null,
      updated_at: new Date().toISOString(),
    },
  ],
  'who-we-are': [
    {
      id: 2,
      page: 'about',
      section: 'who-we-are',
      content_type: 'text',
      content:
        'We are a learning-focused astronomy community connecting students, hobbyists, educators, and dreamers who want to explore the universe together from an African perspective.',
      image_url: null,
      updated_at: new Date().toISOString(),
    },
  ],
}

const svgDataUri = (label: string, colors: { start: string; end: string; accent: string }) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${colors.start}" />
        <stop offset="100%" stop-color="${colors.end}" />
      </linearGradient>
    </defs>
    <rect width="1200" height="800" fill="url(#bg)" />
    <circle cx="950" cy="140" r="90" fill="${colors.accent}" fill-opacity="0.35" />
    <circle cx="240" cy="600" r="130" fill="#ffffff" fill-opacity="0.08" />
    <circle cx="540" cy="260" r="6" fill="#ffffff" />
    <circle cx="690" cy="320" r="4" fill="#ffffff" />
    <circle cx="740" cy="160" r="3" fill="#ffffff" />
    <circle cx="210" cy="210" r="5" fill="#ffffff" />
    <text x="80" y="690" fill="#eaf6ff" font-size="72" font-family="Arial, sans-serif" font-weight="700">${label}</text>
    <text x="80" y="748" fill="#9ccfe0" font-size="30" font-family="Arial, sans-serif">Ethio-Cosmos Learning Community</text>
  </svg>`

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export const fallbackMaterials: Material[] = [
  {
    id: 'm1',
    type: 'image',
    title: 'Nebula Concept Art',
    url: svgDataUri('Nebula Concept Art', { start: '#050a1a', end: '#1c2d5b', accent: '#7c5cbf' }),
    thumbnail_url: svgDataUri('Nebula Concept Art', { start: '#050a1a', end: '#1c2d5b', accent: '#7c5cbf' }),
    created_at: new Date().toISOString(),
  },
  {
    id: 'm2',
    type: 'image',
    title: 'Moon Observation Concept',
    url: svgDataUri('Moon Observation Concept', { start: '#0a1628', end: '#223a6b', accent: '#f5c542' }),
    thumbnail_url: svgDataUri('Moon Observation Concept', { start: '#0a1628', end: '#223a6b', accent: '#f5c542' }),
    created_at: new Date().toISOString(),
  },
  {
    id: 'm3',
    type: 'image',
    title: 'Starscape Study Visual',
    url: svgDataUri('Starscape Study Visual', { start: '#050a1a', end: '#153047', accent: '#00c8c8' }),
    thumbnail_url: svgDataUri('Starscape Study Visual', { start: '#050a1a', end: '#153047', accent: '#00c8c8' }),
    created_at: new Date().toISOString(),
  },
  {
    id: 'm4',
    type: 'image',
    title: 'Observatory Illustration',
    url: svgDataUri('Observatory Illustration', { start: '#081120', end: '#2a1d52', accent: '#00c8c8' }),
    thumbnail_url: svgDataUri('Observatory Illustration', { start: '#081120', end: '#2a1d52', accent: '#00c8c8' }),
    created_at: new Date().toISOString(),
  },
  {
    id: 'm5',
    type: 'video',
    title: 'Introduction to Stargazing',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail_url: svgDataUri('Introduction to Stargazing', { start: '#071325', end: '#123f5b', accent: '#00c8c8' }),
    created_at: new Date().toISOString(),
  },
  {
    id: 'm6',
    type: 'pdf',
    title: 'Astronomy Starter Guide',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    thumbnail_url: null,
    created_at: new Date().toISOString(),
  },
]

export const fallbackArticles: Article[] = [
  {
    id: '1',
    title: 'The James Webb Space Telescope: Seeing the Early Universe',
    summary: 'Discover how the JWST is revolutionizing our understanding of the universe\'s earliest galaxies and star formation.',
    content: 'The James Webb Space Telescope represents humanity\'s most ambitious attempt to peer into the depths of space and time. Launched in December 2021, this infrared observatory has already made groundbreaking discoveries about the early universe, detecting galaxies that formed just a few hundred million years after the Big Bang. With its unprecedented infrared sensitivity and advanced instruments, JWST continues to transform our understanding of cosmic history.',
    thumbnail_url: svgDataUri('JWST', { start: '#050a1a', end: '#1c2d5b', accent: '#00c8c8' }),
    category: 'Space Missions',
    author: 'Astronomy Community',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Mars: The Red Planet\'s Secrets',
    summary: 'Explore the geological wonders, potential for life, and ongoing exploration of Mars.',
    content: 'Mars has captivated human imagination for centuries. Once thought to be home to advanced civilizations, we now know it as a dynamic world with a complex geological history. Recent missions have revealed evidence of ancient water, organic compounds, and conditions that might have supported microbial life. The discovery of methane in the Martian atmosphere and subsurface water ice suggests that Mars remains geologically active and potentially habitable.',
    thumbnail_url: svgDataUri('Mars', { start: '#0a1628', end: '#223a6b', accent: '#f5c542' }),
    category: 'Planet Facts',
    author: 'Astronomy Community',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Black Holes: Gateways to Understanding Physics',
    summary: 'Learn about the most mysterious objects in the universe and what they reveal about spacetime.',
    content: 'Black holes are among the most fascinating and mysterious objects in the universe. These regions of spacetime where gravity is so strong that nothing, not even light, can escape, challenge our understanding of physics and the nature of reality itself. Recent observations by the Event Horizon Telescope have provided the first direct images of black holes, confirming predictions made by Einstein\'s theory of general relativity.',
    thumbnail_url: svgDataUri('Black Holes', { start: '#081120', end: '#2a1d52', accent: '#7c5cbf' }),
    category: 'Black Holes and Galaxies',
    author: 'Astronomy Community',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Exoplanets: Worlds Beyond Our Solar System',
    summary: 'Discover the thousands of planets orbiting distant stars and the search for habitable worlds.',
    content: 'Since the first exoplanet discovery in 1995, astronomers have identified over 5,000 planets orbiting stars beyond our solar system. These distant worlds exhibit remarkable diversity, from massive gas giants orbiting close to their stars to potentially habitable Earth-like planets in the habitable zones of their parent stars. The discovery of exoplanets has fundamentally changed our understanding of planetary formation and the prevalence of worlds in the universe.',
    thumbnail_url: svgDataUri('Exoplanets', { start: '#050a1a', end: '#153047', accent: '#00c8c8' }),
    category: 'Space Science News',
    author: 'Astronomy Community',
    created_at: new Date().toISOString(),
  },
]

export const fallbackScientists: Scientist[] = [
  {
    id: '1',
    name: 'Galileo Galilei',
    portrait_url: svgDataUri('Galileo', { start: '#050a1a', end: '#1c2d5b', accent: '#f5c542' }),
    biography: 'Italian astronomer and physicist who made groundbreaking observations with the telescope, including the moons of Jupiter and phases of Venus. His work challenged the geocentric model and supported the heliocentric theory.',
    contribution: 'Pioneered telescopic astronomy and provided observational evidence for the heliocentric model of the solar system.',
    order_index: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Johannes Kepler',
    portrait_url: svgDataUri('Kepler', { start: '#0a1628', end: '#223a6b', accent: '#00c8c8' }),
    biography: 'German mathematician and astronomer who discovered the laws of planetary motion. His work explained how planets orbit the Sun in elliptical paths rather than perfect circles.',
    contribution: 'Formulated Kepler\'s Laws, which describe how planets orbit the Sun and form the foundation of orbital mechanics.',
    order_index: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Isaac Newton',
    portrait_url: svgDataUri('Newton', { start: '#081120', end: '#2a1d52', accent: '#7c5cbf' }),
    biography: 'English mathematician and physicist who revolutionized our understanding of motion and gravity. His laws of motion and universal gravitation explained planetary orbits and celestial mechanics.',
    contribution: 'Developed the law of universal gravitation and laws of motion, explaining planetary orbits and the behavior of celestial bodies.',
    order_index: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Edwin Hubble',
    portrait_url: svgDataUri('Hubble', { start: '#050a1a', end: '#153047', accent: '#00c8c8' }),
    biography: 'American astronomer who proved the existence of galaxies beyond the Milky Way and discovered the expansion of the universe. His observations revolutionized cosmology.',
    contribution: 'Demonstrated that the universe is expanding, leading to the Big Bang theory and modern cosmology.',
    order_index: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Carl Sagan',
    portrait_url: svgDataUri('Sagan', { start: '#0a1628', end: '#223a6b', accent: '#f5c542' }),
    biography: 'American astronomer and science communicator who made astronomy accessible to the general public through books and television. He promoted scientific literacy and the search for extraterrestrial life.',
    contribution: 'Promoted scientific literacy, the search for extraterrestrial life, and made astronomy accessible to millions.',
    order_index: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Vera Rubin',
    portrait_url: svgDataUri('Rubin', { start: '#081120', end: '#2a1d52', accent: '#00c8c8' }),
    biography: 'American astronomer who provided evidence for the existence of dark matter through her observations of galaxy rotation curves. Her work revolutionized our understanding of the universe.',
    contribution: 'Revolutionized our understanding of galaxy dynamics and the composition of the universe through dark matter research.',
    order_index: 6,
    created_at: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Annie Jump Cannon',
    portrait_url: svgDataUri('Cannon', { start: '#050a1a', end: '#153047', accent: '#f5c542' }),
    biography: 'American astronomer who developed the Harvard Classification Scheme for stars. She classified over 350,000 stars and created a system that is still used today.',
    contribution: 'Created the Harvard Classification Scheme for stars, still the standard system for stellar classification.',
    order_index: 7,
    created_at: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Katherine Johnson',
    portrait_url: svgDataUri('Johnson', { start: '#0a1628', end: '#223a6b', accent: '#7c5cbf' }),
    biography: 'American mathematician whose precise calculations were crucial for NASA\'s space missions. She calculated trajectories for spacecraft, including the Apollo missions.',
    contribution: 'Calculated trajectories for spacecraft, including the Apollo missions, advancing human spaceflight.',
    order_index: 8,
    created_at: new Date().toISOString(),
  },
]

export const fallbackResources: Resource[] = [
  {
    id: '1',
    title: 'NightSky Network',
    description: 'A comprehensive guide to observing the night sky with tips for beginners and advanced observers. Includes constellation maps, observing guides, and community events.',
    url: 'https://www.nightskynetwork.org',
    type: 'website',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Cosmos: A Spacetime Odyssey',
    description: 'A modern take on Carl Sagan\'s classic series, exploring the universe and our place in it. Hosted by Neil deGrasse Tyson.',
    url: 'https://www.youtube.com/playlist?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf',
    type: 'video',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Astrophysics for People in a Hurry',
    description: 'A concise introduction to astrophysics by Neil deGrasse Tyson. Perfect for beginners wanting to understand the cosmos.',
    url: 'https://www.example.com/astrophysics-book',
    type: 'book',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Stellarium',
    description: 'Free, open-source planetarium software for your computer. Shows realistic night sky simulations for any location and time.',
    url: 'https://stellarium.org',
    type: 'tool',
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'NASA\'s Official Website',
    description: 'Access to NASA\'s latest discoveries, missions, and educational resources. Stay updated on space exploration.',
    url: 'https://www.nasa.gov',
    type: 'website',
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Hubble Space Telescope Gallery',
    description: 'Stunning images from the Hubble Space Telescope. Explore galaxies, nebulae, and cosmic phenomena.',
    url: 'https://hubblesite.org',
    type: 'website',
    created_at: new Date().toISOString(),
  },
  {
    id: '7',
    title: 'Sky & Telescope Magazine',
    description: 'Leading astronomy magazine with articles, observing guides, and expert advice for astronomers of all levels.',
    url: 'https://www.skyandtelescope.com',
    type: 'website',
    created_at: new Date().toISOString(),
  },
]
