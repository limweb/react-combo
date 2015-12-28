import React from 'react'
import assign from 'object-assign'

import List from './List'

import join from './join'

const renderList = function(props) {

  const expanded = this.state.expanded
  const currentIndex = this.state.currentIndex

  const listProps = {
    visible: expanded,
    expanded,
    currentIndex,
    data: props.data,
    idProperty: props.idProperty,
    displayProperty: props.displayProperty,
    disabledProperty: props.disabledProperty,
    listPosition: props.listPosition
  }

  if (props.childList){
    return React.cloneElement(props.childList, listProps)
  }

  let list

  if (props.renderList){
    list = props.onRenderList(listProps)
  }

  if (list === undefined){
    list = <List {...listProps} />
  }

  return list
}

export default {
  renderList
}
