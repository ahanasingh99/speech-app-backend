import React, { createContext, useState, useContext } from 'react'

const ToggleContext = createContext()

export const ToggleProvider = ({ children }) => {
  const [isToggled, setToggled] = useState(false)

  const toggle = () => {
    setToggled((prev) => !prev)
  }

  return (
    <ToggleContext.Provider value={{ isToggled, toggle }}>
      {children}
    </ToggleContext.Provider>
  )
}

export const useToggle = () => {
  const context = useContext(ToggleContext)
  if (!context) {
    throw new Error('useToggle must be used within a ToggleProvider')
  }
  return context
}
