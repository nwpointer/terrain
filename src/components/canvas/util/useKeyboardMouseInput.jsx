import { useFrame } from '@react-three/fiber'
import { useKeyPress } from './useKeyPress'
import { useMouseCapture } from './useMouseCapture'

export function useKeyboardMouseInput(
  controls = {
    buttons: {
      a: { field: 'x', value: -1 },
      d: { field: 'x', value: 1 },
      w: { field: 'z', value: -1 },
      s: { field: 'z', value: 1 },
    },
    mouse: {
      dh: { field: 'h', value: 1 },
      dv: { field: 'v', value: 1 },
    },
  },
  cb
) {
  const init = { x: 0, y: 0, z: 0, v: 0, h: 0 }
  const pressed = useKeyPress(Object.keys(controls.buttons))
  const mouse = useMouseCapture()

  useFrame((_, dt) => {
    let state = { ...init, dt }
    for (const [key, { field, value }] of Object.entries(controls.buttons)) {
      if (pressed(key)) state[field] = value
    }
    if (mouse.current.captured) {
      for (const [key, { field, value }] of Object.entries(controls.mouse)) {
        state[field] = mouse.current[key]
      }
    }
    if (cb) cb(state)
  })
}
