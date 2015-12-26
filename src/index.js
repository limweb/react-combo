import React from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import assign from 'object-assign'

import Field from 'react-field'

import ExpandTool from './ExpandTool'

import join from './join'
import fieldMethods from './fieldMethods'
import listMethods from './listMethods'

export default class Combo extends Component {

  constructor(props){
    super(props)

    this.state = {
      focused: false,
      expanded: false
    }
  }

  render(){
    const props = this.prepareProps(this.props)
    const expanded = this.state.expanded

    return <div
      {...props}
      style={null}
      data={null}
      tabIndex={this.state.focused? -1: this.props.tabIndex || 0}
      onFocus={this.onFocus}
    >
      <div className="react-combo__wrapper" style={props.style}>
        {this.renderField(props)}
        <ExpandTool
          onExpandChange={this.onExpandChange}
          focused={this.state.focused}
          expanded={expanded}
        />
      </div>

      {this.renderList(props)}
    </div>
  }

  onExpandChange(value){
    this.setState({
      expanded: value
    })

    this.props.onExpandChange(value)
  }

  onFocus(){
    this.focusField()
  }

  prepareProps(thisProps){
    const props = assign({}, thisProps)

    props.focused = this.state.focused
    props.expanded = this.state.expanded

    props.className = join(
      'react-combo',
      props.className,
      props.focused && join(props.focusedClassName, 'react-combo--focused'),
      props.expanded && join(props.expandedClassName, 'react-combo--expanded')
    )

    return props
  }

  focusField(){
    const input = findDOMNode(this.field);

    input.focus()
  }
}

assign(
  Combo.prototype,
  fieldMethods,
  listMethods
);

Combo.defaultProps = {
  onExpandChange: () => {},
  onFocus: () => {},
  onBlur: () => {},

  expandOnFocus: true,

  idProperty: 'id',
  displayProperty: 'label'
}

