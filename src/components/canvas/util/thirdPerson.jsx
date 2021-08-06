import { useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

export function thirdPerson(useInput, controls, body, api) {
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3())
  const rot = useRef(new THREE.Euler(0))
  useInput(controls, ({ x, y, z, h, v, dt }) => {
    const dir = new THREE.Vector3(x, y, z).normalize().multiplyScalar(dt)

    var axis = new THREE.Vector3(0, 1, 0)
    var angle = body.current.rotation.y

    dir.applyAxisAngle(axis, angle)

    // console.log(body)

    if (body.current) {
      rot.current.y -= (Math.PI * dt * h) / 20
      rot.current.x -= (Math.PI * dt * v) / 20

      // if moving lerp the character towards the direction of movement
      if (dir.length()) {
        const a = body.current.rotation.y
        const b = rot.current.y
        body.current.rotation.y = lerp(a, b, 1.0 - Math.pow(0.02, dt * 2))

        if (api) {
          api.rotation.set(...body.current.rotation.toArray())
        }
      }

      const idealOffset = calculateIdealOffset(body.current, rot.current)
      const idealTarget = calculateIdealTarget(body.current, rot.current)
      const t = 1.0 - Math.pow(0.005, dt * 2)

      target.current.lerp(idealTarget, t)

      // console.log({ idealTarget })

      camera.position.lerp(idealOffset, t)
      camera.lookAt(target.current)
    }
  })
}

export function calculateIdealOffset(mesh, rot) {
  const idealOffset = new THREE.Vector3(0.5, 2, 5)
  const r = rot || mesh.rotation
  idealOffset.applyEuler(new THREE.Euler(0, r.y, 0))
  idealOffset.add(mesh.position)
  // don't go under floor
  idealOffset.y = Math.max(r.x * 2 + idealOffset.y, mesh.position.y)

  return idealOffset
}

export function calculateIdealTarget(mesh, rot) {
  const idealOffset = new THREE.Vector3(1, 2, -3)
  const r = rot || mesh.rotation
  idealOffset.applyEuler(new THREE.Euler(0, r.y, 0))
  idealOffset.add(mesh.position)
  // look up when on floor
  if (r.x * 2 < mesh.position.y) {
    idealOffset.y -= r.x * 2
  }
  return idealOffset
}

export const lerp = (x, y, a) => x * (1 - a) + y * a
const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a))
const invlerp = (x, y, a) => clamp((a - x) / (y - x))
const range = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a))
