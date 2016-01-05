import React from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import assign from 'object-assign'

import Field from 'react-field'
import hasOwn from 'hasown'

import InlineBlock from 'react-inline-block'

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
      dataMap: {},
      filterValue: '',
      text: '',
      activeTagIndex: -1
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

  setText(value){
    this.setState({
      text: value
    })

    this.filterList(value)
  }

  filterList(value){
    if (value === ''){
      return this.setState({
        filterValue: '',
        filterData: undefined
      })
    }

    this.setState({
      filterValue: value,
      filterData: this.getFilteredData(value)
    })
  }

  getFilteredData(value, data){

    const props = this.p

    if (value === undefined){
      value = this.state.filterValue
    }

    if (data === undefined){
      data = this.state.data
    }

    if (!value){
      return data
    }

    const filter = props.filter

    return filter(value, data, props)
  }

  getData(){
    return this.state.filterData || this.state.data;
  }

  setData(data){

    const props = this.p || this.props;

    const dataMap = data.reduce((acc, item) => {
      acc[item[props.idProperty]] = item
      return acc
    }, {})

    const filterData = this.state.filterValue?
                        this.getFilteredData(this.state.filterValue, data):
                        undefined

    this.setState({
      dataMap,
      data,
      filterData
    })
  }

  render(){
    const props = this.p = this.prepareProps(this.props)
    const expanded = this.state.expanded

    const list = this.renderList(props)
    const tags = this.renderTags(props)
    const hidden = this.renderHiddenField(props)

    const loading = this.p.loading

    return <div
      {...props}
      data={null}
      tabIndex={this.state.focused? -1: this.props.tabIndex || 0}
      onFocus={this.onFocus}
    >
      {tags}
      {hidden}
      <ExpandTool
        renderExpandTool={props.renderExpandTool}
        onExpandChange={this.onExpandChange}
        focused={this.state.focused}
        expanded={expanded}
        loading={loading}
      />
      {list}
    </div>
  }

  renderTags(props) {
    const field = this.renderField(props)

    const tags = [
      (props.selectedItems || []).map(this.renderItemTag),
      field
    ]

    return <div className="react-combo__value-tags" children={tags} />
  }

  renderItemTag(item, index) {
    const props = this.p

    const displayProperty = props.displayProperty
    const idProperty = props.idProperty

    const id = item[idProperty]
    const label = item[displayProperty]
    const active = index === props.activeTagIndex

    const clearTool = props.tagClearTool === false || props.tagClearTool == null?
                        null:
                        <div
                        key="clearTool"
                        onClick={this.removeAt.bind(this, index)}
                        className="react-combo__value-tag-clear">
                        {props.tagClearTool}
                      </div>

    const tagProps = {
      key: id,
      onMouseDown: this.onTagMouseDown.bind(this, item, index),
      className: join('react-combo__value-tag', active? 'react-combo__value-tag--active': null),
      item: item,
      idProperty,
      displayProperty,
      children: [
        clearTool,
        <InlineBlock key="label" className="react-combo__value-tag-label">{label}</InlineBlock>
      ]
    }

    let result
    if (props.renderTag){
      result = props.renderTag(tagProps)
    }

    if (result === undefined){
      result = <div {...tagProps} />
    }

    return result
  }

  onTagMouseDown(item, index, event){
    event.preventDefault()

    this.setActiveTag(index)


    // if (!this.state.focused){
    //   this.focusHiddenField()
    // }
  }

  onExpandChange(value){
    this.setState({
      expanded: value
    })

    this.props.onExpandChange(value)
  }

  onFocus(event){
    if (this.state.focused){
      return
    }

    if (event.target == findDOMNode(this.hiddenField)){
      return
    }

    this.focusField()
  }

  onBlur(){
    this.props.onBlur()
  }

  setActiveTag(index){
    if (index < 0 || index >= this.p.value.length){
      //out of range
      index = -1
      this.focusField()
    } else {
      this.focusHiddenField()
    }

    this.setState({
      activeTagIndex: index
    })
  }

  selectAt(index){
    const props = this.p
    const data = props.data
    const item = data[index]

    if (!item){
      return
    }

    const selectedId = item[props.idProperty]

    const selectedMap = props.selectedMap

    if (hasOwn(selectedMap, selectedId)){
      //selection already exists
      return
    }

    const value = props.multiSelect?
                  [...props.value, selectedId]:
                  selectedId

    const selected = props.multiSelect?
                      [...props.selectedItems, item]:
                      item


    props.onSelect(item, selected)

    props.onChange(value, item, selected, { add: item })

    if (this.props.value === undefined){
      this.setState({
        value
      })
    }
  }

  removeAt(index, dir){

    if (dir == undefined){
      dir = 0
    }

    const props = this.p
    const value = props.value || []

    if (clamp(index, 0, value.length - 1) != index){
      return
    }

    const item = props.selectedMap[value[index]]

    const newValue = [
      ...value.slice(0, index),
      ...value.slice(index + 1)
    ]

    const dataMap = this.state.dataMap
    const selected = (newValue || []).map(id => dataMap[id]).filter(x => !!x)

    props.onChange(newValue, item, selected, { remove: item })

    if (this.props.value === undefined){
      this.setState({
        value: newValue
      })
    }

    if (value.length && (index === value.length - 1 || index === 0)){
      this.setActiveTag(
        index === value.length - 1?
          index - 1:
          0
      )
    } else {
      this.setActiveTag(index + dir)
    }

  }

  prepareProps(thisProps){
    const props = assign({}, thisProps)

    this.prepareListProps(props)

    this.prepareValue(props)

    props.activeTagIndex = this.state.activeTagIndex
    props.text = this.state.text
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
      'react-combo--list-' + props.listPosition,
      props.focused && join(props.focusedClassName, 'react-combo--focused'),
      props.expanded && join(props.expandedClassName, 'react-combo--expanded')
    )

    return props
  }

  prepareValue(props){

    let value = props.value === undefined? this.state.value: props.value

    if (props.dropdown){
      props.multiSelect = false
    }

    if (Array.isArray(value) && props.multiSelect === undefined){
      props.multiSelect = true
    }

    value = value !== undefined && !Array.isArray(value)?
                  [value]:
                  value

    const dataMap = this.state.dataMap
    const displayProperty = props.displayProperty

    const selectedMap = {}
    const selectedItems = (value || []).map(id => {
                            const item = dataMap[id]
                            if (item){
                              selectedMap[id] = item
                            }
                            return item
                          }).filter(x => !!x)


    props.selectedItems = selectedItems
    props.selectedMap = selectedMap
    props.value = value

  }

  prepareListProps(props){
    const listChildren = React.Children.toArray(props.children).filter(c => c && c.props && c.props.isComboList)
    const childList = listChildren[0]

    props.data = this.getData()
    props.loading = !!this.state.loading

    if (childList){
      props.data = childList.props.data || props.data
      props.idProperty = childList.props.idProperty || props.idProperty
      props.displayProperty = childList.props.displayProperty || props.displayProperty
      props.listPosition = childList.props.listPosition || props.listPosition
      props.renderItem = childList.props.renderItem || props.renderItem
      props.childList = childList
    }
  }

  focusField(){
    const input = findDOMNode(this.field);

    input.focus()
  }

  focusHiddenField(){
    if (!this.hiddenField){
      return
    }

    const input = findDOMNode(this.hiddenField)

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
  onSelect: (item, selectedItems) => {},
  onChange: () => {},

  onItemMouseDown: (item, id, index) => {},
  onItemMouseEnter: (item, id, index) => {},

  filter: (value, array, props) => {
    const displayProperty = props.displayProperty

    return array.filter(item => {
      return item[displayProperty].indexOf(value) != -1
    })
  },

  gotoNextOnSelect: true,
  forceSelect: true,
  tagClearTool: '⊗',

  expandOnFocus: true,
  dropdown: false,

  idProperty: 'id',
  displayProperty: 'label',
  disabledProperty: 'disabled',
  listPosition: 'bottom'
}

