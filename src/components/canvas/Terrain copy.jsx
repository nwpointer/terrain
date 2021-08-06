import useStore from '@/helpers/store'
import { useLoader } from '@react-three/fiber'
import { Suspense } from 'react'
import { BackSide, DoubleSide, TextureLoader } from 'three'
import { Plane, OrbitControls, Sky } from '@react-three/drei'

export default function f() {
  return (
    <Suspense>
      <pointLight intensity={2} position={[7, 5, 1]} />
      <fog attach='fog' args={['white', 0, 26]} />
      <ambientLight />
      <Sky sunPosition={[7, 5, 1]} />
      <Terrain />
    </Suspense>
  )
}

function Terrain() {
  const colors = useLoader(TextureLoader, '/island/color.png')
  const normals = useLoader(TextureLoader, '/island/normal.png')
  const height = useLoader(TextureLoader, '/island/displacement.png')
  return (
    <Plane
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -3, 0]}
      args={[640, 640, 1024, 1024]}
    >
      <meshStandardMaterial
        attach='material'
        color='white'
        map={colors}
        displacementBias={2.5}
        displacementScale={10}
        metalness={0}
        roughness={1}
        normalMap={normals}
        no
        displacementMap={height}
      />
    </Plane>
  )
}
