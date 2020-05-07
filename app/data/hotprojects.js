import * as request from 'superagent'
import settings from '../settings/settings'

var hotprojects = null

export default function(callback) {
  if (hotprojects !== null) {
    return hotprojects
  } else {
    throw new Error('HotProjects data hasn\'t been loaded yet')
  }
}

export function load(callback) {
  if (hotprojects !== null) {
    return callback(null)
  }

  request
  .get(settings['tm-api'] + '/projects/')
  .end(function(err, res) {
    if (err) return callback(err)
    hotprojects = res.body.mapResults
    callback(null)
  })
}
