import { useThree } from '@react-three/fiber'
import { Box } from '@react-three/drei'
import * as THREE from 'three'
import { useSphere } from '@react-three/cannon'

export function Player({
  useInput,
  useCamera = () => {},
  position = [0, 4, 0],
  color = 'red',
  controls,
  speed = 1,
}) {
  // const box = React.useRef()

  const [ref, api] = useSphere(() => ({
    mass: 1,
    // args: [1, 1, 1],
    args: 1,
    fixedRotation: true,
    // velocity: [1, 1, 0],
    // type: 'Kinematic',
    position,
  }))

  useCamera(useInput, controls, ref, api)

  useInput(controls, ({ x, y, z, dt }) => {
    const dir = new THREE.Vector3(x, y, z)
      .normalize()
      .multiplyScalar(speed * dt)

    var axis = new THREE.Vector3(0, 1, 0)
    var angle = ref.current.rotation.y
    dir.applyAxisAngle(axis, angle)

    if (ref.current) {
      const p = ref.current.position.add(dir)
      // if (api) {
      //   api.velocity.x = 100
      //   api.velocity.z = 100

      // }
      // const c = api
      // ref.current.position.x += dir.x
      // ref.current.position.y += dir.y
      // if (api) {
      //   api.position.set(p.x, p.y, p.z)
      // }
    }
  })

  return (
    <Box
      ref={ref}
      castShadow
      receiveShadow
      args={[1, 1, 1]}
      position={position}
    >
      <meshPhongMaterial color={color} attach='material' />
    </Box>
  )
}
