import React, { PropTypes } from 'react'
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

const getItemId = function(item, props){
  const idProperty = (props || this.p || this.props).idProperty

  return typeof idProperty === 'function'?
          idProperty(item):
          item[idProperty]
}

const getItemLabel = function(item, props){
  const displayProperty = (props || this.p || this.props).displayProperty

  return typeof displayProperty === 'function'?
          displayProperty(item):
          item[displayProperty]
}

export default class Combo extends Component {

  constructor(props){
    super(props)

    this.state = {
      focused: false,
      expanded: props.defaultExpanded || false,
      currentIndex: props.currentIndex,
      value: props.defaultValue,
      data: [],
      dataMap: {},
      filterValue: '',
      text: props.defaultText || '',
      activeTagIndex: props.defaultActiveTagIndex
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

    this.props.onTextChange(value)

    if (this.props.text === undefined){
      this.setState({
        text: value
      })
    }

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
      acc[this.getItemId(item)] = item
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
    const expanded = props.expanded

    const list = this.renderList(props)
    const tags = this.renderTags(props)
    const hidden = this.renderHiddenField(props)

    const loading = this.p.loading

    let tabIndex

    if (props.disabled) {
      tabIndex = -1
    } else {
      tabIndex = this.state.focused? -1: this.props.tabIndex || 0
    }

    return <div
      {...props}
      data={null}
      tabIndex={tabIndex}
      onFocus={this.onFocus}
      onBlur={null}
      onMouseDown={this.onMouseDown}
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

  renderItemTag(item, index, selectedItems) {
    const props = this.p

    const id = this.getItemId(item)
    const label = this.getItemLabel(item)
    const active = index === props.activeTagIndex

    const clearTool = props.tagClearTool === false || props.tagClearTool == null?
                        null:
                        <div
                        key="clearTool"
                        onMouseDown={this.onClearTagMouseDown.bind(this, index)}
                        className="react-combo__value-tag-clear">
                        {props.tagClearTool}
                      </div>

    const tagProps = {
      key: id,
      onMouseDown: this.onTagMouseDown.bind(this, item, index),
      className: join(
          'react-combo__value-tag', 
          active? 'react-combo__value-tag--active': null,
          props.disabled? 'react-combo__value-tag--disabled': null
        ),
      item: item,
      idProperty: props.idProperty,
      displayProperty: props.displayProperty,
      children: [
        clearTool,
        <InlineBlock key="label" className="react-combo__value-tag-label">{label}</InlineBlock>
      ],
      index,
      selectedItems
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

  onMouseDown(event){
    if (this.state.focused) {
      event.preventDefault()
    }
  }

  onClearTagMouseDown(index, event){
    event.preventDefault()
    event.stopPropagation()

    if (this.props.disabled) {
      return false
    }

    this.removeAt(index)
  }

  onTagMouseDown(item, index, event){
    event.preventDefault()
    event.stopPropagation()

    if (this.props.disabled) {
      return false
    }

    this.setActiveTag(index)

    // if (!this.state.focused){
    //   this.focusHiddenField()
    // }
  }

  onExpandChange(value){
    if (this.props.expanded === undefined){
      this.setState({
        expanded: value
      })
    }

    this.props.onExpandChange(value)
  }

  isExpanded(){
    return this.p.expanded
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

  onBlur(event){
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

    this.props.onActiveTagIndexChange(index)

    this.setState({
      activeTagIndex: index
    })
  }

  isSelectedAt(index){
    const props = this.p
    const data = props.data
    const item = data[index]

    if (!item){
      return false
    }

    const id = this.getItemId(item)
    const selectedMap = props.selectedMap

    return hasOwn(selectedMap, id)
  }

  deselectAt(index){
    if (!this.isSelectedAt(index)){
      return
    }

    const props = this.p
    const data = props.data
    const item = data[index]

    const selectedId = this.getItemId(item)

    const idx = props.multiSelect?
                    props.value.indexOf(selectedId):
                    -1

    const value = props.multiSelect?
                    [...props.value.slice(0, idx), ...props.value.slice(idx + 1)]:
                    null

    const selected = props.multiSelect?
                      this.getItemsForIds(value):
                      null

    props.onDeselect(item, selected)

    props.onChange(value, item, selected, { remove: item })

    if (this.props.value === undefined){
      this.setState({
        value
      })
    }
  }

  trySelectAt(index){
    if (this.props.toggleSelection){
      this.isSelectedAt(index)?
        this.deselectAt(index):
        this.selectAt(index)

      return
    }

    this.selectAt(index)
  }

  selectAt(index){
    const props = this.p
    const data = props.data
    const item = data[index]

    if (!item){
      return
    }

    const selectedId = this.getItemId(item)

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

    if (props.clearTextOnSelect){
      this.setText('')
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

    if (props.activeTagIndex == null || props.activeTagIndex == -1){
      return
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

    props.activeTagIndex = (!!props.activeTagIndex || props.activeTagIndex === 0)? 
                            props.activeTagIndex : 
                            this.state.activeTagIndex
    
    props.text = props.text === undefined? this.state.text: props.text
    props.focused = this.state.focused
    
    if (!props.disabled) {
      props.expanded = props.expanded === undefined? this.state.expanded: props.expanded
    } else {
      props.expanded = false
    }

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
      props.expanded && join(props.expandedClassName, 'react-combo--expanded'),
      props.disabled && join(props.disabledClassName, 'react-combo--disabled')
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
                  (value == null? []: [value])
                  :
                  value

    const dataMap = this.state.dataMap

    const selectedMap = {}
    const selectedItems = (value || []).map(id => {
                            const item = dataMap[id]
                            if (item !== undefined){
                              selectedMap[id] = item
                            }
                            return item
                          }).filter(x => !!x)


    props.selectedItems = selectedItems
    props.selectedMap = selectedMap
    props.value = value

  }

  getItemsForIds(ids){
    const dataMap = this.state.dataMap

    return ids.map(id => dataMap[id]).filter(x => !!x)
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
  listMethods,
  {
    getItemLabel,
    getItemId
  }
);

Combo.propTypes = {
  renderExpandTool: PropTypes.func,
  onActiveTagIndexChange: PropTypes.func
}

Combo.defaultProps = {
  onExpandChange: () => {},
  onFocus: () => {},
  onBlur: () => {},

  onNavigate: (index) => {},
  onSelect: (item, selectedItems) => {},
  onDeselect: (item, selectedItems) => {},
  onChange: () => {},
  onTextChange: () => {},
  onActiveTagIndexChange: () => {},

  onItemMouseDown: (item, id, index) => {},
  onItemMouseEnter: (item, id, index) => {},

  filter: (value, array, props) => {

    return array.filter(item => {
      return getItemLabel(item, props).indexOf(value) != -1
    })
  },

  toggleSelection: true,
  clearTextOnSelect: true,
  gotoNextOnSelect: true,
  forceSelect: true,
  tagClearTool: '⊗',

  expandOnFocus: true,
  dropdown: false,

  idProperty: 'id',
  displayProperty: 'label',
  disabledProperty: 'disabled',
  listPosition: 'bottom',
  defaultActiveTagIndex: -1
}
