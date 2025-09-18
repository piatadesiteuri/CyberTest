import React from 'react'

interface CyberBellProps {
  className?: string
  size?: number
}

export default function CyberBell({ className = '', size = 24 }: CyberBellProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M18 8A6 6 0 0 0 6 8C6 7 6 6 6 5C6 3 7 2 9 2H15C17 2 18 3 18 5C18 6 18 7 18 8Z"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 2C10 1 10 0 10 0H14C14 0 14 1 14 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M18 8V14C18 15 18 16 18 17C18 18 17 19 16 19H8C7 19 6 18 6 17C6 16 6 15 6 14V8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="6" r="3" fill="currentColor" fillOpacity="0.2" />
      <path
        d="M18 4V8M16 6H20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
