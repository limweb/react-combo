import React, { PropTypes } from 'react'
import Component from 'react-class'

import join from '../join'
import Item from './Item'

export default class List extends Component {

  toArray(data){
    return [...data]
  }

  render(){

    const props = this.props

    if (!this.props.visible){
      return null
    }

    const data = this.toArray(this.props.dataSource);

    return <ul {...props}>
      {data.map(this.renderItem)}
    </ul>
  }

  renderItem(item){
    const id = item[this.props.idProperty];

    return <Item
      key={id}
      data={item}
      displayProperty={this.props.displayProperty}
    />
  }
}

List.defaultProps = {
  idProperty: 'id',
  displayProperty: 'label'
}

List.propTypes = {
  visible: PropTypes.bool.isRequired,
  dataSource: PropTypes.any.isRequired
}
