import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MapActions from '../../actions/map'
import Header from '../../components/Header'
import EmbedHeader from '../../components/Header/embedHeader.js'
import Map from '../../components/Map'
import Stats from '../../components/Stats'
import CompareBar from '../../components/CompareBar'
import { load as loadHotProjects } from '../../data/hotprojects.js'
import style from './style.css'

class App extends Component {
  state = {
    hotProjectsLoaded: false
  }

  render() {
    const { actions, routeParams, route, embed } = this.props
    const header = (embed) ? <EmbedHeader {...actions}/> : <Header/>;

    if (!this.state.hotProjectsLoaded) {
      return (
        <div className="main">
          {header}
        </div>
      )
      return <p style="text-align:center;">Loading…</p>
    }

    return (
      <div className="main">
        {header}
        <Map
          region={routeParams.region}
          filters={routeParams.filters}
          overlay={routeParams.overlay}
          times={routeParams.times}
          view={route.view}
          embed={embed}
          theme={routeParams.theme || 'default'}
        />
        {route.view === 'country' ? <Stats mode={routeParams.overlay}/> : ''}
        {route.view === 'compare' && embed === false ? <CompareBar times={routeParams.times}/> : ''}
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
  }
}

function mapStateToProps(state) {
  return {
    embed: state.map.embed
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
)(App)
