import React from 'react'
import Component from 'react-class'

import join from '../join'

export default class Item extends Component {

  render(){

    const props = this.props;
    const data = props.data;

    const className = join(
      props.className,
      'react-combo__list-item',
      props.current?
        'react-combo__list-item--current':
        null,
      props.selected?
        'react-combo__list-item--selected':
          null
    )

    return <li {...props} data={null} className={className}>
      {data[props.displayProperty]}
    </li>
  }
}

Item.propTypes = {

}
