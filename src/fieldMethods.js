import React from 'react'
import assign from 'object-assign'

import Field from 'react-field'

import join from './join'

const renderField = function(props) {
  let fieldProps = assign({}, props.fieldProps, {
    tabIndex: -1,
    ref: (f) => this.field = f,

    onFocus: this.onFieldFocus,
    onBlur: this.onFieldBlur,
    onKeyDown: this.onFieldKeyDown
  })

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
    this.toggleList()
  }

  this.props.onBlur(event)

  if (this.props.fieldProps && this.props.fieldProps.onBlur){
    this.props.fieldProps.onBlur(event)
  }
}

const onFieldKeyDown = function(event){
  if (!this.state.expanded && event.key == 'ArrowDown'){
    return this.toggleList()
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
  toggleList
}
