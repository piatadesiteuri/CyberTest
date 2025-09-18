import React from 'react'

interface CyberTrainingProps {
  className?: string
  size?: number
}

export default function CyberTraining({ className = '', size = 24 }: CyberTrainingProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <rect
        x="2"
        y="3"
        width="20"
        height="14"
        rx="2"
        ry="2"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8 21L12 17L16 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="3" fill="currentColor" fillOpacity="0.2" />
      <path
        d="M10 8L12 10L14 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 6H18M6 14H18"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  )
}
