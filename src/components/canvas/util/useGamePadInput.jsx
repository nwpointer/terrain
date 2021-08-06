import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { useGamepads } from 'react-gamepads'

export function useGamePadInput(
  controls = {
    index: '0',
    axes: {
      0: { field: 'x', value: 1, threshold: 0.1 },
      1: { field: 'z', value: 1, threshold: 0.1 },
      2: { field: 'h', value: 1, threshold: 0.2 },
      3: { field: 'v', value: 1, threshold: 0.2 },
    },
  },
  cb
) {
  const init = { x: 0, y: 0, z: 0, v: 0, h: 0 }
  const gamepads = useRef()
  useGamepads((gp) => {
    gamepads.current = gp
  })

  useFrame((_, dt) => {
    let state = { ...init, dt }
    if (gamepads.current && gamepads.current[controls.index]) {
      const gamepad = gamepads.current[controls.index]
      for (const [key, { field, value, threshold }] of Object.entries(
        controls.axes
      )) {
        if (Math.abs(gamepad.axes[key]) > threshold) {
          state[field] =
            gamepad.axes[key] * Math.abs(gamepad.axes[key] * 10) * value
        }
      }
    }
    if (cb) cb(state)
  })
}
