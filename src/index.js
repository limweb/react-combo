import React from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import assign from 'object-assign'

import Field from 'react-field'

import ExpandTool from './ExpandTool'

import join from './join'

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
      data={null}
      tabIndex={this.state.focused? -1: this.props.tabIndex || 0}
      onFocus={this.onFocus}
    >
      {this.renderField(props)}
      <ExpandTool onExpandChange={this.onExpandChange} focused={this.state.focused} expanded={expanded} />
    </div>
  }

  onExpandChange(value){
    this.setState({
      expanded: value
    })

    this.props.onExpandChange(value)
  }

  renderField(props){

    const fieldProps = assign({}, props.fieldProps)
    const className = join(
      fieldProps.className,
      'react-combo__field'
    )

    return <Field
      tabIndex={-1}
      ref={(f) => this.field = f}
      className={className}
      onFocus={this.onFieldFocus}
      onBlur={this.onFieldBlur}
    />
  }

  onFieldFocus(event){

    this.setState({
      focused: true
    })

    this.props.onFocus(event)
  }

  onFieldBlur(event){
    this.setState({
      focused: false
    })

    this.props.onBlur(event)
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

Combo.defaultProps = {
  onExpandChange: () => {},
  onFocus: () => {},
  onBlur: () => {}
}

