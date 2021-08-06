import React from 'react'
import { useLoader } from '@react-three/fiber'
import { useHeightfield } from '@react-three/cannon'
import { TextureLoader } from 'three'
import { Plane } from '@react-three/drei'
import { HeightmapGeometry } from './HeightmapGeometry'

export function DrawHeightfield(props) {
  const colors = useLoader(TextureLoader, '/highlands/colormap.png')
  const normals = useLoader(TextureLoader, '/highlands/normalmap.png')
  const height = useLoader(TextureLoader, '/highlands/heightmap-y.jpg')
  const { elementSize, heights, position, rotation, ...rest } = props
  const [ref] = useHeightfield(() => ({
    args: [
      heights,
      {
        elementSize,
      },
    ],
    position,
    rotation,
  }))

  // return null
  const scale = 10

  return (
    <group
      position={[102.4 / 2 - 10, 0, -102.4 / 2]}
      rotation={[0, Math.PI / 2, 0]}
    >
      <Plane
        ref={ref}
        // rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        args={[102.4, 102.4, 1024, 1024]}
      >
        <meshStandardMaterial
          attach='material'
          color='white'
          map={colors}
          displacementBias={0}
          displacementScale={20}
          // metalness={0.2}
          // normalMap={normals}
          displacementMap={height}
        />
      </Plane>
    </group>
  )

  return (
    <mesh ref={ref} castShadow receiveShadow {...rest}>
      <meshPhongMaterial map={colors} />
      <HeightmapGeometry heights={heights} elementSize={elementSize} />
    </mesh>
  )
}
