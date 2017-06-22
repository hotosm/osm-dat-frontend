/* eslint indent: "off" */
import { handleActions } from 'redux-actions'
import { createHashHistory } from 'history'
import polyline from 'polyline'

import {
  filters as filterOptions,
  overlays as overlayOptions,
  compareTimes as timeOptions
} from '../settings/options'
import defaults from '../settings/defaults'

var history = createHashHistory({ queryKey: false })

const initialState = {
  view: 'default',
  times: ['2011', 'now'],
  region: null,
  filters: defaults.filters,
  overlay: defaults.overlay,
  hotOverlay: false
}

export default handleActions({
  'set region' (state, action) {
    var newState = Object.assign({}, state, {
      view: state.view === 'default' ? 'show' : state.view,
      region: action.payload
    })
    updateURL(newState)
    return newState
  },
  'set region from url' (state, action) {
    return Object.assign({}, state, {
      view: state.view === 'default' ? 'show' : state.view,
      region: parseRegionFromUrl(action.payload)
    })
  },

  'enable filter' (state, action) {
    var newState
    if (state.filters.indexOf(action.payload) === -1) {
      newState = Object.assign({}, state, {
        filters: state.filters.concat(action.payload)
      })
    } else {
      newState = state
    }
    updateURL(newState)
    return newState
  },
  'disable filter' (state, action) {
    var newState = Object.assign({}, state, {
      filters: state.filters.filter(filter => filter !== action.payload)
    })
    updateURL(newState)
    return newState
  },
  'set filters from url' (state, action) {
    if (action.payload === undefined) return state
    return Object.assign({}, state, {
      filters: action.payload !== 'none'
        ? action.payload.split(',').filter(filter =>
            filterOptions.some(filterOption =>
              filterOption.id === filter
            )
          )
        : []
    })
  },

  'set overlay' (state, action) {
    var newState = Object.assign({}, state, {
      overlay: action.payload
    })
    updateURL(newState)
    return newState
  },
  'set overlay from url' (state, action) {
    if (action.payload === undefined) return state
    if (!overlayOptions.some(overlayOption => overlayOption.id === action.payload)) return state
    return Object.assign({}, state, {
      overlay: action.payload
    })
  },

  'set view' (state, action) {
    var newState = Object.assign({}, state, {
      view: action.payload
    })
    updateURL(newState)
    return newState
  },
  'set view from url' (state, action) {
    return Object.assign({}, state, {
      view: action.payload
    })
  },

  'set times' (state, action) {
    var newState = Object.assign({}, state, {
      times: action.payload
    })
    updateURL(newState)
    return newState
  },
  'set times from url' (state, action) {
    if (action.payload === undefined) return state
    const timesArray = action.payload.split('...')
    if (!timesArray.every(time =>
      timeOptions.some(timeOption =>
        timeOption.id === time
      )
    )) {
      return state
    }
    return Object.assign({}, state, {
      times: timesArray
    })
  },

  'enable hot overlay' (state, action) {
    return Object.assign({}, state, {
      hotOverlay: true
    })
  },
  'disable hot overlay' (state, action) {
    return Object.assign({}, state, {
      hotOverlay: false
    })
  }
}, initialState)

function updateURL(state) {
  const view = state.view === 'country' ? 'show' : state.view
  const region = state.region
  const filtersPart = state.filters.length > 0
    ? state.filters.sort().join(',')
    : 'none'
  const overlayPart = state.overlay
  const timesPart = state.times.join('...')
  const options = state.view === 'compare'
    ? timesPart + '/' + filtersPart
    : filtersPart + '/' + overlayPart
  if (region !== null) {
    switch (region.type) {
    case 'bbox':
      history.replace('/'+view
        +'/bbox:'
        +region.coords.map(x => x.toFixed(5)).join(',')
        +'/'+options
      )
    break
    case 'polygon':
      history.replace('/'+view
        +'/polygon:'
        +encodeURIComponent(
          polyline.encode(
            region.coords
          )
        )
        +'/'+options
      )
    break
    case 'hot':
      history.replace('/'+view
        +'/hot:'
        +region.id
        +'/'+options
      )
    break
    default:
      throw new Error('unknown region type', region)
    }
  }
}

function parseRegionFromUrl(regionString) {
  if (!regionString) {
    return null
  }
  const [ regionType, regionContent ] = regionString.split(':')
  switch (regionType) {
    case 'bbox':
      return {
        type: 'bbox',
        coords: regionContent.split(',').map(Number)
      }
    break
    case 'polygon':
      return {
        type: 'polygon',
        coords: polyline.decode(decodeURIComponent(regionContent))
      }
    break
    case 'hot':
      return {
        type: 'hot',
        id: +regionContent
      }
    break
    default:
      throw new Error('unknown region type when parsing from URL', regionString)
  }
}
