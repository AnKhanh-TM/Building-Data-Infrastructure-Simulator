import React from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-0.5",
          {
            'bg-brand-600 text-white hover:bg-brand-700 shadow-md hover:shadow-lg': variant === 'primary',
            'bg-slate-200 text-slate-900 hover:bg-slate-300': variant === 'secondary',
            'border-2 border-brand-600 text-brand-600 hover:bg-brand-50': variant === 'outline',
            'hover:bg-slate-100 text-slate-700': variant === 'ghost',
            'h-9 px-4 text-sm': size === 'sm',
            'h-12 px-8 text-base': size === 'md',
            'h-14 px-10 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
