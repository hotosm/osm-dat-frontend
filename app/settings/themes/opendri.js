import themeBuildings from './templates/buildings'
import themeHighways from './templates/highways'
import themePois from './templates/pois'
import themeWaterways from './templates/waterways'

const blue = '#8DCCFD'
const UIBlue = '#1477c9'

const buildings = {
  aggregatedFill: blue,
  highlightFill: blue,
  outline: blue
}

const highways = {
  aggregatedFill: blue,
  highlightFill: blue
}

const pois = {
  aggregatedFill: blue,
  highlightFill: blue
}

const waterways = {
  aggregatedFill: blue,
  hightlightFill: blue
}

export default {
  swiper: {
    backgroundColor: UIBlue,
    borderColor: UIBlue,
    poly: {
      shape: 'polyline',
      color: UIBlue,
      weight: 2
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
