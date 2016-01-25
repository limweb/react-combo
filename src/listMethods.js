import React from 'react'
import assign from 'object-assign'

import List from './List'

import join from './join'

const renderList = function(props) {

  const expanded = props.expanded
  const currentIndex = this.state.currentIndex
  const loading = this.state.loading

  const listProps = {
    visible: expanded,
    expanded,
    loading,
    currentIndex,
    data: props.data,
    getItemId: this.getItemId,
    getItemLabel: this.getItemLabel,
    idProperty: props.idProperty,
    displayProperty: props.displayProperty,
    disabledProperty: props.disabledProperty,
    renderItem: props.renderItem,
    listPosition: props.listPosition,
    selectedMap: props.selectedMap,
    onItemMouseDown: this.onItemMouseDown,
    onItemMouseEnter: this.onItemMouseEnter,
    listRemoveSelected: props.listRemoveSelected,
    listDisableSelected: props.listDisableSelected
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

const onItemMouseDown = function(item, id, index, event) {
  event.preventDefault()

  this.trySelectAt(index)

  this.props.onItemMouseDown(item, id, index)
}

const onItemMouseEnter = function(item, id, index) {
  this.setState({
    currentIndex: index
  })

  this.props.onItemMouseEnter(item, id, index)
}

export default {
  renderList,
  onItemMouseDown,
  onItemMouseEnter
}
