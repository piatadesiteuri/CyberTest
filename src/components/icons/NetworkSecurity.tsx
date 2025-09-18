import React from 'react'

interface NetworkSecurityProps {
  className?: string
  size?: number
}

export default function NetworkSecurity({ className = '', size = 24 }: NetworkSecurityProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="6" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <path
        d="M8 8L16 16M16 8L8 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M2 2L22 22M2 22L22 2"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.3"
      />
    </svg>
  )
}
