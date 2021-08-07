import useStore from '@/helpers/store'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import {
  BoxBufferGeometry,
  PlaneBufferGeometry,
  PlaneGeometry,
  Vector2,
} from 'three'
import './CustomMaterial'
import * as THREE from 'three'
import useHeights from './terrain/useHeights'
import { HeightmapGeometry } from './terrain/HeightmapGeometry'
import { Skybox } from './Skybox'
import { Environment, Html } from '@react-three/drei'
import world from '../../../public/maps/CustomTerrainShape/_bridge.json'
import { getWorldSize } from './terrain/worldCreator'
import TextureMerger from './util/textureMerger'

import diffuseData from '../../../public/maps/CustomTerrainShape/diffuse.json'
import normalsData from '../../../public/maps/CustomTerrainShape/normals.json'

import { TGALoader } from 'three-stdlib'

const envint = 0.5

const Loading = () => {
  return (
    <Html>
      <div>loading</div>
    </Html>
  )
}

export default function MatDemo() {
  return (
    <Suspense fallback={<Loading />}>
      <MaterialDemo world={world} />
      <Environment preset='park' />
      <Skybox fog={false} />
      <fog attach='fog' args={['#74bbd0', 300, 1800]} />
      {/* <directionalLight
        color='white'
        intensity={0.1}
        position={[100, 100, 10]}
      /> */}
    </Suspense>
  )
}

const getImageData = (image) => {
  const { width, height } = image
  var canvas = document.createElement('canvas')
  canvas.height = height
  canvas.width = width
  var ctx = canvas.getContext('2d')
  ctx.drawImage(image, 0, 0)
  var { data } = ctx.getImageData(0, 0, width, height)
  const values = []
  for (var i = 0; i < data.length; i += 4) {
    values.push(data[i])
  }

  return values
}

function useGeography(src) {
  const image = useLoader(THREE.ImageLoader, src)

  return useMemo(() => {
    const { width: w, height: h } = image
    const geometry = new PlaneBufferGeometry(w, h, (w - 1) / 2, (h - 1) / 2)
    const data = getImageData(image)
    const verts = geometry.attributes.position.array

    for (var i = 0; i < data.length; i++) {
      const y = (data[i] / 255) * 120
      // verts[i * 3 + 2] = y
    }
    geometry.computeFaceNormals()
    geometry.computeVertexNormals()
    geometry.attributes.position.needsUpdate = true
    return geometry
  })
}

/*
Texture budget:
4/6 diffuse
4/6 normal
noise texture
normal map
displacement map
2 splats

-> would be kinda cool to load the low quality color, normal & displacement first
  -> could use default material
  -> then load the 8-12 detailed textures in background and then use custom material on load

  more than 4 textures basically requires a texture atlas.
*/

export function MaterialDemo({ world }) {
  const root = '/maps/CustomTerrainShape/'
  const { height, ratio } = getWorldSize(world)

  const noise = useLoader(THREE.TextureLoader, '/img/simplex-noise.png')
  const splats = [
    useLoader(TGALoader, root + world.Texturing.SplatTexture[0].Name),
    useLoader(TGALoader, root + world.Texturing.SplatTexture[1].Name),
  ]

  // TODO, REPLACE WITH HIGHER RES NORMAL & HIGHT MAP
  const [
    normalMap,
    displacementMap,
    normalAtlas,
    diffuseAtlas,
    d1,
    n1,
    d2,
    n2,
    d3,
    n3,
    d4,
    n4,
    d5,
  ] = [
    useLoader(THREE.TextureLoader, root + 'normalmap-y-hd.jpg'),
    useLoader(THREE.TextureLoader, root + 'heightmap.jpg'),
    useLoader(THREE.TextureLoader, root + 'normals.png'),
    useLoader(THREE.TextureLoader, root + 'diffuse.png'),
    useLoader(
      THREE.TextureLoader,
      root + 'Assets/Cliffs_02/Rock_DarkCrackyCliffs_col.jpg'
    ),
    useLoader(
      THREE.TextureLoader,
      root + 'Assets/Cliffs_02/Rock_DarkCrackyCliffs_norm.jpg'
    ),
    useLoader(
      THREE.TextureLoader,
      root + 'Assets/Rock_04/Rock_sobermanRockWall_col.jpg'
    ),
    useLoader(
      THREE.TextureLoader,
      root + 'Assets/Rock_04/Rock_sobermanRockWall_norm.jpg'
    ),
    useLoader(
      THREE.TextureLoader,
      root + 'Assets/Mud_03/Ground_WetBumpyMud_col.jpg'
    ),
    useLoader(
      THREE.TextureLoader,
      root + 'Assets/Mud_03/Ground_WetBumpyMud_norm.jpg'
    ),
    useLoader(
      THREE.TextureLoader,
      root + 'Assets/Grass_020/ground_Grass1_col.jpg'
    ),
    useLoader(
      THREE.TextureLoader,
      root + 'Assets/Grass_020/ground_Grass1_norm.jpg'
    ),
    useLoader(
      THREE.TextureLoader,
      root + 'Assets/Grass_021/ground_Grass1_col.jpg'
    ),
  ]

  // diffuseAtlas.magFilter = THREE.LinearFilter
  // diffuseAtlas.minFilter = THREE.LinearMipMapNearestFilter

  // diffuseAtlas.wrapS = THREE.ClampToEdgeWrapping
  // diffuseAtlas.wrapT = THREE.ClampToEdgeWrapping
  // diffuseAtlas.repeat = diffuseData.repeat[4]
  // diffuseAtlas.needsUpdate = true
  ;[d1, n1, d2, n2, d3, n3, d4, n4, d5, noise].map((t) => {
    t.wrapS = THREE.RepeatWrapping
    t.wrapT = THREE.RepeatWrapping
    // t.anisotropy = 16
  })

  // todo reuse other texture
  var geo = useGeography('/maps/CustomTerrainShape/heightmap.jpg')

  var material = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      metalness: 1.115,
      // roughness: 1,
      displacementMap,
      displacementScale: height.max / ratio - height.min / ratio,
      displacementBias: height.min / ratio,
      // normalScale: new THREE.Vector2(0.1, 0.9),
      // normalScale: new THREE.Vector2(1.5, 1.5),
      normalScale: new THREE.Vector2(1.25, 1.75),
      // normalScale: new THREE.Vector2(1, 1.5),
      // castShadow: true,
      // receiveShadow: true,
      normalMap,
      envMapIntensity: envint,
    })
    material.onBeforeCompile = (shader) => {
      shader.extensions = {
        derivatives: true,
      }
      shader.uniforms = {
        ...shader.uniforms,
        uNoise: { value: noise },

        uSplat1: { value: splats[0] },
        uSplat2: { value: splats[1] },

        uDiffuse1: { value: d1 },
        uNorm1: { value: n1 },
        uDiffuse2: { value: d2 },
        uNorm2: { value: n2 },
        uDiffuse3: { value: d3 },
        uNorm3: { value: n3 },
        uDiffuse4: { value: d4 },
        uNorm4: { value: n4 },
        uDiffuse5: { value: d5 },

        // uDiffuseAtlas: { value: diffuseAtlas },
        // uDiffuseStartU: { value: diffuseData.startU },
        // uDiffuseEndU: { value: diffuseData.endU },
        // uDiffuseStartV: { value: diffuseData.startV },
        // uDiffuseEndV: { value: diffuseData.endV },

        uNormalAtlas: { value: normalAtlas },
        uNormalStartU: { value: normalsData.startU },
        uNormalEndU: { value: normalsData.endU },
        uNormalStartV: { value: normalsData.startV },
        uNormalEndV: { value: normalsData.endV },

        uRepeat: {
          value: diffuseData.repeat.map((r) => new THREE.Vector2(...r)),
        },
      }

      console.log(diffuseData.repeat)

      shader.fragmentShader = shader.fragmentShader
        .replace(
          'uniform float opacity;',
          `
          uniform float opacity;
          uniform vec3 colour;
          uniform sampler2D uNoise;
          uniform vec2 uRepeat[6];

          uniform sampler2D uSplat1;
          uniform sampler2D uSplat2;


          uniform sampler2D uDiffuse1;
          uniform sampler2D uNorm1;
          uniform sampler2D uDiffuse2;
          uniform sampler2D uNorm2;
          uniform sampler2D uDiffuse3;
          uniform sampler2D uNorm3;
          uniform sampler2D uDiffuse4;
          uniform sampler2D uNorm4;
          uniform sampler2D uDiffuse5;

          // uniform sampler2D uDiffuseAtlas;
          // uniform float uDiffuseStartU[6];
          // uniform float uDiffuseEndU[6];
          // uniform float uDiffuseStartV[6];
          // uniform float uDiffuseEndV[6];

          uniform sampler2D uNormalAtlas;
          uniform float uNormalStartU[4];
          uniform float uNormalEndU[4];
          uniform float uNormalStartV[4];
          uniform float uNormalEndV[4];

          float sum( vec3 v ) { return v.x+v.y+v.z; }

          vec2 auv(vec2 uv, float startU, float endU, float startV, float endV){
            float coordX = (uv.x * (endU - startU) + startU);
            float coordY = (uv.y * (startV - endV) + endV);
            return vec2(coordX, coordY);
          }

          vec2 auvr(vec2 uv, float startU, float endU, float startV, float endV, float r){
            float d = 0.5/1024.0;
            float deltaU = endU - startU;
            float deltaV = startV - endV;
            float coordX = (mod(uv.x * deltaU * r, deltaU*0.99) + startU);
            float coordY = (mod(uv.y * deltaV * r, deltaV*0.99) + endV);
            // return uv*2.0;
            return vec2(coordX, coordY);
          }

          vec4 textureNoTileAtlas(sampler2D samp, in vec2 uv, float startU, float endU, float startV, float endV, float r)
          {
            // sample variation pattern    
            float k = texture( uNoise, 0.05*uv ).x; // cheap (cache friendly) lookup    
            
            // compute index    
            float index = k*(r);
            float i = floor( index );
            float f = fract( index );
        
            // offsets for the different virtual patterns    
            vec2 offa = sin(vec2(3.0,7.0)*(i+0.0)); // can replace with any other hash    
            vec2 offb = sin(vec2(3.0,7.0)*(i+1.0)); // can replace with any other hash    

            vec2 uuv = auvr(uv, startU, endU, startV, endV, r);
            vec2 uva = auvr(uv + offa, startU, endU, startV, endV, r);
            vec2 uvb = auvr(uv + offb, startU, endU, startV, endV, r);
        
            // compute derivatives for mip-mapping    
            vec2 dx = dFdx(uuv), dy = dFdy(uuv);

            // sample the two closest virtual patterns    
            vec3 cola = textureGrad( samp, uva, dx, dy ).xyz;
            vec3 colb = textureGrad( samp, uvb, dx, dy ).xyz;
        
            // interpolate between the two virtual patterns    
            vec3 col = mix( cola, colb, smoothstep(0.2,0.8,f-0.1*sum(cola-colb)) );
            return vec4(col,1.0);
          }

          vec4 textureNoTile( sampler2D samp, vec2 uv )
          {
            // sample variation pattern    
            float k = texture2D( uNoise, 0.005*uv ).x; // cheap (cache friendly) lookup    
            
            // compute index    
            float l = k*8.0;
            float f = fract(l);

            float ia = floor(l);
            float ib = ia + 1.0;
        
            // offsets for the different virtual patterns
            float v = 0.4;
            vec2 offa = sin(vec2(3.0,7.0)*ia); // can replace with any other hash
            vec2 offb = sin(vec2(3.0,7.0)*ib); // can replace with any other hash  

        
            // compute derivatives for mip-mapping    
            vec2 dx = dFdx(uv), dy = dFdy(uv);

            // sample the two closest virtual patterns    
            vec3 cola = textureGrad( samp, uv + v*offa, dx, dy ).xyz;
            vec3 colb = textureGrad( samp, uv + v*offb, dx, dy ).xyz;
        
            // // interpolate between the two virtual patterns    
            vec3 col = mix( cola, colb, smoothstep(0.2,0.8,f-0.1*sum(cola-colb)) );
            return vec4(col,1.0);

            // return vec4(0.0,0.0,0.0,0.0);
          }

          vec4 textureNoTileNormal(sampler2D samp, in vec2 uv, float startU, float endU, float startV, float endV, float r)
          {
            return textureNoTileAtlas(samp, uv, startU, endU, startV, endV, r);
          }

          vec4 blend_rnm(vec4 n1, vec4 n2){
            vec3 t = n1.xyz*vec3( 2,  2, 2) + vec3(-1, -1,  0);
            vec3 u = n2.xyz*vec3(-2, -2, 2) + vec3( 1,  1, -1);
            vec3 r = t*dot(t, u) /t.z -u;
            return vec4((r), 1.0);
          }


          /**
           * Adjusts the saturation of a color.
           * 
           * @name czm_saturation
           * @glslFunction
           * 
           * @param {vec3} rgb The color.
           * @param {float} adjustment The amount to adjust the saturation of the color.
           *
           * @returns {float} The color with the saturation adjusted.
           *
           * @example
           * vec3 greyScale = czm_saturation(color, 0.0);
           * vec3 doubleSaturation = czm_saturation(color, 2.0);
           */
          vec4 czm_saturation(vec4 rgba, float adjustment)
          {
              // Algorithm from Chapter 16 of OpenGL Shading Language
              vec3 rgb = rgba.rgb;
              const vec3 W = vec3(0.2125, 0.7154, 0.0721);
              vec3 intensity = vec3(dot(rgb, W));
              return vec4(mix(intensity, rgb, adjustment), rgba.a);
          }
        `
        )
        .replace(
          '#include <normal_fragment_maps>',
          `
          #ifdef OBJECTSPACE_NORMALMAP

            normal = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0; // overrides both flatShading and attribute normals

            #ifdef FLIP_SIDED

              normal = - normal;

            #endif

            #ifdef DOUBLE_SIDED

              normal = normal * faceDirection;

            #endif

            normal = normalize( normalMatrix * normal );

          #elif defined( TANGENTSPACE_NORMALMAP )

            vec3 mapN = texture2D( normalMap, vUv ).xyz *1.25 -0.25;
            vec4 zeroN = vec4(0.5, 0.5, 1, 1);
            vec4 norm1 = textureNoTile(uNorm1, vUv * float(uRepeat[0]));
            vec4 norm2 = textureNoTile(uNorm2, vUv * float(uRepeat[2]));
            vec4 norm3 = textureNoTile(uNorm3, vUv * float(uRepeat[2]));
            vec4 norm4 = textureNoTile(uNorm4, vUv * float(uRepeat[3]));
  
            vec4 n1 = mix(zeroN, norm1, splat1.g*0.5);
            vec4 n2 = mix(zeroN, norm2, splat1.g *0.5);
            vec4 n3 = mix(zeroN, norm3, splat1.b);
            vec4 n4 = mix(zeroN, norm4, splat1.a);
            vec4 n5 = mix(zeroN, norm4, splat2.r);
            vec4 n6 = mix(zeroN, norm3, splat2.g);
            // vec4 n7 = mix(zeroN, norm3, splat2.g);
  
            vec4 n12 = blend_rnm(n1, n2) *0.5 + 0.5;
            vec4 n34 = blend_rnm(n3, n6) *0.5 + 0.5;
            // vec4 n56 = blend_rnm(n5, n6) *0.5 + 0.5;
  
            vec4 n1234 = blend_rnm(n12, n34) *0.5 + 0.5;
            // vec4 n123456 = blend_rnm(n1234, n56) *0.5 + 0.5;

            vec4 m = vec4(mapN, 1.0);
            
            mapN = (blend_rnm(m, n1234) *0.5 + 0.5).rgb;
            mapN.xy *= normalScale;

            #ifdef USE_TANGENT

              normal = normalize( vTBN * mapN );

            #else

              normal = perturbNormal2Arb( -vViewPosition, normal, mapN, faceDirection );

            #endif

          #elif defined( USE_BUMPMAP )

            normal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd(), faceDirection );

          #endif
        `
        )
        .replace(
          '#include <map_fragment>', //we will swap out this chunk
          `
          #include <map_fragment>

          // vec4 diffuse1 = textureNoTileAtlas(uDiffuseAtlas, vUv, uDiffuseStartU[0], uDiffuseEndU[0], uDiffuseStartV[0], uDiffuseEndV[0], float(uRepeat[0]));
          // vec4 diffuse2 = textureNoTileAtlas(uDiffuseAtlas, vUv, uDiffuseStartU[1], uDiffuseEndU[1], uDiffuseStartV[1], uDiffuseEndV[1], float(uRepeat[1]));
          // vec4 diffuse3 = textureNoTileAtlas(uDiffuseAtlas, vUv, uDiffuseStartU[2], uDiffuseEndU[2], uDiffuseStartV[2], uDiffuseEndV[2], float(uRepeat[2]));
          // vec4 diffuse4 = textureNoTileAtlas(uDiffuseAtlas, vUv, uDiffuseStartU[3], uDiffuseEndU[3], uDiffuseStartV[3], uDiffuseEndV[3], float(uRepeat[3]));
          // vec4 diffuse5 = textureNoTileAtlas(uDiffuseAtlas, vUv, uDiffuseStartU[4], uDiffuseEndU[4], uDiffuseStartV[4], uDiffuseEndV[4], float(uRepeat[4]));
          // vec4 diffuse6 = textureNoTileAtlas(uDiffuseAtlas, vUv, uDiffuseStartU[5], uDiffuseEndU[5], uDiffuseStartV[5], uDiffuseEndV[5], float(uRepeat[5]));

          // vec4 diffuse1 = texture2D(uDiffuseAtlas, auvr(vUv, uDiffuseStartU[0], uDiffuseEndU[0], uDiffuseStartV[0], uDiffuseEndV[0], float(uRepeat[0])));
          // vec4 diffuse2 = texture2D(uDiffuseAtlas, auvr(vUv, uDiffuseStartU[1], uDiffuseEndU[1], uDiffuseStartV[1], uDiffuseEndV[1], float(uRepeat[1])));
          // vec4 diffuse3 = texture2D(uDiffuseAtlas, auvr(vUv, uDiffuseStartU[2], uDiffuseEndU[2], uDiffuseStartV[2], uDiffuseEndV[2], float(uRepeat[2])));
          // vec4 diffuse4 = texture2D(uDiffuseAtlas, auvr(vUv, uDiffuseStartU[3], uDiffuseEndU[3], uDiffuseStartV[3], uDiffuseEndV[3], float(uRepeat[3])));
          // vec4 diffuse5 = texture2D(uDiffuseAtlas, auvr(vUv, uDiffuseStartU[4], uDiffuseEndU[4], uDiffuseStartV[4], uDiffuseEndV[4], float(uRepeat[4])));
          // vec4 diffuse6 = texture2D(uDiffuseAtlas, auvr(vUv, uDiffuseStartU[5], uDiffuseEndU[5], uDiffuseStartV[5], uDiffuseEndV[5], float(uRepeat[5])));

          vec4 diffuse1 = textureNoTile(uDiffuse1, vUv * float(uRepeat[0]));
          vec4 diffuse2 = textureNoTile(uDiffuse2, vUv * float(uRepeat[1]));
          vec4 diffuse3 = textureNoTile(uDiffuse3, vUv * float(uRepeat[2]));
          vec4 diffuse4 = textureNoTile(uDiffuse4, vUv * float(uRepeat[3]));
          vec4 diffuse5 = textureNoTile(uDiffuse5, vUv * float(uRepeat[3]));

          vec4 splat1 = texture2D(uSplat1, vUv);
          vec4 splat2 = texture2D(uSplat2, vUv);

          vec4 c = 
              diffuse1 * splat1.r
            + diffuse2 * splat1.g
            + diffuse3 * splat1.b 
            + diffuse5 * splat1.a
            + czm_saturation(diffuse4, 1.1) * splat2.r
            + diffuse3 * splat2.g 
            ;

          diffuseColor = vec4( c.rgb, opacity );
          `
        )
    }

    return material
  }, [])

  return (
    <mesh material={material} geometry={geo} rotation={[-Math.PI / 2, 0, 0]} />
  )
}
