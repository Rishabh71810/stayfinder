import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

const LoadingSpinner = ({ 
  size = 'md', 
  className = '', 
  text = 'Loading...',
  showText = false,
  variant = 'primary' 
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const variantClasses = {
    primary: 'text-primary-600',
    white: 'text-white',
    gray: 'text-gray-600'
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div className="relative">
        {/* Main spinner */}
        <Loader2 className={cn(
          'animate-spin',
          sizeClasses[size],
          variantClasses[variant]
        )} />
        
        {/* Gradient glow effect */}
        <div className={cn(
          'absolute inset-0 animate-pulse opacity-20',
          sizeClasses[size],
          'bg-gradient-to-r from-primary-400 to-primary-600 rounded-full blur-sm'
        )} />
      </div>
      
      {showText && (
        <div className="text-center animate-pulse">
          <p className={cn(
            'font-medium bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent',
            textSizeClasses[size]
          )}>
            {text}
          </p>
        </div>
      )}
    </div>
  )
}

export default LoadingSpinner 