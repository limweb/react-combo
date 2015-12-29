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
    listPosition: props.listPosition,
    selectedMap: props.selectedMap,
    onItemClick: this.onItemClick,
    onItemMouseEnter: this.onItemMouseEnter
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

const onItemClick = function(item, id, index) {
  this.selectAt(index)

  this.props.onItemClick(item, id, index)
}

const onItemMouseEnter = function(item, id, index) {
  this.setState({
    currentIndex: index
  })

  this.props.onItemMouseEnter(item, id, index)
}

export default {
  renderList,
  onItemClick,
  onItemMouseEnter
}
