import { area, bbox as extent, intersect, bboxPolygon, featureCollection as featurecollection, centroid, lineDistance, within } from 'turf'
import Sphericalmercator from 'sphericalmercator'
import { queue } from 'd3-queue'
import loadTile from '../Map/loadVectorTile.js'
import settings from '../../settings/settings'

var merc = new Sphericalmercator({size: 512})

var cache = {} // todo: cache invalidation

function fetch(region, filter, time /*optional*/, callback) {
  if (callback === undefined) {
    callback = time
    time = undefined
  }
  const zoom = getRegionZoom(region)
  const tiles = getRegionTiles(region, zoom)
  const cachePage = (!time || time === 'now') ? filter : time + '/' + filter
  if (!cache[cachePage]) cache[cachePage] = {}
  const toLoad = tiles.filter(tile => cache[cachePage][tile.hash] === undefined)
  var q = queue(4) // max 4 concurrently loading tiles in queue
  toLoad.forEach(tile => q.defer(getAndCacheTile, tile, filter, time))
  q.awaitAll(function(err) {
    if (err) return callback(err)
    // return matching features
    var output = []
    const regionFc = featurecollection([region])
    tiles.forEach(tile => {
      output = output.concat(
        within(cache[cachePage][tile.hash], regionFc).features
      )
    })
    // todo: handle tile boundaries / split features (merge features with same osm id)
    callback(null, featurecollection(output))
  })
}

function getRegionZoom(region) {
  const maxZoom = 13 // todo: setting "maxZoom"
  const tileLimit = 12 // todo: setting "tileLimit"
  const regionBounds = extent(region)
  for (let z=maxZoom; z>0; z--) {
    let tileBounds = merc.xyz(regionBounds, z)
    let tilesNum = (1 + tileBounds.maxX - tileBounds.minX) * (1 + tileBounds.maxY - tileBounds.minY)
    if (tilesNum <= tileLimit) {
      return z
    }
  }
  return 0
}

function getRegionTiles(region, zoom) {
  const regionBounds = extent(region)
  var tiles = []
  // get all tiles for the regions bbox
  var tileBounds = merc.xyz(regionBounds, zoom)
  for (let x=tileBounds.minX; x<=tileBounds.maxX; x++) {
    for (let y=tileBounds.minY; y<=tileBounds.maxY; y++) {
      tiles.push({
        x,
        y,
        z: zoom,
        hash: x+'/'+y+'/'+zoom
      })
    }
  }
  // drop tiles that are actually outside the region
  tiles = tiles.filter(tile => {
    const bboxPoly = bboxPolygon(merc.bbox(tile.x, tile.y, tile.z))
    try {
      return intersect(
        bboxPoly,
        region
      )
    } catch(e) {
      console.warn(e)
      return true
    }
  })
  return tiles
}

function getAndCacheTile(tile, filter, time, callback) {
  const cachePage = (!time || time === 'now') ? filter : time + '/' + filter
  var url
  if (!time || time === 'now') {
    url = settings['vt-source']+'/'+filter+'/{z}/{x}/{y}.pbf'
  } else {
    url = settings['vt-hist-source']+'/'+time+'/'+filter+'/{z}/{x}/{y}.pbf'
  }
  loadTile(url, 'osm', tile, function(err, data) {
    if (err) return callback(err)
    // convert features to centroids, store tile data in cache
    data.features = data.features.map(feature => {
      var centr = centroid(feature)
      centr.properties = feature.properties
      centr.properties.tile = tile
      centr.properties._length = centr.properties._length ||
          centr.properties._lineDistance ||
          (feature.geometry.type === "LineString" ? lineDistance(feature, 'kilometers') : 0.0)
      return centr
    })
    cache[cachePage][tile.hash] = data
    callback(null) // don't return any actual data as it is available via the cache already
  })
}

export default fetch
export { getRegionZoom, getRegionTiles }
