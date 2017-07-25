import React, { Component } from 'react'

class Swiper extends Component {
  render() {
    const { swiper } = this.props.theme
    return (
      <div className="compare" style={this.state.style}>
        <div style={swiper} className="swiper" onMouseDown={::this._onDown} onTouchStart={::this._onDown}></div>
      </div>
    )
  }

  componentDidMount() {
    document.addEventListener('mousemove', ::this._onMove)
    document.addEventListener('touchmove', ::this._onMove)
    document.addEventListener('mouseup',  ::this._onUp)
    document.addEventListener('touchend', ::this._onUp)
    this._setPosition(window.innerWidth/2)
  }

  state = {
    style: {},
    active: false
  }

  _onDown(e) {
    this.setState({ active: true })
  }
  _onUp() {
    this.setState({ active: false })
  }
  _onMove(e) {
    if (!this.state.active) return
    e.preventDefault()
    this._setPosition(this._getX(e))
  }
  _setPosition(x) {
    var pos = 'translate(' + x + 'px, 0)'
    this.setState({
      style: {
        transform: pos,
        WebkitTransform: pos,
        MsTransform: pos
      }
    })
    this.props.onMoved(x)
  }
  _getX(e) {
    e = e.touches ? e.touches[0] : e
    return e.clientX
    //var x = e.clientX - this._bounds.left;
    //if (x < 0) x = 0;
    //if (x > this._bounds.width) x = this._bounds.width;
    //return x;
  }
}

export default Swiper
