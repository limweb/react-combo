import React from 'react'
import assign from 'object-assign'

import List from './List'

import join from './join'

const renderList = function(props) {

  const expanded = this.state.expanded

  let listProps = assign({}, {
    listPosition: props.listPosition || 'top',
    idProperty: props.idProperty,
    displayProperty: props.displayProperty
  }, props.listProps, {
    visible: expanded,
    expanded
  })

  if (!listProps.dataSource && props.dataSource){
    listProps.dataSource = props.dataSource
  }

  listProps.className = join(
    listProps.className,
    'react-combo__list'
  )

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
