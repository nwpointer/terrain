module.exports = function (world) {
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
