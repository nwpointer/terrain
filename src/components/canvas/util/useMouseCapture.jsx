import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'

export function useMouseCapture() {
  const {
    gl: { domElement },
  } = useThree()

  const mouse = useRef({ x: 0, y: 0, dh: 0, dv: 0, captured: false })
  const last = useRef({ x: 0, y: 0 })

  useFrame(() => {
    mouse.current.dh = mouse.current.x - last.current.x
    mouse.current.dv = mouse.current.y - last.current.y
    last.current.x = mouse.current.x
    last.current.y = mouse.current.y
  })

  useEffect(() => {
    const capturePointer = () => {
      if (mouse.current.captured == false) {
        domElement.requestPointerLock()
        mouse.current.captured = true
      }
    }
    const watchCaptureState = () => {
      mouse.current.captured = document.pointerLockElement == domElement
      console.log(mouse.current.captured)
    }

    const watchMouse = (e) => {
      mouse.current.x += e.movementX
      mouse.current.y += e.movementY
    }

    document.addEventListener('pointerdown', capturePointer)
    document.addEventListener('pointermove', watchMouse)
    document.addEventListener('pointerlockchange', watchCaptureState)
    return () => {
      if (document.exitPointerLock) document.exitPointerLock()
      document.removeEventListener('pointerdown', capturePointer)
      document.removeEventListener('pointermove', watchMouse)
      document.removeEventListener('pointerlockchange', watchCaptureState)
    }
  }, [domElement])

  return mouse
}
