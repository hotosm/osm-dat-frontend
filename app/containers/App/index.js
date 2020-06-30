import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MapActions from '../../actions/map'
import * as StatsActions from '../../actions/stats'
import Header from '../../components/Header'
import EmbedHeader from '../../components/Header/embedHeader.js'
import Map from '../../components/Map'
import Stats from '../../components/Stats'
import CompareBar from '../../components/CompareBar'
import { load as loadHotProjects } from '../../data/hotprojects.js'
import themes from '../../settings/themes'
import { loadLayers } from '../../settings/options'
import style from './style.css'

class App extends Component {
  state = {
    hotProjectsLoaded: false,
    layersLoaded: false
  }

  render() {
    const { actions, routeParams, route, location, embed } = this.props
    const theme = routeParams.theme || 'default'
    var header = ""
    if (embed && route.view === "compare")
      header = <EmbedHeader layers={this.state.layers || []} {...actions} theme={theme}/>
    else if (!embed)
      header = <Header/>

    if (!this.state.hotProjectsLoaded || !this.state.layersLoaded) {
      return (
        <div className="main">
          {header}
          <p style={{ textAlign: "center", marginTop: "100px" }}>Loading…</p>
        </div>
      )
    }

    // update from route params
    if (route.view) {
      this.props.actions.setViewFromUrl(route.view)
    }
    if (routeParams.region) {
      this.props.actions.setRegionFromUrl(routeParams.region)
    }
    if (routeParams.filters) {
      this.props.actions.setFiltersFromUrl(routeParams.filters)
    }
    if (routeParams.overlay) {
      this.props.actions.setOverlayFromUrl(routeParams.overlay)
    }
    if (routeParams.times) {
      this.props.actions.setTimesFromUrl(routeParams.times)
    }

    if (location.query.experienceSelection) {
      this.props.statsActions.setExperienceFilter(
        location.query.experienceSelection.split(",").map(Number)
      )
    }
    if (location.query.timeSelection) {
      this.props.statsActions.setTimeFilter(
        location.query.timeSelection.split(",").map(Number)
      )
    }

    return (
      <div className="main">
        {header}
        <Map
          layers={this.state.layers}
          region={routeParams.region}
          filters={routeParams.filters}
          overlay={routeParams.overlay}
          times={routeParams.times}
          view={route.view}
          embed={embed}
          theme={theme}
        />
        {route.view === 'country' && embed === false ? <Stats layers={this.state.layers} mode={routeParams.overlay}/> : ''}
        {route.view === 'compare' && embed === false ? <CompareBar layers={this.state.layers} times={routeParams.times}/> : ''}
        { embed ? <a className="external-link" target='_blank' rel='noreferrer noopener' style={themes[theme].externalLink} href='http://osm-analytics.org/'>View on osm-analytics.org</a> : '' }
      </div>
    )
  }

  componentDidMount() {
    this.props.actions.setEmbedFromUrl(this.props.routeParams.embed === 'embed')
    this.props.actions.setThemeFromUrl(this.props.routeParams.theme)
    loadHotProjects((err) => {
      if (err) {
        console.error('unable to load hot projects data: ', err)
      }
      this.setState({ hotProjectsLoaded: true })
    })
    loadLayers((err, layers) => {
      if (err) {
        return console.error('unable to load available osm-analytics layers: ', err)
      }
      this.setState({
        layersLoaded: true,
        layers
      })
    })
  }
}

function mapStateToProps(state) {
  return {
    embed: state.map.embed
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(MapActions, dispatch),
    statsActions: bindActionCreators(StatsActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
