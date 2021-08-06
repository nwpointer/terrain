var fs = require('fs')
var parser = require('xml2json')

// take a root
const root = 'public/maps/CustomTerrainShape/'
const publicRoot = '/maps/CustomTerrainShape/'

// parse the bridge file
const bridge = parseXMLFile('bridge.xml')

bridge.WorldCreator.heightMap = publicRoot + 'heightmap.jpg'
bridge.WorldCreator.colorMap = publicRoot + 'colormap.jpg'

bridge.WorldCreator.Texturing.SplatTexture.map((splat) => {
  // locate splat
  const [name] = splat.Name.split('.')
  splat.File = publicRoot + name + '.png'

  splat.TextureInfo.map((info) => {
    //inline the texture info from the description files
    const assets = parseXMLFile(`Assets/${info.Name}/Description.xml`)
    const textures = assets.WorldCreator.Textures
    info.Diffuse =
      publicRoot + 'Assets/' + info.Name + '/' + textures.Diffuse.File
    info.Normal =
      publicRoot + 'Assets/' + info.Name + '/' + textures.Normal.File
    info.Displacement =
      publicRoot + 'Assets/' + info.Name + '/' + textures.Displacement.File
  })
})

fs.writeFileSync(
  root + '_bridge.json',
  JSON.stringify(bridge.WorldCreator, null, 3)
)

console.log(
  `dont forget to convert the .raw and tga files in the ${root} directory`
)

function parseXMLFile(path) {
  const xml = fs.readFileSync(root + path, 'utf-8')
  return parser.toJson(xml, { object: true, coerce: true })
}
