import { ReactNode } from 'react'
import { cn } from '../lib/designSystem'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  description?: string
  children?: ReactNode
  align?: 'left' | 'center'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeStyles = {
  sm: {
    title: 'text-2xl sm:text-3xl',
    subtitle: 'text-xs uppercase tracking-[0.35em]',
    description: 'text-base',
  },
  md: {
    title: 'text-3xl sm:text-4xl',
    subtitle: 'text-sm uppercase tracking-widest',
    description: 'text-lg',
  },
  lg: {
    title: 'text-4xl sm:text-5xl lg:text-6xl',
    subtitle: 'text-sm uppercase tracking-[0.35em]',
    description: 'text-xl',
  },
}

export default function SectionHeader({
  title,
  subtitle,
  description,
  children,
  align = 'left',
  size = 'md',
  className,
}: SectionHeaderProps) {
  const styles = sizeStyles[size]
  const alignClass = align === 'center' ? 'text-center' : 'text-left'

  return (
    <div className={cn('mb-10', alignClass, className)}>
      {subtitle && (
        <p className={cn('font-semibold text-teal', styles.subtitle)}>
          {subtitle}
        </p>
      )}
      <h2 className={cn('font-display font-black text-white mt-2', styles.title)}>
        {title}
      </h2>
      {description && (
        <p className={cn('mt-4 max-w-3xl text-slate-300', styles.description)}>
          {description}
        </p>
      )}
      {children}
    </div>
  )
}
