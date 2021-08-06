const fs = require('fs')
const GrowingPacker = require('./packer')
const nextPOT = require('next-power-of-two')
const { createCanvas, loadImage } = require('canvas')
const getWorldSize = require('./getWorldSize')
const worldLocation = './public/maps/CustomTerrainShape/_bridge.json'
const world = JSON.parse(fs.readFileSync(worldLocation, 'utf-8'))
const { resolution, height, ratio } = getWorldSize(world)

const createAtlas =
  (name, powerOfTwo = true) =>
  (textures) => {
    const images = textures.map((t) => t.img)
    const infos = textures.map((t) => t.info)
    images.sort((a, b) => a.width - b.width)
    var blocks = images.map((i) => ({ w: i.width, h: i.height }))
    var packer = new GrowingPacker()
    packer.fit(blocks)
    let { w, h } = packer.root
    if (powerOfTwo) {
      w = nextPOT(w)
      h = nextPOT(h)
    }
    const canvas = createCanvas(w, h)
    const context = canvas.getContext('2d')

    const data = {
      startU: [],
      endU: [],
      startV: [],
      endV: [],
      repeat: [],
    }

    // console.log(JSON.stringify(packer, null, 3))

    for (var n = 0; n < blocks.length; n++) {
      var image = images[n]
      var block = blocks[n]
      var info = infos[n]

      var [tw, th] = info.TileSize.split(',')
      if (block.fit) {
        const d = 0
        data.startU[n] = (block.fit.x + d) / w
        data.endU[n] = (block.fit.x + block.w - d) / w
        data.startV[n] = (block.h - block.fit.y + d) / h
        data.endV[n] = (block.h - block.fit.y + block.h - d) / h
        data.repeat[n] = [
          resolution.x / parseFloat(tw),
          resolution.y / parseFloat(th),
        ]
        context.drawImage(image, block.fit.x, block.fit.y, block.w, block.h)
      }
    }

    const buffer = canvas.toBuffer('image/png')
    const fname = `./public/maps/CustomTerrainShape/${name}`

    fs.writeFileSync(`${fname}.png`, buffer)
    fs.writeFileSync(`${fname}.json`, JSON.stringify(data, null, 3))
  }

const textureInfo = [
  ...world.Texturing.SplatTexture[0].TextureInfo,
  ...world.Texturing.SplatTexture[1].TextureInfo,
]

let diffuse = textureInfo.map(async (info, i) => {
  const img = await loadImage('./public' + info.Diffuse)
  img.order = i
  return { img, info }
})

// diffuse = [
//   diffuse[3],
//   diffuse[3],
//   diffuse[3],
//   diffuse[3],
//   diffuse[3],
//   diffuse[3],
// ]

const normals = textureInfo
  .filter((info) => info.Normal)
  .map(async (info, i) => {
    const img = await loadImage('./public' + info.Normal)
    img.order = i
    return { img, info }
  })

Promise.all(normals).then(createAtlas('normals'))
Promise.all(diffuse).then(createAtlas('diffuse'))
