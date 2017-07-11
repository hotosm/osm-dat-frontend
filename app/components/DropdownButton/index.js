import React, { Component } from 'react'
import style from './style.css'
import themes from '../../settings/themes'
import Dropdown from 'rc-dropdown'
import Menu, { Item as MenuItem, Divider } from 'rc-menu'

class DropdownButton extends Component {
  state = {
    visible: false
  }

  render() {
    const { theme } = this.props
    const menu = (
      <Menu
        style={theme && themes[theme].dropDownList || {}}
        multiple={this.props.multiple}
        selectedKeys={this.props.selectedKeys}
        onClick={onClick.bind(this)}
        onSelect={onSelect.bind(this)}
        onDeselect={onSelect.bind(this)}
        className={this.props.multiple ? 'checkboxes' : ''}
      >
        {this.props.options.map(option => (
          option.type === 'divider'
            ? <Divider />
            : <MenuItem key={option.id}>{option.description}</MenuItem>
        ))}
      </Menu>
    )
    return (
      <Dropdown
        trigger={['click']}
        overlay={menu}
        onVisibleChange={onVisibleChange.bind(this)}
        visible={this.state.visible}
        selectedKeys={this.props.selected || [this.props.options[0].key]}
        overlayClassName={this.props.className}>
        {this.props.btnElement}
      </Dropdown>
    )
  }
}

function onVisibleChange(visible) {
  this.setState({ visible })
}

function onClick({ selectedKeys }) {
  if (!this.props.multiple) {
    this.setState({
      visible: false
    })
  }
}

function onSelect({ selectedKeys }) {
  this.state
  this.props.onSelectionChange(selectedKeys)
}

export default DropdownButton
