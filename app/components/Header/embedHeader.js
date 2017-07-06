import React, { Component } from 'react'
import classnames from 'classnames'
import _ from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MapActions from '../../actions/map'
import { compareTimes as timeOptions } from '../../settings/options'
import { filters } from '../../settings/options'
import DropdownButton from '../DropdownButton'
import './embedHeader.css'

class EmbedHeader extends Component {
  onFeatureTypeClick(selectedFilters) {
    var enabledFilters = this.props.enabledFilters
    selectedFilters.filter(filter => enabledFilters.indexOf(filter) === -1).map(this.props.actions.enableFilter)
    enabledFilters.filter(filter => selectedFilters.indexOf(filter) === -1).map(this.props.actions.disableFilter)
  }

  onYearChangeClick(isEnd, selectedYears) {
    const newTimes = []
    newTimes[0] = (isEnd === true) ? this.props.times[0] : selectedYears[0]
    newTimes[1] = (isEnd === true) ? selectedYears[0] : this.props.times[1]
    this.props.actions.setTimes(newTimes)
  }

  render() {
    const years = timeOptions.map(timeOption => ({
      id: timeOption.id,
      description: timeOption.id
    }))
    const yearsList = timeOptions.map(timeOption => timeOption.id)

    const yearStart = this.props.times[0]
    const yearEnd = this.props.times[1]

    // don't allow year start after year end and vice versa
    const yearsEndIndex = yearsList.indexOf(yearEnd)
    const yearsStart = years.slice(0, yearsEndIndex)
    const yearsStartIndex = yearsList.indexOf(yearStart)
    const yearsEnd = years.slice(yearsStartIndex + 1)
    return (
      <header className="embedHeader">
        <div className="left">
          <span className="title">Before and after.</span>

          <DropdownButton
            style={{marginRight: '150px'}}
            options={yearsStart}
            btnElement={<button title='Select time range'>{yearStart}&ensp;▾</button>}
            multiple={false}
            selectedKeys={[yearStart]}
            onSelectionChange={_.partial(this.onYearChangeClick, false).bind(this)}
          />

          <DropdownButton
            options={yearsEnd}
            btnElement={<button title='Select time range'>{yearEnd}&ensp;▾</button>}
            multiple={false}
            selectedKeys={[yearEnd]}
            onSelectionChange={_.partial(this.onYearChangeClick, true).bind(this)}
          />
        </div>

        <div>
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
      </header>
    )
  }
}


function mapStateToProps(state) {
  return {
    enabledFilters: state.map.filters,
    times: state.map.times
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
