import { ReactNode, forwardRef } from 'react'
import { cn } from '../lib/designSystem'

type ButtonVariant = 'primary' | 'secondary' | 'tertiary'
type ButtonSize = 'sm' | 'md' | 'lg'

interface BaseButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  fullWidth?: boolean
  className?: string
}

interface ButtonAsButtonProps extends BaseButtonProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  as?: never
  children: ReactNode
}

interface ButtonAsLinkProps extends BaseButtonProps, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  as: 'a' | typeof import('react-router-dom').Link
  href?: string
  to?: string
  children: ReactNode
}

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-teal text-slate-950 hover:scale-105 hover:brightness-110 active:scale-95',
  secondary: 'border border-white/20 bg-white/5 text-white hover:border-teal/40 hover:text-teal active:bg-white/10',
  tertiary: 'bg-transparent text-teal hover:text-white active:opacity-75',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

const baseClass = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-lg'

// Button component that works as both button and link
const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      className,
      as,
      ...props
    },
    ref,
  ) => {
    const classes = cn(
      baseClass,
      variantStyles[variant],
      sizeStyles[size],
      fullWidth && 'w-full',
      (isLoading) && 'opacity-50 cursor-not-allowed',
      className,
    )

    // If 'as' prop is provided, render as link
    if (as) {
      const Component = as as any
      return (
        <Component ref={ref} className={classes} {...props}>
          {isLoading ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
              Loading...
            </>
          ) : (
            children
          )}
        </Component>
      )
    }

    // Default: render as button
    const buttonProps = props as React.ButtonHTMLAttributes<HTMLButtonElement>
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        disabled={isLoading || buttonProps.disabled}
        {...buttonProps}
      >
        {isLoading ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'

export default Button
