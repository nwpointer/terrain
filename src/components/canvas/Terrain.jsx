import useStore from '@/helpers/store'
import { useLoader } from '@react-three/fiber'
import { Suspense, useEffect, useRef } from 'react'
import { BackSide, TextureLoader } from 'three'
import { Plane, OrbitControls, Sky, Stars } from '@react-three/drei'
import pixels from 'image-pixels'
import { scaleLinear } from 'd3-scale'
import * as CANNON from 'cannon-es'
import { Skybox } from './Skybox'

export default function f() {
  return (
    <Suspense>
      <pointLight intensity={0.5} position={[7, 5, 1]} />
      <fog attach='fog' args={['#c9f1fa', 0, 800]} />
      {/* <fog attach='fog' args={['white', 0, 800]} /> */}
      <ambientLight intensity={0.5} />
      {/* <Sky sunPosition={[7, 5, 1]} /> */}
      {/* <Stars /> */}
      <Terrain />
      <Skybox />
    </Suspense>
  )
}

function Terrain() {
  const colors = useLoader(TextureLoader, '/highlands/colormap.png')
  const normals = useLoader(TextureLoader, '/highlands/normalmap.png')
  const height = useLoader(TextureLoader, '/highlands/heightmap-y.jpg')
  const plane = useRef()

  useEffect(() => {
    async function getPixels() {
      const { data, width, height } = await pixels('/highlands/heightmap-y.jpg')
      console.log(data, width, height)

      var y = scaleLinear().domain([0, 255]).range([0, 80])
      const matrix = []
      for (var i = 0; i < width; i++) {
        matrix[i] = []
        for (var j = 0; j < height; j++) {
          matrix[i].push(y(data[(i * j + j) * 4]))
        }
      }
      console.log(matrix)
      console.log(new CANNON.Heightfield(matrix, { elementSize: 1 }))
      // CANNON.Heightfield(matrix, { elementSize: 1 })
      // console.log()
    }
    getPixels()
  })

  // useEffect(() => {
  //   console.log(plane.current)
  // }, [plane.current])
  return (
    <>
      <Plane
        ref={plane}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -3, 0]}
        args={[640, 640, 1024, 1024]}
      >
        <meshStandardMaterial
          attach='material'
          color='white'
          map={colors}
          // displacementBias={-55}
          displacementScale={80}
          // metalness={0.2}
          // normalMap={normals}
          displacementMap={height}
        />
      </Plane>
    </>
  )
}
