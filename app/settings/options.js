import settings from './settings'
import * as request from 'superagent'

export function loadLayers(callback) {
  request
  .get(settings['vt-source'] + '/analytics.json')
  .end(function(err, res) {
    if (err) return callback(err)
    callback(null, res.body.layers)
  })
}

export const gapsFilters = [
  {
    name: 'buildings-vs-ghs',
    title: 'Buildings vs. Built-up',
    description: 'OpenStreetMap buildings compared to data of built-up areas from "Global Human Settlement Layer".',
    layers: {
      osm: 'buildings',
      reference: 'ghs-pop'
    }
  }
]

export const overlays = [
  {
    id: 'recency',
    description: 'Recency of Edits'
  },
  {
    id: 'experience',
    description: 'Editor Level of Experience'
  },
]

export const compareTimes = [
  { id: '2007', timestamp: new Date('2007-01-01'), except: ['pois', 'waterways'] },
  { id: '2008', timestamp: new Date('2008-01-01'), except: ['pois', 'waterways'] },
  { id: '2009', timestamp: new Date('2009-01-01'), except: ['pois', 'waterways'] },
  { id: '2010', timestamp: new Date('2010-01-01'), except: ['pois', 'waterways'] },
  { id: '2011', timestamp: new Date('2011-01-01'), except: ['pois', 'waterways'] },
  { id: '2012', timestamp: new Date('2012-01-01'), except: ['pois', 'waterways'] },
  { id: '2013', timestamp: new Date('2013-01-01'), except: ['pois', 'waterways'] },
  { id: '2014', timestamp: new Date('2014-01-01'), except: ['pois', 'waterways'] },
  { id: '2015', timestamp: new Date('2015-01-01'), except: ['pois'] },
  { id: '2016', timestamp: new Date('2016-01-01'), except: ['pois'] },
  { id: '2017', timestamp: new Date('2017-01-01'), except: ['pois'] },
  { id: '2018', timestamp: new Date('2018-01-01'), except: ['pois'] },
  { id: 'now',  timestamp: new Date() }
]
