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
      currentIndex: props.defaultCurrentIndex,
      direction: 0
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

    let data = this.props.data
    const listPosition = props.listPosition || 'bottom'
    
    const className = join(
      props.className,
      'react-combo__list',
      `react-combo__list--${listPosition}`,
      props.loading && 'react-combo__list--loading',
      !data.length && 'react-combo__list--empty'
    )

    return <ul {...props} data={null} className={className}>
      {this.renderItems(data, listPosition)}
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
    const props = this.props
    const currentIndex = props.currentIndex;
    const listPosition = props.listPosition

    // when list is expanded and currentIndex is not set, scroll bottom
    if (currentIndex == null && listPosition === 'top') {
      this.scrollBottom()
    }

    if (prevProps.currentIndex != currentIndex){
      if (currentIndex != null){
        const direction = currentIndex - (prevProps.currentIndex || 0) < 0? -1: 1

        this.scrollToRow(currentIndex, direction * this.getDirectionSign())
      }
    }
  }

  scrollToRow(index, direction){
    const el = this.refs[`list-item-${index}`]
    const row = findDOMNode(el)
    
    scrollToRowIfNeeded(row, direction)
  }

  scrollBottom(){
    const domNode = findDOMNode(this)

    if (domNode) {
      domNode.scrollTop = domNode.offsetHeight
    }
  }

  renderItems(data, listPosition){
      if (listPosition === 'bottom') {
        return data.map(this.renderItem)
      }

      if (listPosition === 'top') {
        return data.reduceRight((acc, item, index) => {
          acc.push(this.renderItem(item, index))

          return acc
        }, [])
      }
  }

  renderItem(item, index){
    const selected = hasOwn(this.props.selectedMap, id)
    
    const getItemId = this.props.getItemId
    const getItemLabel = this.props.getItemLabel

    const id = getItemId(item)

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

    return <Item ref={`list-item-${index}`} {...itemProps} />
  }

  onItemMouseDown(item, id, index, event){
    this.props.onItemMouseDown(item, id, index, event)
  }

  onItemMouseEnter(item, id, index, event){
    this.props.onItemMouseEnter(item, id, index, event)
  }

  getDirectionSign (){
    return this.p.listPosition === 'bottom'? 1 : -1
  }
}

List.defaultProps = {
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
