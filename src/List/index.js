import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import assign from 'object-assign'

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
      'react-combo__list'
    )

    return <ul {...props} className={className}>
      {data.map(this.renderItem)}
    </ul>
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
    const domNode = findDOMNode(this).children[index]

    scrollToRowIfNeeded(domNode, direction)
  }

  renderItem(item, index){
    const id = item[this.props.idProperty];

    return <Item
      key={id}
      data={item}
      current={index === this.p.currentIndex}
      displayProperty={this.props.displayProperty}
    />
  }
}

List.defaultProps = {
  listPosition: 'top',
  isComboList: true
}

List.propTypes = {
  idProperty: PropTypes.string,
  displayProperty: PropTypes.string,
  disabledProperty: PropTypes.string,
  visible: PropTypes.bool,
  data: PropTypes.array
}
