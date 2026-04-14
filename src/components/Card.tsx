import { ReactNode } from 'react'
import { cn } from '../lib/designSystem'

type CardVariant = 'default' | 'light' | 'elevated'
type CardBorderStyle = 'default' | 'teal' | 'gold' | 'accent'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: CardVariant
  borderStyle?: CardBorderStyle
  hoverable?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

const variantStyles: Record<CardVariant, string> = {
  default: 'rounded-3xl border bg-deep-navy/85 shadow-lg shadow-black/20',
  light: 'rounded-3xl border border-slate-200 bg-white shadow-xl shadow-black/10',
  elevated: 'rounded-3xl border bg-navy/60 shadow-md shadow-black/30',
}

const borderStyles: Record<CardBorderStyle, string> = {
  default: 'border-white/10',
  teal: 'border-teal/20',
  gold: 'border-gold/20',
  accent: 'border-white/20',
}

const paddingStyles = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export default function Card({
  children,
  variant = 'default',
  borderStyle = 'default',
  hoverable = false,
  padding = 'md',
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'transition-all duration-300',
        variantStyles[variant],
        borderStyles[borderStyle],
        hoverable && 'hover:border-teal/30 hover:shadow-glow cursor-pointer',
        paddingStyles[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
