import React, { Component } from 'react'
import * as request from 'superagent'
import moment from 'moment'
import style from './style.css'
import { filters as featureTypeOptions } from '../../settings/options'
import settings from '../../settings/settings'

class Legend extends Component {
  state = {}

  render() {
    const featureTypeDescription = featureTypeOptions.find(f => f.id === this.props.featureType).description
    const { showHighlighted }  = this.props

    var legendEntries = []
    if (this.props.zoom > 13) {
      legendEntries.push(<li><span className={'legend-icon feature '+this.props.featureType}></span>{featureTypeDescription}</li>)
      if (showHighlighted === true) {
        legendEntries.push(<li><span className={'legend-icon feature highlight '+this.props.featureType}></span>Highlighted {featureTypeDescription.toLowerCase()}</li>)
      }
    } else {
      legendEntries.push(
        <li><span className={'legend-icon high '+this.props.featureType}></span>High density of {featureTypeDescription.toLowerCase()}</li>,
        <li><span className={'legend-icon mid '+this.props.featureType}></span>Medium density of {featureTypeDescription.toLowerCase()}</li>,
        <li><span className={'legend-icon low '+this.props.featureType}></span>Low density of {featureTypeDescription.toLowerCase()}</li>
      )
      if (showHighlighted === true) {
        legendEntries.push(<li><span className={'legend-icon highlight '+this.props.featureType}></span>Area with mostly highlighted {featureTypeDescription.toLowerCase()}</li>)
      }
    }
    if (this.props.hotOverlayEnabled) {
      legendEntries.push(
        <li><span className={'legend-icon hot-projects'}></span>HOT project outline</li>
      )
    }
    return (
      <ul id="legend">
        <li><h3>Map Legend</h3></li>
        {legendEntries}
        <li>Last Data Update: {this.state.lastModified
        ? <span title={this.state.lastModified}>{moment(this.state.lastModified).fromNow()}</span>
        : ''
        }</li>
      </ul>
    )
  }

  componentDidMount() {
    this.updateLastModified(this.props.featureType)
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.featureType !== this.props.featureType) {
      this.updateLastModified(nextProps.featureType)
    }
  }

  updateLastModified(featureType) {
    request.head(settings['vt-source']+'/'+featureType+'/0/0/0.pbf').end((err, res) => {
      if (!err) this.setState({
        lastModified: res.headers['last-modified']
      })
    })
  }

}

export default Legend
