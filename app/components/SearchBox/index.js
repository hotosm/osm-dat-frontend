import React, { Component } from 'react'
import * as request from 'superagent'
import superagentPromisePlugin from 'superagent-promise-plugin'
import osmtogeojson from 'osmtogeojson'
import { simplify, polygon } from 'turf'
import Fuse from 'fuse.js'
import Autosuggest from 'react-autosuggest'
import hotProjects from '../../data/hotprojects.js'
import style from './style.css'

var hotProjectsList

function fuse (data) {
  return new Fuse(data, {
    keys: ['name'],
    include: ['score'],
    threshold: 0.4,
    shouldSort: false
  });
}

class SearchBox extends Component {
  state = {
    active: true,
    currentValue: '',
    fuse: null
  }

  onClick() {
    this.setState({active: true})
  }
  onKeyPress(event) {
    if (this.state.errored) this.setState({ errored: false })
    // enter key or search icon clicked
    var regionName = this.state.currentValue
    if (regionName && (event.type === 'click' || event.which === 13)) {
      if (regionName.match(/^\d+$/)) {
        let best = this.getSuggestions(regionName)[0]
        this.setState({currentValue: best.name})
        this.go(best)
      } else {
        this.goOSM(regionName)
      }
    }
  }
  getSuggestions(input, callback) {
    let suggestions = this.state.fuse.search(input)
    suggestions.sort((a, b) => {
      let diff = a.score - b.score
      return diff || (a.item.name < b.item.name ? -1 : 1)
    })
    suggestions = suggestions.map(s => s.item)

    if (input.match(/^\d+$/)) {
      suggestions = hotProjectsList.filter(p => p.id === +input).concat(suggestions)
    }

    if (callback) {
      callback(null, suggestions);
    }
    return suggestions
  }

  go(where) {
    this.props.setRegion({
      type: 'hot',
      id: where.id
    })
  }
  goOSM(where) {
    var setState = ::this.setState
    setState({ loading: true })
    var setRegion = this.props.setRegion
    request
    .get('http://osm-analytics.vizzuality.com/api/v1/gazeteer/search')
    .query({
      q: where
    })
    .use(superagentPromisePlugin)
    .then(function(res) {
      var hits = res.body.filter(r => r.osm_type !== 'node')
      if (hits.length === 0) throw new Error('nothing found for place name '+where)

      return request
      .get(`http://osm-analytics.vizzuality.com/api/v1/gazeteer/${hits[0].osm_type}/${hits[0].osm_id}`)
      .use(superagentPromisePlugin)
    })
    .then(function(res) {
      var osmFeature = osmtogeojson(JSON.parse(res.text)).features[0]
      if (!(osmFeature.geometry.type === 'Polygon' || osmFeature.geometry.type === 'MultiPolygon')) throw new Error('invalid geometry')
      var coords = osmFeature.geometry.coordinates
      if (osmFeature.geometry.type === 'MultiPolygon') {
        coords = coords.sort((p1,p2) => p2[0].length - p1[0].length)[0] // choose polygon with the longest outer ring
      }
      coords = coords[0]
      const maxNodeCount = 40 // todo: setting
      if (coords.length > maxNodeCount) {
        for (let simpl = 0.00001; simpl<100; simpl*=1.4) {
          let simplifiedFeature = simplify(polygon([coords]), simpl)
          if (simplifiedFeature.geometry.coordinates[0].length <= maxNodeCount) {
            coords = simplifiedFeature.geometry.coordinates[0]
            break
          }
        }
      }
      setState({ loading: false })
      setRegion({
        type: 'polygon',
        coords: coords.slice(0,-1)
      })
    })
    .catch(function(err) {
      console.error('error during osm region search:', err)
      setState({ loading: false, errored: true })
    })
  }

  render() {
    return (
      <div className="search">
        <Autosuggest
          suggestions={::this.getSuggestions}
          suggestionRenderer={s => ('#'+s.id+' '+s.name)}
          suggestionValue={s => s.name}
          onSuggestionSelected={s => this.go(s)}
          value={this.state.currentValue}
          scrollBar
          inputAttributes={{
            className: 'searchbox',
            placeholder: 'Search by region or HOT Project ID',
            type: 'search',
            onKeyPress: ::this.onKeyPress,
            onChange: value => ::this.setState({ currentValue: value })
          }}
        />
        <span
          className={'search-icon' + (this.state.loading ? ' loading' : '') + (this.state.errored ? ' errored' : '')}
          onClick={::this.onKeyPress}>
        </span>
      </div>
    )
  }

  componentDidMount() {
    hotProjectsList = hotProjects().features.map(f => ({ id: f.id, name: f.properties.name }))
    this.setState({
      fuse: fuse(hotProjectsList)
    })

    if (this.props.selectedRegion) {
      if (this.props.selectedRegion.type === 'hot') {
        this.setState({
          currentValue: hotProjectsList.find(p => p.id === this.props.selectedRegion.id).name
        })
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedRegion) {
      if (nextProps.selectedRegion.type === 'hot') {
        this.setState({
          currentValue: hotProjectsList.find(p => p.id === nextProps.selectedRegion.id).name
        })
      }
    }
  }
}

export default SearchBox
