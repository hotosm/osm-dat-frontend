import themeBuildings from './templates/buildings'
import themeHighways from './templates/highways'
import themePois from './templates/pois'
import themeWaterways from './templates/waterways'

const buildings = {
  aggregatedFill: '#FDB863',
  highlightFill: '#5CBAD8',
  outline: '#E08214'
}

const highways = {
  aggregatedFill: '#9e9ac8',
  highlightFill: '#5CBAD8'
}

const pois = {
  aggregatedFill: '#FF0000',
  highlightFill: '#5CBAD8'
}

const waterways = {
  aggregatedFill: '#c89ab7',
  hightlightFill: '#5CBAD8'
}

export default {
  swiper: {
    backgroundColor: 'rgba(75,90,106, 0.8)',
    borderColor: '#FFFFFF',
    poly: {
      shape: 'polygon',
      color: 'grey',
      weight: 1
    }
  },

  styles: {
    buildings,
    highways,
    pois,
    waterways
  },

  buildings: themeBuildings(buildings),
  highways: themeHighways(highways),
  pois: themePois(pois),
  waterways: themeWaterways(waterways)
}
