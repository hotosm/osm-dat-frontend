import { area, bbox as extent, intersect, bboxPolygon, featureCollection as featurecollection, centroid, lineDistance, within } from 'turf'
import Sphericalmercator from 'sphericalmercator'
import { queue } from 'd3-queue'
import loadTile from '../Map/loadVectorTile.js'
import { getRegionZoom, getRegionTiles } from './searchFeatures.js'
import settings from '../../settings/settings'

var merc = new Sphericalmercator({size: 512})

var cache = {} // todo: cache invalidation

function fetch(region, callback) {
  const zoom = Math.min(12, getRegionZoom(region))
  const tiles = getRegionTiles(region, zoom)
  const cachePage = 'builtup'
  if (!cache[cachePage]) cache[cachePage] = {}
  const toLoad = tiles.filter(tile => cache[cachePage][tile.hash] === undefined)
  var q = queue(4) // max 4 concurrently loading tiles in queue
  toLoad.forEach(tile => q.defer(getAndCacheTile, tile))
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

function getAndCacheTile(tile, callback) {
  const cachePage = 'builtup'
  loadTile(settings['vt-gaps-source']+'/{z}/{x}/{y}.pbf', 'buildup', tile, function(err, data) {
    if (err) return callback(err)
    // convert features to centroids, store tile data in cache
    data.features = data.features.map(feature => {
      var centr = centroid(feature)
      centr.properties = feature.properties
      centr.properties.tile = tile
      centr.properties.area = centr.properties.area || area(feature.geometry)
      return centr
    })
    cache[cachePage][tile.hash] = data
    callback(null) // don't return any actual data as it is available via the cache already
  })
}

export default fetch
