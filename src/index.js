import React from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import assign from 'object-assign'

import Field from 'react-field'

import ExpandTool from './ExpandTool'

import join from './join'
import fieldMethods from './fieldMethods'
import listMethods from './listMethods'

import clamp from './clamp'

import List from './List'

export { default as List } from './List'

export default class Combo extends Component {

  constructor(props){
    super(props)

    this.state = {
      focused: false,
      expanded: false,
      currentIndex: props.currentIndex,
      value: props.defaultValue,
      data: [],
      dataMap: {}
    }
  }

  componentWillReceiveProps(nextProps){
    this.onChangeProps(nextProps)
  }

  componentWillMount(){
    this.onChangeProps(this.props, { force: true })
  }

  onChangeProps(props, config){
    config = config || {}

    if (props.dataSource === this.props.dataSource && !config.force){
      //the datasource has not changed as we assume
      //changes will be reflected by giving another instance - immutability into play
      return
    }

    if (props.dataSource && !Array.isArray(props.dataSource) && props.dataSource.then){
      //this is a promise

      props.dataSource.then((data) => {
        this.setData(data)
        this.setState({
          loading: false
        })
      })

      this.setData([])
      this.setState({
        loading: true
      })
    } else {
      this.setData(props.dataSource || [])
    }
  }

  setData(data){

    const props = this.p || this.props;

    const dataMap = data.reduce((acc, item) => {
      acc[item[props.idProperty]] = item
      return acc
    }, {})

    this.setState({
      dataMap,
      data
    })
  }

  render(){
    const props = this.p = this.prepareProps(this.props)
    const expanded = this.state.expanded

    const list = this.renderList(props)
    const field = this.renderField(props)

    const loading = this.p.loading

    return <div
      {...props}
      style={null}
      data={null}
      tabIndex={this.state.focused? -1: this.props.tabIndex || 0}
      onFocus={this.onFocus}
    >
      <div className="react-combo__wrapper" style={props.style}>
        {field}
        <ExpandTool
          onExpandChange={this.onExpandChange}
          focused={this.state.focused}
          expanded={expanded}
          loading={loading}
        />
        {list}
      </div>
    </div>
  }

  onExpandChange(value){
    this.setState({
      expanded: value
    })

    this.props.onExpandChange(value)
  }

  onFocus(){
    this.focusField()
  }

  selectAt(index){
    const props = this.p
    const data = props.data
    const item = data[index]
    const selectedId = item[props.idProperty]

    const value = props.multiSelect?
                  [...props.value, selectedId]:
                  selectedId

    const selected = props.multiSelect?
                      assign({}, props.selectedMap, { [selectedId]: item  }):
                      item


    props.onSelect(item, selected)
  }

  prepareProps(thisProps){
    const props = assign({}, thisProps)

    this.prepareListProps(props)

    props.value = props.value == null? this.state.value: props.value

    if (Array.isArray(props.value)){
      props.multiSelect = true
    }

    this.prepareValue(props)

    props.focused = this.state.focused
    props.expanded = this.state.expanded

    let currentIndex = thisProps.currentIndex == null? this.state.currentIndex: thisProps.currentIndex

    if (clamp(currentIndex, 0, props.data.length - 1) != currentIndex){
      currentIndex = null
    }

    props.currentIndex = currentIndex

    props.className = join(
      'react-combo',
      props.className,
      props.focused && join(props.focusedClassName, 'react-combo--focused'),
      props.expanded && join(props.expandedClassName, 'react-combo--expanded')
    )

    return props
  }

  prepareValue(props){
    const value = props.multiSelect && !Array.isArray(props.value)?
                  [props.value]:
                  props.value

    const dataMap = this.state.dataMap
    const displayProperty = props.displayProperty
    const selectedMap = {}

    let displayValue = props.displayValue

    if (displayValue == null){
      displayValue = props.multiSelect?
                      value.map(id => {
                        const item = dataMap[id]
                        if (item){
                          selectedMap[id] = item
                          return item[displayProperty]
                        }
                      }):
                      dataMap[value] && dataMap[value][displayProperty]
    }

    props.selectedMap = selectedMap
    props.value = value
    props.displayValue = displayValue
  }

  prepareListProps(props){
    const listChildren = React.Children.toArray(props.children).filter(c => c && c.props && c.props.isComboList)
    const childList = listChildren[0]

    props.data = this.state.data
    props.loading = !!this.state.loading

    if (childList){
      props.data = childList.props.data || props.data
      props.idProperty = childList.props.idProperty || props.idProperty
      props.displayProperty = childList.props.displayProperty || props.displayProperty
      props.listPosition = childList.props.listPosition || props.listPosition

      props.childList = childList
    }
  }

  focusField(){
    const input = findDOMNode(this.field);

    input.focus()
  }
}

assign(
  Combo.prototype,
  fieldMethods,
  listMethods
);

Combo.defaultProps = {
  onExpandChange: () => {},
  onFocus: () => {},
  onBlur: () => {},

  onNavigate: (index) => {},
  onSelect: (item, selection) => {},

  expandOnFocus: true,
  dropdown: false,

  idProperty: 'id',
  displayProperty: 'label',
  disabledProperty: 'disabled'
}

