import useStore from '@/helpers/store'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { useGamepads } from 'react-gamepads'

// function useControls({ input, mesh }) {
//   useFrame(() => {
//     // console.log(input)
//     if (mesh) {
//       if (input.right) mesh.current.position.x += 0.01
//     }
//   })
// }

export default function Player() {
  const mesh = useRef()
  const { camera } = useThree()
  // useControls({ input: { right: false }, mesh })

  useGamepads((gamepads) => {
    const [x, z, _, y] = gamepads[0].axes

    mesh.current.position.x += x
    mesh.current.position.z += z
    mesh.current.position.y += y
    camera.position.x += x
    camera.position.z += z
    camera.position.y += y
    camera.lookAt(mesh.current.position)
  })
  return (
    <>
      <mesh ref={mesh} position={[0, 0, 0]}>
        <boxGeometry args={[10, 160, 10]} />
        <meshStandardMaterial color='white' />
      </mesh>
    </>
  )
}
