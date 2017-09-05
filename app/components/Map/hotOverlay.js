import React, { Component } from 'react'
import { centroid } from 'turf'

var hotProjectsGlLayer

class HotOverlay extends Component {
  state = {}

  render() {
    return <dummy></dummy>
  }

  componentDidMount() {
    hotProjectsGlLayer = L.mapboxGL({
      updateInterval: 0,
      style: {
        "version": 8,
        "sources": {
          "hotprojects": {
            "type": "vector",
            "tiles": [
              "https://s3.amazonaws.com/osma/tiles/{z}/{x}/{y}.pbf"
            ],
            "minzoom": 1,
            "maxzoom": 9
          }
        },
        "layers": [{
          "id": "hotprojects",
          "type": "line",
          "source": "hotprojects",
          "source-layer": "hotprojects.raw",
          "paint": {
            "line-color": "#3388FF",
            "line-width": 2,
          }
        }, {
          "id": "hotprojects-hover",
          "type": "fill",
          "source": "hotprojects",
          "source-layer": "hotprojects.raw",
          "paint": {
            "fill-opacity": 0,
            "fill-color": "#3388FF"
          }
        }]
      },
      hash: false
    })
  }
  componentWillReceiveProps(nextProps) {
    const map = nextProps.leaflet
    if (!map) return

    if (map && !this.props.leaflet) {
      // first time we actually get a valid leaflet object
      // -> initialize remaining stuff
      map.on('click', function (e) {
        if (!hotProjectsGlLayer._glMap) return
        var point = hotProjectsGlLayer._glMap.project(e.latlng)
        var features = hotProjectsGlLayer._glMap.queryRenderedFeatures([point.x, point.y], { layers: ['hotprojects-hover'] })
        if (!features.length) return
        var feature = features[0]
        map.openPopup(
          '<p>HOT project <a class="link" href="#/show/hot:'+feature.properties.id+'">#'+feature.properties.id+'</a>:<br/><a class="link" target="_blank" href="http://tasks.hotosm.org/project/'+feature.properties.id+'">'+feature.properties.name+'</a></p>',
          centroid(feature).geometry.coordinates.reverse()
        )
      })
      map.on('mousemove', function (e) {
        if (!hotProjectsGlLayer._glMap) return
        var point = hotProjectsGlLayer._glMap.project(e.latlng)
        var features = hotProjectsGlLayer._glMap.queryRenderedFeatures([point.x, point.y], { layers: ['hotprojects-hover'] })
        map.getContainer().style.cursor = features.length ? 'pointer' : ''
      })
    }

    if (nextProps.enabled) {
      hotProjectsGlLayer.addTo(map)
    } else {
      hotProjectsGlLayer.removeFrom(map)
    }
  }

}

export default HotOverlay
