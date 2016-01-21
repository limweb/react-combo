import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import assign from 'object-assign'

import hasOwn from 'hasown'

import join from '../join'
import Item from './Item'
import scrollToRowIfNeeded from './scrollToRowIfNeeded'

export default class List extends Component {

  constructor(props){
    super(props)

    this.state = {
      currentIndex: props.defaultCurrentIndex
    }
  }

  toArray(data){
    return [...data]
  }

  render(){

    const props = this.p = assign({}, this.props)

    props.currentIndex = props.currentIndex != null? props.currentIndex: this.state.currentIndex

    if (!this.props.visible){
      return null
    }

    const data = this.props.data;

    const className = join(
      props.className,
      'react-combo__list',
      'react-combo__list--' + props.listPosition,
      props.loading && 'react-combo__list--loading',
      !data.length && 'react-combo__list--empty'
    )

    return <ul {...props} data={null} className={className}>
      {data.map(this.renderItem)}
      {this.renderEmptyText()}
      {this.renderLoadingText()}
    </ul>
  }

  renderEmptyText(){
    if (this.props.data.length || this.props.loading){
      return null
    }

    return this.props.emptyText
  }

  renderLoadingText(){
    if (!this.props.loading){
      return null
    }

    return this.props.loadingText
  }

  componentDidUpdate(prevProps){
    if (prevProps.currentIndex != this.props.currentIndex){
      const index = this.props.currentIndex;

      if (index != null){
        this.scrollToRow(index, index - (prevProps.currentIndex || 0) < 0? -1: 1)
      }
    }
  }

  scrollToRow(index, direction){
    const domNode = findDOMNode(this)
    const row = domNode? domNode.children[index]: null

    scrollToRowIfNeeded(row, direction)
  }

  renderItem(item, index){
    const getItemId = this.props.getItemId
    const getItemLabel = this.props.getItemLabel
    const id = getItemId(item)
    const selected = hasOwn(this.props.selectedMap, id)

    const itemProps = {
      key: id,
      data: item,
      selected,
      current: index === this.p.currentIndex,
      children: getItemLabel(item),

      idProperty: this.props.idProperty,
      displayProperty: this.props.displayProperty,

      getItemId: this.props.getItemId.bind(this),
      getItemLabel: this.props.getItemLabel.bind(this),

      onMouseDown: this.onItemMouseDown.bind(this, item, id, index),
      onMouseEnter: this.onItemMouseEnter.bind(this, item, id, index),

      renderItem: this.props.renderItem
    }

    return <Item {...itemProps} />
  }

  onItemMouseDown(item, id, index, event){
    this.props.onItemMouseDown(item, id, index, event)
  }

  onItemMouseEnter(item, id, index, event){
    this.props.onItemMouseEnter(item, id, index, event)
  }
}

List.defaultProps = {
  listPosition: 'bottom',
  isComboList: true,

  onItemMouseDown: () => {},
  onItemMouseEnter: () => {},

  emptyText: 'Nothing to display.',
  loadingText: 'Loading...'
}

List.propTypes = {
  idProperty: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  displayProperty: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  disabledProperty: PropTypes.string,
  visible: PropTypes.bool,
  data: PropTypes.array,
  emptyText: PropTypes.node,
  loadingText: PropTypes.node
}
