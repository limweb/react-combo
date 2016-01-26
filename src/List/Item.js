import React, { PropTypes } from 'react'
import Component from 'react-class'
import assign from 'object-assign'

import join from '../join'

export default class Item extends Component {

  render(){

    let props = this.props;
    const data = props.data;

    const className = join(
      props.className,
      'react-combo__list-item',
      props.current?
        'react-combo__list-item--current':
        null,
      props.selected?
        'react-combo__list-item--selected':
          null,
      props.disabled?
        'react-combo__list-item--disabled':
          null
    )

    props = assign({}, props, {
      className: className,
      children: props.children
    })

    let item

    if (props.renderItem){
      item = props.renderItem(props)
    }

    if (item  === undefined){
      props.data = null
      item = <li {...props}/>
    }

    return item
  }
}

Item.propTypes = {
  getItemId: PropTypes.func,
  getItemLabel: PropTypes.func
}
