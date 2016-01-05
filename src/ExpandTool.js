import React, { PropTypes } from 'react'
import Component from 'react-class'
import assign from 'object-assign'

const DOWN = '▼'
const UP = '▲'

export default class ExpandTool extends Component {

  render(){
    const props = this.props
    
    const toolProps = assign({}, props, {
      className: 'react-combo__expand-tool',
      onMouseDown: this.onMouseDown,
      children: props.expanded? UP: DOWN,
      expanded: props.expanded
    })
    
    const renderExpandTool = props.renderExpandTool
    
    let result
    
    if (renderExpandTool){
      result = renderExpandTool(toolProps)
    }
    if (result === undefined){
      result = <div {...toolProps} />
    }
    return result
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
