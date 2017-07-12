import React, { Component } from 'react'
import themes from '../../settings/themes'
import cx from 'classnames'

class Button extends Component {
  constructor (props) {
    super(props)
    this.setHover = this.setHover.bind(this)
    this.state = {
      hover: false,
      active: false
    }
  }

  setHover (hover) {
    this.setState({ hover })
  }

  render () {
    const { children, disabled, active, theme, className, ...rest } = this.props
    const { hover } = this.state
    const styles = themes[theme].buttons

    const style = disabled
      ? styles.button
      : hover
        ? styles.hover
        : active ? styles.active : styles.button

    return (
      <button
        style={style}
        className={cx(className, { disabled })}
        onMouseOver={() => this.setHover(true)}
        onMouseOut={() => this.setHover(false)}
        {...rest}
      >
        {children}
      </button>
    )
  }
}

export default Button
