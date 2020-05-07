import React, { Component } from 'react'
import Modal from 'react-modal'
import * as request from 'superagent'
import { queue } from 'd3-queue'
import settings from '../../settings/settings'

const initialHowMany = 10

class HotProjectsModal extends Component {
  state = {
    howMany: initialHowMany,
    loading: false
  }

  projectProperties = {}

  render() {
    const propertiesLoaded = p => this.projectProperties[p.properties.projectId] !== undefined
    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
        className={this.state.loading ? 'updating' : ''}
        style={this.props.style}>
        <h3>HOT Projects{this.state.howMany < this.props.hotProjects.length ? ' ('+this.state.howMany+'/'+this.props.hotProjects.length+')': ''}</h3>
        <a className="close-link" onClick={this.props.onRequestClose}>x</a>
        <ul className="hot-projects">
        {this.props.hotProjects.slice(0,this.state.howMany).map(p =>
          <li key={p.properties.projectId}>
            <a className="link" href={"http://tasks.hotosm.org/project/"+p.properties.projectId}>#{
              p.properties.projectId
            } <span title={propertiesLoaded(p) ? this.projectProperties[p.properties.projectId].shortDescription : 'loading project information'}>{
              propertiesLoaded(p) ? this.projectProperties[p.properties.projectId].name + ' (' + this.projectProperties[p.properties.projectId].created.substr(0, 10) + ')' : '…'
            }</span></a>
          </li>
        )}
          <li>{this.props.hotProjects.length > this.state.howMany
            ? <button onClick={::this.expand}>show more</button>
            : ''}
          </li>
        </ul>
      </Modal>
    )
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isOpen) return
    this.loadprojectPropertiesFor(nextProps.hotProjects.slice(0,initialHowMany).map(project => project.properties.projectId))
  }

  expand() {
    this.loadprojectPropertiesFor(this.props.hotProjects.slice(this.state.howMany,this.state.howMany+initialHowMany).map(project => project.properties.projectId))
    this.setState({
      howMany: this.state.howMany + initialHowMany
    })
  }

  loadprojectPropertiesFor(projectIds) {
    this.setState({ loading: true })
    var q = queue()
    var projectIdsToRequest = projectIds.filter(projectId => !this.projectProperties[projectId])

    projectIdsToRequest.forEach(projectId => {
      let req = request.get(settings['tm-api'] + '/projects/'+projectId+'/queries/summary/')
      q.defer(req.end.bind(req))
    })
    q.awaitAll(function(err, data) {
      if (err) {
        console.error(err)
      } else {
        projectIdsToRequest.forEach((projectId, idx) => {
          this.projectProperties[projectId] = data[idx].body
        })
      }
      this.setState({ loading: false })
    }.bind(this))
  }
}

export default HotProjectsModal
