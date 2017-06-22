import React, { Component } from 'react'
import classnames from 'classnames'
import _ from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MapActions from '../../actions/map'
import 'react-select/dist/react-select.css'
import { compareTimes as timeOptions } from '../../settings/options'
import { filters } from '../../settings/options'
// import style from './style.css'

class EmbedHeader extends Component {
  onFeatureTypeClick(selectedFilters) {
    var enabledFilters = this.props.enabledFilters
    selectedFilters.filter(filter => enabledFilters.indexOf(filter) === -1).map(this.props.actions.enableFilter)
    enabledFilters.filter(filter => selectedFilters.indexOf(filter) === -1).map(this.props.actions.disableFilter)
  }

  render() {
    // const years = timeOptions.map(timeOption => ({
    //   label: timeOption.id,
    //   value: timeOption.timestamp
    // }))

    return (
      <div>
        <span>Before and after.</span>

        {/* years selector: use DropdownButton (already in project) */}

        {filters.filter(filter => filter.hidden !== true).map(filter => {
          return <button
            key={filter.id}
            className={classnames({ '-selected': this.props.enabledFilters !== undefined && filter.id === this.props.enabledFilters[0] })}
            onClick={_.partial(this.onFeatureTypeClick, [filter.id]).bind(this)}
          >
            {filter.description}
          </button>
        })}
      </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    enabledFilters: state.map.filters
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
)(EmbedHeader)
