import themeBuildings from './templates/buildings'
import themeHighways from './templates/highways'
import themePois from './templates/pois'
import themeWaterways from './templates/waterways'

const blue = '#1e79c6'

const buildings = themeBuildings({
  aggregatedFill: blue,
  highlightFill: blue,
  outline: blue
})

const highways = themeHighways({
  aggregatedFill: blue,
  highlightFill: blue
})

const pois = themePois({
  aggregatedFill: blue,
  highlightFill: blue
})

const waterways = themeWaterways({
  aggregatedFill: blue,
  hightlightFill: blue
})

export default {
  swiper: {
    backgroundColor: blue,
    borderColor: blue,
    poly: {
      shape: 'polyline',
      color: blue,
      weight: 2
    }
  },
  buildings,
  highways,
  pois,
  waterways
}
