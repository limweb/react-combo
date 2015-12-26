import React, { PropTypes } from 'react'
import Component from 'react-class'

const DOWN = '▼'
const UP = '▲'

export default class ExpandTool extends Component {

  render(){
    const props = this.props

    return <div
      {...props}
      className="react-combo__expand-tool"
      onMouseDown={this.onMouseDown}
    >
      {props.expanded? UP: DOWN}
    </div>
  }

  onMouseDown(event){
    //prevent default so that the field does not get blurred
    this.props.focused && event.preventDefault()

    const expanded = !this.props.expanded;

    this.props.onExpandChange(expanded)
  }
}

ExpandTool.propTypes = {
  focused: PropTypes.bool,
  expanded: PropTypes.bool,
  onExpandChange: PropTypes.func
}
