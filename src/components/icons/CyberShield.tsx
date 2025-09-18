import React from 'react'

interface CyberShieldProps {
  className?: string
  size?: number
}

export default function CyberShield({ className = '', size = 24 }: CyberShieldProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M12 2L4 6V12C4 16.55 6.84 20.74 12 22C17.16 20.74 20 16.55 20 12V6L12 2Z"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 12L11 14L15 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="8" r="2" fill="currentColor" />
    </svg>
  )
}
