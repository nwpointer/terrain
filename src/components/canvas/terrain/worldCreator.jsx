import React, { useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import { TextureLoader, DoubleSide, RepeatWrapping, Vector2 } from 'three'
import { Plane } from '@react-three/drei'

import splatVert from '../../shaders/splat.vert'
import splatFrag from '../../shaders/splat.frag'

// this component takes a world creator bridge json file and locates the necessary textures to pass to the generic splat texture component
export default function WorldCreatorTerrain({ world, smart = true }) {
  const heightMap = useLoader(TextureLoader, world.heightMap)
  const color = useLoader(TextureLoader, world.colorMap)
  const { width, length, resolution, height, ratio } = getWorldSize(world)

  const splats = [
    useLoader(TextureLoader, '/maps/CustomTerrainShape/splatmap_01.png'),
    useLoader(TextureLoader, '/maps/CustomTerrainShape/splatmap_02.png'),
    useLoader(TextureLoader, '/maps/CustomTerrainShape/splatmap_03.png'),
    useLoader(TextureLoader, '/maps/CustomTerrainShape/splatmap_04.png'),
    useLoader(TextureLoader, '/maps/CustomTerrainShape/splatmap_05.png'),
    useLoader(TextureLoader, '/maps/CustomTerrainShape/splatmap_06.png'),
  ]

  const textureInfo = [
    ...world.Texturing.SplatTexture[0].TextureInfo,
    ...world.Texturing.SplatTexture[1].TextureInfo,
  ]

  const diffuse = textureInfo.map((info) => {
    // const texture = useLoader(TextureLoader, info.Diffuse)
    // texture.wrapT = RepeatWrapping
    // texture.wrapS = RepeatWrapping
    // const [w, h] = info.TileSize.split(',')
    // const scale = 2
    // texture.repeat = new Vector2(
    //   (resolution.x / parseFloat(w)) * scale,
    //   (resolution.y / parseFloat(h)) * scale
    // )
    // return texture
  })

  return (
    <SplatTerrain
      smart={smart}
      diffuse={diffuse}
      splats={splats}
      heightMap={heightMap}
      color={color}
      //   position={[102.4 / 2 - 10, 0, -102.4 / 2]}
      rotation-x={-Math.PI / 2}
      args={[width / ratio, length / ratio, resolution.x, resolution.y]}
      displacementBias={height.min / ratio}
      displacementScale={height.max / ratio - height.min / ratio}
      userData={{ terrain: true }}
    />
  )
}

export function getWorldSize(world) {
  return {
    ratio: 2,
    width: world.Surface.Width,
    length: world.Surface.Length,
    height: {
      min: world.Surface.MinHeight * world.Surface.Height,
      max: world.Surface.MaxHeight * world.Surface.Height,
    },
    resolution: {
      x: world.Surface.ResolutionX,
      y: world.Surface.ResolutionY,
    },
    heightMap: world.heightMap,
  }
}

export function SplatTerrain({
  smart,
  diffuse,
  splats,
  heightMap,
  color,
  displacementBias = 0,
  displacementScale = 100,
  ...rest
}) {
  const noise = useLoader(TextureLoader, '/img/simplex-noise.png')
  const uniforms = useMemo(() => {
    return {
      uColor: { value: color },
      uNoise: { value: noise },
      displacementBias: { value: displacementBias },
      displacementScale: { value: displacementScale },
      displacementMap: { value: heightMap },
      uSplat1: { value: splats[0] },
      uSplat2: { value: splats[1] },
      uSplat3: { value: splats[2] },
      uSplat4: { value: splats[3] },
      uSplat5: { value: splats[4] },
      uSplat6: { value: splats[5] },
      uDiffuse1: { value: diffuse[0] },
      uDiffuse2: { value: diffuse[1] },
      uDiffuse3: { value: diffuse[2] },
      uDiffuse4: { value: diffuse[3] },
      uDiffuse5: { value: diffuse[4] },
      uDiffuse6: { value: diffuse[5] },
      uDiffuseRepeat1: { value: diffuse[1].repeat },
      uDiffuseRepeat2: { value: diffuse[1].repeat },
      uDiffuseRepeat3: { value: diffuse[1].repeat },
      uDiffuseRepeat4: { value: diffuse[1].repeat },
      uDiffuseRepeat5: { value: diffuse[1].repeat },
      uDiffuseRepeat6: { value: diffuse[1].repeat },
    }
  })

  const material = smart ? (
    <shaderMaterial
      uniforms={uniforms}
      vertexShader={splatVert}
      fragmentShader={splatFrag}
      side={DoubleSide}
      displacementBias={displacementBias}
      displacementScale={displacementScale}
      displacementMap={heightMap}
      extensions={{
        derivatives: true,
      }}
    />
  ) : (
    <meshStandardMaterial
      attach='material'
      color='white'
      map={color}
      displacementBias={displacementBias}
      displacementScale={displacementScale}
      displacementMap={heightMap}
    />
  )

  return <Plane {...rest}>{material}</Plane>
}

// todo: get all the splats & textures in a uniform
// apply a simple color texture

// sample and mix the textures
// figure out displacement
