import { ReactNode } from 'react'
import { cn, getDifficultyStyles } from '../lib/designSystem'

type BadgeVariant = 'default' | 'teal' | 'gold' | 'purple' | 'difficulty'
type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode
  variant?: BadgeVariant
  difficulty?: DifficultyLevel
  size?: 'sm' | 'md'
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-white/10 text-white border-white/20',
  teal: 'bg-teal/10 text-teal border-teal/30',
  gold: 'bg-gold/10 text-gold border-gold/30',
  purple: 'bg-cosmos-purple/10 text-cosmos-purple border-cosmos-purple/30',
  difficulty: '', // Will be set dynamically
}

const sizeStyles = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1 text-xs',
}

export default function Badge({
  children,
  variant = 'default',
  difficulty,
  size = 'md',
  className,
  ...props
}: BadgeProps) {
  const baseClass = 'inline-flex items-center rounded-full border font-semibold'
  
  let variantClass = variantStyles[variant]
  if (variant === 'difficulty' && difficulty) {
    variantClass = getDifficultyStyles(difficulty)
  }

  const content = children || (variant === 'difficulty' && difficulty ? difficulty : '')

  return (
    <span
      className={cn(
        baseClass,
        variantClass,
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {content}
    </span>
  )
}
