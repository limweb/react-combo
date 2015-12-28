import React from 'react'
import assign from 'object-assign'

import Field from 'react-field'

import join from './join'
import clamp from './clamp'

const renderField = function(props) {
  const displayValue = props.multiSelect?
                        props.displayValue.join(', '):
                        props.displayValue

  let fieldProps = assign({}, props.fieldProps, {
    value: displayValue,
    tabIndex: -1,
    ref: (f) => this.field = f,

    onFocus: this.onFieldFocus,
    onBlur: this.onFieldBlur,
    onKeyDown: this.onFieldKeyDown
  })

  if (props.dropdown){
    fieldProps.readOnly = true
  }

  fieldProps.className = join(
    fieldProps.className,
    'react-combo__field'
  )

  if (props.onRenderField){
    fieldProps = props.onRenderField(fieldProps)
  }

  let field

  if (props.renderField){
    field = props.renderField(fieldProps)
  }

  if (field === undefined){
    field = <Field {...fieldProps} />
  }

  return field
}

const onFieldFocus = function(event) {
  this.setState({
    focused: true
  })

  if (this.props.expandOnFocus && !this.state.expanded){
    this.toggleList()
  }

  this.props.onFocus(event)

  if (this.props.fieldProps && this.props.fieldProps.onFocus){
    this.props.fieldProps.onFocus(event)
  }
}

const onFieldBlur = function(event){
  this.setState({
    focused: false
  })

  if (this.state.expanded){
    // this.toggleList()
  }

  this.props.onBlur(event)

  if (this.props.fieldProps && this.props.fieldProps.onBlur){
    this.props.fieldProps.onBlur(event)
  }
}

const onFieldKeyDown = function(event){

  const arrowDown = event.key === 'ArrowDown'
  const arrowUp = event.key === 'ArrowUp'
  const arrow = arrowUp || arrowDown

  if (this.props.dropdown && arrow){
    event.preventDefault()
  }

  if (!this.state.expanded && arrow){
    return this.toggleList()
  }

  arrowDown && this.navigate(1)
  arrowUp && this.navigate(-1)

  if (event.key == 'Enter'){
    this.selectAt(this.p.currentIndex)
  }
}

const navigate = function (dir) {

  dir = dir < 0? -1: 1

  const currentIndex = this.p.currentIndex

  let newCurrentIndex

  if (currentIndex == null ){
    newCurrentIndex = 0
  } else {
    newCurrentIndex = clamp(currentIndex + dir, 0, this.p.data.length - 1)
  }

  this.props.onNavigate(newCurrentIndex)

  if (this.props.currentIndex == null){
    this.setState({
      currentIndex: newCurrentIndex
    })
  }
}

const toggleList = function(){
  this.onExpandChange(!this.state.expanded)
}

export default {
  renderField,
  onFieldFocus,
  onFieldBlur,
  onFieldKeyDown,
  toggleList,
  navigate
}
