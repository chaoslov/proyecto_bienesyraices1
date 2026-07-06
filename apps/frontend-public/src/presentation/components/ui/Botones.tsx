import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'danger' | 'ghost'
  size?: 'pq' | 'md' | 'grd'
  loading?: boolean
  children: ReactNode
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants = {
    primary: 'bg-[#2C3E50] text-white hover:bg-[#1A252F] focus:ring-[#2C3E50]',
    outline: 'border-2 border-[#2C3E50] text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white focus:ring-[#2C3E50]',
    danger: 'bg-[#C47B4A] text-white hover:bg-[#A8653A] focus:ring-[#C47B4A]',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-400',
  }

  const sizes = {
    pq: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    grd: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${loading || disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          Cargando...
        </span>
      ) : (
        children
      )}
    </button>
  )
}