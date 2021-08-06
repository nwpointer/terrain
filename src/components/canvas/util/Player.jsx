import { useLoader, useThree } from '@react-three/fiber'
import { Box } from '@react-three/drei'
import * as THREE from 'three'
import { uniqWith } from 'lodash'
import { useMemo } from 'react'
import { scaleLinear } from 'd3-scale'
import { getWorldSize } from '../terrain/worldCreator'

function useImageSample(src) {
  const height = useLoader(THREE.ImageLoader, src)

  const canvas = useMemo(() => {
    var img = height
    var canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height)
    return canvas
  })

  const sample = (x, y) => canvas.getContext('2d').getImageData(x, y, 1, 1).data

  return sample
}

function useMapHeight(world) {
  const { heightMap, resolution, height, ratio } = getWorldSize(world)
  const sample = useImageSample(heightMap)

  const width = resolution.x
  const length = resolution.y
  const translateX = scaleLinear()
    .domain([-width / 2, width / 2])
    .range([0, width])
  const translateY = scaleLinear()
    .domain([-length / 2, length / 2])
    .range([0, length])

  const positionToPixel = (x, y) => {
    return [translateX(x), translateY(y)]
  }

  const pixelToHeight = scaleLinear()
    .domain([0, 255])
    .range([height.min / ratio, height.max / ratio])

  const getMapHeight = (position) => {
    const [x, z] = [position.x, position.z]
    const [a] = sample(...positionToPixel(x, z))
    return pixelToHeight(a)
  }

  return getMapHeight
}

export function Player({
  useInput,
  useCamera = () => {},
  position = [0, 0, 0],
  color = 'red',
  controls,
  speed = 1,
  height = 1,
  world,
}) {
  const box = React.useRef()

  useCamera(useInput, controls, box)
  const getMapHeight = useMapHeight(world)
  // const getMapHeight = () => 100

  useInput(controls, ({ x, y, z, dt }) => {
    const dir = new THREE.Vector3(x, y, z)
      .normalize()
      .multiplyScalar(speed * dt)

    var axis = new THREE.Vector3(0, 1, 0)
    var angle = box.current.rotation.y
    dir.applyAxisAngle(axis, angle)

    if (box.current) {
      box.current.position.add(dir)

      const idealPosition = new THREE.Vector3()
        .copy(box.current.position)
        .setY(getMapHeight(box.current.position) + height / 2)

      box.current.position.lerp(idealPosition, 0.05)
    }
  })

  return (
    <Box
      ref={box}
      castShadow
      receiveShadow
      args={[1, height, 1]}
      position={[
        position[0],
        getMapHeight(new THREE.Vector3(...position)) + height / 2,
        position[2],
      ]}
    >
      <meshPhongMaterial color={color} attach='material' />
    </Box>
  )
}
