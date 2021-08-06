import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import frag from '../shaders/terrain.frag'
import vert from '../shaders/terrain.vert'
import { ShaderLib } from 'three/src/renderers/shaders/ShaderLib'
import { ShaderChunk } from 'three/src/renderers/shaders/ShaderChunk'
import { mergeUniforms } from 'three/src/renderers/shaders/UniformsUtils'
import { UniformsLib } from 'three/src/renderers/shaders/UniformsLib'
import { ShaderMaterial } from 'three'

const uniforms = mergeUniforms([
  UniformsLib.common,
  UniformsLib.envmap,
  UniformsLib.aomap,
  UniformsLib.lightmap,
  UniformsLib.emissivemap,
  UniformsLib.bumpmap,
  UniformsLib.normalmap,
  UniformsLib.displacementmap,
  UniformsLib.roughnessmap,
  UniformsLib.metalnessmap,
  UniformsLib.fog,
  UniformsLib.lights,
  {
    emissive: { value: new THREE.Color(0x000000) },
    roughness: { value: 1.0 },
    metalness: { value: 0.0 },
    envMapIntensity: { value: 1 }, // temporary
  },
])

const TerrainMaterial = shaderMaterial(uniforms, vert, frag)

extend({ TerrainMaterial })
