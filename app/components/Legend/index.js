import React, { Component } from 'react'
import * as request from 'superagent'
import moment from 'moment'
import style from './style.css'
import { filters as featureTypeOptions } from '../../settings/options'
import settings from '../../settings/settings'
import themes from '../../settings/themes'

class Legend extends Component {
  state = {}

  render() {
    const { showHighlighted, featureType, theme }  = this.props
    const featureTypeDescription = featureTypeOptions.find(f => f.id === featureType).description
    const { aggregatedFill, hightlightFill } = themes[theme]['styles'][featureType]

    const aggregatedStyle = { backgroundColor: aggregatedFill, borderColor: aggregatedFill }
    const highligthStyle =  { backgroundColor: hightlightFill, borderColor: aggregatedFill }

    var legendEntries = []
    if (this.props.zoom > 13) {
      legendEntries.push(<li>
        <span
          style={aggregatedStyle}
          className={'legend-icon feature '+featureType} />
        {featureTypeDescription}
        </li>)
      if (showHighlighted === true) {
        legendEntries.push(<li>
          <span
            style={highligthStyle}
            className={'legend-icon feature highlight '+featureType}></span>
          Highlighted {featureTypeDescription.toLowerCase()}
        </li>)
      }
    } else {
      legendEntries.push(
        <li>
          <span style={aggregatedStyle} className={'legend-icon high '+featureType}></span>
          High density of {featureTypeDescription.toLowerCase()}</li>,
        <li>
          <span style={aggregatedStyle} className={'legend-icon mid '+featureType}></span>
          Medium density of {featureTypeDescription.toLowerCase()}</li>,
        <li>
          <span style={aggregatedStyle} className={'legend-icon low '+featureType}></span>
          Low density of {featureTypeDescription.toLowerCase()}</li>
      )
      if (showHighlighted === true) {
        legendEntries.push(<li>
          <span style={highligthStyle} className={'legend-icon highlight '+featureType}></span>
          Area with mostly highlighted {featureTypeDescription.toLowerCase()}</li>)
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
