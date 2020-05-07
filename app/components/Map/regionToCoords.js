import { bboxPolygon, polygon, flip, simplify } from 'turf'
import * as request from 'superagent'
import superagentPromisePlugin from 'superagent-promise-plugin'
import 'promise'
import settings from '../../settings/settings'

export default function regionToCoords(region, latLngOrder) {
  var coords
  switch (region.type) {
  case 'gist':
    let gistId = region.id
    coords = request
    .get('https://api.github.com/gists/'+gistId)
    .use(superagentPromisePlugin)
    .then(function(res) {
      let file = res.body.files['polygon.geojson'] || res.body.files['map.geojson']
      if (file === undefined) {
        throw new Error('uncompatible gist', gistId)
      }
      return request
      .get(file.raw_url)
      .use(superagentPromisePlugin)
      .then(function(res) {
        let geometry = JSON.parse(res.text)
        if (geometry.type === 'FeatureCollection') {
          geometry = geometry.features[0];
        }
        if (geometry.type === 'Feature') {
          geometry = geometry.geometry;
        }
        if (geometry.type === 'MultiPolygon' && geometry.coordinates.length === 1) {
          return polygon(geometry.coordinates[0])
        } else {
          return {
            type: 'Feature',
            properties: {},
            geometry: geometry
          }
        }
      })
    }).catch(function(err) {
      if (err.status == 404) {
        throw new Error('unknown gist', gistId)
      } else {
        throw err
      }
    });
  break;
  case 'hot':
    let projectId = region.id
    coords = request
    .get(settings['tm-api'] + '/projects/'+projectId+'/queries/aoi/')
    .use(superagentPromisePlugin)
    .then(function(res) {
      let geometry = res.body
      if (geometry.type === 'MultiPolygon' && geometry.coordinates.length === 1) {
        return polygon(geometry.coordinates[0])
      } else {
        return {
          type: 'Feature',
          properties: {},
          geometry: geometry
        }
      }
    }).catch(function(err) {
      if (err.status == 404) {
        throw new Error('unknown hot project', projectId)
      } else {
        throw err
      }
    });
  break;
  case 'bbox':
    coords = bboxPolygon(region.coords)
  break;
  case 'polygon':
    coords = polygon([region.coords.concat([region.coords[0]])])
  break;
  default:
    throw new Error('unknown region', region)
  }
  return Promise.resolve(coords).then(function(coords) {
    if (latLngOrder) {
      return flip(coords)
    } else {
      return coords
    }
  })
}
