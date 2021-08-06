import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import frag from '../shaders/grass.frag'
import vert from '../shaders/grass.vert'

const GrassMaterial = shaderMaterial(
  { bladeHeight: 1, map: null, alphaMap: null, time: 0 },
  vert,
  frag,
  (self) => {
    self.side = THREE.DoubleSide
    self.transparent = true
    self.depthWrite = false
  }
)

extend({ GrassMaterial })
