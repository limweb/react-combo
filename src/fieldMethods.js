import React from 'react'
import { findDOMNode } from 'react-dom'
import assign from 'object-assign'

import Field from 'react-field'

import join from './join'
import clamp from './clamp'

import getSelectionStart from './getSelectionStart'
import getSelectionEnd from './getSelectionEnd'

const renderField = function(props) {
  let fieldProps = assign({}, props.fieldProps, {
    value: props.text,
    tabIndex: -1,
    ref: (f) => this.field = f,

    onFocus: this.onFieldFocus,
    onBlur: this.onFieldBlur,
    onKeyDown: this.onFieldKeyDown,
    onChange: this.onFieldChange
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

  if (this.state.focused){
    return
  }

  if (this.props.expandOnFocus && !this.state.expanded){
    this.toggleList()
  }

  this.props.onFocus(event)

}

const onFieldBlur = function(event){
  this.setState({
    focused: false
  }, () => {
    if (this.state.focused){
      return
    }

    this.setState({
      activeTagIndex: -1
    })

    console.log('blur!!!')

    this.props.forceSelect && this.setText('')
    this.onBlur(event)

    if (this.state.expanded){
      this.toggleList()
    }
  })
}

const onFieldKeyDown = function(event){

  const key = event.key
  const arrowDown = key === 'ArrowDown'
  const arrowUp = key === 'ArrowUp'
  const arrow = arrowUp || arrowDown
  const props = this.p

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
    this.navigate(1)//go to next item
  }

  if (event.key == 'Escape' && this.state.expanded){
    return this.toggleList()
  }

  if (!props.multiSelect) {
    return
  }

  //now deal with navigation between tags

  if (key != 'Backspace' && key != 'ArrowLeft' && key != 'ArrowRight' && key != 'Delete'){
    return
  }

  const text = props.text + ''
  const tags = props.value

  const selectionStart = this.getSelectionStart()
  const selectionEnd = this.getSelectionEnd()

  if (selectionStart < selectionEnd){
    return
  }

  let textToLeft
  let textToRight
  let index = props.activeTagIndex

  if (key == 'ArrowLeft' || key == 'Backspace'){
    textToLeft = text.substring(0, selectionStart)
  }
  if (key == 'ArrowRight' || key == 'Delete'){
    textToRight = text.substring(selectionEnd)
  }

  if ((key == 'Backspace' || key == 'ArrowLeft') && textToLeft === ''){
    //if there is no other character at the left of the cursor
    //go to the tag before the cursor
    if (index == -1){
      index = tags.length
    }

    index--

    if (index >= 0){
      this.setActiveTag(index)
      event.preventDefault()
    }
  }

  if ((key == 'ArrowRight' || key == 'Delete') && index == -1 && textToRight == '' && tags.length){
    this.setActiveTag(index + 1)
    event.preventDefault()
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

const onFieldChange = function (value) {

  if (!this.state.expanded){
    this.toggleList()
  }

  this.setText(value)
}

const toggleList = function(){
  this.onExpandChange(!this.state.expanded)
}

const renderHiddenField = function(props){
  if (!props.multiSelect){
    return null
  }

  return <input
    tabIndex={-1}
    ref={(f) => this.hiddenField = f}
    key="hiddenFocusField"
    type="text"
    className="react-combo__hidden-field"
    onFocus={this.onHiddenFieldFocus}
    onBlur={this.onHiddenFieldBlur}
    onKeyDown={this.onHiddenFieldKeyDown}
  />
}

const onHiddenFieldFocus = function(){
  const props = this.p

  this.setState({
    focused: true
  })
}

const onHiddenFieldBlur = function(event){
  this.onFieldBlur(event)
}

const onHiddenFieldKeyDown = function(event){
  const props = this.p
  const key = event.key
  let index = props.activeTagIndex
  const tags = props.value

  let dir = 0

  if (key == 'ArrowUp' || key == 'ArrowDown' || key == ' '){
    event.preventDefault()
    return
  }

  if (key == 'Escape'){
    event.preventDefault()
    this.setActiveTag(-1)
    return
  }

  if (key == 'ArrowLeft'){
    dir = -1
  }
  if (key == 'ArrowRight'){
    dir = 1
  }

  if (dir){

    if (clamp(index + dir, 0, tags.length - 1) == index + dir){
      index += dir
    } else {
      index = -1
    }

    this.setActiveTag(index)

    event.preventDefault()

    return
  }

  if (key == 'Backspace' || key == 'Delete'){
    this.removeAt(index, key == 'Backspace'? -1: 0)
    event.preventDefault()
  }
}

export default {
  renderField,
  onFieldFocus,
  onFieldBlur,
  onFieldKeyDown,
  onFieldChange,
  toggleList,
  navigate,
  renderHiddenField,
  onHiddenFieldFocus,
  onHiddenFieldBlur,
  onHiddenFieldKeyDown,
  getSelectionStart(){
    return getSelectionStart(findDOMNode(this.field))
  },
  getSelectionEnd(){
    return getSelectionEnd(findDOMNode(this.field))
  }
}
