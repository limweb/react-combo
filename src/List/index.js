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

    scrollToRowIfNeeded(domNode, direction)
  }

  renderItem(item, index){
    const id = item[this.props.idProperty]
    const selected = hasOwn(this.props.selectedMap, id)

    const itemProps = {
      key: id,
      data: item,
      selected,
      current: index === this.p.currentIndex,
      displayProperty: this.props.displayProperty,
      onClick: this.onItemClick.bind(this, item, id, index),
      onMouseEnter: this.onItemMouseEnter.bind(this, item, id, index),
      renderItem: this.props.renderItem
    }

    return <Item {...itemProps} />
  }

  onItemClick(item, id, index, event){
    this.props.onItemClick(item, id, index, event)
  }

  onItemMouseEnter(item, id, index, event){
    this.props.onItemMouseEnter(item, id, index, event)
  }
}

List.defaultProps = {
  listPosition: 'top',
  isComboList: true,

  onItemClick: () => {},
  onItemMouseEnter: () => {},

  emptyText: 'Nothing to display.',
  loadingText: 'Loading...'
}

List.propTypes = {
  idProperty: PropTypes.string,
  displayProperty: PropTypes.string,
  disabledProperty: PropTypes.string,
  visible: PropTypes.bool,
  data: PropTypes.array,
  emptyText: PropTypes.node,
  loadingText: PropTypes.node
}
