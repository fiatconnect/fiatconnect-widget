import * as React from 'react'

function ErrorIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={100}
      height={100}
      fill="none"
    >
      <g clipPath="url(#a)">
        <path
          fill="#FF7E7E"
          d="M50 100A50 50 0 1 0 50 0a50 50 0 0 0 0 100Zm0-75a4.676 4.676 0 0 1 4.688 4.688v21.875A4.676 4.676 0 0 1 50 56.25a4.676 4.676 0 0 1-4.688-4.688V29.689A4.676 4.676 0 0 1 50 25Zm-6.25 43.75a6.25 6.25 0 1 1 12.5 0 6.25 6.25 0 0 1-12.5 0Z"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h100v100H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}
export default ErrorIcon
