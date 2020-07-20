import React, { Component } from 'react'
import style from './style.css'
import glStyles, { getCompareStyles } from './glstyles'
import Swiper from './swiper'
import FilterButton from '../FilterButton'
import SearchBox from '../SearchBox'
import Legend from '../Legend'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as MapActions from '../../actions/map'
import { bboxPolygon, area, difference as erase } from 'turf'
import { debounce } from 'lodash'
import regionToCoords from './regionToCoords'
import themes from '../../settings/themes'
import settings from '../../settings/settings'

// leaflet plugins
import * as _leafletmapboxgljs from '../../libs/leaflet-mapbox-gl.js'
import * as _leafleteditable from '../../libs/Leaflet.Editable.js'

var map // Leaflet map object
var glLayer // mapbox-gl layer
var glCompareLayers // mapbox-gl layers for before/after view
var boundsLayer = null // selected region layer
var moveDirectly = false

class Map extends Component {
  state = {}

  render() {
    const { view, actions, embed, theme } = this.props
    const containerClassName = (embed === false) ? `${view}View` : ''
    const activeLayer = this.props.layers.find(layer => layer.name === this.props.map.filters[0])
    return (
      <div className={containerClassName}>
        <div id="map" style={embed ? { bottom: 30 } : {}}>
        </div>
        {this.props.map.view === 'compare'
          ? <Swiper onMoved={::this.swiperMoved} theme={themes[theme]} />
          : ''
        }

        {embed === false && <div>
          <SearchBox className="searchbox" selectedRegion={this.props.map.region} {...actions}/>
          <span className="search-alternative">or</span>
          <button className="outline" onClick={::this.setViewportRegion}>Outline Custom Area</button>
          <FilterButton
            layers={this.props.layers}
            enabledFilters={this.props.map.filters}
            {...actions}
          />
        </div>}

        <Legend
          layer={activeLayer}
          zoom={this.state.mapZoomLevel}
          showHighlighted={!!this.props.stats.timeFilter || !!this.props.stats.experienceFilter}
          theme={theme}
        />
      </div>
    )
  }

  componentDidMount() {
    const { theme, embed, layers } = this.props

    const activeLayer = layers.find(layer => layer.name === this.props.map.filters[0])

    map = L.map(
      'map', {
      editable: true,
      minZoom: 2,
      scrollWheelZoom: !embed
    })
    .setView([0, 35], 2)
    map.on('editable:editing', debounce(::this.setCustomRegion, 200))
    map.on('zoomend', (e) => { this.setState({ mapZoomLevel:map.getZoom() }) })

    L.control.scale({ position: 'bottomright' }).addTo(map)
    map.zoomControl.setPosition('bottomright')

    L.tileLayer(settings['map-background-tile-layer'], {
      attribution: settings['map-attribution'],
      zIndex: -1
    }).addTo(map)

    if (!mapboxgl.supported()) {
      alert('This browser does not support WebGL which is required to run this application. Please check that you are using a supported browser and that WebGL is enabled.')
    }
    glLayer = L.mapboxGL({
      updateInterval: 0,
      style: glStyles(layers, activeLayer, { theme }),
      hash: false
    })

    const glCompareLayerStyles = getCompareStyles(layers, activeLayer, this.props.map.times, theme)
    glCompareLayers = {
      before: L.mapboxGL({
        updateInterval: 0,
        style: glCompareLayerStyles.before,
        hash: false
      }),
      after: L.mapboxGL({
        updateInterval: 0,
        style: glCompareLayerStyles.after,
        hash: false
      })
    }

    // add glLayers if map state is already initialized
    if (this.props.map.view === 'country' || this.props.map.view === 'default') {
      glLayer.addTo(map)
    } else if (this.props.map.view === 'compare') {
      glCompareLayers.before.addTo(map)
      glCompareLayers.after.addTo(map)
      this.swiperMoved(window.innerWidth/2)
    }

    // init from route params
    if (this.props.region) {
      moveDirectly = true
      this.mapSetRegion(this.props.map.region, this.props.embed === false, this.props.embed === false)
    }

    if (this.props.stats.timeFilter) {
      glLayer._glMap.on('load', () =>
        this.setTimeFilter(this.props.stats.timeFilter)
      )
    }
  }

  componentWillReceiveProps(nextProps) {
    const { theme, layers } = this.props

    // ceck for changed url parameters
    if (nextProps.region !== this.props.region) {
      this.props.actions.setRegionFromUrl(nextProps.region)
    }
    if (nextProps.filters !== this.props.filters) {
      this.props.actions.setFiltersFromUrl(nextProps.filters)
    }
    if (nextProps.overlay !== this.props.overlay) {
      this.props.actions.setOverlayFromUrl(nextProps.overlay)
    }
    if (nextProps.overlay !== this.props.overlay) {
      this.props.actions.setOverlayFromUrl(nextProps.overlay)
    }
    if (nextProps.view !== this.props.view) {
      this.props.actions.setViewFromUrl(nextProps.view)
    }
    if (nextProps.times !== this.props.times) {
      this.props.actions.setTimesFromUrl(nextProps.times)
    }
    // check for changed map parameters
    if (nextProps.map.region !== this.props.map.region) {
      this.mapSetRegion(nextProps.map.region, nextProps.embed === false, nextProps.embed === false)
    }
    const nextActiveLayer = layers.find(layer => layer.name === nextProps.map.filters[0])
    if (nextProps.map.filters.join() !== this.props.map.filters.join()) { // todo: handle this in reducer?
      glLayer.setStyle(glStyles(layers, nextActiveLayer, {
        timeFilter: nextProps.stats.timeFilter,
        experienceFilter: nextProps.stats.experienceFilter,
        theme
      }))
      let glCompareLayerStyles = getCompareStyles(layers, nextActiveLayer, nextProps.map.times, theme)
      glCompareLayers.before.setStyle(glCompareLayerStyles.before)
      glCompareLayers.after.setStyle(glCompareLayerStyles.after)
    }
    if (nextProps.map.times !== this.props.map.times) {
      let glCompareLayerStyles = getCompareStyles(layers, nextActiveLayer, nextProps.map.times, theme)
      if (nextProps.map.times[0] !== this.props.map.times[0]) {
        glCompareLayers.before.setStyle(glCompareLayerStyles.before)
      }
      if (nextProps.map.times[1] !== this.props.map.times[1]) {
        glCompareLayers.after.setStyle(glCompareLayerStyles.after)
      }
    }
    // check for changed time/experience filter
    if (nextProps.stats.timeFilter !== this.props.stats.timeFilter) {
      this.setTimeFilter(nextProps.stats.timeFilter)
    }
    if (nextProps.stats.experienceFilter !== this.props.stats.experienceFilter) {
      this.setExperienceFilter(nextProps.stats.experienceFilter)
    }
    // check for switched map views (country/compare)
    if (nextProps.map.view !== this.props.map.view) {
      if (!(this.props.map.view === 'country' || this.props.map.view === 'default')
        && (nextProps.map.view === 'country' || nextProps.map.view === 'default')) {
        glCompareLayers.before.removeFrom(map)
        glCompareLayers.after.removeFrom(map)
        glLayer.addTo(map)
      }
      if (nextProps.map.view === 'compare') {
        glLayer.removeFrom(map)
        glCompareLayers.before.addTo(map)
        glCompareLayers.after.addTo(map)
        this.swiperMoved(window.innerWidth/2)
      }
    }
  }

  setViewportRegion() {
    var pixelBounds = map.getPixelBounds()
    var paddedLatLngBounds = L.latLngBounds(
      map.unproject(
        pixelBounds.getBottomLeft().add([30,-(20+212)])
      ),
      map.unproject(
        pixelBounds.getTopRight().subtract([30,-(70+52)])
      )
    ).pad(-0.15)
    this.props.actions.setRegion({
      type: 'bbox',
      coords: paddedLatLngBounds
        .toBBoxString()
        .split(',')
        .map(Number)
    })
  }

  setCustomRegion() {
    if (!boundsLayer) return
    this.props.actions.setRegion({
      type: 'polygon',
      coords: L.polygon(boundsLayer.getLatLngs()[1]).toGeoJSON().geometry.coordinates[0].slice(0,-1)
    })
  }

  mapSetRegion(region, isEditable, fitBoundsWithBottomPadding) {
    const { swiper: { poly } } = themes[this.props.theme]

    if (boundsLayer !== null && region === null) {
      map.removeLayer(boundsLayer)
      return
    }
    regionToCoords(region, 'leaflet')
    .then(function(region) {
      let coords = region.geometry.coordinates

      if (boundsLayer !== null) {
        map.removeLayer(boundsLayer)
      }
      boundsLayer = L[poly.shape](
        [[[-85.0511287798,-1E5],[85.0511287798,-1E5],[85.0511287798,2E5],[-85.0511287798,2E5],[-85.0511287798,-1E5]]]
        .concat(coords), {
        weight: poly.weight,
        color: poly.color,
        interactive: false
      }).addTo(map)

      if (isEditable) {
        boundsLayer.enableEdit()
      }

      // set map view to region
      try { // geometry calculcation are a bit hairy for invalid geometries (which may happen during polygon editing)
        let viewPort = bboxPolygon(map.getBounds().toBBoxString().split(',').map(Number))
        let xorAreaViewPort = erase(viewPort, L.polygon(boundsLayer.getLatLngs()[1]).toGeoJSON())
        let fitboundsFunc
        if (moveDirectly) {
          fitboundsFunc = ::map.fitBounds
          moveDirectly = false
        } else if (
          !xorAreaViewPort // new region fully includes viewport
          || area(xorAreaViewPort) > area(viewPort)*(1-0.01) // region is small compared to current viewport (<10% of the area covered) or feature is outside current viewport
        ) {
          fitboundsFunc = ::map.flyToBounds
        } else {
          fitboundsFunc = () => {}
        }
        fitboundsFunc(
          // zoom to inner ring!
          boundsLayer.getLatLngs().slice(1)
            .map(coords => L.polygon(coords).getBounds())
            .reduce((bounds1, bounds2) => bounds1.extend(bounds2)),
        {
          paddingTopLeft: [20, 10+52],
          paddingBottomRight: [20, 10+ ((fitBoundsWithBottomPadding) ? 212 : 52)]
        })
      } catch(e) {}
    });
  }

  setTimeFilter(timeFilter) {
    const { theme, layers } = this.props

    const activeLayer = layers.find(layer => layer.name === this.props.map.filters[0])
    const highlightLayers = glStyles(layers, activeLayer, { theme }).layers.filter(l => l.id.match(/highlight/))
    if (timeFilter === null) {
      // reset time filter
      highlightLayers.forEach(highlightLayer => {
        glLayer._glMap.setFilter(highlightLayer.id, ["==", "_timestamp", -1])
      })
    } else {
      highlightLayers.forEach(highlightLayer => {
        let layerFilter = ["any",
          ["all",
            [">=", "_timestamp", timeFilter[0]],
            ["<=", "_timestamp", timeFilter[1]]
          ],
          ["all",
            [">=", "_timestampMin", timeFilter[0]],
            ["<=", "_timestampMax", timeFilter[1]]
          ]
        ]
        if (highlightLayer.densityFilter) {
          layerFilter = ["all",
            highlightLayer.densityFilter,
            layerFilter
          ]
        }
        glLayer._glMap.setFilter(highlightLayer.id, layerFilter)
      })
    }
  }

  setExperienceFilter(experienceFilter) {
    const { theme, layers } = this.props

    const activeLayer = layers.find(layer => layer.name === this.props.map.filters[0])
    const highlightLayers = glStyles(layers, activeLayer, { theme }).layers.map(l => l.id).filter(id => id.match(/highlight/))
    if (experienceFilter === null) {
      // reset time filter
      highlightLayers.forEach(highlightLayer => {
        glLayer._glMap.setFilter(highlightLayer, ["==", "_timestamp", -1])
      })
    } else {
      highlightLayers.forEach(highlightLayer => {
        glLayer._glMap.setFilter(highlightLayer, ["all",
          [">=", "_userExperience", experienceFilter[0]],
          ["<=", "_userExperience", experienceFilter[1]]
        ])
      })
    }
  }

  swiperMoved(x) {
    if (!map) return
    const mapPanePos = map._getMapPanePos()
    const nw = map.containerPointToLayerPoint([0, 0])
    const se = map.containerPointToLayerPoint(map.getSize())
    const clipX = nw.x + (se.x - nw.x) * x / window.innerWidth
    glCompareLayers.before._glContainer.style.clip = 'rect(' + [nw.y+mapPanePos.y, clipX+mapPanePos.x, se.y+mapPanePos.y, nw.x+mapPanePos.x].join('px,') + 'px)'
    glCompareLayers.after._glContainer.style.clip = 'rect(' + [nw.y+mapPanePos.y, se.x+mapPanePos.x, se.y+mapPanePos.y, clipX+mapPanePos.x].join('px,') + 'px)'
  }

}



function mapStateToProps(state) {
  return {
    map: state.map,
    stats: state.stats
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(MapActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map)
