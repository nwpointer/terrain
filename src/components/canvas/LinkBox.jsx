import useStore from '@/helpers/store'
import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'

const BoxComponent = ({ route }) => {
  const router = useStore((s) => s.router)
  // This reference will give us direct access to the THREE.Mesh object
  const mesh = useRef()
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  // useFrame((state, delta) =>
  //   mesh.current
  //     ? (mesh.current.rotation.y = mesh.current.rotation.x += 0.01)
  //     : null
  // )
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      ref={mesh}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
      onClick={() => {
        router.push(route)
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial
        color={hovered ? 'hotpink' : route === '/' ? 'darkgrey' : 'orange'}
      />
    </mesh>
  )
}
export default BoxComponent
