import React from 'react'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  as?: React.ElementType
  className?: string
}

const sizeClasses: Record<NonNullable<ContainerProps['size']>, string> = {
  sm: 'max-w-screen-sm',     // 640px
  md: 'max-w-screen-md',     // 768px
  lg: 'max-w-screen-lg',     // 1024px
  xl: 'max-w-7xl',           // 1280px (Standard for SCNSWF NGO)
  full: 'max-w-none',
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'xl',
  as: Component = 'div',
  className = '',
  ...props
}) => {
  return (
    <Component
      className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Container
