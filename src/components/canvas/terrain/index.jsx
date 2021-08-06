import React from 'react'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import { Plane } from '@react-three/drei'

export default function Terrain(props) {
  const colors = useLoader(TextureLoader, '/highlands/colormap.png')
  const normals = useLoader(TextureLoader, '/highlands/normalmap.png')
  const height = useLoader(TextureLoader, '/highlands/heightmap-y.jpg')
  const { elementSize, heights, position, rotation, ...rest } = props

  return (
    <Plane
      // position={[102.4 / 2 - 10, 0, -102.4 / 2]}
      rotation-x={-Math.PI / 2}
      args={[1024, 1024, 1024, 1024]}
      userData={{ terrain: true }}
    >
      <meshStandardMaterial
        attach='material'
        color='white'
        map={colors}
        displacementBias={0}
        displacementScale={20 * 5}
        // metalness={0.2}
        // normalMap={normals}
        displacementMap={height}
      />
    </Plane>
  )
}
