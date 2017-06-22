import React, { Component } from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import { compareTimes as timeOptions } from '../../settings/options'
// import style from './style.css'

class EmbedHeader extends Component {
  logChange(val) {
    console.log("Selected: " + val)
  }
  render() {
    const years = timeOptions.map(timeOption => ({
      label: timeOption.id,
      value: timeOption.timestamp
    }))

    return (
      <div>
        Before and after.
        <Select
          name="form-field-name"
          options={years}
          onChange={this.logChange}
        />
        <Select
          name="form-field-name"
          options={years}
          onChange={this.logChange}
        />
        <button>Buildings</button>
        <button>Roads</button>
        <button>Waterways</button>
      </div>
    )
  }
}

export default EmbedHeader
