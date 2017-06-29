import themeBuildings from './templates/buildings'
import themeHighways from './templates/highways'
import themePois from './templates/pois'
import themeWaterways from './templates/waterways'

const buildings = themeBuildings({
  aggregatedFill: '#FDB863',
  highlightFill: '#5CBAD8',
  outline: '#E08214'
})

const highways = themeHighways({
  aggregatedFill: '#9e9ac8',
  highlightFill: '#5CBAD8'
})

const pois = themePois({
  aggregatedFill: '#FF0000',
  highlightFill: '#5CBAD8'
})

const waterways = themeWaterways({
  aggregatedFill: '#c89ab7',
  hightlightFill: '#5CBAD8'
})

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
  buildings,
  highways,
  pois,
  waterways
}
