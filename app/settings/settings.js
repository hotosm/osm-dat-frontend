const mapbox_token = 'pk.eyJ1IjoiaG90IiwiYSI6ImNpbmx4bWN6ajAwYTd3OW0ycjh3bTZvc3QifQ.KtikS4sFO95Jm8nyiOR4gQ'

export default {
  'vt-source': 'https://tiles.osm-analytics.heigit.org', // source of current vector tiles
  'vt-gaps-source': 'https://tiles.osm-analytics.heigit.org/gaps',
  'vt-hist-source': 'https://tiles.osm-analytics.heigit.org', // source of historic vector tiles for compare feature
  'map-background-tile-layer': 'https://api.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=' + mapbox_token,
  'map-attribution': '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
  'tm-api': 'https://tasking-manager-tm4-production-api.hotosm.org/api/v2', // hot tasking manager api
}
