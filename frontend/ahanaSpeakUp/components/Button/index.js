import React from 'react'

export function Button({ children, buttonStyle, ...rest }) {
  return (
    <button type="button" className={buttonStyle} {...rest}>
      {children}
    </button>
  )
}
