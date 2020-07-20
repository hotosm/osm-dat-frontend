import * as request from 'superagent'
import vt from 'vector-tile'
import Protobuf from 'pbf'
import { featureCollection as featurecollection } from 'turf'

// based on https://github.com/mapbox/mapbox-gl-js/blob/master/js/source/worker.js

export default loadTile

function loadTile(url, layerName, tile, callback) {
  url = url
    .replace('{z}', tile.z)
    .replace('{x}', tile.x)
    .replace('{y}', tile.y)

  getArrayBuffer(url, function done(err, data) {
    if (err) return callback(err)
    if (data === null) return callback(null, featurecollection([]))
    data = new vt.VectorTile(new Protobuf(new Uint8Array(data)))
    parseTile(data, layerName, tile, callback)
  })
}

function parseTile(data, layerName, tile, callback) {
  const layer = data.layers[layerName]
  var features = []
  if (layer) {
    for (let i=0; i<layer.length; i++) {
      let feature = layer.feature(i)
      features.push(feature.toGeoJSON(tile.x, tile.y, tile.z))
    }
  }
  callback(null, featurecollection(features))
}

function getArrayBuffer(url, callback) {
  // todo: global?
  request.parse['application/x-protobuf'] = obj => obj
  request.parse['application/octet-stream'] = obj => obj

  /* eslint-disable indent */
  request.get(url)
  .on('request', function () {
    // todo: needed?
    // todo: check browser compat?? xhr2??? see https://github.com/visionmedia/superagent/pull/393 + https://github.com/visionmedia/superagent/pull/566
    this.xhr.responseType = 'arraybuffer' // or blob
  })
  .end(function(err,res) {
    // now res.body is an arraybuffer or a blob
    if (!err && res.status >= 200 && res.status < 300) {
      callback(null, res.body)
    } else if (res && res.status === 404) {
      callback(null, null)
    } else {
      callback(err || new Error(res.status))
    }
  });
  /* eslint-enable indent */
}
