import { useRef, useEffect } from 'react'

export function useKeyPress(targetKeys) {
  const keys = useRef({})
  const pressed = (key) => keys.current[key]

  function downHandler({ key }) {
    if (targetKeys.includes(key)) {
      keys.current[key] = true
    }
  }

  const upHandler = ({ key }) => {
    if (targetKeys.includes(key)) {
      keys.current[key] = false
    }
  }
  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, [])

  return pressed
}
