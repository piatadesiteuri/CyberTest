import React from 'react'

interface CyberMenuProps {
  className?: string
  size?: number
}

export default function CyberMenu({ className = '', size = 24 }: CyberMenuProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <rect
        x="3"
        y="6"
        width="18"
        height="2"
        rx="1"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="3"
        y="11"
        width="18"
        height="2"
        rx="1"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="3"
        y="16"
        width="18"
        height="2"
        rx="1"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="20" cy="7" r="2" fill="currentColor" fillOpacity="0.2" />
      <circle cx="20" cy="12" r="2" fill="currentColor" fillOpacity="0.2" />
      <circle cx="20" cy="17" r="2" fill="currentColor" fillOpacity="0.2" />
    </svg>
  )
}
