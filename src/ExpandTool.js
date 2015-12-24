import React from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import assign from 'object-assign'

import join from './join'

export default class ExpandTool extends Component {

  render(){
    const props = this.props

    return <div
      {...props}
      onMouseDown={this.onMouseDown}
    >
      x
    </div>
  }

  onMouseDown(event){
    event.preventDefault()

    const expanded = !this.props.expanded;

    console.log('exp: ', expanded)
    this.props.onExpandChange(expanded)
  }
}
